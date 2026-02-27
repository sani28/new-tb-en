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

  return (
    <div
      className={`promo-hero-modal-overlay${isOpen ? " active" : ""}`}
      id="promoHeroPromotionModal"
      aria-hidden={!isOpen}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="promo-hero-modal" role="dialog" aria-modal="true" aria-labelledby="promoHeroPromotionTitle">
        <button className="close-popup" id="closePromoHeroPromotionModal" type="button" aria-label="Close" onClick={close}>
          &times;
        </button>
        <div className="promo-hero-modal-media">
          <img id="promoHeroPromotionImg" src={promo.image} alt="Promotion" />
        </div>
        <div className="promo-hero-modal-body">
          <h3 id="promoHeroPromotionTitle">{promo.title}</h3>
          <p id="promoHeroPromotionDesc">{promo.desc}</p>
        </div>
        <div className="promo-hero-actions">
          <button className="promo-hero-secondary" id="promoHeroPromotionCloseBtn" type="button" onClick={close}>Close</button>
          <button className="promo-hero-cta" id="promoHeroPromotionBookNowBtn" type="button" onClick={onBookNow}>Book now</button>
        </div>
      </div>
    </div>
  );
}

