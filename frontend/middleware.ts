// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('riadkit_staff_token')?.value;
  const path = request.nextUrl.pathname;

  const isAuthPage = path === '/login' || path === '/register';
  const isGuestPage = path.startsWith('/room/');
  const isProtectedPage = path.startsWith('/dashboard/') || path.startsWith('/reception/');

  // 1. Guest portal – always accessible
  if (isGuestPage) {
    return NextResponse.next();
  }

  // 2. If no token and trying to access protected page → redirect to login
  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. If token exists and trying to access login/register → redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/reception/:path*',
    '/login',
    '/register',
    '/room/:path*',
  ],
};