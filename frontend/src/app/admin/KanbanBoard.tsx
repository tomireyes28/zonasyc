"use client";

// Definimos la forma de los datos que nos manda NestJS
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
  // Mapeamos los datos reales a nuestras columnas visuales
  const columns = [
    { id: "IDEA", title: "💡 Ideas", borderColor: "border-slate-500", cards: initialData.ideas || [] },
    { id: "DRAFT", title: "✍️ En Redacción", borderColor: "border-yellow-500", cards: initialData.drafts || [] },
    { id: "REVIEW", title: "🔎 Aprobación", borderColor: "border-purple-500", cards: initialData.reviews || [] },
    { id: "PUBLISHED", title: "🚀 Publicados", borderColor: "border-zonasyc-red", cards: initialData.published || [] },
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
          <div key={col.id} className="flex flex-col bg-slate-900/50 rounded-xl p-4 border border-slate-800">
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
                  className="bg-zonasyc-card border border-slate-700/50 p-4 rounded-lg shadow-md cursor-grab active:cursor-grabbing hover:border-slate-500 transition-colors group"
                >
                  <h3 className="text-white font-medium mb-3 leading-snug group-hover:text-zonasyc-red transition-colors">
                    {card.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${card.is_ai_generated ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                      {card.author?.name || 'Autor Desconocido'}
                    </span>
                    {/* Formateamos la fecha de Prisma a "12 Ago" */}
                    <span>
                      {new Date(card.updatedAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </div>
              ))}
              
              {col.cards.length === 0 && (
                <div className="h-24 border-2 border-dashed border-slate-800 rounded-lg flex items-center justify-center text-slate-500 text-sm">
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