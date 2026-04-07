export type SelectedTour = {
  tourId: string;
  name: string;
  packageType: "classic" | "exclusive";
  adultPrice: number;
  childPrice: number;
};

export const CLASSIC_TOURS = [
  {
    tourId: "tour01",
    name: "Downtown Palace Namsan Course",
    description: "Discover Seoul's historic palaces and iconic Namsan Tower on this hop-on hop-off route.",
    image: "imgs/tour01__.png",
    badge: "day" as const,
    stops: 12,
    durationHours: 2.5,
    highlights: ["Gyeongbokgung Palace", "Bukchon Hanok Village", "Namsan Tower", "Myeongdong"],
    pricing: { adult: 20, child: 15 },
    isPopular: false,
  },
  {
    tourId: "tour02",
    name: "Panorama Course",
    description: "Experience Seoul's best panoramic views from elevated vantage points across the city.",
    image: "imgs/panorama.png",
    badge: "day" as const,
    stops: 10,
    durationHours: 2,
    highlights: ["Seoul Sky", "Lotte World Tower", "Han River Views", "Olympic Park"],
    pricing: { adult: 20, child: 15 },
    isPopular: false,
  },
  {
    tourId: "tour04",
    name: "Night View Course",
    description: "Seoul transforms after dark — explore the city's most spectacular illuminated landmarks.",
    image: "imgs/tour02__.png",
    badge: "night" as const,
    stops: 8,
    durationHours: 1.5,
    highlights: ["Cheonggyecheon Stream", "N Seoul Tower", "DDP Night", "Gwanghwamun"],
    pricing: { adult: 18, child: 12 },
    isPopular: true,
  },
] as const;

export const EXCLUSIVE_PACKAGES = [
  {
    tourId: "pkg-kculture",
    name: "K-Culture Explorer",
    tagline: "BTS filming spots + museum pass combo",
    image: "imgs/tour01__.png",
    badge: "Exclusive",
    baseRoute: "Based on Tour 01",
    highlights: ["BTS Filming Locations", "K-Pop Museum Entry", "Han River Cruise", "Hanbok Experience"],
    pricing: { adult: 45, child: 35 },
  },
  {
    tourId: "pkg-kbeauty",
    name: "K-Beauty & Style Tour",
    tagline: "Shopping districts + beauty experience",
    image: "imgs/panorama.png",
    badge: "Popular",
    baseRoute: "Based on Tour 02",
    highlights: ["Myeongdong Beauty Market", "Hongdae Shopping", "Skin Care Workshop", "Style Photo Shoot"],
    pricing: { adult: 40, child: 30 },
  },
] as const;

export function formatUsd(n: number) {
  return `$${n.toFixed(2)}`;
}

export function getTourById(tourId: string): SelectedTour | null {
  const classic = CLASSIC_TOURS.find((t) => t.tourId === tourId);
  if (classic) {
    return {
      tourId: classic.tourId,
      name: classic.name,
      packageType: "classic",
      adultPrice: classic.pricing.adult,
      childPrice: classic.pricing.child,
    };
  }
  const exclusive = EXCLUSIVE_PACKAGES.find((p) => p.tourId === tourId);
  if (exclusive) {
    return {
      tourId: exclusive.tourId,
      name: exclusive.name,
      packageType: "exclusive",
      adultPrice: exclusive.pricing.adult,
      childPrice: exclusive.pricing.child,
    };
  }
  return null;
}
