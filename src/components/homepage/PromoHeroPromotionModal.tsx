/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useState } from "react";

type PromoConfig = {
  title: string;
  desc: string;
  image: string;
  preferredTour: string;
  /** When true, only the preferredTour is valid — no tour selector shown */
  tourLocked: boolean;
  tourLabel: string;
  adultPrice: number;
  adultOrigPrice: number;
  childPrice: number;
  childOrigPrice: number;
};

const PROMO_DATA: Record<string, PromoConfig> = {
  "1": {
    title: "Sejong Backstage Pass",
    desc: "Go behind the scenes at Korea's premier performing arts venue with exclusive backstage access to the Sejong Center for the Performing Arts.",
    image: "/imgs/promotion-1.png",
    preferredTour: "tour01",
    tourLocked: true,
    tourLabel: "Tour 01 — Downtown Palace Namsan Course",
    adultPrice: 20,
    adultOrigPrice: 27,
    childPrice: 14,
    childOrigPrice: 18,
  },
  "2": {
    title: "Promotion 2",
    desc: "Limited-time offer. View details and continue to booking.",
    image: "/imgs/promotion-2.png",
    preferredTour: "tour02",
    tourLocked: false,
    tourLabel: "Tour 02 — Panorama Course",
    adultPrice: 22,
    adultOrigPrice: 29,
    childPrice: 15,
    childOrigPrice: 20,
  },
  "3": {
    title: "Promotion 3",
    desc: "Limited-time offer. View details and continue to booking.",
    image: "/imgs/promotion-3.png",
    preferredTour: "tour04",
    tourLocked: false,
    tourLabel: "Tour 04 — Night View Course",
    adultPrice: 18,
    adultOrigPrice: 24,
    childPrice: 12,
    childOrigPrice: 16,
  },
};

const clamp = (n: number, min = 0, max = 10) => Math.max(min, Math.min(max, n));

export default function PromoHeroPromotionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [promoId, setPromoId] = useState("1");
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);

  const promo = PROMO_DATA[promoId] ?? PROMO_DATA["1"]!;
  const totalTickets = adultCount + childCount;
  const subtotal = adultCount * promo.adultPrice + childCount * promo.childPrice;
  const origSubtotal = adultCount * promo.adultOrigPrice + childCount * promo.childOrigPrice;

  const close = useCallback(() => {
    setIsOpen(false);
    document.body.classList.remove("promo-hero-modal-open");
  }, []);

  const open = useCallback((id: string) => {
    setPromoId(id);
    setAdultCount(0);
    setChildCount(0);
    setIsOpen(true);
    document.body.classList.add("promo-hero-modal-open");
  }, []);

  /* Listen for clicks on the promo carousel [data-promo-popup] triggers */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const trigger = target?.closest<HTMLElement>("[data-promo-popup]");
      if (!trigger) return;
      e.preventDefault();
      const id = trigger.dataset.promoPopup || trigger.closest<HTMLElement>(".promo-slide")?.dataset.promo || "1";
      open(id);
    };
    const carousel = document.querySelector(".promo-tab-carousel");
    carousel?.addEventListener("click", onClick as EventListener);
    return () => carousel?.removeEventListener("click", onClick as EventListener);
  }, [open]);

  /* Listen for custom event from PromoTabCarousel */
  useEffect(() => {
    const handler = (e: Event) => {
      const id = String((e as CustomEvent).detail?.promoId ?? "1");
      open(id);
    };
    document.addEventListener("tb:openPromoHeroPromotion", handler);
    return () => document.removeEventListener("tb:openPromoHeroPromotion", handler);
  }, [open]);

  /* Escape key */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const onBookNow = () => {
    close();
    document.dispatchEvent(new CustomEvent("tb:openPromoTourSelectionFromHero", {
      detail: {
        preferredTour: promo.preferredTour,
        adultCount,
        childCount,
      },
    }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/70 z-[var(--z-modal)] p-5"
      id="promoHeroPromotionModal"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div
        className="bg-white w-[min(720px,92vw)] max-h-[90vh] rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)] relative flex flex-col"
        role="dialog"
        aria-labelledby="promoHeroPromotionTitle"
      >
        <button
          className="absolute top-[10px] right-[10px] w-9 h-9 rounded-full border-none bg-white/90 cursor-pointer text-[24px] leading-none z-[2] flex items-center justify-center hover:bg-white transition-colors"
          id="closePromoHeroPromotionModal"
          type="button"
          aria-label="Close"
          onClick={close}
        >
          &times;
        </button>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Media */}
          <div>
            <img
              id="promoHeroPromotionImg"
              src={promo.image}
              alt="Promotion"
              className="w-full h-auto block"
            />
          </div>

          {/* Body */}
          <div className="p-[18px]">
            <h3 id="promoHeroPromotionTitle" className="m-0 mb-2 text-[20px] text-[#111]">
              {promo.title}
            </h3>
            <p id="promoHeroPromotionDesc" className="m-0 text-[#333] leading-[1.4] mb-4">
              {promo.desc}
            </p>

            {/* Associated tour badge */}
            <div className="flex items-center gap-2 mb-5 p-3 rounded-lg bg-[#f8f8f8] border border-[#e8e8e8]">
              <i className="fas fa-bus text-[#E20021] text-sm" />
              <span className="text-[13px] text-[#555] font-medium">
                {promo.tourLocked ? "This promotion is exclusive to:" : "Recommended tour:"}
              </span>
              <span className="text-[13px] text-[#111] font-semibold">{promo.tourLabel}</span>
            </div>

            {/* Ticket selection */}
            <div className="border border-[#e8e8e8] rounded-xl overflow-hidden">
              <div className="bg-[#fafafa] px-4 py-3 border-b border-[#e8e8e8]">
                <h4 className="m-0 text-[15px] font-semibold text-[#111]">Select Tickets</h4>
              </div>

              {/* Adult row */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#f0f0f0]">
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-[#222]">Adult</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[15px] font-bold text-[#E20021]">${promo.adultPrice} USD</span>
                    <span className="text-[12px] text-[#999] line-through">${promo.adultOrigPrice} USD</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="w-8 h-8 rounded-full border-2 border-[#ddd] bg-white text-[16px] font-semibold text-[#333] flex items-center justify-center cursor-pointer transition-colors hover:border-[#E20021] hover:text-[#E20021] disabled:opacity-30 disabled:cursor-not-allowed"
                    onClick={() => setAdultCount((c) => clamp(c - 1))}
                    disabled={adultCount === 0}
                    aria-label="Decrease adult count"
                    type="button"
                  >
                    -
                  </button>
                  <span className="min-w-[24px] text-center text-[16px] font-bold text-[#111]" aria-live="polite">
                    {adultCount}
                  </span>
                  <button
                    className="w-8 h-8 rounded-full border-2 border-[#ddd] bg-white text-[16px] font-semibold text-[#333] flex items-center justify-center cursor-pointer transition-colors hover:border-[#E20021] hover:text-[#E20021] disabled:opacity-30 disabled:cursor-not-allowed"
                    onClick={() => setAdultCount((c) => clamp(c + 1))}
                    disabled={adultCount === 10}
                    aria-label="Increase adult count"
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Child row */}
              <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-[#222]">Child</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[15px] font-bold text-[#E20021]">${promo.childPrice} USD</span>
                    <span className="text-[12px] text-[#999] line-through">${promo.childOrigPrice} USD</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="w-8 h-8 rounded-full border-2 border-[#ddd] bg-white text-[16px] font-semibold text-[#333] flex items-center justify-center cursor-pointer transition-colors hover:border-[#E20021] hover:text-[#E20021] disabled:opacity-30 disabled:cursor-not-allowed"
                    onClick={() => setChildCount((c) => clamp(c - 1))}
                    disabled={childCount === 0}
                    aria-label="Decrease child count"
                    type="button"
                  >
                    -
                  </button>
                  <span className="min-w-[24px] text-center text-[16px] font-bold text-[#111]" aria-live="polite">
                    {childCount}
                  </span>
                  <button
                    className="w-8 h-8 rounded-full border-2 border-[#ddd] bg-white text-[16px] font-semibold text-[#333] flex items-center justify-center cursor-pointer transition-colors hover:border-[#E20021] hover:text-[#E20021] disabled:opacity-30 disabled:cursor-not-allowed"
                    onClick={() => setChildCount((c) => clamp(c + 1))}
                    disabled={childCount === 10}
                    aria-label="Increase child count"
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Subtotal */}
            {totalTickets > 0 && (
              <div className="flex items-center justify-between mt-4 px-1">
                <span className="text-[14px] text-[#666]">
                  {totalTickets} {totalTickets === 1 ? "ticket" : "tickets"} selected
                </span>
                <div className="flex items-center gap-2">
                  {origSubtotal > subtotal && (
                    <span className="text-[13px] text-[#999] line-through">${origSubtotal.toFixed(2)}</span>
                  )}
                  <span className="text-[18px] font-bold text-[#E20021]">${subtotal.toFixed(2)} USD</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky bottom actions */}
        <div className="flex gap-3 justify-end items-center px-[18px] py-[14px] border-t border-[#eee] shrink-0 bg-white">
          <button
            className="bg-transparent border border-[#cfcfcf] text-[#111] px-[14px] py-[10px] rounded-[10px] cursor-pointer font-semibold hover:bg-[#f5f5f5] transition-colors"
            id="promoHeroPromotionCloseBtn"
            type="button"
            onClick={close}
          >
            Close
          </button>
          <button
            className="bg-[#E2601E] border border-[#E2601E] text-white px-[14px] py-[10px] rounded-[10px] cursor-pointer font-bold hover:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            id="promoHeroPromotionBookNowBtn"
            type="button"
            onClick={onBookNow}
            disabled={totalTickets === 0}
          >
            {totalTickets > 0 ? `Book now — $${subtotal.toFixed(2)}` : "Select tickets to book"}
          </button>
        </div>
      </div>
    </div>
  );
}
