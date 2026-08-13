"use client";

import { useState, useRef } from "react";
import Tiptap from "@/components/admin/editor/Tiptap";
import { uploadImageAction } from "@/app/admin/actions";

// Función utilitaria para autogenerar el slug
const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // Separa los acentos de las letras
    .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos
    .replace(/\s+/g, "-") // Reemplaza espacios por guiones
    .replace(/[^\w\-]+/g, "") // Elimina caracteres no alfanuméricos
    .replace(/\-\-+/g, "-") // Reemplaza múltiples guiones por uno solo
    .replace(/^-+/, "") // Quita guiones al principio
    .replace(/-+$/, ""); // Quita guiones al final
};

const CATEGORIES = ["Cine", "Series", "Videojuegos", "Música", "Libros", "Streaming"];

export default function EditorPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  // Estados de Imagen
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Nuevos estados SEO
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const slug = generateSlug(title); // Se calcula al vuelo en cada render

  const handleSave = () => {
    // Acá armaremos el paquete final para enviar a NestJS
    const payload = {
      title,
      slug,
      content,
      coverImage,
      category,
      tags,
    };
    console.log("Guardando borrador:", payload);
  };

  // Subida de imagen de portada
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadImageAction(formData);

    if (result.error) {
      alert(`Error: ${result.error}`);
    } else if (result.url) {
      setCoverImage(result.url);
    }
    
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Manejador para agregar etiquetas (Tags)
  const handleKeyDownTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="max-w-7xl mx-auto w-full pb-12">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Nueva Nota</h1>
          <p className="text-slate-400 mt-1">Redactá y formateá tu contenido.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleSave}
            className="bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-lg"
          >
            Guardar Borrador
          </button>
          <button 
            className="bg-zonasyc-red hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-lg shadow-red-500/20"
          >
            Publicar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA PRINCIPAL (Izquierda) */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <input
              type="text"
              placeholder="Título impactante..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-4 text-2xl font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-zonasyc-red transition-colors"
            />
            {/* Muestra el Slug autogenerado debajo del título */}
            {title && (
              <p className="text-sm text-slate-400 mt-2 ml-2 flex items-center gap-1">
                <span className="text-zonasyc-red">🔗</span> zonasyc.com/
                <span className="text-slate-300 font-medium">{slug}</span>
              </p>
            )}
          </div>

          <Tiptap content={content} onChange={setContent} />
        </div>

        {/* BARRA LATERAL (Derecha) */}
        <div className="space-y-6">
          
          {/* CAJA DE IMAGEN DE PORTADA */}
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4 border-b border-slate-700/50 pb-2">
              Imagen de Portada
            </h3>
            
            <div className="flex flex-col items-center justify-center">
              {coverImage ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-600 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverImage} alt="Portada" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => setCoverImage(null)}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg transition-colors"
                    >
                      Quitar Imagen
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video border-2 border-dashed border-slate-600 hover:border-zonasyc-red hover:bg-slate-800/50 transition-colors rounded-lg flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-white"
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-slate-500 border-t-zonasyc-red rounded-full animate-spin"></div>
                      <span className="text-sm font-medium">Subiendo...</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-3xl mb-2">📸</span>
                      <span className="text-sm font-medium text-center px-4">Click para subir imagen</span>
                      <span className="text-xs opacity-75 mt-1">(Max 5MB)</span>
                    </>
                  )}
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden" 
              />
            </div>
          </div>

          {/* CAJA DE CLASIFICACIÓN Y SEO */}
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4 border-b border-slate-700/50 pb-2">
              Clasificación y SEO
            </h3>

            {/* Categorías */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-400 mb-2">Categoría Principal</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-zonasyc-red transition-colors"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Etiquetas (Tags) */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Etiquetas <span className="text-xs opacity-70">(Presioná Enter)</span>
              </label>
              
              <div className="bg-slate-800 border border-slate-600 rounded-lg p-2 flex flex-wrap gap-2 focus-within:border-zonasyc-red transition-colors">
                {tags.map(tag => (
                  <span key={tag} className="bg-slate-700 text-slate-200 text-sm px-2 py-1 rounded-md flex items-center gap-1">
                    {tag}
                    <button 
                      onClick={() => removeTag(tag)}
                      className="text-slate-400 hover:text-white hover:bg-slate-600 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
                
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDownTag}
                  placeholder={tags.length === 0 ? "Ej: marvel, reseña..." : ""}
                  className="bg-transparent border-none outline-none text-white text-sm flex-1 min-w-[120px] py-1"
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}