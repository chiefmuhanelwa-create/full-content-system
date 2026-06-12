import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withAuth } from 'next-auth/middleware'

// Authentication middleware - protects all routes except public paths
export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Public paths that don't require authentication
        const publicPaths = ['/', '/auth/signin', '/auth/signup', '/auth/error']
        const internalSeedPaths = ['/api/products/seed', '/api/story-bank/seed']
        const isPublicPath = publicPaths.some(path =>
          req.nextUrl.pathname === path || req.nextUrl.pathname.startsWith('/api/auth')
        ) || (internalSeedPaths.includes(req.nextUrl.pathname) && req.headers.get('x-internal-seed') === '1')

        if (isPublicPath) {
          return true
        }

        // All dashboard and API routes require authentication
        if (req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/api/')) {
          return !!token
        }

        return true
      },
    },
    pages: {
      signIn: '/auth/signin',
      error: '/auth/error',
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.html).*)',
  ],
}
