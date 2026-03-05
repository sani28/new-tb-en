/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface PromoSlide {
  id: number;
  image: string;
  alt: string;
}

const PROMO_SLIDES: PromoSlide[] = [
  { id: 1, image: "/imgs/promotion-1.png", alt: "Promotion 1" },
  { id: 2, image: "/imgs/promotion-2.png", alt: "Promotion 2" },
  { id: 3, image: "/imgs/promotion-3.png", alt: "Promotion 3" },
];

const SLIDE_DURATION = 5000;

export default function PromoTabCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = PROMO_SLIDES.length;

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (isPaused) return;
    clearTimer();
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
      setProgressKey((k) => k + 1);
    }, SLIDE_DURATION);
  }, [isPaused, total, clearTimer]);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [currentIndex, startTimer, clearTimer]);

  const goToSlide = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(total - 1, idx));
      setCurrentIndex(clamped);
      setProgressKey((k) => k + 1);
    },
    [total],
  );

  const goPrev = () => { if (currentIndex > 0) goToSlide(currentIndex - 1); };
  const goNext = () => { if (currentIndex < total - 1) goToSlide(currentIndex + 1); };

  const togglePause = () => {
    setIsPaused((p) => {
      const next = !p;
      if (next) clearTimer();
      return next;
    });
    setProgressKey((k) => k + 1);
  };

  const onMouseEnter = () => { if (!isPaused) clearTimer(); };
  const onMouseLeave = () => { if (!isPaused) startTimer(); };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
    touchEndX.current = null;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
  };
  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < total - 1) goToSlide(currentIndex + 1);
      else if (diff < 0 && currentIndex > 0) goToSlide(currentIndex - 1);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const onPromoClick = (promoId: number) => {
    document.dispatchEvent(
      new CustomEvent("tb:openPromoHeroPromotion", { detail: { promoId } }),
    );
  };

  return (
    /* Desktop: absolute, centered, 45% wide, 190px above bottom of hero
       Mobile: relative, full-width, stacked above booking widget */
    <div
      ref={containerRef}
      className={
        "w-full relative z-[101] md:absolute md:bottom-[190px] md:left-1/2 md:-translate-x-1/2 md:z-[50] md:w-[45%] max-[1200px]:md:w-[55%] max-[992px]:md:w-[65%]"
      }
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Promotional offers"
    >
      {/* Container — glass card desktop, white-bg card on mobile */}
      <div
        className={
          "relative flex items-center justify-center h-[160px] rounded-2xl backdrop-blur-[10px] border border-white/20 shadow-[0_6px_20px_rgba(0,0,0,0.15)] " +
          "max-[1200px]:h-[140px] max-[992px]:h-[120px] " +
          "max-md:h-auto max-md:min-h-[64px] max-md:rounded-t-2xl max-md:rounded-b-none max-md:bg-white/98 max-md:backdrop-blur-[20px] max-md:shadow-[0_-4px_20px_rgba(0,0,0,0.1)] max-md:border-b-0 max-md:px-4 max-md:py-3"
        }
      >
        {/* Progress bars — gradient overlay at the top */}
        <div
          className={
            "absolute top-0 left-0 right-0 z-[10] flex items-center gap-1.5 px-4 py-3 pr-[50px] rounded-t-2xl " +
            "bg-gradient-to-b from-black/40 to-transparent " +
            "max-md:px-3 max-md:py-2 max-md:pr-[40px] max-md:gap-[3px] max-md:rounded-t-2xl"
          }
        >
          {PROMO_SLIDES.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1 bg-white/40 rounded-sm overflow-hidden cursor-pointer max-md:h-[3px]"
              onClick={() => goToSlide(i)}
              role="button"
              aria-label={`Go to promotion ${i + 1}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                  e.preventDefault();
                  goToSlide(i);
                }
              }}
            >
              <div
                key={`pf-${progressKey}-${i}`}
                className="block h-full bg-white rounded-sm"
                style={
                  i < currentIndex
                    ? { width: "100%", transition: "none" }
                    : i === currentIndex && !isPaused
                      ? { width: "100%", transition: `width ${SLIDE_DURATION}ms linear`, transitionDelay: "50ms" }
                      : i === currentIndex && isPaused
                        ? { width: "50%", transition: "none" }
                        : { width: "0%", transition: "none" }
                }
              />
            </div>
          ))}

          {/* Pause/play button */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-white/25 border-none text-white cursor-pointer text-[10px] transition-all hover:bg-white/40 hover:scale-110 max-md:right-3 max-md:w-5 max-md:h-5 max-md:text-[8px]"
            onClick={togglePause}
            aria-label={isPaused ? "Resume carousel" : "Pause carousel"}
          >
            <i className={`fas ${isPaused ? "fa-play" : "fa-pause"}`} />
          </button>
        </div>

        {/* Prev arrow */}
        <button
          className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-brand-red border-none text-white cursor-pointer transition-all hover:bg-brand-dark-red hover:scale-110 max-[1200px]:w-9 max-[1200px]:h-9 max-[992px]:w-8 max-[992px]:h-8 max-md:w-8 max-md:h-8"
          onClick={goPrev}
          aria-label="Previous promotion"
          style={{ display: currentIndex > 0 ? "flex" : "none" }}
        >
          <i className="fas fa-chevron-left text-base max-[992px]:text-[14px] max-md:text-[12px]" />
        </button>

        {/* Slides */}
        <div className="flex flex-1 overflow-hidden relative w-full h-full max-md:h-auto max-md:min-h-[50px]">
          {PROMO_SLIDES.map((slide, i) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-300 ${i === currentIndex ? "opacity-100 block" : "opacity-0 hidden"} max-md:relative max-md:inset-auto`}
              data-promo={String(slide.id)}
              role="group"
              aria-roledescription="slide"
              aria-label={`Promotion ${slide.id} of ${total}`}
              aria-hidden={i !== currentIndex}
            >
              <div
                className="w-full h-full flex flex-col justify-center items-center text-center text-white rounded-xl box-border cursor-pointer max-md:px-3 max-md:py-1.5"
                data-promo-popup={String(slide.id)}
                style={{ cursor: "pointer" }}
                onClick={() => onPromoClick(slide.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                    e.preventDefault();
                    onPromoClick(slide.id);
                  }
                }}
                role="button"
                tabIndex={i === currentIndex ? 0 : -1}
              >
                <div className="relative">
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    loading="lazy"
                    className="w-[90%] max-w-full h-auto max-h-[110px] object-contain max-[1200px]:max-h-[95px] max-[992px]:max-h-[80px] max-md:w-full max-md:max-h-[80px] max-md:rounded-lg"
                  />
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/60 text-white/90 text-xs font-mono px-2 py-0.5 rounded pointer-events-none z-10 select-none">
                    640×110px
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Next arrow */}
        <button
          className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-brand-red border-none text-white cursor-pointer transition-all hover:bg-brand-dark-red hover:scale-110 max-[1200px]:w-9 max-[1200px]:h-9 max-[992px]:w-8 max-[992px]:h-8 max-md:w-8 max-md:h-8"
          onClick={goNext}
          aria-label="Next promotion"
          style={{ display: currentIndex < total - 1 ? "flex" : "none" }}
        >
          <i className="fas fa-chevron-right text-base max-[992px]:text-[14px] max-md:text-[12px]" />
        </button>
      </div>
    </div>
  );
}
