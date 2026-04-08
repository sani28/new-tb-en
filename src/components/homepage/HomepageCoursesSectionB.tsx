/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePromoCheckout, TOUR_META, TOUR_PRICES, getTourPrices, getTourMeta, formatPrice } from "./checkout/PromoCheckoutContext";
import { promoProductData } from "@/lib/data/promoProducts";
import TicketCard from "@/components/shared/TicketCard";

// ─── Data ────────────────────────────────────────────────────────────────────

const CLASSIC_TOUR_IDS = ["tour01", "tour02", "tour04"] as const;

const EXCLUSIVE_PACKAGES = [
  {
    tourId: "pkg-kculture",
    nameKey: "pkgKculture.name",
    taglineKey: "pkgKculture.tagline",
    image: "/imgs/exclusive-package-bts.png",
    badgeKey: "exclusive",
    baseRouteKey: "basedOnTour",
    baseRouteParam: "Tour 01",
    highlightsKey: "pkgKculture.highlights",
    pricing: { adult: 45, adultOrig: 60, child: 35, childOrig: 45 },
  },
  {
    tourId: "pkg-kbeauty",
    nameKey: "pkgKbeauty.name",
    taglineKey: "pkgKbeauty.tagline",
    image: "/imgs/t01-a.png",
    badgeKey: "popular",
    baseRouteKey: "basedOnTour",
    baseRouteParam: "Tour 02",
    highlightsKey: "pkgKbeauty.highlights",
    pricing: { adult: 40, adultOrig: 55, child: 30, childOrig: 40 },
  },
];

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
        <span key={i} className={`block size-2 rounded-full transition-colors ${i === active ? "bg-brand-red" : "bg-white/30"}`} />
      ))}
    </div>
  );
}

function CarouselArrows({ onPrev, onNext, prevDisabled, nextDisabled }: { onPrev: () => void; onNext: () => void; prevDisabled: boolean; nextDisabled: boolean }) {
  return (
    <>
      <button className="absolute -left-3 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-brand-red text-white shadow-md disabled:opacity-40" onClick={onPrev} disabled={prevDisabled} aria-label="Previous" type="button">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <button className="absolute -right-3 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-brand-red text-white shadow-md disabled:opacity-40" onClick={onNext} disabled={nextDisabled} aria-label="Next" type="button">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
      </button>
    </>
  );
}

function chunk<T>(arr: readonly T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size) as T[]);
  return out;
}

// ─── Classic tour detail data ────────────────────────────────────────────────

const CLASSIC_TOUR_DETAILS: Record<string, {
  descriptionKey: string;
  stops: number;
  durationHours: number;
  highlightsKey: string;
}> = {
  tour01: {
    descriptionKey: "tour01.description",
    stops: 12,
    durationHours: 2.5,
    highlightsKey: "tour01.highlights",
  },
  tour02: {
    descriptionKey: "tour02.description",
    stops: 10,
    durationHours: 2,
    highlightsKey: "tour02.highlights",
  },
  tour04: {
    descriptionKey: "tour04.description",
    stops: 8,
    durationHours: 1.5,
    highlightsKey: "tour04.highlights",
  },
};

// ─── Sakura badge ───────────────────────────────────────────────────────────

function SakuraBadge({ label }: { label: string }) {
  return (
    <div
      className="absolute z-30 flex items-center justify-center pointer-events-none"
      style={{ width: 36, height: 36, top: -1, right: -1 }}
    >
      {/* Rotating sakura flower with notched petals */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full drop-shadow-lg"
        style={{ animation: "sakura-spin 6s linear infinite" }}
      >
        <defs>
          <path
            id="sakura-petal"
            d="M50,50 C42,38 38,20 42,10 C45,4 48,2 50,2 C52,2 55,4 58,10 C62,20 58,38 50,50 Z"
          />
          <clipPath id="petal-notch">
            <rect x="0" y="0" width="48" height="100" />
            <rect x="52" y="0" width="48" height="100" />
          </clipPath>
        </defs>
        {[0, 72, 144, 216, 288].map((angle) => (
          <g key={angle} transform={`rotate(${angle} 50 50)`}>
            {/* Left half of petal */}
            <path
              d="M50,50 C34,34 28,16 36,6 C40,0 45,-2 50,-2 L50,50 Z"
              fill="#F4A7B9"
            />
            {/* Right half of petal */}
            <path
              d="M50,50 C66,34 72,16 64,6 C60,0 55,-2 50,-2 L50,50 Z"
              fill="#F4A7B9"
            />
            {/* Notch at tip */}
            <path
              d="M44,2 L50,10 L56,2"
              fill="white"
            />
          </g>
        ))}
      </svg>
      {/* Static text — doesn't rotate */}
      <span
        className="relative z-10 text-[6px] font-extrabold uppercase tracking-wide text-white text-center leading-none"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Tour cards ──────────────────────────────────────────────────────────────

function ClassicTourCard({
  tourId, isSelected, onSelect, titleOverride,
}: { tourId: string; isSelected: boolean; onSelect: () => void; titleOverride?: string }) {
  const locale = useLocale();
  const isKo = locale === "ko";
  const meta = getTourMeta(tourId, locale) ?? TOUR_META[tourId]!;
  const prices = getTourPrices(locale)[tourId]!;
  const details = CLASSIC_TOUR_DETAILS[tourId];
  const title = titleOverride ?? meta.title;
  const tc = useTranslations("Common");
  const tt = useTranslations("Tours");
  const th = useTranslations("Homepage");

  // Get translated highlights array
  const tourKey = tourId as "tour01" | "tour02" | "tour04";
  const highlightKeys = ["0", "1", "2", "3"];

  return (
    <div className="relative h-full">
      {tourId === "tour01" && <SakuraBadge label={th("popular")} />}
      <div
        className="flex h-full flex-col overflow-hidden border-2 border-white bg-white shadow-sm transition-all cursor-pointer hover:shadow-md"
        onClick={onSelect}
      >
      <div className={`relative ${isKo ? "h-[200px]" : "h-[150px]"} shrink-0 overflow-hidden`}>
        <img src={meta.image} alt={title} className="size-full object-cover" />
        <span className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-[13px] font-extrabold tracking-wide ${meta.labelColor === "#FFD700" ? "text-black" : "text-white"}`} style={{ background: meta.labelColor }}>
          {meta.label}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h4 className="mb-1.5 text-[18px] text-black leading-tight ko-scale-ipad-lg" style={{ fontFamily: "'SUIT-Heavy', sans-serif", textWrap: "balance" }}>{title}</h4>
        {details && (
          <>
            <p className="mb-2 text-[14px] text-[#666] leading-[1.4]">{tt(`${tourKey}.description`)}</p>
            <div className="mb-2 flex gap-3 text-[14px] text-[#999]">
              <span>{tt("stopsCount", { count: details.stops })}</span>
              <span>{tt("routeDuration", { hours: details.durationHours })}</span>
            </div>
            <ul className="mb-2.5 space-y-1.5">
              {highlightKeys.map((i) => (
                <li key={i} className="flex items-center gap-1.5 text-[14px] text-text-dark">
                  <span className="text-brand-red">{"\u2713"}</span> {tt(`${tourKey}.highlights.${i}`)}
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="mt-auto border-t border-[#eee] pt-2">
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="text-[12px] text-[#666]">{tc("adult")}</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[11px] text-[#999] italic">{tc("from")}</span>
              <span className="text-[10px] text-[#999] line-through ko-scale-ipad-sm">{formatPrice(prices.adultOrig, locale)}</span>
              <span className="text-[14px] font-bold text-[#FF0000] ko-scale-ipad-md">{formatPrice(prices.adult, locale)}</span>
            </div>
          </div>
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-[12px] text-[#666]">{tc("child")}</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[11px] text-[#999] italic">{tc("from")}</span>
              <span className="text-[10px] text-[#999] line-through ko-scale-ipad-sm">{formatPrice(prices.childOrig, locale)}</span>
              <span className="text-[14px] font-bold text-[#FF0000] ko-scale-ipad-md">{formatPrice(prices.child, locale)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex-1 border border-brand-red bg-white py-2 text-[12px] font-semibold text-brand-red transition-colors hover:bg-brand-red/5 ko-scale-ipad-xs"
              onClick={(e) => { e.stopPropagation(); }}
            >
              {tc("viewMore")}
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 bg-[#FF0000] py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#E00000] ko-scale-ipad-xs"
              onClick={(e) => { e.stopPropagation(); onSelect(); }}
            >
              {tc("book")} <span className="text-[14px]">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

function ExclusivePackageCard({
  pkg, onSelect,
}: { pkg: (typeof EXCLUSIVE_PACKAGES)[number]; onSelect: () => void }) {
  const tc = useTranslations("Common");
  const tt = useTranslations("Tours");
  const th = useTranslations("Homepage");
  const locale = useLocale();

  const name = tt(pkg.nameKey);
  const tagline = tt(pkg.taglineKey);
  const baseRoute = tt(pkg.baseRouteKey, { tour: pkg.baseRouteParam });
  const highlightKeys = ["0", "1", "2", "3"];

  // Use locale-aware pricing from the central pricing table
  const localePrices = getTourPrices(locale)[pkg.tourId];
  const prices = localePrices ?? pkg.pricing;

  return (
    <div
      className="flex h-full flex-col overflow-hidden border-2 border-white bg-white shadow-sm transition-shadow cursor-pointer hover:shadow-md"
      onClick={onSelect}
    >
      <div className="relative h-[200px] overflow-hidden">
        <img src={pkg.image} alt={name} className="size-full object-cover" />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-brand-red px-2.5 py-0.5 text-[13px] font-extrabold text-white">{th(pkg.badgeKey)}</span>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <div className="mb-0.5 text-[18px] text-text-dark leading-tight ko-scale-ipad-lg" style={{ fontFamily: "'SUIT-Heavy', sans-serif", textWrap: "balance" }}>{name}</div>
        <div className="mb-2 text-[14px] italic text-[#666]">{tagline}</div>
        <div className="mb-2 text-[13px] text-[#999]">{baseRoute}</div>
        <ul className="mb-2.5 space-y-1.5">
          {highlightKeys.map((i) => (
            <li key={i} className="flex items-center gap-1.5 text-[14px] text-text-dark">
              <span className="text-brand-red">{"\u2605"}</span> {tt(`${pkg.highlightsKey}.${i}`)}
            </li>
          ))}
        </ul>
        <div className="mt-auto border-t border-[#eee] pt-2">
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="text-[12px] text-[#666]">{tc("adult")}</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[11px] text-[#999] italic">{tc("from")}</span>
              <span className="text-[10px] text-[#999] line-through ko-scale-ipad-sm">{formatPrice(prices.adultOrig, locale)}</span>
              <span className="text-[14px] font-bold text-[#FF0000] ko-scale-ipad-md">{formatPrice(prices.adult, locale)}</span>
            </div>
          </div>
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-[12px] text-[#666]">{tc("child")}</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[11px] text-[#999] italic">{tc("from")}</span>
              <span className="text-[10px] text-[#999] line-through ko-scale-ipad-sm">{formatPrice(prices.childOrig, locale)}</span>
              <span className="text-[14px] font-bold text-[#FF0000] ko-scale-ipad-md">{formatPrice(prices.child, locale)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex-1 border border-brand-red bg-white py-2 text-[12px] font-semibold text-brand-red transition-colors hover:bg-brand-red/5 ko-scale-ipad-xs"
              onClick={(e) => { e.stopPropagation(); }}
            >
              {tc("viewMore")}
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 bg-[#FF0000] py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#E00000] ko-scale-ipad-xs"
              onClick={(e) => { e.stopPropagation(); onSelect(); }}
            >
              {tc("book")} <span className="text-[14px]">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ titleKey }: { titleKey: string }) {
  const t = useTranslations("Homepage");
  const isKo = useLocale() === "ko";
  return (
    <div className="mb-4">
      <div className="h-px bg-white/30" />
      <h3
        className={`py-2.5 text-center ${isKo ? "text-[26px] ko-scale-ipad-xl" : "text-[18px]"} uppercase tracking-[0.2em] text-white`}
        style={{ fontFamily: isKo ? "'SUIT-SemiBold', sans-serif" : "'SUIT-Heavy', sans-serif" }}
      >
        {t(titleKey)}
      </h3>
      <div className="h-px bg-white/30" />
    </div>
  );
}

// ─── Design C layout ─────────────────────────────────────────────────────────

function DesignCTours({ selectedTourId, onSelect, variant }: {
  selectedTourId: string;
  onSelect: (tourId: string) => void;
  variant: "A" | "B";
}) {
  const locale = useLocale();
  const isKo = locale === "ko";
  const classicSlides = chunk(CLASSIC_TOUR_IDS, 2);
  const classicDesktopCarousel = useCarousel(classicSlides.length);
  const exclusiveDesktopCarousel = useCarousel(EXCLUSIVE_PACKAGES.length);
  const classicMobileCarousel = useCarousel(CLASSIC_TOUR_IDS.length);
  const exclusiveMobileCarousel = useCarousel(EXCLUSIVE_PACKAGES.length);
  const classicScrollRef = useRef<HTMLDivElement>(null);
  const [classicScrolled, setClassicScrolled] = useState(false);
  const onClassicScroll = () => {
    const el = classicScrollRef.current;
    if (el) setClassicScrolled(el.scrollLeft > 0);
  };
  const scrollClassic = (dir: "prev" | "next") => {
    const el = classicScrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(":scope > div");
    if (!card) return;
    const amount = card.offsetWidth + 12;
    el.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  // Shared sub-components for desktop columns
  const exclusiveColumn = (
    <div>
      <SectionHeader titleKey="exclusive" />
      <div className="relative">
        <ExclusivePackageCard
          pkg={EXCLUSIVE_PACKAGES[exclusiveDesktopCarousel.index]}
          onSelect={() => onSelect(EXCLUSIVE_PACKAGES[exclusiveDesktopCarousel.index].tourId)}
        />
        {exclusiveDesktopCarousel.index > 0 && (
          <button
            type="button"
            className="absolute -left-5 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-lg"
            onClick={exclusiveDesktopCarousel.prev}
            aria-label="Previous"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
        )}
        {exclusiveDesktopCarousel.index < EXCLUSIVE_PACKAGES.length - 1 && (
          <button
            type="button"
            className="absolute -right-5 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-lg"
            onClick={exclusiveDesktopCarousel.next}
            aria-label="Next"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        )}
        <CarouselDots total={EXCLUSIVE_PACKAGES.length} active={exclusiveDesktopCarousel.index} />
      </div>
    </div>
  );

  const classicColumn = (
    <div className="relative">
      {classicScrolled && (
        <button
          type="button"
          className="absolute left-0 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-lg"
          onClick={() => scrollClassic("prev")}
          aria-label="Previous"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
      )}
      <div className={`overflow-hidden pr-14 ${classicScrolled ? "pl-14" : ""}`}>
        <SectionHeader titleKey="classic" />
        <div ref={classicScrollRef} onScroll={onClassicScroll} className="flex items-stretch gap-3 overflow-x-auto scrollbar-hide" style={{ scrollSnapType: "x mandatory" }}>
          {CLASSIC_TOUR_IDS.map((id) => (
            <div key={id} className="w-[calc(45%-6px)] shrink-0 self-stretch" style={{ scrollSnapAlign: "start" }}>
              <ClassicTourCard tourId={id} isSelected={selectedTourId === id} onSelect={() => onSelect(id)} />
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="absolute right-0 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-lg"
        onClick={() => scrollClassic("next")}
        aria-label="Next"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
      </button>
    </div>
  );

  // Korean: Classic (2fr) left, Exclusive (1fr) right
  // English: Exclusive (1fr) left, Classic (2fr) right
  const leftColumn = isKo ? classicColumn : exclusiveColumn;
  const rightColumn = isKo ? exclusiveColumn : classicColumn;
  const gridCols = isKo ? "lg:grid-cols-[2fr_auto_1fr]" : "lg:grid-cols-[1fr_auto_2fr]";

  // Variant B: Classic tours only, full width grid
  if (variant === "B") {
    return (
      <div>
        <SectionHeader titleKey="classic" />
        {/* Desktop: all classic cards in a row */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4">
          {CLASSIC_TOUR_IDS.map((id) => (
            <ClassicTourCard key={id} tourId={id} isSelected={selectedTourId === id} onSelect={() => onSelect(id)} />
          ))}
        </div>
        {/* Mobile: single card carousel */}
        <div className="lg:hidden">
          <div className="relative px-4">
            <ClassicTourCard
              tourId={CLASSIC_TOUR_IDS[classicMobileCarousel.index]}
              isSelected={selectedTourId === CLASSIC_TOUR_IDS[classicMobileCarousel.index]}
              onSelect={() => onSelect(CLASSIC_TOUR_IDS[classicMobileCarousel.index])}
            />
            <CarouselArrows onPrev={classicMobileCarousel.prev} onNext={classicMobileCarousel.next} prevDisabled={classicMobileCarousel.index === 0} nextDisabled={classicMobileCarousel.index === CLASSIC_TOUR_IDS.length - 1} />
            <CarouselDots total={CLASSIC_TOUR_IDS.length} active={classicMobileCarousel.index} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop: asymmetric layout — order flipped for Korean */}
      <div className={`hidden lg:grid ${gridCols} lg:gap-6`}>
        {leftColumn}
        <div className="w-px self-stretch bg-white/20" />
        {rightColumn}
      </div>

      {/* Mobile: stacked carousels — Classic first for both locales */}
      <div className="space-y-6 lg:hidden">
        <div>
          <SectionHeader titleKey="classic" />
          <div className="relative px-4">
            <ClassicTourCard
              tourId={CLASSIC_TOUR_IDS[classicMobileCarousel.index]}
              isSelected={selectedTourId === CLASSIC_TOUR_IDS[classicMobileCarousel.index]}
              onSelect={() => onSelect(CLASSIC_TOUR_IDS[classicMobileCarousel.index])}
            />
            <CarouselArrows onPrev={classicMobileCarousel.prev} onNext={classicMobileCarousel.next} prevDisabled={classicMobileCarousel.index === 0} nextDisabled={classicMobileCarousel.index === CLASSIC_TOUR_IDS.length - 1} />
            <CarouselDots total={CLASSIC_TOUR_IDS.length} active={classicMobileCarousel.index} />
          </div>
        </div>
        <div>
          <SectionHeader titleKey="exclusive" />
          <div className="relative px-4">
            <ExclusivePackageCard
              pkg={EXCLUSIVE_PACKAGES[exclusiveMobileCarousel.index]}
              onSelect={() => onSelect(EXCLUSIVE_PACKAGES[exclusiveMobileCarousel.index].tourId)}
            />
            <CarouselArrows onPrev={exclusiveMobileCarousel.prev} onNext={exclusiveMobileCarousel.next} prevDisabled={exclusiveMobileCarousel.index === 0} nextDisabled={exclusiveMobileCarousel.index === EXCLUSIVE_PACKAGES.length - 1} />
            <CarouselDots total={EXCLUSIVE_PACKAGES.length} active={exclusiveMobileCarousel.index} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function HomepageCoursesSectionB() {
  const { selectedTourId, setSelectedTourId, openTourSelection, openAddonModal } = usePromoCheckout();
  const [addonVariant, setAddonVariant] = useState<"A" | "B">("A");
  const [coursesVariant, setCoursesVariant] = useState<"A" | "B">("A");
  const [ticketIndex, setTicketIndex] = useState(0);
  const addonEntries = Object.entries(promoProductData);
  const t = useTranslations("Homepage");
  const locale = useLocale();
  const isKo = locale === "ko";

  const handleTourSelect = (tourId: string) => {
    setSelectedTourId(tourId);
    openTourSelection({ preferredTour: tourId });
  };

  return (
    <div style={{ fontFamily: "'SUIT-Bold', sans-serif" }}>
      <section className="courses">
        <div className="courses-inner" style={{ backgroundColor: "#001e53" }}>
          {/* Korean-only courses layout toggle — pinned top-right of the section */}
          {isKo && (
            <div className="mx-auto flex max-w-[1100px] justify-end px-6 pt-3 max-md:px-4 max-md:pt-2">
              <div className="flex overflow-hidden rounded-lg border border-white/20 shadow-sm">
                {([["A", t("withExclusive")], ["B", t("classicOnly")]] as const).map(([v, label]) => (
                  <button
                    key={v}
                    type="button"
                    className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                      coursesVariant === v
                        ? "bg-brand-red text-white"
                        : "bg-white/10 text-white/50 hover:bg-white/20 hover:text-white"
                    }`}
                    onClick={() => setCoursesVariant(v)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mx-auto max-w-[1100px] px-6 pt-4 pb-12 max-md:px-4 max-md:pt-0 max-md:pb-8">

            <DesignCTours selectedTourId={selectedTourId} onSelect={handleTourSelect} variant={isKo ? coursesVariant : "A"} />

          </div>
        </div>
      </section>

      {/* Enhance your experience — separate section */}
      <div className="bg-brand-cream py-10 max-md:py-6 relative">
        {/* Toggle pill */}
        <div className="absolute top-4 right-4 z-50 flex overflow-hidden rounded-lg border border-black/10 shadow-sm">
          {([["A", t("marquee")], ["B", t("carousel")]] as const).map(([v, label]) => (
            <button
              key={v}
              type="button"
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                addonVariant === v
                  ? "bg-brand-red text-white"
                  : "bg-white text-black/50 hover:bg-black/5 hover:text-black"
              }`}
              onClick={() => setAddonVariant(v)}
            >
              {label}
            </button>
          ))}
        </div>

        <h3
          className={`mb-8 text-center ${locale === "ko" ? "text-[26px] ko-scale-ipad-xl" : "text-[18px]"} uppercase tracking-[0.2em] text-black`}
          style={{ fontFamily: locale === "ko" ? "'SUIT-SemiBold', sans-serif" : "'SUIT-Heavy', sans-serif" }}
        >
          {t("enhanceExperience")}
        </h3>

        {/* A: Marquee — infinite looping ticket cards */}
        {addonVariant === "A" && (
          <div className="overflow-hidden">
            <div className="flex animate-[marquee-half_80s_linear_infinite] hover:[animation-play-state:paused] w-max gap-8">
              {[...addonEntries, ...addonEntries].map(([id, product], i) => (
                <div key={`${id}-${i}`} className="flex-none w-[700px] max-md:w-[85vw]">
                  <TicketCard id={id} product={product} onBook={(pid: string) => openAddonModal(pid, selectedTourId)} bgColor="bg-brand-cream" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* B: Static carousel — paginated single ticket */}
        {addonVariant === "B" && (() => {
          const ticket = addonEntries[ticketIndex];
          if (!ticket) return null;
          const [id, product] = ticket;
          const hasMultiple = addonEntries.length > 1;
          return (
            <div className="mx-auto max-w-[800px] px-6 max-md:px-4">
              <TicketCard id={id} product={product} onBook={(pid: string) => openAddonModal(pid, selectedTourId)} bgColor="bg-brand-cream">
                {hasMultiple && (
                  <div className="flex items-center gap-3 pt-3 border-t border-black/5">
                    <button
                      type="button"
                      className="size-8 flex items-center justify-center rounded-full border border-black/10 text-black/30 hover:text-black hover:border-black/30 transition-colors"
                      onClick={() => setTicketIndex((i) => (i - 1 + addonEntries.length) % addonEntries.length)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <div className="flex gap-1.5">
                      {addonEntries.map((_, i) => (
                        <span
                          key={i}
                          className={`block size-2 rounded-full cursor-pointer transition-colors ${i === ticketIndex ? "bg-[#FF0000]" : "bg-black/15"}`}
                          onClick={() => setTicketIndex(i)}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      className="size-8 flex items-center justify-center rounded-full border border-black/10 text-black/30 hover:text-black hover:border-black/30 transition-colors"
                      onClick={() => setTicketIndex((i) => (i + 1) % addonEntries.length)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                    <span className="ml-auto text-[11px] text-black/30">{ticketIndex + 1} / {addonEntries.length}</span>
                  </div>
                )}
              </TicketCard>
            </div>
          );
        })()}
      </div>

      {/* Bus Features */}
      <div className="text-center mt-0 bg-[#FF0019] w-full py-10 px-0 max-md:py-[30px] max-md:px-[15px]">
        <div className="max-w-[1200px] mx-auto">
          <h3 className="text-[32px] mb-10 text-white max-md:text-2xl max-md:mb-5 max-md:text-center">{t("busFeatures")}</h3>
          <div className="flex justify-center gap-[60px] max-md:justify-between max-md:gap-2">
            {[
              { img: "/imgs/bus-feature-1.png", labelKey: "freeAudio" as const },
              { img: "/imgs/bus-feature-2.png", labelKey: "freeUsb" as const },
              { img: "/imgs/bus-feature-3.png", labelKey: "doubleDecker" as const },
              { img: "/imgs/bus-feature-4.png", labelKey: "singleDecker" as const },
              { img: "/imgs/bus-feature-5.png", labelKey: "freeWifi" as const },
            ].map((f) => (
              <div key={f.labelKey} className="flex flex-col items-center gap-4 max-md:flex-[0_1_18%] max-md:gap-1">
                <img
                  src={f.img}
                  alt={t(f.labelKey)}
                  className="w-20 h-20 p-4 bg-white rounded-full object-contain max-[1200px]:w-[50px] max-[1200px]:h-[50px] max-[1200px]:p-3 max-md:w-[50px] max-md:h-[50px] max-md:p-1.5"
                />
                <span className="text-base whitespace-nowrap text-white max-[1200px]:text-sm max-md:text-[10px] max-md:leading-[1.2]">
                  {t(f.labelKey)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
