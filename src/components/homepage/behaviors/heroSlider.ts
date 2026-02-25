import type { Cleanup } from "./types";

export function initHeroSlider(): Cleanup {
  const slides = Array.from(document.querySelectorAll<HTMLElement>(".hero-slider .slide"));
  if (slides.length === 0) return () => {};

  const dots = Array.from(document.querySelectorAll<HTMLElement>(".slider-dots .dot"));
  const previewDots = Array.from(document.querySelectorAll<HTMLElement>(".preview-dots .preview-dot"));
  const progressFills = Array.from(document.querySelectorAll<HTMLElement>(".progress-fill"));
  const pauseButton = document.querySelector<HTMLElement>(".slider-pause");

  let currentSlide = 0;
  let isPlaying = true;
  let slideInterval: number | null = null;
  const slideDelay = 7000;

  const showSlide = (index: number) => {
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));
    previewDots.forEach((dot) => dot.classList.remove("active"));

    progressFills.forEach((fill) => {
      fill.classList.remove("running");
      // Reset animation (prototype behavior)
      (fill.style as CSSStyleDeclaration).animation = "none";
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      fill.offsetHeight;
      (fill.style as CSSStyleDeclaration).animation = "";
    });

    const next = ((index % slides.length) + slides.length) % slides.length;
    currentSlide = next;

    slides[next]?.classList.add("active");
    dots[next]?.classList.add("active");
    previewDots[next]?.classList.add("active");
    if (isPlaying) progressFills[next]?.classList.add("running");
  };

  const nextSlide = () => showSlide(currentSlide + 1);

  const start = () => {
    if (!isPlaying) return;
    if (slideInterval) window.clearInterval(slideInterval);
    slideInterval = window.setInterval(nextSlide, slideDelay);
  };

  const stop = () => {
    if (slideInterval) window.clearInterval(slideInterval);
    slideInterval = null;
  };

  const togglePlayPause = () => {
    isPlaying = !isPlaying;
    if (pauseButton) pauseButton.classList.toggle("paused", !isPlaying);
    if (isPlaying) {
      showSlide(currentSlide);
      start();
    } else {
      stop();
      progressFills.forEach((fill) => fill.classList.remove("running"));
    }
  };

  const prevButton = document.querySelector<HTMLElement>(".slider-nav.prev");
  const nextButton = document.querySelector<HTMLElement>(".slider-nav.next");

  const onPrev = () => {
    showSlide(currentSlide - 1);
    if (isPlaying) start();
  };
  const onNext = () => {
    nextSlide();
    if (isPlaying) start();
  };

  prevButton?.addEventListener("click", onPrev);
  nextButton?.addEventListener("click", onNext);
  pauseButton?.addEventListener("click", togglePlayPause);

  const dotClickHandlers: Array<{ el: HTMLElement; handler: () => void }> = [];
  [...dots, ...previewDots].forEach((dot, index) => {
    const handler = () => {
      showSlide(index);
      if (isPlaying) start();
    };
    dot.addEventListener("click", handler);
    dotClickHandlers.push({ el: dot, handler });
  });

  showSlide(currentSlide);
  start();

  return () => {
    stop();
    prevButton?.removeEventListener("click", onPrev);
    nextButton?.removeEventListener("click", onNext);
    pauseButton?.removeEventListener("click", togglePlayPause);
    dotClickHandlers.forEach(({ el, handler }) => el.removeEventListener("click", handler));
  };
}
