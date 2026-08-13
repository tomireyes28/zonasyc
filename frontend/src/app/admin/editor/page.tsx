"use client";

import { useState } from "react";
import Tiptap from "@/components/admin/editor/Tiptap";

export default function EditorPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSave = () => {
    // Acá luego conectaremos la Server Action para guardar en la BD
    console.log("Título:", title);
    console.log("Contenido HTML:", content);
  };

  return (
    <div className="max-w-5xl mx-auto w-full pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Nueva Nota</h1>
          <p className="text-slate-400 mt-1">Redactá y formateá tu contenido.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-zonasyc-red hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-lg shadow-red-500/20"
        >
          Guardar Borrador
        </button>
      </div>

      <div className="space-y-6">
        {/* INPUT DE TÍTULO */}
        <div>
          <input
            type="text"
            placeholder="Título impactante..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-4 text-2xl text-white placeholder:text-slate-500 focus:outline-none focus:border-slate-500 transition-colors"
          />
        </div>

        {/* EDITOR TIPTAP */}
        <Tiptap content={content} onChange={setContent} />
      </div>
    </div>
  );
}