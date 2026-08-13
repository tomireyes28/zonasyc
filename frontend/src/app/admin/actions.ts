// src/app/admin/actions.ts
"use server";

import { cookies } from "next/headers";

export async function updateArticleStatusAction(articleId: string, newStatus: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { error: "Sesión inválida" };
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${articleId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      return { error: "El backend rechazó el cambio" };
    }

    return { success: true };
 } catch (error) {
    console.error("Error en la mutación del Kanban:", error); 
    return { error: "Error de conexión con la API" };
  }
}