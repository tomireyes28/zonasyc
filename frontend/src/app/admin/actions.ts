// src/app/admin/actions.ts
"use server";

import { cookies } from "next/headers";

// 1. Mover notas en el Kanban
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

// 2. Subir imágenes a NestJS/Supabase
export async function uploadImageAction(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { error: "Sesión inválida o expirada" };
  }

  try {
    // Le pasamos el FormData crudo directo a NestJS
    console.log("URL de destino:", `${process.env.NEXT_PUBLIC_API_URL}/upload`);
    console.log("¿Existe el token?:", !!token);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.message || "Error al subir la imagen al servidor" };
    }

    const data = await res.json();
    
    // Devolvemos la URL pública que generó Supabase
    return { success: true, url: data.url };
  } catch (error) {
    console.error("Error en uploadImageAction:", error);
    return { error: "Error de conexión con la API" };
  }
}