import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/'
  if (!next.startsWith('/')) {
    next = `/${next}`
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("Supabase exchangeCodeForSession error:", error.message);
      const forwardedHost = request.headers.get('x-forwarded-host');
      const forwardedProto = request.headers.get('x-forwarded-proto') || 'http';
      let errorRedirectBaseUrl = 'https://trackie.online';
      if (process.env.NODE_ENV === 'development') {
        errorRedirectBaseUrl = `http://localhost:3000`;
      } else if (forwardedHost) {
        errorRedirectBaseUrl = `${forwardedProto}://${forwardedHost}`;
      }
      return NextResponse.redirect(`${errorRedirectBaseUrl}/auth/auth-code-error`);
    }

    const forwardedHost = request.headers.get('x-forwarded-host');
    const forwardedProto = request.headers.get('x-forwarded-proto') || 'http';

    let redirectBaseUrl;
    const isLocalEnv = process.env.NODE_ENV === 'development';


    if (isLocalEnv) {
      // In development, the 'origin' from request.url will be correct (http://localhost:3000)
      redirectBaseUrl = `http://localhost:3000`;
    } else if (forwardedHost) {
      // In production, rely on x-forwarded-host and x-forwarded-proto for the actual domain
      redirectBaseUrl = `${forwardedProto}://${forwardedHost}`;
    } else {
      // Fallback for unexpected scenarios, though x-forwarded-host should be present in prod
      console.warn("x-forwarded-host not found in production environment. Falling back to origin from request.url.");
      const { origin } = new URL(request.url); // Use origin from request.url if no forwarded host
      redirectBaseUrl = origin;
    }
    return NextResponse.redirect(`${redirectBaseUrl}${next}`); // e.g., https://trackie.online/tracker
  }


  const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'http';
  let noCodeRedirectBaseUrl = 'https://trackie.online';

  if (process.env.NODE_ENV === 'development') {
    noCodeRedirectBaseUrl = `http://localhost:3000`;
  } else if (forwardedHost) {
    noCodeRedirectBaseUrl = `${forwardedProto}://${forwardedHost}`;
  }
  return NextResponse.redirect(`${noCodeRedirectBaseUrl}/auth/auth-code-error`);
}