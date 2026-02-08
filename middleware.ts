import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Public paths that don't require authentication
        const publicPaths = ['/', '/auth/signin', '/auth/signup', '/auth/error']
        const isPublicPath = publicPaths.some(path =>
          req.nextUrl.pathname === path || req.nextUrl.pathname.startsWith('/api/auth')
        )

        if (isPublicPath) {
          return true
        }

        // All dashboard routes require authentication
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token
        }

        return !!token
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
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
    '/dashboard/:path*',
    '/api/:path*',
  ],
}
