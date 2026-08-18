"use client";

import { useState, useEffect } from "react";

interface SeoPanelProps {
  title: string;
  content: string; // El HTML de TipTap
  coverImage: string | null;
  onMetaChange: (metaTitle: string, metaDescription: string) => void;
}

export default function SeoPanel({ title, content, coverImage, onMetaChange }: SeoPanelProps) {
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  // --- AUTOCOMPLETADO INICIAL ---
  // Si el redactor no escribió nada, sugerimos el título de la nota
  useEffect(() => {
    if (!metaTitle && title) {
      setMetaTitle(title);
    }
  }, [title, metaTitle]);

  // Notificamos al padre cada vez que el usuario edita estos campos
  useEffect(() => {
    onMetaChange(metaTitle, metaDescription);
  }, [metaTitle, metaDescription, onMetaChange]);

  // --- MOTOR DE ANÁLISIS SEO ---
  const analyzeSEO = () => {
    let score = 0;

    // 1. Extensión del Texto (Max 30)
    // Limpiamos el HTML para contar solo las palabras reales
    const plainText = content.replace(/<[^>]*>?/gm, ' ').trim();
    const wordCount = plainText.split(/\s+/).filter(w => w.length > 0).length;
    
    if (wordCount >= 500) score += 30;
    else if (wordCount >= 300) score += 20;
    else if (wordCount >= 150) score += 10;

    // 2. Descripción SEO (Max 20)
    const descLen = metaDescription.length;
    if (descLen >= 120 && descLen <= 160) score += 20;
    else if ((descLen >= 70 && descLen < 120) || (descLen > 160 && descLen <= 180)) score += 10;

    // 3. Título SEO (Max 15)
    const titleLen = metaTitle.length;
    if (titleLen >= 40 && titleLen <= 60) score += 15;
    else if ((titleLen >= 20 && titleLen < 40) || (titleLen > 60 && titleLen <= 70)) score += 5;

    // Para analizar imágenes y links usamos DOMParser (solo funciona en el cliente)
    let internalMediaCount = 0;
    let hasInternalLink = false;
    let hasExternalLink = false;

    if (typeof window !== 'undefined') {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      
      internalMediaCount = doc.querySelectorAll('img, iframe').length;
      
      const links = Array.from(doc.querySelectorAll('a'));
      links.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href.startsWith('/') || href.includes('zonasyc.com')) {
          hasInternalLink = true;
        } else if (href.startsWith('http')) {
          hasExternalLink = true;
        }
      });
    }

    // 4. Multimedia (Max 20)
    if (coverImage) {
      if (internalMediaCount >= 2) score += 20;
      else if (internalMediaCount === 1) score += 15;
      else score += 10;
    }

    // 5. Enlaces (Max 15)
    if (hasInternalLink && hasExternalLink) score += 15;
    else if (hasInternalLink || hasExternalLink) score += 8;

    return { score, wordCount };
  };

  const { score, wordCount } = analyzeSEO();

  // Determinamos el color de la barra
  let progressColor = "bg-red-500";
  if (score >= 75) progressColor = "bg-green-500";
  else if (score >= 50) progressColor = "bg-yellow-500";

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 mt-6">
      <div className="flex items-center justify-between mb-4 border-b border-slate-700/50 pb-3">
        <h3 className="text-white font-semibold flex items-center gap-2">
          🎯 Optimización SEO
        </h3>
        <span className={`text-xl font-black ${score >= 75 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
          {score}/100
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="w-full bg-slate-800 rounded-full h-2.5 mb-6 overflow-hidden">
        <div className={`h-2.5 rounded-full transition-all duration-500 ${progressColor}`} style={{ width: `${score}%` }}></div>
      </div>

      {/* VISTA PREVIA DE GOOGLE */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-inner">
        <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
          <span className="bg-slate-200 rounded-full w-4 h-4 inline-block"></span> 
          zonasyc.com › ...
        </p>
        <h4 className="text-[20px] leading-tight text-[#1a0dab] font-medium hover:underline cursor-pointer truncate">
          {metaTitle || "Título de tu nota..."}
        </h4>
        <p className="text-sm text-[#4d5156] mt-1 line-clamp-2 leading-snug">
          {metaDescription || "Acá aparecerá el extracto que invita al lector a entrar a tu nota. Recordá usar un texto atrapante..."}
        </p>
      </div>

      {/* CAMPOS DE EDICIÓN */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-slate-400">Título SEO</label>
            <span className={`text-xs ${metaTitle.length > 60 || metaTitle.length < 40 ? 'text-red-400' : 'text-green-400'}`}>
              {metaTitle.length}/60
            </span>
          </div>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-zonasyc-red"
            placeholder="Título llamativo para buscadores..."
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-slate-400">Descripción SEO (Extracto)</label>
            <span className={`text-xs ${metaDescription.length > 160 || metaDescription.length < 120 ? 'text-red-400' : 'text-green-400'}`}>
              {metaDescription.length}/160
            </span>
          </div>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={3}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-zonasyc-red resize-none"
            placeholder="Un resumen atrapante que obligue al usuario a hacer clic..."
          />
        </div>

        {/* Info extra para el redactor */}
        <p className="text-xs text-slate-500 text-right mt-2">
          Palabras escritas: <span className="font-bold">{wordCount}</span>
        </p>
      </div>
    </div>
  );
}