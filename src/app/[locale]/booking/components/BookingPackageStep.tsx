"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";

export type SelectedTour = {
  tourId: string;
  name: string;
  packageType: "classic" | "exclusive";
  adultPrice: number;
  childPrice: number;
};

type Props = {
  adultCount: number;
  childCount: number;
  selectedDate: Date;
  variant: "A" | "C";
  onVariantChange: (v: "A" | "C") => void;
  onSelectTour: (tour: SelectedTour) => void;
  onBack: () => void;
};

// Placeholder pricing — to be replaced by backend API
const CLASSIC_TOURS = [
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
];

const EXCLUSIVE_PACKAGES = [
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
];

function formatUsd(n: number) {
  return `$${n.toFixed(2)}`;
}

// ─── Carousel helpers ────────────────────────────────────────────────────────

function useCarousel(total: number) {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(total - 1, i + 1));
  return { index, prev, next };
}

function CarouselDots({ total, active }: { total: number; active: number }) {
  if (total <= 1) return null;
  return (
    <div className="mt-3 flex justify-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`block size-2 rounded-full transition-colors ${i === active ? "bg-brand-red" : "bg-[#ddd]"}`}
        />
      ))}
    </div>
  );
}

function CarouselArrows({
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
}: {
  onPrev: () => void;
  onNext: () => void;
  prevDisabled: boolean;
  nextDisabled: boolean;
}) {
  return (
    <>
      <button
        className="absolute -left-4 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-red text-white shadow-md disabled:opacity-40 max-md:-left-3"
        onClick={onPrev}
        disabled={prevDisabled}
        aria-label="Previous"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        className="absolute -right-4 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-red text-white shadow-md disabled:opacity-40 max-md:-right-3"
        onClick={onNext}
        disabled={nextDisabled}
        aria-label="Next"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </>
  );
}

// ─── Card components ─────────────────────────────────────────────────────────

type StandardTourCardProps = {
  tour: (typeof CLASSIC_TOURS)[number];
  adultCount: number;
  childCount: number;
  onBook: () => void;
  variant?: "default" | "grid";
  hideDescription?: boolean;
};

function StandardTourCard({
  tour,
  adultCount,
  childCount,
  onBook,
  variant = "default",
  hideDescription = false,
}: StandardTourCardProps) {
  const tc = useTranslations("Common");
  const pricing = tour.pricing;
  const total = adultCount * pricing.adult + childCount * pricing.child;
  const showTotal = adultCount + childCount > 0;

  return (
    <div className="overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-[180px] overflow-hidden">
        <img src={tour.image} alt={tour.name} className="size-full object-cover" />
        <span
          className={`absolute left-3 top-3 rounded px-2 py-0.5 text-xs font-semibold text-white ${
            tour.badge === "night" ? "bg-[#1a1a2e]" : "bg-brand-red"
          }`}
        >
          {tour.badge === "night" ? tc("night") : tc("day")}
        </span>
        {tour.isPopular && (
          <span className="absolute right-3 top-3 rounded bg-[#ff9f00] px-2 py-0.5 text-xs font-semibold text-white">
            Popular
          </span>
        )}
      </div>
      <div className={`${variant === "grid" ? "p-3" : "p-4"}`}>
        <h3 className="mb-1 text-base font-bold text-text-dark">{tour.name}</h3>
        {!hideDescription && <p className="mb-3 text-sm text-text-gray">{tour.description}</p>}
        <div className="mb-3 flex gap-4 text-xs text-text-gray">
          <span>{tour.stops} stops</span>
          <span>{tour.durationHours}h route</span>
        </div>
        <ul className="mb-3 space-y-1">
          {tour.highlights.slice(0, 4).map((h) => (
            <li key={h} className="flex items-center gap-1.5 text-xs text-text-dark">
              <span className="text-brand-red">✓</span> {h}
            </li>
          ))}
        </ul>
        <div className="border-t border-[#eee] pt-3">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-text-gray">{tc("adult")}</span>
            <span className="font-semibold text-brand-red">{formatUsd(pricing.adult)}</span>
          </div>
          <div className="mb-3 flex justify-between text-sm">
            <span className="text-text-gray">{tc("child")}</span>
            <span className="font-semibold text-brand-red">{formatUsd(pricing.child)}</span>
          </div>
          {showTotal && (
            <div className="mb-3 flex justify-between text-sm font-bold">
              <span>{tc("yourTotal")}</span>
              <span className="text-brand-red">{formatUsd(total)}</span>
            </div>
          )}
          <button
            className="w-full rounded-lg bg-brand-red py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark-red"
            onClick={onBook}
          >
            {tc("bookNow")}
          </button>
        </div>
      </div>
    </div>
  );
}

type ExclusivePackageCardProps = {
  pkg: (typeof EXCLUSIVE_PACKAGES)[number];
  adultCount: number;
  childCount: number;
  onBook: () => void;
};

function ExclusivePackageCard({ pkg, adultCount, childCount, onBook }: ExclusivePackageCardProps) {
  const tc = useTranslations("Common");
  const pricing = pkg.pricing;
  const total = adultCount * pricing.adult + childCount * pricing.child;
  const showTotal = adultCount + childCount > 0;

  return (
    <div className="overflow-hidden rounded-xl border-2 border-brand-red bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-[200px] overflow-hidden">
        <img src={pkg.image} alt={pkg.name} className="size-full object-cover" />
        <span className="absolute left-3 top-3 rounded bg-brand-red px-2 py-0.5 text-xs font-semibold text-white">
          {pkg.badge}
        </span>
      </div>
      <div className="p-4">
        <h3 className="mb-1 text-base font-bold text-text-dark">{pkg.name}</h3>
        <p className="mb-1 text-sm italic text-text-gray">{pkg.tagline}</p>
        <p className="mb-3 text-xs text-text-light-gray">{pkg.baseRoute}</p>
        <ul className="mb-3 space-y-1">
          {pkg.highlights.slice(0, 4).map((h) => (
            <li key={h} className="flex items-center gap-1.5 text-xs text-text-dark">
              <span className="text-brand-red">★</span> {h}
            </li>
          ))}
        </ul>
        <div className="border-t border-[#eee] pt-3">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-text-gray">{tc("adult")}</span>
            <span className="font-semibold text-brand-red">{formatUsd(pricing.adult)}</span>
          </div>
          <div className="mb-3 flex justify-between text-sm">
            <span className="text-text-gray">{tc("child")}</span>
            <span className="font-semibold text-brand-red">{formatUsd(pricing.child)}</span>
          </div>
          {showTotal && (
            <div className="mb-3 flex justify-between text-sm font-bold">
              <span>{tc("yourTotal")}</span>
              <span className="text-brand-red">{formatUsd(total)}</span>
            </div>
          )}
          <button
            className="w-full rounded-lg bg-brand-red py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark-red"
            onClick={onBook}
          >
            {tc("bookNow")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ title, description, fixedHeight = false }: { title: string; description: string; fixedHeight?: boolean }) {
  return (
    <div className={`mb-4 ${fixedHeight ? "min-h-[72px]" : ""}`}>
      <h2 className="text-xl font-bold text-text-dark">{title}</h2>
      <p className="mt-1 text-sm text-text-gray">{description}</p>
    </div>
  );
}

// Chunk array into groups of `size`
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

type SectionProps = Omit<Props, "selectedDate" | "onBack" | "variant" | "onVariantChange">;

// ─── Design A ────────────────────────────────────────────────────────────────
// Desktop: equal 2-column grid with stacked cards
// Mobile: carousels (1 card per slide per section)

function DesignA({ adultCount, childCount, onSelectTour }: SectionProps) {
  const classicCarousel = useCarousel(CLASSIC_TOURS.length);
  const exclusiveCarousel = useCarousel(EXCLUSIVE_PACKAGES.length);

  const bookClassic = (tour: (typeof CLASSIC_TOURS)[number]) =>
    onSelectTour({
      tourId: tour.tourId,
      name: tour.name,
      packageType: "classic",
      adultPrice: tour.pricing.adult,
      childPrice: tour.pricing.child,
    });

  const bookExclusive = (pkg: (typeof EXCLUSIVE_PACKAGES)[number]) =>
    onSelectTour({
      tourId: pkg.tourId,
      name: pkg.name,
      packageType: "exclusive",
      adultPrice: pkg.pricing.adult,
      childPrice: pkg.pricing.child,
    });

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Classic Tours */}
      <div>
        <SectionHeader
          title="Classic Seoul Tours"
          description="Hop-on hop-off routes covering Seoul's iconic landmarks."
          fixedHeight
        />
        {/* Desktop: stacked */}
        <div className="hidden space-y-4 lg:block">
          {CLASSIC_TOURS.map((tour) => (
            <StandardTourCard
              key={tour.tourId}
              tour={tour}

              adultCount={adultCount}
              childCount={childCount}
              onBook={() => bookClassic(tour)}
            />
          ))}
        </div>
        {/* Mobile: carousel */}
        <div className="relative px-5 lg:hidden">
          <StandardTourCard
            tour={CLASSIC_TOURS[classicCarousel.index]}
            adultCount={adultCount}
            childCount={childCount}
            onBook={() => bookClassic(CLASSIC_TOURS[classicCarousel.index])}
          />
          <CarouselArrows
            onPrev={classicCarousel.prev}
            onNext={classicCarousel.next}
            prevDisabled={classicCarousel.index === 0}
            nextDisabled={classicCarousel.index === CLASSIC_TOURS.length - 1}
          />
          <CarouselDots total={CLASSIC_TOURS.length} active={classicCarousel.index} />
        </div>
      </div>

      {/* Exclusive Packages */}
      <div>
        <SectionHeader
          title="Exclusive Packages"
          description="Curated experiences combining tours with unique Seoul activities."
          fixedHeight
        />
        {/* Desktop: stacked */}
        <div className="hidden space-y-4 lg:block">
          {EXCLUSIVE_PACKAGES.map((pkg) => (
            <ExclusivePackageCard
              key={pkg.tourId}
              pkg={pkg}

              adultCount={adultCount}
              childCount={childCount}
              onBook={() => bookExclusive(pkg)}
            />
          ))}
        </div>
        {/* Mobile: carousel */}
        <div className="relative px-5 lg:hidden">
          <ExclusivePackageCard
            pkg={EXCLUSIVE_PACKAGES[exclusiveCarousel.index]}
            adultCount={adultCount}
            childCount={childCount}
            onBook={() => bookExclusive(EXCLUSIVE_PACKAGES[exclusiveCarousel.index])}
          />
          <CarouselArrows
            onPrev={exclusiveCarousel.prev}
            onNext={exclusiveCarousel.next}
            prevDisabled={exclusiveCarousel.index === 0}
            nextDisabled={exclusiveCarousel.index === EXCLUSIVE_PACKAGES.length - 1}
          />
          <CarouselDots total={EXCLUSIVE_PACKAGES.length} active={exclusiveCarousel.index} />
        </div>
      </div>
    </div>
  );
}

// ─── Design C ────────────────────────────────────────────────────────────────
// Desktop: asymmetric 1:2 grid — left=exclusive (1/slide), right=classic (2/slide)
// Mobile: stacked carousels (1/slide each)

function DesignC({ adultCount, childCount, onSelectTour }: SectionProps) {
  const classicSlides = chunk(CLASSIC_TOURS, 2);
  const classicDesktopCarousel = useCarousel(classicSlides.length);
  const exclusiveDesktopCarousel = useCarousel(EXCLUSIVE_PACKAGES.length);
  const classicMobileCarousel = useCarousel(CLASSIC_TOURS.length);
  const exclusiveMobileCarousel = useCarousel(EXCLUSIVE_PACKAGES.length);

  const bookClassic = (tour: (typeof CLASSIC_TOURS)[number]) =>
    onSelectTour({
      tourId: tour.tourId,
      name: tour.name,
      packageType: "classic",
      adultPrice: tour.pricing.adult,
      childPrice: tour.pricing.child,
    });

  const bookExclusive = (pkg: (typeof EXCLUSIVE_PACKAGES)[number]) =>
    onSelectTour({
      tourId: pkg.tourId,
      name: pkg.name,
      packageType: "exclusive",
      adultPrice: pkg.pricing.adult,
      childPrice: pkg.pricing.child,
    });

  return (
    <div>
      {/* Desktop: asymmetric 1:2 grid */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_2fr] lg:gap-8">
        {/* Left: Exclusive Packages — 1 per slide */}
        <div>
          <SectionHeader
            title="Exclusive Packages"
            description="Unique curated Seoul experiences."
          />
          <div className="relative px-5">
            <ExclusivePackageCard
              pkg={EXCLUSIVE_PACKAGES[exclusiveDesktopCarousel.index]}

              adultCount={adultCount}
              childCount={childCount}
              onBook={() => bookExclusive(EXCLUSIVE_PACKAGES[exclusiveDesktopCarousel.index])}
            />
            <CarouselArrows
              onPrev={exclusiveDesktopCarousel.prev}
              onNext={exclusiveDesktopCarousel.next}
              prevDisabled={exclusiveDesktopCarousel.index === 0}
              nextDisabled={exclusiveDesktopCarousel.index === EXCLUSIVE_PACKAGES.length - 1}
            />
            <CarouselDots total={EXCLUSIVE_PACKAGES.length} active={exclusiveDesktopCarousel.index} />
          </div>
        </div>

        {/* Right: Classic Tours — 2 per slide */}
        <div>
          <SectionHeader
            title="Classic Seoul Tours"
            description="Hop-on hop-off routes covering Seoul's iconic landmarks."
          />
          <div className="relative px-5">
            <div className="grid grid-cols-2 gap-5">
              {classicSlides[classicDesktopCarousel.index].map((tour) => (
                <StandardTourCard
                  key={tour.tourId}
                  tour={tour}
    
                  adultCount={adultCount}
                  childCount={childCount}
                  variant="grid"
                  hideDescription
                  onBook={() => bookClassic(tour)}
                />
              ))}
            </div>
            {classicSlides.length > 1 && (
              <CarouselArrows
                onPrev={classicDesktopCarousel.prev}
                onNext={classicDesktopCarousel.next}
                prevDisabled={classicDesktopCarousel.index === 0}
                nextDisabled={classicDesktopCarousel.index === classicSlides.length - 1}
              />
            )}
            <CarouselDots total={classicSlides.length} active={classicDesktopCarousel.index} />
          </div>
        </div>
      </div>

      {/* Mobile: stacked carousels */}
      <div className="space-y-8 lg:hidden">
        <div>
          <SectionHeader
            title="Classic Seoul Tours"
            description="Hop-on hop-off routes covering Seoul's iconic landmarks."
          />
          <div className="relative px-5">
            <StandardTourCard
              tour={CLASSIC_TOURS[classicMobileCarousel.index]}

              adultCount={adultCount}
              childCount={childCount}
              hideDescription
              onBook={() => bookClassic(CLASSIC_TOURS[classicMobileCarousel.index])}
            />
            <CarouselArrows
              onPrev={classicMobileCarousel.prev}
              onNext={classicMobileCarousel.next}
              prevDisabled={classicMobileCarousel.index === 0}
              nextDisabled={classicMobileCarousel.index === CLASSIC_TOURS.length - 1}
            />
            <CarouselDots total={CLASSIC_TOURS.length} active={classicMobileCarousel.index} />
          </div>
        </div>
        <div>
          <SectionHeader
            title="Exclusive Packages"
            description="Unique curated Seoul experiences."
          />
          <div className="relative px-5">
            <ExclusivePackageCard
              pkg={EXCLUSIVE_PACKAGES[exclusiveMobileCarousel.index]}

              adultCount={adultCount}
              childCount={childCount}
              onBook={() => bookExclusive(EXCLUSIVE_PACKAGES[exclusiveMobileCarousel.index])}
            />
            <CarouselArrows
              onPrev={exclusiveMobileCarousel.prev}
              onNext={exclusiveMobileCarousel.next}
              prevDisabled={exclusiveMobileCarousel.index === 0}
              nextDisabled={exclusiveMobileCarousel.index === EXCLUSIVE_PACKAGES.length - 1}
            />
            <CarouselDots total={EXCLUSIVE_PACKAGES.length} active={exclusiveMobileCarousel.index} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BookingPackageStep({
  adultCount,
  childCount,
  selectedDate,
  variant,
  onVariantChange,
  onSelectTour,
  onBack,
}: Props) {
  const locale = useLocale();
  const localeTag = locale === "ko" ? "ko-KR" : "en-US";
  const t = useTranslations("BookingStep2");
  const tc = useTranslations("Common");

  const dateLabel = selectedDate.toLocaleDateString(localeTag, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      {/* Step Header */}
      <div className="flex items-center justify-between border-b border-[#eee] px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-brand-red text-base font-semibold text-white">
            2
          </span>
          <span className="text-lg font-semibold text-text-dark">{t("stepTitle")}</span>
        </div>
        {/* Design variant toggle */}
        <div className="flex overflow-hidden rounded-lg border border-[#ddd]">
          {(["A", "C"] as const).map((v) => (
            <button
              key={v}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                variant === v ? "bg-brand-red text-white" : "bg-white text-text-gray hover:bg-[#f5f5f5]"
              }`}
              onClick={() => onVariantChange(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 max-md:p-4">
        <button
          className="mb-4 border-none bg-transparent py-2 text-base text-text-gray hover:text-text-dark"
          onClick={onBack}
        >
          {tc("back")}
        </button>

        {/* Date / duration context */}
        <div className="mb-6 rounded-xl bg-[#f8f9fa] px-5 py-4">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold text-text-dark">{dateLabel}</span>
            {adultCount > 0 && (
              <span className="text-text-gray">
                {adultCount} {adultCount > 1 ? tc("adults") : tc("adult")}
              </span>
            )}
            {childCount > 0 && (
              <span className="text-text-gray">
                {childCount} {childCount > 1 ? tc("children") : tc("child")}
              </span>
            )}
          </div>
        </div>

        {variant === "A" ? (
          <DesignA
            adultCount={adultCount}
            childCount={childCount}
            onSelectTour={onSelectTour}
          />
        ) : (
          <DesignC
            adultCount={adultCount}
            childCount={childCount}
            onSelectTour={onSelectTour}
          />
        )}
      </div>
    </>
  );
}
