/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePromoCheckout, TOUR_PRICES, TOUR_META, getTourPrices, getTourMeta, formatPrice } from "./checkout/PromoCheckoutContext";

const useIsKo = () => useLocale() === "ko";
import { promoProductData } from "@/lib/data/promoProducts";
import TicketCard from "@/components/shared/TicketCard";
import BookingCalendar from "@/app/[locale]/booking/components/BookingCalendar";

/* ── Progress indicator ──────────────────────────────────────────────────────── */
type StepStatus = "completed" | "active" | "pending";
function ProgressIndicator({ statuses }: { statuses: StepStatus[] }) {
  const t = useTranslations("PromoModal");
  const labels = [t("progressSelect"), t("progressInfo"), t("progressPayment")];
  return (
    <div className="flex items-center justify-center gap-[10px] py-[18px] px-[18px] bg-[#001e53] shrink-0" aria-hidden="true">
      {statuses.map((status, i) => (
        <div key={i} className="flex items-center gap-[10px]">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[13px] border-2 ${
              status === "completed" ? "border-white bg-white text-[#001e53]"
              : status === "active"  ? "border-[#FF0000] bg-[#FF0000] text-white"
              :                        "border-white/30 text-white/40"
            }`}>
              {status === "completed" ? "\u2713" : i + 1}
            </div>
            <span className={`text-[11px] uppercase tracking-wider hidden sm:inline ${
              status === "active" ? "text-white font-bold" : "text-white/40"
            }`}>{labels[i]}</span>
          </div>
          {i < statuses.length - 1 && <div className="w-8 h-px bg-white/20" />}
        </div>
      ))}
    </div>
  );
}

/* ── Tour data ────────────────────────────────────────────────────────────────── */

const CLASSIC_TOUR_IDS = ["tour01", "tour02", "tour04"] as const;
const EXCLUSIVE_PACKAGE_IDS = ["pkg-kculture", "pkg-kbeauty"] as const;

const TOUR_HIGHLIGHT_KEYS: Record<string, string> = {
  tour01: "tour01Highlights",
  tour02: "tour02Highlights",
  tour04: "tour04Highlights",
  "pkg-kculture": "pkgKcultureHighlights",
  "pkg-kbeauty": "pkgKbeautyHighlights",
};

/* ── Carousel hook ────────────────────────────────────────────────────────────── */

function useCarousel(total: number) {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(total - 1, i + 1));
  return { index, prev, next };
}

/* ── Selection card ───────────────────────────────────────────────────────────── */

function TourSelectionCard({
  id,
  isActive,
  onSelect,
}: {
  id: string;
  isActive: boolean;
  onSelect: () => void;
}) {
  const locale = useLocale();
  const isKo = locale === "ko";
  const meta = getTourMeta(id, locale);
  const prices = getTourPrices(locale)[id];
  const tc = useTranslations("Common");
  if (!meta || !prices) return null;

  return (
    <button
      type="button"
      className={`w-full flex flex-col text-left transition-all overflow-hidden ${
        isActive
          ? "ring-2 ring-[#FF0000] bg-white shadow-md"
          : "border border-white/15 hover:border-white/30"
      }`}
      style={{ borderRadius: "4px" }}
      onClick={onSelect}
    >
      <div className={`relative w-full ${isKo ? "h-[140px] max-md:h-[120px]" : "h-[120px] max-md:h-[100px]"} overflow-hidden`}>
        <img src={meta.image} alt={meta.title} className="size-full object-cover" />
        <span
          className={`absolute left-2 top-2 px-2 py-0.5 ${isKo ? "text-[11px]" : "text-[10px]"} font-extrabold tracking-wide ${
            meta.labelColor === "#FFD700" ? "text-black" : "text-white"
          }`}
          style={{ background: meta.labelColor, borderRadius: "2px" }}
        >
          {meta.label}
        </span>
        {isActive && (
          <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-[#FF0000] text-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        )}
      </div>

      <div className={`${isKo ? "p-4" : "p-3"} flex-1 flex flex-col`}>
        <div className={`${isKo ? "text-[14px]" : "text-[12px]"} font-bold leading-tight ${isActive ? "text-black" : "text-white"}`}>
          {meta.title}
        </div>

        <div className="mt-auto flex items-baseline gap-2 pt-2 border-t border-white/10">
          <div className="flex items-baseline gap-1">
            <span className={`${isKo ? "text-[10px]" : "text-[9px]"} ${isActive ? "text-black/30" : "text-white/30"}`}>{tc("adult")}</span>
            <span className={`${isKo ? "text-[11px]" : "text-[10px]"} line-through ${isActive ? "text-black/25" : "text-white/25"}`}>{formatPrice(prices.adultOrig, locale)}</span>
            <span className={`${isKo ? "text-[15px]" : "text-[13px]"} font-bold ${isActive ? "text-[#FF0000]" : "text-white"}`}>{formatPrice(prices.adult, locale)}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`${isKo ? "text-[10px]" : "text-[9px]"} ${isActive ? "text-black/30" : "text-white/30"}`}>{tc("child")}</span>
            <span className={`${isKo ? "text-[13px]" : "text-[11px]"} font-bold ${isActive ? "text-[#FF0000]" : "text-white"}`}>{formatPrice(prices.child, locale)}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

/* ── Carousel nav dots ────────────────────────────────────────────────────────── */

function CarouselDots({ total, active }: { total: number; active: number }) {
  if (total <= 1) return null;
  return (
    <div className="flex justify-center gap-1.5 mt-2">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`block size-1.5 rounded-full transition-colors ${i === active ? "bg-[#FF0000]" : "bg-white/25"}`} />
      ))}
    </div>
  );
}

function CarouselArrows({ onPrev, onNext, prevDisabled, nextDisabled }: { onPrev: () => void; onNext: () => void; prevDisabled: boolean; nextDisabled: boolean }) {
  return (
    <>
      <button type="button" className="absolute -left-2 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-md disabled:opacity-30"
        onClick={(e) => { e.stopPropagation(); onPrev(); }} disabled={prevDisabled} aria-label="Previous">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <button type="button" className="absolute -right-2 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-md disabled:opacity-30"
        onClick={(e) => { e.stopPropagation(); onNext(); }} disabled={nextDisabled} aria-label="Next">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
      </button>
    </>
  );
}

/* ── Main component ──────────────────────────────────────────────────────────── */
export default function PromoTourSelectionModal() {
  const {
    step, selectedTourId, selectedDate, adultQty, childQty,
    setSelectedTourId, setSelectedDate, setAdultQty, setChildQty,
    proceedFromTourSelection, closeCheckout, openAddonModal,
  } = usePromoCheckout();

  const t = useTranslations("PromoModal");
  const tc = useTranslations("Common");
  const ts1 = useTranslations("BookingStep1");
  const isKo = useIsKo();

  const [addonIndex, setAddonIndex] = useState(0);
  const [mapOpen, setMapOpen] = useState(false);
  const classicCarousel = useCarousel(CLASSIC_TOUR_IDS.length);
  const exclusiveCarousel = useCarousel(EXCLUSIVE_PACKAGE_IDS.length);
  const addonEntries = Object.entries(promoProductData);

  if (step !== "tourSelection") return null;

  const locale = useLocale();
  const canContinue = !!selectedDate && adultQty + childQty >= 1;
  const selectedPrices = getTourPrices(locale)[selectedTourId];
  const selectedMeta = getTourMeta(selectedTourId, locale);
  const highlightKey = TOUR_HIGHLIGHT_KEYS[selectedTourId];

  return (
    <div className="promo-modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) closeCheckout(); }}>
      <div
        className="promo-tour-modal bg-white w-[95%] max-w-[780px] max-h-[90vh] overflow-hidden flex flex-col relative shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        style={{ borderRadius: "4px", fontFamily: "'SUIT-Bold', sans-serif" }}
        role="dialog" aria-modal="true" aria-labelledby="promoTourModalTitle"
      >
        <button className="absolute top-[10px] right-[10px] w-[42px] h-[42px] border-none bg-white/10 text-white text-[28px] leading-none cursor-pointer z-[2] flex items-center justify-center hover:bg-white/20"
          type="button" aria-label="Close" onClick={closeCheckout}>&times;</button>

        <div className="flex flex-col h-full min-h-0">
          <ProgressIndicator statuses={["active", "pending", "pending"]} />

          <div className="popup-scrollable-content">
            {/* ── 2-column tour selection ── */}
            <div className="bg-[#001e53] px-6 py-6 max-md:px-4">
              <h2 id="promoTourModalTitle" className={`${isKo ? "text-[28px]" : "text-[20px]"} text-white mb-5`} style={{ fontFamily: isKo ? "'SUIT-SemiBold', sans-serif" : "'SUIT-Heavy', sans-serif" }}>
                {t("chooseYourTour")}
              </h2>

              {/* Desktop: 2-column grid */}
              <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:gap-4">
                <div>
                  <h3 className={`${isKo ? "text-[19px]" : "text-[11px]"} uppercase tracking-[0.15em] text-white/50 mb-3`} style={{ fontFamily: isKo ? "'SUIT-SemiBold', sans-serif" : "'SUIT-Heavy', sans-serif" }}>
                    {t("exclusivePackages")}
                  </h3>
                  <div className="relative px-3">
                    <TourSelectionCard id={EXCLUSIVE_PACKAGE_IDS[exclusiveCarousel.index]} isActive={selectedTourId === EXCLUSIVE_PACKAGE_IDS[exclusiveCarousel.index]} onSelect={() => setSelectedTourId(EXCLUSIVE_PACKAGE_IDS[exclusiveCarousel.index])} />
                    {EXCLUSIVE_PACKAGE_IDS.length > 1 && <CarouselArrows onPrev={exclusiveCarousel.prev} onNext={exclusiveCarousel.next} prevDisabled={exclusiveCarousel.index === 0} nextDisabled={exclusiveCarousel.index === EXCLUSIVE_PACKAGE_IDS.length - 1} />}
                    <CarouselDots total={EXCLUSIVE_PACKAGE_IDS.length} active={exclusiveCarousel.index} />
                  </div>
                </div>
                <div className="w-px self-stretch bg-white/15" />
                <div>
                  <h3 className={`${isKo ? "text-[19px]" : "text-[11px]"} uppercase tracking-[0.15em] text-white/50 mb-3`} style={{ fontFamily: isKo ? "'SUIT-SemiBold', sans-serif" : "'SUIT-Heavy', sans-serif" }}>
                    {t("classicTours")}
                  </h3>
                  <div className="relative px-3">
                    <TourSelectionCard id={CLASSIC_TOUR_IDS[classicCarousel.index]} isActive={selectedTourId === CLASSIC_TOUR_IDS[classicCarousel.index]} onSelect={() => setSelectedTourId(CLASSIC_TOUR_IDS[classicCarousel.index])} />
                    <CarouselArrows onPrev={classicCarousel.prev} onNext={classicCarousel.next} prevDisabled={classicCarousel.index === 0} nextDisabled={classicCarousel.index === CLASSIC_TOUR_IDS.length - 1} />
                    <CarouselDots total={CLASSIC_TOUR_IDS.length} active={classicCarousel.index} />
                  </div>
                </div>
              </div>

              {/* Mobile: stacked carousels */}
              <div className="space-y-5 md:hidden">
                <div>
                  <h3 className={`${isKo ? "text-[19px]" : "text-[11px]"} uppercase tracking-[0.15em] text-white/50 mb-3`} style={{ fontFamily: isKo ? "'SUIT-SemiBold', sans-serif" : "'SUIT-Heavy', sans-serif" }}>{t("exclusivePackages")}</h3>
                  <div className="relative px-4">
                    <TourSelectionCard id={EXCLUSIVE_PACKAGE_IDS[exclusiveCarousel.index]} isActive={selectedTourId === EXCLUSIVE_PACKAGE_IDS[exclusiveCarousel.index]} onSelect={() => setSelectedTourId(EXCLUSIVE_PACKAGE_IDS[exclusiveCarousel.index])} />
                    {EXCLUSIVE_PACKAGE_IDS.length > 1 && <CarouselArrows onPrev={exclusiveCarousel.prev} onNext={exclusiveCarousel.next} prevDisabled={exclusiveCarousel.index === 0} nextDisabled={exclusiveCarousel.index === EXCLUSIVE_PACKAGE_IDS.length - 1} />}
                    <CarouselDots total={EXCLUSIVE_PACKAGE_IDS.length} active={exclusiveCarousel.index} />
                  </div>
                </div>
                <div>
                  <h3 className={`${isKo ? "text-[19px]" : "text-[11px]"} uppercase tracking-[0.15em] text-white/50 mb-3`} style={{ fontFamily: isKo ? "'SUIT-SemiBold', sans-serif" : "'SUIT-Heavy', sans-serif" }}>{t("classicTours")}</h3>
                  <div className="relative px-4">
                    <TourSelectionCard id={CLASSIC_TOUR_IDS[classicCarousel.index]} isActive={selectedTourId === CLASSIC_TOUR_IDS[classicCarousel.index]} onSelect={() => setSelectedTourId(CLASSIC_TOUR_IDS[classicCarousel.index])} />
                    <CarouselArrows onPrev={classicCarousel.prev} onNext={classicCarousel.next} prevDisabled={classicCarousel.index === 0} nextDisabled={classicCarousel.index === CLASSIC_TOUR_IDS.length - 1} />
                    <CarouselDots total={CLASSIC_TOUR_IDS.length} active={classicCarousel.index} />
                  </div>
                </div>
              </div>

              {/* Selected tour info */}
              {highlightKey && (
                <div className="border-t border-white/10 pt-4 mt-5 flex flex-col items-center text-center">
                  <ul className="space-y-1.5 mb-4 inline-block text-left">
                    {[0, 1, 2, 3].map((i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] text-white/60 leading-[1.5]">
                        <span className="text-[#FF0000] mt-0.5 shrink-0">&bull;</span>
                        {t(`${highlightKey}.${i}`)}
                      </li>
                    ))}
                  </ul>
                  <button type="button" className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white text-[12px] hover:bg-white/10 transition-colors" style={{ borderRadius: "3px" }} onClick={() => setMapOpen(true)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    {t("viewRouteMap")}
                  </button>
                </div>
              )}
            </div>

            {/* ── Date selection ── */}
            <div className="px-6 py-6 max-md:px-4 border-b border-[#eee]">
              <h3 className={`${isKo ? "text-[22px]" : "text-[14px]"} uppercase tracking-[0.15em] text-black mb-4`} style={{ fontFamily: isKo ? "'SUIT-SemiBold', sans-serif" : "'SUIT-Heavy', sans-serif" }}>
                {t("selectDate")}
              </h3>
              <BookingCalendar selectedDate={selectedDate} onDateSelect={(d) => setSelectedDate(d)} />
            </div>

            {/* ── Ticket counters ── */}
            <div className="px-6 py-6 max-md:px-4 border-b border-[#eee]">
              <h3 className={`${isKo ? "text-[22px]" : "text-[14px]"} uppercase tracking-[0.15em] text-black mb-4`} style={{ fontFamily: isKo ? "'SUIT-SemiBold', sans-serif" : "'SUIT-Heavy', sans-serif" }}>
                {t("numberOfTickets")}
              </h3>
              <div className={`${isKo ? "space-y-4" : "space-y-3"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`${isKo ? "text-[15px]" : "text-[13px]"} font-bold text-black`}>{tc("adult")}</div>
                    <div className={`${isKo ? "text-[12px]" : "text-[11px]"} text-black/40`}>{ts1("agesAdult")}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedPrices && (
                      <div className="flex items-baseline gap-1 mr-2">
                        <span className={`${isKo ? "text-[11px]" : "text-[10px]"} text-black/30 line-through`}>{formatPrice(selectedPrices.adultOrig, locale)}</span>
                        <span className={`${isKo ? "text-[16px]" : "text-[14px]"} font-bold text-[#FF0000]`}>{formatPrice(selectedPrices.adult, locale)}</span>
                      </div>
                    )}
                    <button type="button" className={`${isKo ? "w-9 h-9" : "w-8 h-8"} flex items-center justify-center border border-black/15 text-black/50 hover:border-black/30 transition-colors`} style={{ borderRadius: "3px" }} onClick={() => setAdultQty(Math.max(0, adultQty - 1))}>&#8722;</button>
                    <span className={`w-6 text-center ${isKo ? "text-[16px]" : "text-[14px]"} font-bold`}>{adultQty}</span>
                    <button type="button" className={`${isKo ? "w-9 h-9" : "w-8 h-8"} flex items-center justify-center border border-black/15 text-black/50 hover:border-black/30 transition-colors`} style={{ borderRadius: "3px" }} onClick={() => setAdultQty(adultQty + 1)}>+</button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`${isKo ? "text-[15px]" : "text-[13px]"} font-bold text-black`}>{tc("child")}</div>
                    <div className={`${isKo ? "text-[12px]" : "text-[11px]"} text-black/40`}>{ts1("agesChild")}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedPrices && (
                      <div className="flex items-baseline gap-1 mr-2">
                        <span className={`${isKo ? "text-[11px]" : "text-[10px]"} text-black/30 line-through`}>{formatPrice(selectedPrices.childOrig, locale)}</span>
                        <span className={`${isKo ? "text-[16px]" : "text-[14px]"} font-bold text-[#FF0000]`}>{formatPrice(selectedPrices.child, locale)}</span>
                      </div>
                    )}
                    <button type="button" className={`${isKo ? "w-9 h-9" : "w-8 h-8"} flex items-center justify-center border border-black/15 text-black/50 hover:border-black/30 transition-colors`} style={{ borderRadius: "3px" }} onClick={() => setChildQty(Math.max(0, childQty - 1))}>&#8722;</button>
                    <span className={`w-6 text-center ${isKo ? "text-[16px]" : "text-[14px]"} font-bold`}>{childQty}</span>
                    <button type="button" className={`${isKo ? "w-9 h-9" : "w-8 h-8"} flex items-center justify-center border border-black/15 text-black/50 hover:border-black/30 transition-colors`} style={{ borderRadius: "3px" }} onClick={() => setChildQty(childQty + 1)}>+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Add-ons section ── */}
            <div className="bg-brand-cream px-6 py-8 max-md:px-4">
              <div className="mb-4">
                <div className="h-px bg-black/10" />
                <h3 className={`py-2.5 text-center ${isKo ? "text-[22px]" : "text-[14px]"} uppercase tracking-[0.2em] text-black`} style={{ fontFamily: isKo ? "'SUIT-SemiBold', sans-serif" : "'SUIT-Heavy', sans-serif" }}>
                  {t("enhanceExperience")}
                </h3>
                <div className="h-px bg-black/10" />
              </div>

              {(() => {
                const ticket = addonEntries[addonIndex];
                if (!ticket) return null;
                const [id, product] = ticket;
                const hasMultiple = addonEntries.length > 1;
                return (
                  <div className="mx-auto max-w-[620px]">
                    <TicketCard id={id} product={product} onBook={(pid: string) => openAddonModal(pid, selectedTourId)} bgColor="bg-brand-cream" compact>
                      {hasMultiple && (
                        <div className="flex items-center gap-3 pt-3 border-t border-black/5">
                          <button type="button" className="size-7 flex items-center justify-center rounded-full border border-black/10 text-black/30 hover:text-black hover:border-black/30 transition-colors"
                            onClick={() => setAddonIndex((i) => (i - 1 + addonEntries.length) % addonEntries.length)}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                          </button>
                          <div className="flex gap-1.5">
                            {addonEntries.map((_, i) => (
                              <span key={i} className={`block size-1.5 rounded-full cursor-pointer transition-colors ${i === addonIndex ? "bg-[#FF0000]" : "bg-black/15"}`} onClick={() => setAddonIndex(i)} />
                            ))}
                          </div>
                          <button type="button" className="size-7 flex items-center justify-center rounded-full border border-black/10 text-black/30 hover:text-black hover:border-black/30 transition-colors"
                            onClick={() => setAddonIndex((i) => (i + 1) % addonEntries.length)}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                          </button>
                          <span className="ml-auto text-[10px] text-black/30">{addonIndex + 1} / {addonEntries.length}</span>
                        </div>
                      )}
                    </TicketCard>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* ── Sticky footer ── */}
          <div className="sticky bottom-0 bg-[#001e53] border-t border-white/10 py-[14px] px-[18px] shrink-0">
            <button
              className="w-full border-none px-4 py-[14px] text-[14px] font-bold cursor-pointer uppercase tracking-wide bg-[#FF0000] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-[#E00000]"
              style={{ borderRadius: "2px" }}
              type="button" disabled={!canContinue} onClick={proceedFromTourSelection}
            >
              {t("continueWith", { tour: selectedMeta?.title ?? "" })}
            </button>
          </div>
        </div>
      </div>

      {/* ── Route map popup ── */}
      {mapOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 p-4" onClick={() => setMapOpen(false)}>
          <div className="relative bg-white max-w-[700px] w-full max-h-[85vh] overflow-auto" style={{ borderRadius: "4px" }} onClick={(e) => e.stopPropagation()}>
            <button type="button" className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/60 text-white text-[18px] hover:bg-black/80 z-10" style={{ borderRadius: "2px" }} onClick={() => setMapOpen(false)}>&times;</button>
            <img src="/imgs/tour01-timetable-en.png" alt="Route Map" className="w-full h-auto" />
          </div>
        </div>
      )}
    </div>
  );
}
