import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Buscamos la cookie que seteamos en la Server Action
  const token = request.cookies.get('token')?.value;

  // Si el redactor quiere entrar a /admin y no tiene token, lo rebotamos al login
  if (request.nextUrl.pathname.startsWith('/admin') && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Si está en el login pero ya tiene token, lo mandamos directo al admin
  if (request.nextUrl.pathname.startsWith('/auth/login') && token) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

// Le decimos al middleware en qué rutas específicas tiene que actuar
export const config = {
  matcher: ['/admin/:path*', '/auth/login'],
};