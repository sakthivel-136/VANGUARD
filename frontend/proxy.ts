import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that don't require authentication
const publicRoutes = ['/login', '/_next', '/api', '/favicon.ico', '/public', '/icon.png']

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Allow public routes and static assets to pass through
    if (
        publicRoutes.some(route => pathname.startsWith(route)) ||
        pathname === '/' ||
        pathname.includes('.')
    ) {
        return NextResponse.next()
    }

    // Retrieve auth token from cookies
    const token = request.cookies.get('access_token')

    // If there's no token, redirect to login
    if (!token?.value) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // Allow the request to proceed if a token exists
    return NextResponse.next()
}

// Specify the paths the proxy should run on
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
