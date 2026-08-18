"use client";

import { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import NewsCard from "./NewsCard";

interface Article {
  id: string;
  title: string;
  slug: string;
  cover_image_url: string | null;
  category: { name: string; slug: string } | null;
  publishedAt: string;
}

const CATEGORIES = ["Todo", "Cine", "Series", "Gaming", "Música"];

export default function BentoGrid({ articles }: { articles: Article[] }) {
  const [activeCategory, setActiveCategory] = useState("Todo");

  if (!articles || articles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-bold text-slate-400">No hay noticias publicadas aún.</h2>
      </div>
    );
  }

  // Lógica de filtrado en vivo
  const filteredArticles = articles.filter((article) => {
    if (activeCategory === "Todo") return true;
    return article.category?.name === activeCategory;
  });

  const featured = filteredArticles[0];
  const secondary = filteredArticles.slice(1, 3);
  const rest = filteredArticles.slice(3);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28 min-h-[80vh]">
      
      {/* Botonera de Filtros Rápidos (Píldoras) */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
              activeCategory === cat
                ? "bg-zonasyc-red text-white shadow-lg shadow-red-500/30 scale-105"
                : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grilla con Animaciones */}
      <AnimatePresence mode="wait">
        {filteredArticles.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20"
          >
            <span className="text-5xl mb-4 block">📭</span>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
              Sin novedades por ahora
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Todavía no publicamos ninguna nota en la categoría {activeCategory}.
            </p>
          </motion.div>
        ) : (
          <motion.div
            // Usamos activeCategory como key para forzar que Framer Motion reinicie la animación al filtrar
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <motion.div variants={itemVariants} className="lg:col-span-2 h-full">
                {featured && <NewsCard article={featured} featured={true} />}
              </motion.div>
              
              {secondary.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                  {secondary.map((article) => (
                    <motion.div key={article.id} variants={itemVariants} className="h-full">
                      <NewsCard article={article} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((article) => (
                  <motion.div key={article.id} variants={itemVariants} className="h-full">
                    <NewsCard article={article} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}