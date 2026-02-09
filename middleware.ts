import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Pass-through middleware (authentication disabled for now)
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

// Optional: Specify which routes this middleware runs on
// Currently allowing all routes through
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

// Commented out authentication middleware for future use:
// import { withAuth } from 'next-auth/middleware'
//
// export default withAuth(
//   function middleware(req) {
//     return NextResponse.next()
//   },
//   {
//     callbacks: {
//       authorized: ({ token, req }) => {
//         // Public paths that don't require authentication
//         const publicPaths = ['/', '/auth/signin', '/auth/signup', '/auth/error']
//         const isPublicPath = publicPaths.some(path =>
//           req.nextUrl.pathname === path || req.nextUrl.pathname.startsWith('/api/auth')
//         )
//
//         if (isPublicPath) {
//           return true
//         }
//
//         // All dashboard routes require authentication
//         if (req.nextUrl.pathname.startsWith('/dashboard')) {
//           return !!token
//         }
//
//         return !!token
//       },
//     },
//     pages: {
//       signIn: '/auth/signin',
//       error: '/auth/error',
//     },
//   }
// )
