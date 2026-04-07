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
  // Bus feature icons
  "/imgs/bus-feature-1.png",
  "/imgs/bus-feature-2.png",
  "/imgs/bus-feature-3.png",
  "/imgs/bus-feature-4.png",
  "/imgs/bus-feature-5.png",
  // Footer social icons + logo
  "/imgs/footericon-1.png",
  "/imgs/footericon-2.png",
  "/imgs/footericon-3.png",
  "/imgs/redlogo-tigerbus.png",
]);

export function proxy(req: NextRequest) {
  // Image placeholder rewriting disabled — show real images.
  return NextResponse.next();
}

export const config = {
  // Run for all paths; we quickly bail for non-image requests above.
  matcher: ["/:path*"],
};
