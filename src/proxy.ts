import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Admin gate. Refreshes the Supabase session cookie and sends signed-out visitors
 * to /admin/login. This is an optimistic check only: every admin page and Server
 * Action re-verifies the user and the admin_users allow-list (src/lib/admin/auth.ts).
 */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isLogin = request.nextUrl.pathname === "/admin/login";
  if (!url || !anonKey) return isLogin ? NextResponse.next() : redirectTo(request, "/admin/login");

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet, headers) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const signedIn = !!data?.claims?.sub;

  if (!signedIn && !isLogin) return redirectTo(request, "/admin/login");
  if (signedIn && isLogin) return redirectTo(request, "/admin");
  return response;
}

function redirectTo(request: NextRequest, pathname: string) {
  const target = request.nextUrl.clone();
  target.pathname = pathname;
  target.search = "";
  return NextResponse.redirect(target);
}

export const config = {
  matcher: ["/admin/:path*"],
};
