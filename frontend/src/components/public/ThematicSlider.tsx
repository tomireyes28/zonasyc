import NewsCard from "./NewsCard";

interface Article {
  id: string;
  title: string;
  slug: string;
  cover_image_url: string | null;
  category: { name: string; slug: string } | null;
  publishedAt: string;
}

interface SliderProps {
  title: string;
  categoryName: string;
  articles: Article[];
}

export default function ThematicSlider({ title, categoryName, articles }: SliderProps) {
  // Filtramos las notas para esta tira y nos quedamos con las últimas 5
  const sliderArticles = articles
    .filter((a) => a.category?.name === categoryName)
    .slice(0, 5);

  if (sliderArticles.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {title}
        </h2>
        <span className="text-sm font-bold text-zonasyc-red uppercase tracking-wider">
          Ver más →
        </span>
      </div>

      {/* Contenedor horizontal con Swipe y ocultamiento de barra de scroll */}
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        {sliderArticles.map((article) => (
          <div 
            key={article.id} 
            className="shrink-0 w-[85vw] sm:w-100 snap-center sm:snap-start h-full"
          >
            <NewsCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}