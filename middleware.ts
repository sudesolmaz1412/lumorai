import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) { // Tip düzeltildi
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { session } } = await supabase.auth.getSession()
  const path = req.nextUrl.pathname

  // 1. ANA SAYFA KORUMASI: lumorafi.com yazınca nereye gideceğine karar ver
  if (path === '/') {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    } else {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // 2. DASHBOARD KORUMASI: Giriş yapmamışsa /login'e yolla
  if (!session && path.startsWith('/dashboard')) {
    const loginUrl = new URL('/login', req.url)
    const redirectResponse = NextResponse.redirect(loginUrl)
    redirectResponse.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate')
    return redirectResponse
  }

  // 3. YÖNLENDİRME: Eski /incomes -> /dashboard/incomes
  if (path === '/incomes') {
    return NextResponse.redirect(new URL('/dashboard/incomes', req.url))
  }

  // 4. TERS KORUMA: Giriş yapmışsa /login'e girmesini engelle, dashboard'a at
  if (session && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/',             // Artık ana sayfayı da izliyor
    '/dashboard/:path*',
    '/incomes',
    '/login'
  ],
}