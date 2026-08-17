import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import BentoGrid from "@/components/public/BentoGrid";

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
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-zonasyc-red selection:text-white">
      <PublicHeader />
      
      <main>
        <BentoGrid articles={articles} />
      </main>

      <PublicFooter />
    </div>
  );
}