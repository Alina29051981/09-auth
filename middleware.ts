// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookieHeader = req.headers.get('cookie') || '';
  const cookiesParsed = parse(cookieHeader);

  const refreshToken = cookiesParsed.refreshToken;

  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  let isAuthenticated = Boolean(cookiesParsed.accessToken);

  if (!isAuthenticated && refreshToken) {
    const user = await checkSession({ cookie: cookieHeader });
    if (user) isAuthenticated = true;
  }

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!isAuthenticated && isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
