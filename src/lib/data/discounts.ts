/**
 * Discount affiliate data layer.
 *
 * Currently returns hardcoded seed data.
 * When the Python backend is ready, swap `fetchAffiliates()` to hit the API.
 *
 * Python endpoint contract:
 *   GET /api/discounts/affiliates → AffiliateDiscount[]
 */

import type { AffiliateDiscount } from "@/lib/schemas/discounts";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/["']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Seed / prototype data — mirrors the legacy discounts.html cards. */
export const SEED_AFFILIATES: AffiliateDiscount[] = [
  {
    id: "1", slug: "bangtae-makguksu", name: "Bangtae Makguksu",
    description: "Traditional Korean buckwheat noodle restaurant near Jongno.",
    image: "/imgs/discount-1.png", discount: "15% OFF",
    address: "157 Jongno, Jongno-gu, Seoul",
    benefit: "15% OFF for Tiger Bus ticket holders.",
    retrieveInstructions: "Show your Tiger Bus tour ticket at checkout to redeem.",
    website: "https://www.bangtaemakguksu.com",
  },
  {
    id: "2", slug: "ganga", name: "Ganga",
    description: "Authentic Indian cuisine in the heart of Seoul.",
    image: "/imgs/discount-2.png", discount: "15% OFF",
    address: "123 Ganga Street, Seoul",
    benefit: "15% OFF for Tiger Bus ticket holders.",
    retrieveInstructions: "Show your Tiger Bus tour ticket at checkout to redeem.",
    website: "https://www.ganga.com",
  },
  {
    id: "3", slug: "haus", name: "Haus",
    description: "Modern European-style café and dining experience.",
    image: "/imgs/discount-3.png", discount: "15% OFF",
    address: "456 Haus Street, Seoul",
    benefit: "15% OFF for Tiger Bus ticket holders.",
    retrieveInstructions: "Show your Tiger Bus tour ticket at checkout to redeem.",
    website: "https://www.haus.com",
  },
  {
    id: "4", slug: "gwangho", name: "Gwangho",
    description: "Popular Korean BBQ and traditional dishes.",
    image: "/imgs/discount-4.png", discount: "15% OFF",
    address: "789 Gwangho Street, Seoul",
    benefit: "15% OFF for Tiger Bus ticket holders.",
    retrieveInstructions: "Show your Tiger Bus tour ticket at checkout to redeem.",
    website: "https://www.gwangho.com",
  },
  {
    id: "5", slug: "kansong-museum", name: "Kansong Museum",
    description: "Historic art museum featuring Korean cultural heritage.",
    image: "/imgs/discount-5.png", discount: "15% OFF",
    address: "321 Museum Road, Seoul",
    benefit: "15% OFF for Tiger Bus ticket holders.",
    retrieveInstructions: "Show your Tiger Bus tour ticket at checkout to redeem.",
    website: "https://www.kansongmuseum.com",
  },
  {
    id: "6", slug: "moms-touch", name: "Mom's Touch",
    description: "Popular Korean fast food chain with burgers and chicken.",
    image: "/imgs/discount-6.png", discount: "15% OFF",
    address: "654 Food Street, Seoul",
    benefit: "15% OFF for Tiger Bus ticket holders.",
    retrieveInstructions: "Show your Tiger Bus tour ticket at checkout to redeem.",
    website: "https://www.momstouch.com",
  },
  {
    id: "7", slug: "zamshh", name: "ZAMSHH (Massage Chair Cafe)",
    description: "Relaxing massage chair café experience.",
    image: "/imgs/discount-7.png", discount: "15% OFF",
    address: "987 Cafe Street, Seoul",
    benefit: "15% OFF for Tiger Bus ticket holders.",
    retrieveInstructions: "Show your Tiger Bus tour ticket at checkout to redeem.",
    website: "https://www.zamshh.com",
  },
  {
    id: "8", slug: "gwanghwamun-hansang", name: "Gwanghwamun Hansang",
    description: "Traditional Korean set-meal restaurant near Gwanghwamun.",
    image: "/imgs/discount-8.png", discount: "15% OFF",
    address: "147 Gwanghwamun Street, Seoul",
    benefit: "15% OFF for Tiger Bus ticket holders.",
    retrieveInstructions: "Show your Tiger Bus tour ticket at checkout to redeem.",
    website: "https://www.gwanghwamunhansang.com",
  },
];

/* ------------------------------------------------------------------ */
/*  Data-fetching functions (swap implementation for real API)         */
/* ------------------------------------------------------------------ */

/**
 * Fetch all affiliate discounts.
 *
 * TODO (backend): Replace body with:
 *   const res = await fetch(`${process.env.API_BASE_URL}/api/discounts/affiliates`);
 *   if (!res.ok) throw new Error("Failed to fetch affiliates");
 *   return res.json();
 */
export async function fetchAffiliates(): Promise<AffiliateDiscount[]> {
  return SEED_AFFILIATES;
}

/** Resolve a single affiliate by slug (for deep-link support). */
export function findAffiliateBySlug(slug: string): AffiliateDiscount | undefined {
  return SEED_AFFILIATES.find((a) => a.slug === slug || slugify(a.name) === slug);
}

