import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import BentoGrid from "@/components/public/BentoGrid";
import ThematicSlider from "@/components/public/ThematicSlider";
import NewsletterBlock from "@/components/public/NewsletterBlock";

// Función para hacer fetch a nuestro backend de NestJS
async function getLatestArticles() {
  try {
    // Usamos no-store para que la portada siempre traiga lo último de la DB (SSR)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/articles/latest`, {
      cache: 'no-store' 
    });
    
    if (!res.ok) return [];
    
    return res.json();
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export default async function HomePage() {
  const articles = await getLatestArticles();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-zonasyc-red selection:text-white flex flex-col">
      <PublicHeader />
      
      {/* Usamos flex-grow para empujar el footer abajo si hay poco contenido */}
      <main className="grow">
        {/* Grilla Principal con Filtros */}
        <BentoGrid articles={articles} />

        {/* Tiras Temáticas (Le pasamos todas las notas y el slider filtra internamente) */}
        <ThematicSlider title="Tendencias en Gaming" categoryName="Gaming" articles={articles} />
        <ThematicSlider title="Lo último en Cine" categoryName="Cine" articles={articles} />

        {/* Call to Action - Suscripción */}
        <NewsletterBlock />
      </main>

      <PublicFooter />
    </div>
  );
}