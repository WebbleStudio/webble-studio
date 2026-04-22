import { NextRequest, NextResponse } from "next/server";
import { isValidLocale, defaultLocale } from "@/lib/locales";

/**
 * Reads the locale from the first path segment and forwards it as
 * the `x-locale` response header so the root layout can set <html lang>.
 * This proxy never redirects — it only annotates the response.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const rawLocale = segments[0];
  const locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;

  const response = NextResponse.next();
  response.headers.set("x-locale", locale);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except Next.js internals and static files.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
