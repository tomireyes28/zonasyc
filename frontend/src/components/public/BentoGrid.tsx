"use client";

import { motion, Variants } from "framer-motion";
import NewsCard from "./NewsCard";

interface Article {
  id: string;
  title: string;
  slug: string;
  cover_image_url: string | null;
  category: { name: string; slug: string } | null;
  publishedAt: string;
}

export default function BentoGrid({ articles }: { articles: Article[] }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-bold text-slate-400">No hay noticias publicadas aún.</h2>
      </div>
    );
  }

  const featured = articles[0];
  const secondary = articles.slice(1, 3);
  const rest = articles.slice(3);

  // Le agregamos el tipo : Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  // Le agregamos el tipo : Variants
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">
      
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
      >
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <NewsCard article={featured} featured={true} />
        </motion.div>
        
        {secondary.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {secondary.map(article => (
              <motion.div key={article.id} variants={itemVariants} className="h-full">
                <NewsCard article={article} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {rest.length > 0 && (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {rest.map(article => (
            <motion.div key={article.id} variants={itemVariants} className="h-full">
              <NewsCard article={article} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}