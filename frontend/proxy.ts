import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = ['/dashboard']

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Only protect specific routes
    const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

    if (!isProtected) {
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

    return NextResponse.next()
}

// Only run proxy on protected paths
export const config = {
    matcher: ['/dashboard/:path*'],
}
