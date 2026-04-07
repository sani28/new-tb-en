import type { Cleanup } from "./types";

export function initPromoHeroPromotionModal(): Cleanup {
  const promoCarousel = document.querySelector<HTMLElement>(".promo-tab-carousel");
  const overlay = document.getElementById("promoHeroPromotionModal");
  if (!promoCarousel || !overlay) return () => {};

  const closeXBtn = document.getElementById("closePromoHeroPromotionModal") as HTMLButtonElement | null;
  const closeBtn = document.getElementById("promoHeroPromotionCloseBtn") as HTMLButtonElement | null;
  const bookBtn = document.getElementById("promoHeroPromotionBookNowBtn") as HTMLButtonElement | null;

  const imgEl = document.getElementById("promoHeroPromotionImg") as HTMLImageElement | null;
  const titleEl = document.getElementById("promoHeroPromotionTitle") as HTMLElement | null;
  const descEl = document.getElementById("promoHeroPromotionDesc") as HTMLElement | null;

  const promoConfig: Record<
    string,
    { title: string; desc: string; image: string; preferredTour: string | null }
  > = {
    "1": {
      title: "Promotion 1",
      desc: "Limited-time offer. View details and continue to booking.",
      image: "/imgs/promotion-1.png",
      preferredTour: "tour01",
    },
    "2": {
      title: "Promotion 2",
      desc: "Limited-time offer. View details and continue to booking.",
      image: "/imgs/promotion-2.png",
      preferredTour: "tour02",
    },
    "3": {
      title: "Promotion 3",
      desc: "Limited-time offer. View details and continue to booking.",
      image: "/imgs/promotion-3.png",
      preferredTour: "tour04",
    },
  };

  let activePromoId = "1";

  const applyPromo = (promoId: string) => {
    const cfg = promoConfig[promoId] ?? promoConfig["1"];
    if (imgEl) imgEl.src = cfg.image;
    if (titleEl) titleEl.textContent = cfg.title;
    if (descEl) descEl.textContent = cfg.desc;
    if (bookBtn) bookBtn.dataset.preferredTour = cfg.preferredTour ?? "";
  };

  const open = (promoId: string) => {
    activePromoId = promoId;
    applyPromo(promoId);
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("promo-hero-modal-open");
  };

  const close = () => {
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("promo-hero-modal-open");
  };

  const onCarouselClick = (e: MouseEvent) => {
    const target = e.target as Element | null;
    const trigger = target?.closest<HTMLElement>("[data-promo-popup]");
    if (!trigger) return;

    e.preventDefault();
    const promoId = trigger.dataset.promoPopup || trigger.closest<HTMLElement>(".promo-slide")?.dataset.promo || "1";
    open(promoId);
  };

  const onOverlayClick = (e: MouseEvent) => {
    if (e.target === overlay) close();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && overlay.classList.contains("active")) close();
  };

  const onBook = (e: MouseEvent) => {
    e.preventDefault();
    const preferredTour = (bookBtn?.dataset.preferredTour || null) ?? null;
    close();

    document.dispatchEvent(
      new CustomEvent("tb:openPromoTourSelectionFromHero", {
        detail: {
          preferredTour: preferredTour || (promoConfig[activePromoId]?.preferredTour ?? null),
        },
      })
    );
  };

  promoCarousel.addEventListener("click", onCarouselClick);
  overlay.addEventListener("click", onOverlayClick);
  closeXBtn?.addEventListener("click", close);
  closeBtn?.addEventListener("click", close);
  bookBtn?.addEventListener("click", onBook);
  document.addEventListener("keydown", onKeyDown);

  return () => {
    // Ensure the page isn't left in a locked-scroll state if the component unmounts while open.
    close();
    promoCarousel.removeEventListener("click", onCarouselClick);
    overlay.removeEventListener("click", onOverlayClick);
    closeXBtn?.removeEventListener("click", close);
    closeBtn?.removeEventListener("click", close);
    bookBtn?.removeEventListener("click", onBook);
    document.removeEventListener("keydown", onKeyDown);
  };
}
