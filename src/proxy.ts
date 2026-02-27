import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Lightweight dev/prototype helper:
// Visually mask raster images with a single placeholder that says
// "TO REPLACE WITH WEBP".
//
// We intentionally do NOT touch SVGs so iconography keeps working.
const PLACEHOLDER_PATH = "/imgs/__replace-with-webp.svg";
// We only mask *non-webp* rasters. If an image is already .webp, we leave it alone.
const RASTER_EXT_RE = /\.(png|jpg|jpeg|gif|avif)$/i;

// Allowlist for small UI icons/logos we want to keep as real PNGs
// (so the header still looks usable while larger marketing imagery is masked).
const KEEP_REAL_RASTER_PATHS = new Set([
  "/imgs/smallicon.png",
  "/imgs/smalllogo.png",
  "/imgs/bookingicon.png",
  "/imgs/mybookingicon.png",
  "/imgs/myaccounticon.png",
  // Homepage hero slider: keep original photography visible for now
  "/imgs/hero-slider-image-4.jpg",
  "/imgs/hero-slider-image-5.jpg",
]);

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Never touch API routes.
  if (pathname.startsWith("/api/")) return NextResponse.next();

  // Never rewrite the placeholder itself.
  if (pathname === PLACEHOLDER_PATH) return NextResponse.next();

  // Keep SVG icons as-is.
  if (pathname.toLowerCase().endsWith(".svg")) return NextResponse.next();

  // Keep certain header icons/logos as real raster images.
  if (KEEP_REAL_RASTER_PATHS.has(pathname.toLowerCase())) {
    return NextResponse.next();
  }

  // Only rewrite raster requests.
  if (!RASTER_EXT_RE.test(pathname)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = PLACEHOLDER_PATH;
  return NextResponse.rewrite(url);
}

export const config = {
  // Run for all paths; we quickly bail for non-image requests above.
  matcher: ["/:path*"],
};
