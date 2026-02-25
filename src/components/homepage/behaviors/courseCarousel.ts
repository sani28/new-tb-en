import type { Cleanup } from "./types";
import { safeParseJsonArray } from "./types";

export function initHomepageCourseCarousel(): Cleanup {
  const carousel = document.querySelector<HTMLElement>(".homepage-carousel-container");
  const slides = Array.from(document.querySelectorAll<HTMLElement>(".homepage-carousel-slide"));
  const dots = Array.from(document.querySelectorAll<HTMLElement>(".carousel-dots .dot"));
  const prevButton = document.querySelector<HTMLElement>(".carousel-nav.prev");
  const nextButton = document.querySelector<HTMLElement>(".carousel-nav.next");
  const gradientTitle = document.querySelector<HTMLElement>(".gradient-section .course-title");

  if (!carousel || slides.length === 0 || !prevButton || !nextButton) return () => {};

  let currentIndex = 0;

  const slideColorElements = Array.from(document.querySelectorAll<HTMLElement>("[data-slide-colors]"));
  const slideColorsByEl = new Map<HTMLElement, string[]>();
  slideColorElements.forEach((el) => {
    const colors = safeParseJsonArray(el.getAttribute("data-slide-colors"));
    if (colors) slideColorsByEl.set(el, colors);
  });

  const showSlide = (index: number) => {
    currentIndex = Math.max(0, Math.min(slides.length - 1, index));

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentIndex);
    });

    const gradientSection = document.querySelector<HTMLElement>(".gradient-section");
    if (gradientSection) {
      gradientSection.classList.remove("slide-1", "slide-2", "slide-3");
      gradientSection.classList.add(`slide-${currentIndex + 1}`);
    }

    // Apply data-slide-colors styles (same as prototype)
    slideColorsByEl.forEach((colors, el) => {
      const color = colors[currentIndex];
      if (!color) return;
      if (el.classList.contains("gradient-section")) {
        el.style.background = color;
      } else {
        el.style.backgroundColor = color;
      }
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });

    prevButton.style.visibility = currentIndex === 0 ? "hidden" : "visible";
    nextButton.style.visibility = currentIndex === slides.length - 1 ? "hidden" : "visible";

    // Prototype-specific title changes
    if (gradientTitle) {
      if (currentIndex === 0) {
        gradientTitle.textContent = "Downtown Namsan Palace Course";
        gradientTitle.style.color = "white";
        gradientTitle.style.background = "#001C2C";
      } else if (currentIndex === 1) {
        gradientTitle.textContent = "Nightview Course(Non Stop)";
        gradientTitle.style.color = "black";
        gradientTitle.style.background = "#FCD700";
      } else {
        gradientTitle.textContent = "Panorama Course";
        gradientTitle.style.color = "white";
        gradientTitle.style.background = "#C41E3A";
      }
    }
  };

  const onPrev = () => {
    if (currentIndex > 0) showSlide(currentIndex - 1);
  };

  const onNext = () => {
    if (currentIndex < slides.length - 1) showSlide(currentIndex + 1);
  };

  prevButton.addEventListener("click", onPrev);
  nextButton.addEventListener("click", onNext);

  const dotHandlers: Array<{ dot: HTMLElement; handler: () => void }> = [];
  dots.forEach((dot, index) => {
    const handler = () => showSlide(index);
    dot.addEventListener("click", handler);
    dotHandlers.push({ dot, handler });
  });

  let touchStartX = 0;
  const onTouchStart = (e: TouchEvent) => {
    touchStartX = e.touches[0]?.clientX ?? 0;
  };
  const onTouchEnd = (e: TouchEvent) => {
    const touchEndX = e.changedTouches[0]?.clientX ?? 0;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) <= 50) return;
    if (diff > 0 && currentIndex < slides.length - 1) showSlide(currentIndex + 1);
    if (diff < 0 && currentIndex > 0) showSlide(currentIndex - 1);
  };

  carousel.addEventListener("touchstart", onTouchStart, { passive: true });
  carousel.addEventListener("touchend", onTouchEnd, { passive: true });

  const onResize = () => showSlide(currentIndex);
  window.addEventListener("resize", onResize);

  showSlide(0);

  return () => {
    window.removeEventListener("resize", onResize);
    prevButton.removeEventListener("click", onPrev);
    nextButton.removeEventListener("click", onNext);
    dotHandlers.forEach(({ dot, handler }) => dot.removeEventListener("click", handler));
    carousel.removeEventListener("touchstart", onTouchStart);
    carousel.removeEventListener("touchend", onTouchEnd);
  };
}
