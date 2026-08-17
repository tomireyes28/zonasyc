"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Article {
  id: string;
  title: string;
  slug: string;
  cover_image_url: string | null;
  category: { name: string; slug: string } | null;
  publishedAt: string;
}

interface NewsCardProps {
  article: Article;
  featured?: boolean; // Si es true, la tarjeta será más grande
}

export default function NewsCard({ article, featured = false }: NewsCardProps) {
  return (
    <Link href={`/${article.slug}`} className="block h-full group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900 h-full min-h-75 flex flex-col justify-end p-6 md:p-8 border border-slate-200/50 dark:border-slate-800/50 shadow-lg ${
          featured ? 'md:min-h-125' : ''
        }`}
      >
        {/* Imagen con zoom on hover */}
        {article.cover_image_url ? (
          <motion.img
            src={article.cover_image_url}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-slate-800" />
        )}
        
        {/* Gradiente oscuro para garantizar legibilidad del texto */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:from-black" />

        {/* Contenido (Categoría y Título) */}
        <div className="relative z-10 transform transition-transform duration-300 group-hover:-translate-y-1">
          {article.category && (
            <span className="inline-block px-3 py-1 mb-3 text-xs font-bold uppercase tracking-widest text-white bg-zonasyc-red rounded-full shadow-md">
              {article.category.name}
            </span>
          )}
          <h3 className={`font-bold text-white leading-tight tracking-tight ${
            featured ? 'text-3xl md:text-5xl' : 'text-xl md:text-2xl'
          } text-slate-100 transition-colors`}>
            {article.title}
          </h3>
        </div>
      </motion.div>
    </Link>
  );
}