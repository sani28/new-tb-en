/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { usePromoCheckout, TOUR_PRICES, TOUR_META } from "./checkout/PromoCheckoutContext";
import PromoEnhanceSeoulAddonsCarousel from "@/components/homepage/PromoEnhanceSeoulAddonsCarousel";

/* ── Progress indicator ──────────────────────────────────────────────────────── */
type StepStatus = "completed" | "active" | "pending";
function ProgressIndicator({ statuses }: { statuses: StepStatus[] }) {
  return (
    <div className="flex items-center justify-center gap-[10px] py-[18px] px-[18px] border-b border-[#eee] bg-white shrink-0" aria-hidden="true">
      {statuses.map((status, i) => (
        <div key={i} className="flex items-center gap-[10px]">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[14px] border-2 bg-white ${
            status === "completed" ? "border-[#2e7d32] text-[#2e7d32]"
            : status === "active"  ? "border-brand-red text-brand-red"
            :                        "border-[#ddd] text-[#666]"
          }`}>
            {i + 1}
          </div>
          {i < statuses.length - 1 && <div className="w-12 h-0.5 bg-[#e5e5e5]" />}
        </div>
      ))}
    </div>
  );
}

// ─── Exclusive packages data ──────────────────────────────────────────────────
const EXCLUSIVE_PACKAGES = [
  {
    tourId: "pkg-kculture",
    name: "K-Culture Explorer",
    tagline: "BTS filming spots + museum pass combo",
    image: "/imgs/tour01__.png",
    badge: "Exclusive",
    baseRoute: "Based on Tour 01",
    highlights: ["BTS Filming Locations", "K-Pop Museum Entry", "Han River Cruise", "Hanbok Experience"],
    pricing: { adult: 45, child: 35 },
  },
  {
    tourId: "pkg-kbeauty",
    name: "K-Beauty & Style Tour",
    tagline: "Shopping districts + beauty experience",
    image: "/imgs/panorama.png",
    badge: "Popular",
    baseRoute: "Based on Tour 02",
    highlights: ["Myeongdong Beauty Market", "Hongdae Shopping", "Skin Care Workshop", "Style Photo Shoot"],
    pricing: { adult: 40, child: 30 },
  },
];

const CLASSIC_TOUR_IDS = ["tour01", "tour02", "tour04"] as const;

// ─── Carousel helpers ─────────────────────────────────────────────────────────
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
        <span key={i} className={`block size-2 rounded-full transition-colors ${i === active ? "bg-brand-red" : "bg-[#ddd]"}`} />
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

// ─── Classic tour card ────────────────────────────────────────────────────────
function ClassicTourCard({
  tourId, isSelected, adultQty, childQty, onSelect, compact = false,
}: { tourId: string; isSelected: boolean; adultQty: number; childQty: number; onSelect: () => void; compact?: boolean }) {
  const meta = TOUR_META[tourId]!;
  const prices = TOUR_PRICES[tourId]!;
  const total = adultQty * prices.adult + childQty * prices.child;
  const showTotal = adultQty + childQty > 0;

  return (
    <div
      className={`overflow-hidden rounded-xl border-2 bg-white shadow-sm transition-all cursor-pointer hover:shadow-md ${isSelected ? "border-brand-red" : "border-[#e5e5e5] hover:border-brand-red/40"}`}
      onClick={onSelect}
    >
      <div className={`relative overflow-hidden ${compact ? "h-[120px]" : "h-[150px]"}`}>
        <img src={meta.image} alt={meta.title} className="size-full object-cover" />
        <span className="absolute left-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide text-white" style={{ background: meta.labelColor }}>
          {meta.label}
        </span>
        {meta.isPopular && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-black px-2.5 py-0.5 text-[10px] font-extrabold text-white">POPULAR</span>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-[11px] font-bold tracking-wide text-white leading-tight">
          {meta.title}
        </div>
      </div>
      <div className="p-3">
        <div className="mb-1.5 flex justify-between text-[12px]">
          <span className="text-[#666]">Adult</span>
          <span className="font-semibold text-brand-red">${prices.adult.toFixed(2)}</span>
        </div>
        <div className={`flex justify-between text-[12px] ${showTotal ? "mb-1.5" : "mb-3"}`}>
          <span className="text-[#666]">Child</span>
          <span className="font-semibold text-brand-red">${prices.child.toFixed(2)}</span>
        </div>
        {showTotal && (
          <div className="mb-2.5 flex justify-between text-[12px] font-bold border-t border-[#eee] pt-1.5">
            <span>Total</span>
            <span className="text-brand-red">${total.toFixed(2)}</span>
          </div>
        )}
        <button
          type="button"
          className={`w-full rounded-lg py-2 text-[12px] font-semibold transition-colors ${isSelected ? "bg-brand-red text-white" : "border border-brand-red bg-white text-brand-red hover:bg-brand-red hover:text-white"}`}
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
        >
          {isSelected ? "Selected ✓" : "Select"}
        </button>
      </div>
    </div>
  );
}

// ─── Exclusive package card ───────────────────────────────────────────────────
function ExclusivePackageCard({
  pkg, adultQty, childQty, onSelect,
}: { pkg: (typeof EXCLUSIVE_PACKAGES)[number]; adultQty: number; childQty: number; onSelect: () => void }) {
  const total = adultQty * pkg.pricing.adult + childQty * pkg.pricing.child;
  const showTotal = adultQty + childQty > 0;

  return (
    <div
      className="overflow-hidden rounded-xl border-2 border-brand-red bg-white shadow-sm transition-shadow cursor-pointer hover:shadow-md"
      onClick={onSelect}
    >
      <div className="relative h-[150px] overflow-hidden">
        <img src={pkg.image} alt={pkg.name} className="size-full object-cover" />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-brand-red px-2.5 py-0.5 text-[10px] font-extrabold text-white">{pkg.badge}</span>
      </div>
      <div className="p-3">
        <div className="mb-0.5 text-[13px] font-bold text-text-dark">{pkg.name}</div>
        <div className="mb-2 text-[11px] italic text-[#666]">{pkg.tagline}</div>
        <div className="mb-2 text-[10px] text-[#999]">{pkg.baseRoute}</div>
        <ul className="mb-2 space-y-0.5">
          {pkg.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex items-center gap-1 text-[11px] text-text-dark">
              <span className="text-brand-red">★</span> {h}
            </li>
          ))}
        </ul>
        <div className="border-t border-[#eee] pt-2">
          <div className="mb-1 flex justify-between text-[12px]">
            <span className="text-[#666]">Adult</span>
            <span className="font-semibold text-brand-red">${pkg.pricing.adult.toFixed(2)}</span>
          </div>
          <div className={`flex justify-between text-[12px] ${showTotal ? "mb-1.5" : "mb-2.5"}`}>
            <span className="text-[#666]">Child</span>
            <span className="font-semibold text-brand-red">${pkg.pricing.child.toFixed(2)}</span>
          </div>
          {showTotal && (
            <div className="mb-2.5 flex justify-between text-[12px] font-bold">
              <span>Total</span>
              <span className="text-brand-red">${total.toFixed(2)}</span>
            </div>
          )}
          <button
            type="button"
            className="w-full rounded-lg bg-brand-red py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#C4001C]"
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ title, description, fixedHeight = false }: { title: string; description: string; fixedHeight?: boolean }) {
  return (
    <div className={`mb-3 ${fixedHeight ? "min-h-[56px]" : ""}`}>
      <h3 className="text-[15px] font-bold text-text-dark">{title}</h3>
      <p className="mt-0.5 text-[12px] text-[#666]">{description}</p>
    </div>
  );
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// ─── Design A layout ─────────────────────────────────────────────────────────
function DesignA({ adultQty, childQty, selectedTourId, onSelect }: {
  adultQty: number; childQty: number; selectedTourId: string;
  onSelect: (tourId: string, name: string, adultPrice: number, childPrice: number) => void;
}) {
  const classicCarousel = useCarousel(CLASSIC_TOUR_IDS.length);
  const exclusiveCarousel = useCarousel(EXCLUSIVE_PACKAGES.length);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Classic tours */}
      <div>
        <SectionHeader title="Classic Seoul Tours" description="Hop-on hop-off routes covering Seoul's iconic landmarks." fixedHeight />
        <div className="hidden space-y-3 lg:block">
          {CLASSIC_TOUR_IDS.map((id) => (
            <ClassicTourCard key={id} tourId={id} isSelected={selectedTourId === id} adultQty={adultQty} childQty={childQty}
              onSelect={() => onSelect(id, TOUR_META[id]!.title, TOUR_PRICES[id]!.adult, TOUR_PRICES[id]!.child)} />
          ))}
        </div>
        <div className="relative px-4 lg:hidden">
          <ClassicTourCard tourId={CLASSIC_TOUR_IDS[classicCarousel.index]} isSelected={selectedTourId === CLASSIC_TOUR_IDS[classicCarousel.index]}
            adultQty={adultQty} childQty={childQty}
            onSelect={() => { const id = CLASSIC_TOUR_IDS[classicCarousel.index]; onSelect(id, TOUR_META[id]!.title, TOUR_PRICES[id]!.adult, TOUR_PRICES[id]!.child); }} />
          <CarouselArrows onPrev={classicCarousel.prev} onNext={classicCarousel.next} prevDisabled={classicCarousel.index === 0} nextDisabled={classicCarousel.index === CLASSIC_TOUR_IDS.length - 1} />
          <CarouselDots total={CLASSIC_TOUR_IDS.length} active={classicCarousel.index} />
        </div>
      </div>

      {/* Exclusive packages */}
      <div>
        <SectionHeader title="Exclusive Packages" description="Curated experiences combining tours with unique Seoul activities." fixedHeight />
        <div className="hidden space-y-3 lg:block">
          {EXCLUSIVE_PACKAGES.map((pkg) => (
            <ExclusivePackageCard key={pkg.tourId} pkg={pkg} adultQty={adultQty} childQty={childQty}
              onSelect={() => onSelect(pkg.tourId, pkg.name, pkg.pricing.adult, pkg.pricing.child)} />
          ))}
        </div>
        <div className="relative px-4 lg:hidden">
          <ExclusivePackageCard pkg={EXCLUSIVE_PACKAGES[exclusiveCarousel.index]} adultQty={adultQty} childQty={childQty}
            onSelect={() => { const pkg = EXCLUSIVE_PACKAGES[exclusiveCarousel.index]; onSelect(pkg.tourId, pkg.name, pkg.pricing.adult, pkg.pricing.child); }} />
          <CarouselArrows onPrev={exclusiveCarousel.prev} onNext={exclusiveCarousel.next} prevDisabled={exclusiveCarousel.index === 0} nextDisabled={exclusiveCarousel.index === EXCLUSIVE_PACKAGES.length - 1} />
          <CarouselDots total={EXCLUSIVE_PACKAGES.length} active={exclusiveCarousel.index} />
        </div>
      </div>
    </div>
  );
}

// ─── Design C layout ─────────────────────────────────────────────────────────
function DesignC({ adultQty, childQty, selectedTourId, onSelect }: {
  adultQty: number; childQty: number; selectedTourId: string;
  onSelect: (tourId: string, name: string, adultPrice: number, childPrice: number) => void;
}) {
  const classicSlides = chunk([...CLASSIC_TOUR_IDS], 2);
  const classicDesktopCarousel = useCarousel(classicSlides.length);
  const exclusiveDesktopCarousel = useCarousel(EXCLUSIVE_PACKAGES.length);
  const classicMobileCarousel = useCarousel(CLASSIC_TOUR_IDS.length);
  const exclusiveMobileCarousel = useCarousel(EXCLUSIVE_PACKAGES.length);

  return (
    <div>
      {/* Desktop: asymmetric 1:2 */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_2fr] lg:gap-6">
        <div>
          <SectionHeader title="Exclusive Packages" description="Unique curated Seoul experiences." />
          <div className="relative px-4">
            <ExclusivePackageCard pkg={EXCLUSIVE_PACKAGES[exclusiveDesktopCarousel.index]} adultQty={adultQty} childQty={childQty}
              onSelect={() => { const pkg = EXCLUSIVE_PACKAGES[exclusiveDesktopCarousel.index]; onSelect(pkg.tourId, pkg.name, pkg.pricing.adult, pkg.pricing.child); }} />
            <CarouselArrows onPrev={exclusiveDesktopCarousel.prev} onNext={exclusiveDesktopCarousel.next} prevDisabled={exclusiveDesktopCarousel.index === 0} nextDisabled={exclusiveDesktopCarousel.index === EXCLUSIVE_PACKAGES.length - 1} />
            <CarouselDots total={EXCLUSIVE_PACKAGES.length} active={exclusiveDesktopCarousel.index} />
          </div>
        </div>
        <div>
          <SectionHeader title="Classic Seoul Tours" description="Hop-on hop-off routes covering Seoul's iconic landmarks." />
          <div className="relative px-4">
            <div className="grid grid-cols-2 gap-3">
              {classicSlides[classicDesktopCarousel.index].map((id) => (
                <ClassicTourCard key={id} tourId={id} isSelected={selectedTourId === id} adultQty={adultQty} childQty={childQty} compact
                  onSelect={() => onSelect(id, TOUR_META[id]!.title, TOUR_PRICES[id]!.adult, TOUR_PRICES[id]!.child)} />
              ))}
            </div>
            {classicSlides.length > 1 && (
              <CarouselArrows onPrev={classicDesktopCarousel.prev} onNext={classicDesktopCarousel.next} prevDisabled={classicDesktopCarousel.index === 0} nextDisabled={classicDesktopCarousel.index === classicSlides.length - 1} />
            )}
            <CarouselDots total={classicSlides.length} active={classicDesktopCarousel.index} />
          </div>
        </div>
      </div>

      {/* Mobile: stacked carousels */}
      <div className="space-y-6 lg:hidden">
        <div>
          <SectionHeader title="Classic Seoul Tours" description="Hop-on hop-off routes covering Seoul's iconic landmarks." />
          <div className="relative px-4">
            <ClassicTourCard tourId={CLASSIC_TOUR_IDS[classicMobileCarousel.index]} isSelected={selectedTourId === CLASSIC_TOUR_IDS[classicMobileCarousel.index]}
              adultQty={adultQty} childQty={childQty}
              onSelect={() => { const id = CLASSIC_TOUR_IDS[classicMobileCarousel.index]; onSelect(id, TOUR_META[id]!.title, TOUR_PRICES[id]!.adult, TOUR_PRICES[id]!.child); }} />
            <CarouselArrows onPrev={classicMobileCarousel.prev} onNext={classicMobileCarousel.next} prevDisabled={classicMobileCarousel.index === 0} nextDisabled={classicMobileCarousel.index === CLASSIC_TOUR_IDS.length - 1} />
            <CarouselDots total={CLASSIC_TOUR_IDS.length} active={classicMobileCarousel.index} />
          </div>
        </div>
        <div>
          <SectionHeader title="Exclusive Packages" description="Unique curated Seoul experiences." />
          <div className="relative px-4">
            <ExclusivePackageCard pkg={EXCLUSIVE_PACKAGES[exclusiveMobileCarousel.index]} adultQty={adultQty} childQty={childQty}
              onSelect={() => { const pkg = EXCLUSIVE_PACKAGES[exclusiveMobileCarousel.index]; onSelect(pkg.tourId, pkg.name, pkg.pricing.adult, pkg.pricing.child); }} />
            <CarouselArrows onPrev={exclusiveMobileCarousel.prev} onNext={exclusiveMobileCarousel.next} prevDisabled={exclusiveMobileCarousel.index === 0} nextDisabled={exclusiveMobileCarousel.index === EXCLUSIVE_PACKAGES.length - 1} />
            <CarouselDots total={EXCLUSIVE_PACKAGES.length} active={exclusiveMobileCarousel.index} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────────────── */
export default function PromoTourSelectionModal() {
  const {
    step, selectedTourId, selectedDate, adultQty, childQty,
    setSelectedTourId, proceedFromTourSelection, closeCheckout,
  } = usePromoCheckout();

  const [variant, setVariant] = useState<"A" | "C">("C");

  if (step !== "tourSelection") return null;

  const canContinue = !!selectedDate && adultQty + childQty >= 1;

  const dateLabel = selectedDate
    ? selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
    : "No date selected";

  const handleSelect = (tourId: string) => {
    setSelectedTourId(tourId);
  };

  return (
    <div className="promo-modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) closeCheckout(); }}>
      <div
        className={`promo-tour-modal bg-white w-[95%] max-h-[90vh] rounded-xl overflow-hidden flex flex-col relative shadow-[0_20px_60px_rgba(0,0,0,0.35)] ${variant === "A" ? "max-w-[780px]" : "max-w-[900px]"}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="promoTourModalTitle"
      >
        <button
          className="absolute top-[10px] right-[10px] w-[42px] h-[42px] rounded-full border-none bg-black/[0.06] text-[#333] text-[28px] leading-none cursor-pointer z-[2] flex items-center justify-center hover:bg-black/[0.10]"
          type="button" aria-label="Close" onClick={closeCheckout}
        >
          &times;
        </button>

        <div className="flex flex-col h-full min-h-0">
          <ProgressIndicator statuses={["active", "pending", "pending"]} />

          {/* Sub-header: title + variant toggle */}
          <div className="flex items-center justify-between border-b border-[#eee] px-6 py-4 shrink-0">
            <div>
              <h2 id="promoTourModalTitle" className="m-0 text-[18px] font-bold text-[#111]">Select Your Tour</h2>
            </div>
            <div className="flex overflow-hidden rounded-lg border border-[#ddd]">
              {(["A", "C"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`px-3 py-1.5 text-xs font-semibold transition-colors ${variant === v ? "bg-brand-red text-white" : "bg-white text-[#666] hover:bg-[#f5f5f5]"}`}
                  onClick={() => setVariant(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="popup-scrollable-content">
            {/* Read-only summary bar */}
            <div className="mb-5 rounded-xl bg-[#f8f9fa] px-5 py-3">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-[#666]">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className={`font-semibold ${selectedDate ? "text-text-dark" : "text-[#999]"}`}>{dateLabel}</span>
                {adultQty > 0 && <span className="rounded-full border border-[#e5e5e5] bg-white px-2.5 py-0.5 text-[11px] text-[#666]">{adultQty} Adult{adultQty > 1 ? "s" : ""}</span>}
                {childQty > 0 && <span className="rounded-full border border-[#e5e5e5] bg-white px-2.5 py-0.5 text-[11px] text-[#666]">{childQty} Child{childQty > 1 ? "ren" : ""}</span>}
              </div>
            </div>

            {/* Tour cards — Design A or C */}
            {variant === "A" ? (
              <DesignA adultQty={adultQty} childQty={childQty} selectedTourId={selectedTourId} onSelect={handleSelect} />
            ) : (
              <DesignC adultQty={adultQty} childQty={childQty} selectedTourId={selectedTourId} onSelect={handleSelect} />
            )}

            {/* Add-on carousel */}
            <div className="mt-8 lg:max-w-[580px] lg:mx-auto">
              <h3 className="mb-3 text-[15px] font-semibold text-[#333]">Enhance Your Visit</h3>
              <PromoEnhanceSeoulAddonsCarousel />
            </div>
          </div>

          {/* Sticky footer — fallback Continue button */}
          <div className="sticky bottom-0 bg-white border-t border-[#eee] py-[14px] px-[18px] shrink-0">
            <button
              className="w-full border-none rounded-xl px-4 py-[14px] text-[15px] font-extrabold cursor-pointer bg-brand-red text-white disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
              disabled={!canContinue}
              onClick={proceedFromTourSelection}
            >
              Continue with {TOUR_META[selectedTourId]?.title ?? "selected tour"} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
