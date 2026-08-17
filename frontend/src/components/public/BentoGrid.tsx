import NewsCard from "./NewsCard";

// Definimos la estructura estricta de la nota que llega del backend
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
        <p className="text-slate-500 mt-2">Ingresá al panel de administrador y publicá tu primer artículo.</p>
      </div>
    );
  }

  // Separamos las notas para la asimetría
  const featured = articles[0];
  const secondary = articles.slice(1, 3);
  const rest = articles.slice(3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">
      
      {/* Bloque Asimétrico Superior (Bento Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <NewsCard article={featured} featured={true} />
        </div>
        
        {secondary.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {secondary.map(article => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>

      {/* Grilla estándar para el resto de las noticias (Scroll Infinito visual) */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map(article => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}