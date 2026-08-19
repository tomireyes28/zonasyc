import { NextResponse } from 'next/server';

const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.MAKE_API_SECRET}`) {
      return NextResponse.json({ error: 'No autorizado por el webhook' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, category, tags } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Faltan datos obligatorios (título o contenido)' }, { status: 400 });
    }

    // ACÁ ESTÁ EL ARREGLO: Volamos metaTitle y metaDescription para que NestJS no se queje
    const payload = {
      title,
      slug: generateSlug(title),
      content,
      coverImage: null,
      category: category || "Cine",
      tags: tags || [],
      status: 'DRAFT',
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ADMIN_JWT_TOKEN}`, 
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData.message || "NestJS rechazó la petición" }, { status: res.status });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Borrador creado con éxito',
      slug: payload.slug 
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}