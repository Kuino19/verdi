import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — IMPORTANT: do not remove this
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protected app routes
  const isAppRoute = pathname.startsWith("/dashboard") ||
    pathname.startsWith("/cases") ||
    pathname.startsWith("/assistant") ||
    pathname.startsWith("/exam-generator") ||
    pathname.startsWith("/flashcards") ||
    pathname.startsWith("/caseflow") ||
    pathname.startsWith("/study-planner") ||
    pathname.startsWith("/past-papers") ||
    pathname.startsWith("/dictionary") ||
    pathname.startsWith("/community") ||
    pathname.startsWith("/leaderboard") ||
    pathname.startsWith("/bookmarks") ||
    pathname.startsWith("/referrals") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/upgrade");

  // Auth pages — redirect logged-in users away
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");

  if (isAppRoute && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
