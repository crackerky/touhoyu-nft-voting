import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-key')

// Protected API routes that require authentication
const protectedRoutes = [
  '/api/nft/check-eligibility',
  '/api/voting/cast-vote',
  '/api/user/profile'
]

// Admin-only routes
const adminRoutes = [
  '/api/admin',
  '/admin'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute || isAdminRoute) {
    // Get the token from the Authorization header
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    try {
      // Verify the JWT token
      const { payload } = await jwtVerify(token, secret)
      
      if (!payload) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        )
      }

      // For admin routes, check if user has admin privileges
      if (isAdminRoute) {
        // In a real app, you would check the user's role from the database
        // For now, we'll check if the user email contains 'admin'
        const userEmail = payload.email as string
        if (!userEmail || !userEmail.includes('admin')) {
          return NextResponse.json(
            { error: 'Admin access required' },
            { status: 403 }
          )
        }
      }

      // Add user info to request headers for use in API routes
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('X-User-Id', payload.userId as string)
      requestHeaders.set('X-User-Email', payload.email as string || '')
      requestHeaders.set('X-User-Wallet', payload.walletAddress as string || '')

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      console.error('Token verification failed:', error)
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/nft/:path*',
    '/api/voting/:path*',
    '/api/user/:path*',
    '/api/admin/:path*',
    '/admin/:path*'
  ],
}