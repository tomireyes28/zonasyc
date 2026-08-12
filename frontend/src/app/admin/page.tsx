import { cookies } from "next/headers";
import KanbanBoard from "./KanbanBoard";

export default async function AdminDashboard() {
  // Leemos el token seguro de la cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // Estructura vacía por defecto
  let data = { ideas: [], drafts: [], reviews: [], published: [] };

  try {
    // Hacemos el fetch al backend enviando el Token de autorización
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/kanban`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // Evitamos que Next.js guarde esto en caché para ver los cambios en vivo
    });

    if (res.ok) {
      data = await res.json();
    }
  } catch (error) {
    console.error("Error conectando con la API:", error);
  }

  // Renderizamos el componente pasándole los datos
  return <KanbanBoard initialData={data} />;
}