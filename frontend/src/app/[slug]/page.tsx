import { notFound } from "next/navigation";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import AuthorCard from "@/components/public/AuthorCard";
import type { Metadata } from 'next'; // <-- Importamos el tipo Metadata

// 1. Eliminamos el 'any' creando las interfaces correctas
interface Tag {
  id: string;
  name: string;
}

interface Article {
  title: string;
  content: string;
  publishedAt: string;
  cover_image_url: string | null;
  category?: { name: string };
  author: { name: string; avatar_url: string | null };
  tags?: Tag[];
}

async function getArticle(slug: string): Promise<Article | null> {
  // 2. Eliminamos la variable 'error' sin usar y aseguramos el puerto del backend
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${apiUrl}/public/articles/${slug}`, {
      cache: 'no-store' 
    });
    
    if (!res.ok) return null;
    return res.json();
  } catch { 
    return null;
  }
}

// Función dinámica de Next.js para el SEO y las Open Graph Cards
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getArticle(resolvedParams.slug);

  if (!article) {
    return { title: 'Noticia no encontrada | Zonasyc' };
  }

  // Generamos una descripción limpia sacando el HTML del TipTap (máximo 150 caracteres)
  const plainTextDescription = article.content.replace(/<[^>]+>/g, '').substring(0, 150) + '...';

  return {
    title: `${article.title} | Zonasyc`,
    description: plainTextDescription,
    openGraph: {
      title: article.title,
      description: plainTextDescription,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      images: article.cover_image_url ? [{ url: article.cover_image_url }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: plainTextDescription,
      images: article.cover_image_url ? [article.cover_image_url] : [],
    },
  };
}

// 3. Soporte para Next.js 15: params ahora se debe manejar como una Promesa
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const article = await getArticle(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const date = new Date(article.publishedAt).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-zonasyc-red selection:text-white">
      <PublicHeader />

      <main className="pt-24 pb-16">
        <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <header className="mb-10 text-center max-w-3xl mx-auto mt-8 md:mt-12">
            {article.category && (
              <span className="inline-block px-3 py-1 mb-6 text-xs font-bold uppercase tracking-widest text-white bg-zonasyc-red rounded-full">
                {article.category.name}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
              {article.title}
            </h1>
            
            <div className="flex items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                {article.author.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={article.author.avatar_url} alt={article.author.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold">
                    {article.author.name.charAt(0)}
                  </div>
                )}
                <span className="font-medium">{article.author.name}</span>
              </div>
              <span>•</span>
              <time>{date}</time>
            </div>
          </header>

          {article.cover_image_url && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 shadow-2xl bg-slate-900">
               {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.cover_image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* 4. Cambiamos max-w-[700px] a max-w-175 para complacer a Tailwind */}
          <div className="max-w-175 mx-auto prose prose-lg prose-slate dark:prose-invert prose-headings:font-bold prose-a:text-zonasyc-red hover:prose-a:text-red-700 prose-img:rounded-xl leading-loose">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="max-w-175 mx-auto mt-16 pt-8 border-t border-slate-200 dark:border-slate-800/50">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: Tag) => (
                  <span key={tag.id} className="px-4 py-1.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-sm font-medium rounded-full border border-slate-200/50 dark:border-slate-800/50 transition-colors hover:border-zonasyc-red">
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          
                {/* Componente del Autor */}
          <AuthorCard 
            name={article.author.name} 
            avatar_url={article.author.avatar_url} 
          />
        </article>
      </main>

      <PublicFooter />
    </div>
  );
}