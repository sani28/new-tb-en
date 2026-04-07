import type { Cleanup } from "./types";

export function initDiscoveryMobileCarousel(): Cleanup {
  if (window.innerWidth > 768) return () => {};

  const blogGrid = document.querySelector<HTMLElement>(".discovery-grid");
  if (!blogGrid) return () => {};

  const dots = Array.from(document.querySelectorAll<HTMLElement>(".discovery .dot"));
  const prevButton = document.querySelector<HTMLElement>(".discovery .carousel-arrow.prev");
  const nextButton = document.querySelector<HTMLElement>(".discovery .carousel-arrow.next");

  let currentIndex = 0;
  let startX = 0;
  let isDragging = false;

  const scrollToCard = (index: number) => {
    currentIndex = index;
    const translateX = index * -100;
    blogGrid.style.transform = `translateX(${translateX}%)`;

    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    if (prevButton) prevButton.style.visibility = currentIndex === 0 ? "hidden" : "visible";
    if (nextButton) nextButton.style.visibility = currentIndex === 2 ? "hidden" : "visible";
  };

  const onPrev = () => {
    if (currentIndex > 0) scrollToCard(currentIndex - 1);
  };
  const onNext = () => {
    if (currentIndex < 2) scrollToCard(currentIndex + 1);
  };
  const onTouchStart = (e: TouchEvent) => {
    startX = e.touches[0]?.clientX ?? 0;
    isDragging = true;
    blogGrid.style.transition = "none";
  };
  const onTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0]?.clientX ?? 0;
    const diff = startX - currentX;
    const translateX = currentIndex * 100 + (diff / window.innerWidth) * 100;
    if (translateX < -10 || translateX > 210) return;
    blogGrid.style.transform = `translateX(-${translateX}%)`;
  };
  const onTouchEnd = (e: TouchEvent) => {
    isDragging = false;
    blogGrid.style.transition = "transform 0.3s ease-in-out";
    const endX = e.changedTouches[0]?.clientX ?? 0;
    const diff = startX - endX;
    const threshold = window.innerWidth * 0.2;
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentIndex < 2) scrollToCard(currentIndex + 1);
      else if (diff < 0 && currentIndex > 0) scrollToCard(currentIndex - 1);
      else scrollToCard(currentIndex);
    } else {
      scrollToCard(currentIndex);
    }
  };

  prevButton?.addEventListener("click", onPrev);
  nextButton?.addEventListener("click", onNext);

  const dotHandlers: Array<{ dot: HTMLElement; handler: () => void }> = [];
  dots.forEach((dot, index) => {
    const handler = () => scrollToCard(index);
    dot.addEventListener("click", handler);
    dotHandlers.push({ dot, handler });
  });

  blogGrid.addEventListener("touchstart", onTouchStart, { passive: true });
  blogGrid.addEventListener("touchmove", onTouchMove, { passive: true });
  blogGrid.addEventListener("touchend", onTouchEnd, { passive: true });

  scrollToCard(0);

  return () => {
    prevButton?.removeEventListener("click", onPrev);
    nextButton?.removeEventListener("click", onNext);
    dotHandlers.forEach(({ dot, handler }) => dot.removeEventListener("click", handler));
    blogGrid.removeEventListener("touchstart", onTouchStart);
    blogGrid.removeEventListener("touchmove", onTouchMove);
    blogGrid.removeEventListener("touchend", onTouchEnd);
  };
}
