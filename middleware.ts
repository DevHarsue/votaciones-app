
import { NextResponse, type NextRequest } from 'next/server';

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;
    const { pathname } = new URL(request.url);

    // Rutas públicas
    const publicRoutes = ['/login', '/register'];
    // Rutas protegidas
    const protectedRoutes = ['/dashboard', '/inscripcion',"/votaciones"];

    if (token && publicRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}