import type { Cleanup } from "./types";

export function initPromoTabCarousel(): Cleanup {
  const promoCarousel = document.querySelector<HTMLElement>(".promo-tab-carousel");
  if (!promoCarousel) return () => {};

  const promoSlides = Array.from(document.querySelectorAll<HTMLElement>(".promo-slide"));
  const prevArrow = document.querySelector<HTMLElement>(".promo-nav-arrow.prev");
  const nextArrow = document.querySelector<HTMLElement>(".promo-nav-arrow.next");
  const progressBarsContainer = document.querySelector<HTMLElement>(".promo-progress-bars");
  const pauseButton = document.querySelector<HTMLElement>(".promo-pause-btn");

  if (promoSlides.length === 0 || !prevArrow || !nextArrow || !progressBarsContainer) return () => {};

  let currentSlideIndex = 0;
  const totalSlides = promoSlides.length;
  const slideDuration = 5000;
  let autoRotateTimeout: number | null = null;
  let isPaused = false;

  const removeProgressBars = () => {
    progressBarsContainer.querySelectorAll(".promo-progress-bar").forEach((bar) => bar.remove());
  };

  const createProgressBars = () => {
    removeProgressBars();
    for (let i = 0; i < totalSlides; i++) {
      const bar = document.createElement("div");
      bar.className = "promo-progress-bar";
      bar.innerHTML = '<div class="promo-fill"></div>';
      bar.addEventListener("click", () => goToSlide(i));
      if (pauseButton) {
        progressBarsContainer.insertBefore(bar, pauseButton);
      } else {
        progressBarsContainer.appendChild(bar);
      }
    }
  };

  const updateProgressBars = () => {
    const bars = Array.from(progressBarsContainer.querySelectorAll<HTMLElement>(".promo-progress-bar"));
    bars.forEach((bar, index) => {
      const fill = bar.querySelector<HTMLElement>(".promo-fill");
      if (!fill) return;

      if (index < currentSlideIndex) {
        fill.style.transition = "none";
        fill.style.width = "100%";
      } else if (index === currentSlideIndex) {
        fill.style.transition = "none";
        fill.style.width = "0%";
        window.setTimeout(() => {
          fill.style.transition = "width 5s linear";
          fill.style.width = "100%";
        }, 50);
      } else {
        fill.style.transition = "none";
        fill.style.width = "0%";
      }
    });
  };

  const updateSlides = () => {
    promoSlides.forEach((slide, index) => {
      slide.classList.toggle("active", index === currentSlideIndex);
    });
    prevArrow.style.display = currentSlideIndex > 0 ? "flex" : "none";
    nextArrow.style.display = currentSlideIndex < totalSlides - 1 ? "flex" : "none";
    updateProgressBars();
  };

  function goToSlide(index: number) {
    currentSlideIndex = Math.max(0, Math.min(totalSlides - 1, index));
    updateSlides();
    resetAutoRotate();
  }

  const nextSlide = () => {
    currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
    updateSlides();
  };

  const startAutoRotate = () => {
    if (isPaused) return;
    if (autoRotateTimeout) window.clearTimeout(autoRotateTimeout);
    autoRotateTimeout = window.setTimeout(() => {
      nextSlide();
      startAutoRotate();
    }, slideDuration);
  };

  const stopAutoRotate = () => {
    if (autoRotateTimeout) window.clearTimeout(autoRotateTimeout);
    autoRotateTimeout = null;
  };

  const resetAutoRotate = () => {
    stopAutoRotate();
    if (!isPaused) startAutoRotate();
  };

  const togglePause = () => {
    isPaused = !isPaused;
    pauseButton?.classList.toggle("paused", isPaused);

    const bars = Array.from(progressBarsContainer.querySelectorAll<HTMLElement>(".promo-progress-bar"));
    const currentFill = bars[currentSlideIndex]?.querySelector<HTMLElement>(".promo-fill");

    if (isPaused) {
      stopAutoRotate();
      if (currentFill) {
        const computedWidth = getComputedStyle(currentFill).width;
        currentFill.style.transition = "none";
        currentFill.style.width = computedWidth;
      }
    } else {
      updateProgressBars();
      startAutoRotate();
    }
  };

  const onPrev = () => {
    if (currentSlideIndex > 0) goToSlide(currentSlideIndex - 1);
  };
  const onNext = () => {
    if (currentSlideIndex < totalSlides - 1) goToSlide(currentSlideIndex + 1);
  };
  const onMouseEnter = () => {
    if (!isPaused) stopAutoRotate();
  };
  const onMouseLeave = () => {
    if (!isPaused) startAutoRotate();
  };

  prevArrow.addEventListener("click", onPrev);
  nextArrow.addEventListener("click", onNext);
  pauseButton?.addEventListener("click", togglePause);
  promoCarousel.addEventListener("mouseenter", onMouseEnter);
  promoCarousel.addEventListener("mouseleave", onMouseLeave);

  createProgressBars();
  updateSlides();
  startAutoRotate();

  return () => {
    stopAutoRotate();
    prevArrow.removeEventListener("click", onPrev);
    nextArrow.removeEventListener("click", onNext);
    pauseButton?.removeEventListener("click", togglePause);
    promoCarousel.removeEventListener("mouseenter", onMouseEnter);
    promoCarousel.removeEventListener("mouseleave", onMouseLeave);
    removeProgressBars();
  };
}
