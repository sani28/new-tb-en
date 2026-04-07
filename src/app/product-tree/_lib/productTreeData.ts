import {
  TOUR_PRICES,
  TOUR_NAMES,
  TOUR_META,
} from "@/components/homepage/checkout/PromoCheckoutContext";
import { promoProductData } from "@/lib/data/promoProducts";
import { typeDisplayName } from "./colors";
import type {
  ProductNode,
  ProductEdge,
  ProductTreeData,
  AddonType,
} from "./types";

// ── Exclusive packages (hardcoded — matches BookingPackageStep + PromoTourSelectionModal) ──
const EXCLUSIVE_PACKAGES = [
  {
    id: "pkg-bts-day",
    name: "BTS the City Seoul (Day)",
    tagline: "Visit iconic BTS filming locations across Seoul — daytime edition",
    image: "/imgs/tour01__.png",
    badge: "Exclusive",
    baseRoute: "Based on Tour 01",
    highlights: ["BTS Filming Locations", "K-Pop Museum Entry", "Han River Cruise", "Hanbok Experience"],
    pricing: { adult: 45, child: 35 },
    basedOnTour: "tour01",
  },
  {
    id: "pkg-bts-night",
    name: "BTS the City Seoul (Night)",
    tagline: "Visit iconic BTS filming locations across Seoul — night edition",
    image: "/imgs/tour04home.png",
    badge: "Exclusive",
    baseRoute: "Based on Tour 04",
    highlights: ["BTS Filming Locations", "K-Pop Museum Entry", "Night City Views", "Hanbok Experience"],
    pricing: { adult: 45, child: 35 },
    basedOnTour: "tour04",
  },
  {
    id: "pkg-glow-up",
    name: "Glow Up Package",
    tagline: "K-Beauty shopping districts + beauty experience",
    image: "/imgs/tour01__.png",
    badge: "Popular",
    baseRoute: "Based on Tour 01",
    highlights: ["Myeongdong Beauty Market", "Hongdae Shopping", "Skin Care Workshop", "Style Photo Shoot"],
    pricing: { adult: 40, child: 30 },
    basedOnTour: "tour01",
  },
];

// Static KRW pricing (manual values, not converted)
const TOUR_KRW: Record<string, { adult: number; child: number; adultOrig: number; childOrig: number }> = {
  tour01: { adult: 27000, child: 19000, adultOrig: 33000, childOrig: 23000 },
  tour02: { adult: 25000, child: 16000, adultOrig: 33000, childOrig: 23000 },
  tour04: { adult: 24000, child: 16000, adultOrig: 29000, childOrig: 19000 },
};

const EXCLUSIVE_KRW: Record<string, { adult: number; child: number; adultOrig: number; childOrig: number }> = {
  "pkg-bts-day": { adult: 28000, child: 20000, adultOrig: 34000, childOrig: 21000 },
  "pkg-bts-night": { adult: 26000, child: 17000, adultOrig: 29000, childOrig: 19000 },
  "pkg-glow-up": { adult: 28000, child: 20000, adultOrig: 36000, childOrig: 26000 },
};

const ADDON_KRW: Record<string, { price?: number; originalPrice?: number; adultPrice?: number; childPrice?: number }> = {
  kwangjuyo: { price: 31000, originalPrice: 43000 },
  "sejong-backstage": { adultPrice: 10000, childPrice: 6000 },
  "museum-pass": { adultPrice: 31000, childPrice: 18000 },
  "han-river-cruise": { adultPrice: 31000, childPrice: 25000 },
  "hanbok-rental": { adultPrice: 25000, childPrice: 15000 },
};

function buildProductTree(): ProductTreeData {
  // ── Tours ── (exclude pkg-* entries which are exclusive packages, not classic tours)
  const tourIds = Object.keys(TOUR_PRICES).filter((id) => !id.startsWith("pkg-"));
  const tours: ProductNode[] = tourIds.map((id) => {
    const prices = TOUR_PRICES[id];
    const krw = TOUR_KRW[id];
    const meta = TOUR_META[id] ?? {};
    return {
      id,
      kind: "tour",
      name: TOUR_NAMES[id] ?? id,
      active: id !== "tour02",
      pricing: {
        adultPrice: prices.adult,
        childPrice: prices.child,
        adultOrig: prices.adultOrig,
        childOrig: prices.childOrig,
        adultPriceKrw: krw?.adult,
        childPriceKrw: krw?.child,
        adultOrigKrw: krw?.adultOrig,
        childOrigKrw: krw?.childOrig,
      },
      meta: {
        image: meta.image,
        label: meta.label,
        labelColor: meta.labelColor,
        title: meta.title,
        isPopular: meta.isPopular,
      },
      tags: [],
      compatibleTours: null,
      tourOptional: false,
    };
  });

  // ── Exclusive tours ──
  const exclusives: ProductNode[] = EXCLUSIVE_PACKAGES.map((pkg) => {
    const krw = EXCLUSIVE_KRW[pkg.id];
    return {
    id: pkg.id,
    kind: "exclusive" as const,
    name: pkg.name,
    active: true,
    tags: [],
    pricing: {
      adultPrice: pkg.pricing.adult,
      childPrice: pkg.pricing.child,
      adultPriceKrw: krw?.adult,
      childPriceKrw: krw?.child,
      adultOrigKrw: krw?.adultOrig,
      childOrigKrw: krw?.childOrig,
    },
    meta: {
      tagline: pkg.tagline,
      image: pkg.image,
      badge: pkg.badge,
      baseRoute: pkg.baseRoute,
      highlights: pkg.highlights,
      basedOnTour: pkg.basedOnTour,
    },
    compatibleTours: null,
    tourOptional: false,
  };
  });

  // ── Addons ──
  // Per-product display tags
  const ADDON_TAGS: Record<string, string[]> = {
    "kwangjuyo": ["product"],
    "sejong-backstage": ["scheduled", "physical ticket"],
    "museum-pass": ["validity pass", "ticket"],
    "han-river-cruise": ["scheduled", "e-mail ticket"],
    "hanbok-rental": ["scheduled", "e-mail ticket"],
  };

  const addonEntries = Object.entries(promoProductData);
  const addons: ProductNode[] = addonEntries.map(([id, p]) => {
    const krw = ADDON_KRW[id];
    return {
    id,
    kind: "addon" as const,
    name: p.name,
    active: true,
    type: p.type as AddonType,
    tags: ADDON_TAGS[id] ?? [typeDisplayName(p.type)],
    category: p.category,
    pricing: {
      price: p.price,
      originalPrice: p.originalPrice,
      adultPrice: p.adultPrice,
      childPrice: p.childPrice,
      priceKrw: krw?.price,
      originalPriceKrw: krw?.originalPrice,
      adultPriceKrw: krw?.adultPrice,
      childPriceKrw: krw?.childPrice,
    },
    meta: {
      description: p.description,
      image: p.image,
      placeholder: p.placeholder,
      variants: p.variants,
      colors: p.colors ?? null,
      cruiseTypes: p.cruiseTypes ?? null,
      timeSlots: p.timeSlots ?? null,
      validUntil: p.validUntil ?? null,
      operationHours: p.operationHours ?? null,
      availableTimes: p.availableTimes ?? null,
    },
    compatibleTours: p.compatibleTours ?? null,
    tourOptional: p.tourOptional ?? false,
  };
  });

  // ── Edges (tour → addon) ──
  const edges: ProductEdge[] = [];
  for (const addon of addons) {
    if (addon.compatibleTours) {
      for (const tourId of addon.compatibleTours) {
        edges.push({
          from: tourId,
          to: addon.id,
          required: !addon.tourOptional,
        });
      }
    } else {
      // Universal: connect to all tours
      for (const tour of tours) {
        edges.push({
          from: tour.id,
          to: addon.id,
          required: false,
        });
      }
    }
  }

  // ── Edges (exclusive → base tour) ──
  for (const pkg of exclusives) {
    const baseTour = pkg.meta.basedOnTour as string;
    if (baseTour) {
      edges.push({
        from: baseTour,
        to: pkg.id,
        required: false,
      });
    }
  }

  // ── Products (user-created, starts empty — items added via UI) ──
  const products: ProductNode[] = [];

  return Object.freeze({ tours, exclusives, addons, products, edges }) as ProductTreeData;
}

export const productTree = buildProductTree();
