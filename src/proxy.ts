import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/config";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

// Paths that should NOT go through i18n locale routing
const SKIP_INTL_RE = /^\/(api|_next|product-tree|imgs|home-imgs|fonts|favicon\.ico)/;
// File extension — skip i18n for static assets
const HAS_EXT_RE = /\.[a-z0-9]+$/i;

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip i18n for API, static assets, product-tree
  if (SKIP_INTL_RE.test(pathname) || HAS_EXT_RE.test(pathname)) {
    return NextResponse.next();
  }

  // Run next-intl middleware for locale routing
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/:path*"],
};
