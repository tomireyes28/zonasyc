import { cookies } from "next/headers";
import KanbanBoard from "@/components/admin/KanbanBoard";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let data = { ideas: [], drafts: [], reviews: [], published: [] };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/kanban`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (res.ok) {
      data = await res.json();
    }
  } catch (error) {
    console.error("Error conectando con la API:", error);
  }

  return <KanbanBoard initialData={data} />;
}