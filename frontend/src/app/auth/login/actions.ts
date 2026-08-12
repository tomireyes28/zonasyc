// src/app/auth/login/actions.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Interfaz estricta para respetar nuestras reglas de TypeScript (Cero any)
interface LoginResponse {
  access_token?: string;
  message?: string;
}

export async function loginAction(email: string, password: string): Promise<{ error?: string }> {
  let isSuccess = false;

  try {
    // Al ser una Server Action, le pegamos a NestJS de servidor a servidor. 
    // ¡Nos ahorramos todos los problemas de CORS!
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      return { error: "Credenciales inválidas" };
    }

    const data = (await res.json()) as LoginResponse;

    if (data.access_token) {
      // En las versiones más nuevas de Next.js, cookies() es una promesa
      const cookieStore = await cookies();
      
      cookieStore.set("token", data.access_token, {
        httpOnly: true, // Imposible de leer desde el navegador (Máxima seguridad)
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // Dura 7 días exactos
        path: "/",
      });
      
      isSuccess = true;
    }
 } catch (error) {
    console.error("Error crítico en Login Action:", error);
    return { error: "Error de conexión con el servidor (API apagada)" };
  }

  // Importante: redirect() lanza un error interno en Next.js para funcionar.
  // SIEMPRE debe ir por fuera del bloque try-catch.
  if (isSuccess) {
    redirect("/admin");
  }
  
  return {};
}