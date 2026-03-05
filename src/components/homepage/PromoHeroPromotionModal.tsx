/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useState } from "react";

type PromoConfig = { title: string; desc: string; image: string; preferredTour: string | null };

const PROMO_DATA: Record<string, PromoConfig> = {
  "1": { title: "Promotion 1", desc: "Limited-time offer. View details and continue to booking.", image: "/imgs/promotion-1.png", preferredTour: "tour01" },
  "2": { title: "Promotion 2", desc: "Limited-time offer. View details and continue to booking.", image: "/imgs/promotion-2.png", preferredTour: "tour02" },
  "3": { title: "Promotion 3", desc: "Limited-time offer. View details and continue to booking.", image: "/imgs/promotion-3.png", preferredTour: "tour04" },
};

export default function PromoHeroPromotionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [promoId, setPromoId] = useState("1");

  const promo = PROMO_DATA[promoId] ?? PROMO_DATA["1"];

  const close = useCallback(() => {
    setIsOpen(false);
    document.body.classList.remove("promo-hero-modal-open");
  }, []);

  const open = useCallback((id: string) => {
    setPromoId(id);
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
      detail: { preferredTour: promo.preferredTour },
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
          <p id="promoHeroPromotionDesc" className="m-0 text-[#333] leading-[1.4]">
            {promo.desc}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end px-[18px] py-[14px] border-t border-[#eee]">
          <button
            className="bg-transparent border border-[#cfcfcf] text-[#111] px-[14px] py-[10px] rounded-[10px] cursor-pointer font-semibold hover:bg-[#f5f5f5] transition-colors"
            id="promoHeroPromotionCloseBtn"
            type="button"
            onClick={close}
          >
            Close
          </button>
          <button
            className="bg-[#E2601E] border border-[#E2601E] text-white px-[14px] py-[10px] rounded-[10px] cursor-pointer font-bold hover:brightness-95 transition-all"
            id="promoHeroPromotionBookNowBtn"
            type="button"
            onClick={onBookNow}
          >
            Book now
          </button>
        </div>
      </div>
    </div>
  );
}
