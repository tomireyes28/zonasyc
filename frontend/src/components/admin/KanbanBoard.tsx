"use client";

import { useState } from "react";
import { updateArticleStatusAction } from "@/app/admin/actions";

interface Article {
  id: string;
  title: string;
  updatedAt: string;
  is_ai_generated: boolean;
  author: { name: string };
}

interface KanbanData {
  ideas: Article[];
  drafts: Article[];
  reviews: Article[];
  published: Article[];
}

export default function KanbanBoard({ initialData }: { initialData: KanbanData }) {
  // Convertimos los datos que vienen del servidor en un estado local reactivo
  const [data, setData] = useState<KanbanData>(initialData);
  const [isDragging, setIsDragging] = useState(false);

  // 1. Cuando agarramos una tarjeta
  const handleDragStart = (e: React.DragEvent, articleId: string, sourceColId: string) => {
    setIsDragging(true);
    e.dataTransfer.setData("articleId", articleId);
    e.dataTransfer.setData("sourceColId", sourceColId);
  };

  // 2. Necesario para permitir que las zonas reciban tarjetas
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // 3. Cuando soltamos la tarjeta
  // 3. Cuando soltamos la tarjeta
  const handleDrop = async (e: React.DragEvent, targetColId: string) => {
    e.preventDefault();
    setIsDragging(false);

    const articleId = e.dataTransfer.getData("articleId");
    const sourceColId = e.dataTransfer.getData("sourceColId");

    // Si la soltó en el mismo lugar o no hay ID, cancelamos
    if (!articleId || sourceColId === targetColId) return;

    // EL DICCIONARIO TRADUCTOR: Mapea el ID de la columna a la clave plural del estado
    const colToKey: Record<string, keyof KanbanData> = {
      "IDEA": "ideas",
      "DRAFT": "drafts",
      "REVIEW": "reviews",
      "PUBLISHED": "published"
    };

    const sourceKey = colToKey[sourceColId];
    const targetKey = colToKey[targetColId];

    // Si por alguna razón la columna no existe en el diccionario, abortamos
    if (!sourceKey || !targetKey) return;

    const articleToMove = data[sourceKey].find((a) => a.id === articleId);
    if (!articleToMove) return;

    // Guardamos un backup por si el backend nos rebota
    const originalBackup = { ...data };

    // ACTUALIZACIÓN OPTIMISTA: Movemos la tarjeta visualmente al instante
    setData((prev) => ({
      ...prev,
      [sourceKey]: prev[sourceKey].filter((a) => a.id !== articleId),
      [targetKey]: [articleToMove, ...prev[targetKey]],
    }));

    // Disparamos la petición silenciosa al servidor
    const result = await updateArticleStatusAction(articleId, targetColId);

    // Si falló, deshacemos el cambio visual
    if (result.error) {
      setData(originalBackup);
      alert("Error al mover la nota: " + result.error);
    }
  };
  const columns = [
    { id: "IDEA", title: "💡 Ideas", borderColor: "border-slate-500", cards: data.ideas || [] },
    { id: "DRAFT", title: "✍️ En Redacción", borderColor: "border-yellow-500", cards: data.drafts || [] },
    { id: "REVIEW", title: "🔎 Aprobación", borderColor: "border-purple-500", cards: data.reviews || [] },
    { id: "PUBLISHED", title: "🚀 Publicados", borderColor: "border-zonasyc-red", cards: data.published || [] },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Tablero Editorial</h1>
          <p className="text-slate-400 mt-1">Gestioná el flujo de publicación de las notas.</p>
        </div>
        <button className="bg-zonasyc-red hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-lg shadow-red-500/20">
          + Nueva Nota
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div 
            key={col.id} 
            className={`flex flex-col bg-slate-900/50 rounded-xl p-4 border border-slate-800 transition-colors ${isDragging ? 'border-dashed border-slate-600' : ''}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className={`border-t-2 ${col.borderColor} pt-2 mb-4 flex items-center justify-between`}>
              <h2 className="text-slate-200 font-semibold">{col.title}</h2>
              <span className="bg-slate-800 text-slate-400 text-xs py-1 px-2 rounded-full font-medium">
                {col.cards.length}
              </span>
            </div>

            <div className="flex-1 space-y-3 min-h-50">
              {col.cards.map((card) => (
                <div 
                  key={card.id} 
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, card.id, col.id)}
                  onDragEnd={() => setIsDragging(false)}
                  className="bg-zonasyc-card border border-slate-700/50 p-4 rounded-lg shadow-md cursor-grab active:cursor-grabbing hover:border-slate-500 transition-colors group relative z-10"
                >
                  <h3 className="text-white font-medium mb-3 leading-snug group-hover:text-zonasyc-red transition-colors">
                    {card.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${card.is_ai_generated ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                      {card.author?.name || 'Autor Desconocido'}
                    </span>
                    <span>
                      {new Date(card.updatedAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </div>
              ))}
              
              {col.cards.length === 0 && (
                <div className="h-24 border-2 border-dashed border-slate-800/50 rounded-lg flex items-center justify-center text-slate-500 text-sm">
                  Arrastrá notas aquí
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}