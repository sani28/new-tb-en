import type { Cleanup } from "./types";

export function initCardCarousels(): Cleanup {
  const carousels = Array.from(document.querySelectorAll<HTMLElement>(".card-carousel-container"));
  if (carousels.length === 0) return () => {};

  const cleanups: Cleanup[] = [];

  carousels.forEach((container) => {
    const track = container.querySelector<HTMLElement>(".card-carousel-track");
    const cards = Array.from(container.querySelectorAll<HTMLElement>(".card"));
    const carouselId = container.id;
    if (!track || cards.length === 0 || !carouselId) return;

    const prevBtn = document.querySelector<HTMLElement>(`.card-prev[data-carousel="${carouselId}"]`);
    const nextBtn = document.querySelector<HTMLElement>(`.card-next[data-carousel="${carouselId}"]`);

    let currentIndex = 0;

    const updateCarousel = () => {
      const firstCard = cards[0];
      const cardWidth = firstCard?.offsetWidth ?? 0;
      if (!cardWidth) return;

      const isMobile = window.innerWidth <= 768;
      const isSmallMobile = window.innerWidth <= 480;

      let gap = 20;
      if (isSmallMobile) gap = 10;
      else if (isMobile) gap = 12;

      const containerWidth = container.offsetWidth;
      const visibleCards = Math.max(1, Math.floor(containerWidth / (cardWidth + gap)));
      const totalCards = cards.length;
      const maxIndex = Math.max(0, totalCards - visibleCards);

      if (currentIndex > maxIndex) currentIndex = maxIndex;

      const offset = currentIndex * (cardWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;

      if (prevBtn) prevBtn.style.opacity = currentIndex === 0 ? "0.5" : "1";
      if (nextBtn) nextBtn.style.opacity = currentIndex >= maxIndex ? "0.5" : "1";

      container.dataset.maxIndex = String(maxIndex);
    };

    const getStep = () => (window.innerWidth <= 768 ? 2 : 1);

    const onPrev = () => {
      if (currentIndex > 0) {
        currentIndex = Math.max(0, currentIndex - getStep());
        updateCarousel();
      }
    };
    const onNext = () => {
      const maxIndex = parseInt(container.dataset.maxIndex ?? "0", 10) || 0;
      if (currentIndex < maxIndex) {
        currentIndex = Math.min(maxIndex, currentIndex + getStep());
        updateCarousel();
      }
    };

    prevBtn?.addEventListener("click", onPrev);
    nextBtn?.addEventListener("click", onNext);
    window.addEventListener("resize", updateCarousel);
    updateCarousel();

    cleanups.push(() => {
      prevBtn?.removeEventListener("click", onPrev);
      nextBtn?.removeEventListener("click", onNext);
      window.removeEventListener("resize", updateCarousel);
    });
  });

  return () => cleanups.forEach((fn) => fn());
}
