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

  /* Auto-rotate */
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

  const goPrev = () => {
    if (currentIndex > 0) goToSlide(currentIndex - 1);
  };

  const goNext = () => {
    if (currentIndex < total - 1) goToSlide(currentIndex + 1);
  };

  const togglePause = () => {
    setIsPaused((p) => {
      const next = !p;
      if (next) clearTimer();
      return next;
    });
    setProgressKey((k) => k + 1);
  };

  /* Hover pause */
  const onMouseEnter = () => {
    if (!isPaused) clearTimer();
  };
  const onMouseLeave = () => {
    if (!isPaused) startTimer();
  };

  /* Touch / swipe */
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

  /* Promo click — dispatch event for the PromoHeroPromotionModal */
  const onPromoClick = (promoId: number) => {
    document.dispatchEvent(
      new CustomEvent("tb:openPromoHeroPromotion", { detail: { promoId } }),
    );
  };

  return (
    <div
      ref={containerRef}
      className="absolute bottom-[190px] left-1/2 -translate-x-1/2 z-50 w-[45%] max-[1200px]:w-[55%] max-[992px]:w-[65%] max-md:relative max-md:bottom-auto max-md:left-auto max-md:w-full max-md:translate-x-0 max-md:z-[101] max-md:m-0 max-[400px]:z-[90]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Promotional offers"
    >
      <div className="relative backdrop-blur-[10px] rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.15)] border border-white/20 flex items-center justify-center h-[160px] max-[1200px]:h-[140px] max-[992px]:h-[120px] max-md:h-auto max-md:min-h-[64px] max-md:pt-3 max-md:pb-3 max-md:pl-4 max-md:pr-4 max-md:bg-white/[0.98] max-md:rounded-t-[16px] max-md:rounded-b-none max-md:shadow-[0_-4px_20px_rgba(0,0,0,0.1)] max-md:backdrop-blur-xl max-md:border-b-0 max-md:items-center max-[400px]:min-h-0 max-[400px]:pt-[10px] max-[400px]:pb-[10px] max-[400px]:pl-3 max-[400px]:pr-3 max-[400px]:rounded-[12px_12px_0_0]">
        {/* Progress bars */}
        <div className="flex pt-3 pb-3 pl-4 pr-[50px] w-full absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/40 to-transparent rounded-t-2xl items-center gap-[6px] max-md:pt-2 max-md:pb-2 max-md:pl-3 max-md:pr-10 max-md:gap-[3px] max-md:rounded-[12px_12px_0_0] max-[400px]:pt-[6px] max-[400px]:pb-[6px] max-[400px]:pl-[10px] max-[400px]:pr-9 max-[400px]:gap-0.5 max-[400px]:rounded-[10px_10px_0_0]">
          {PROMO_SLIDES.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1 bg-white/40 rounded-[2px] overflow-hidden cursor-pointer max-md:h-[3px]"
              onClick={() => goToSlide(i)}
              role="button"
              aria-label={`Go to promotion ${i + 1}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  goToSlide(i);
                }
                if (e.key === " " || e.key === "Spacebar") {
                  e.preventDefault();
                  goToSlide(i);
                }
              }}
            >
              <div
                key={`pf-${progressKey}-${i}`}
                className="block h-full rounded-[2px] bg-white"
                style={
                  i < currentIndex
                    ? { width: "100%", transition: "none" }
                    : i === currentIndex && !isPaused
                      ? {
                          width: "100%",
                          transition: `width ${SLIDE_DURATION}ms linear`,
                          transitionDelay: "50ms",
                        }
                      : i === currentIndex && isPaused
                        ? { width: "50%", transition: "none" }
                        : { width: "0%", transition: "none" }
                }
              />
            </div>
          ))}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/25 border-0 text-white w-6 h-6 rounded-full cursor-pointer flex items-center justify-center transition-all duration-200 text-[10px] hover:bg-white/40 hover:scale-110 max-md:w-5 max-md:h-5 max-md:text-[8px] max-md:right-3 max-[400px]:right-[10px]"
            onClick={togglePause}
            aria-label={isPaused ? "Resume carousel" : "Pause carousel"}
          >
            <i className={`fas ${isPaused ? "fa-play" : "fa-pause"}`} />
          </button>
        </div>

        {/* Prev arrow */}
        <button
          className="bg-brand-red border-0 text-white cursor-pointer p-3 rounded-full transition-all duration-200 flex items-center justify-center shrink-0 w-10 h-10 min-w-10 hover:bg-brand-dark-red hover:scale-110 hover:shadow-[0_4px_12px_rgba(226,0,33,0.4)] max-[1200px]:w-9 max-[1200px]:h-9 max-[1200px]:min-w-9 max-[992px]:w-8 max-[992px]:h-8 max-[992px]:min-w-8 max-md:p-2 max-md:w-8 max-md:h-8 max-md:min-w-8 max-[400px]:w-7 max-[400px]:h-7 max-[400px]:min-w-7 max-[400px]:p-[6px]"
          onClick={goPrev}
          aria-label="Previous promotion"
          style={{ display: currentIndex > 0 ? "flex" : "none" }}
        >
          <i className="fas fa-chevron-left text-[16px] font-bold max-[992px]:text-sm max-md:text-xs max-[400px]:text-[11px]" />
        </button>

        {/* Slides */}
        <div className="flex flex-1 overflow-hidden relative w-full h-full max-md:h-auto max-md:min-h-[50px]">
          {PROMO_SLIDES.map((slide, i) => (
            <div
              key={slide.id}
              className={
                i === currentIndex
                  ? "block absolute w-full h-full opacity-100 transition-opacity duration-300 max-md:relative max-md:h-auto"
                  : "hidden"
              }
              data-promo={String(slide.id)}
              role="group"
              aria-roledescription="slide"
              aria-label={`Promotion ${slide.id} of ${total}`}
              aria-hidden={i !== currentIndex}
            >
              <div
                className="text-white rounded-xl h-full w-full flex flex-col justify-center items-center text-center box-border max-md:pt-3 max-md:pb-3 max-md:pl-4 max-md:pr-4"
                data-promo-popup={String(slide.id)}
                style={{ cursor: "pointer" }}
                onClick={() => onPromoClick(slide.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onPromoClick(slide.id);
                  }
                  if (e.key === " " || e.key === "Spacebar") {
                    e.preventDefault();
                    onPromoClick(slide.id);
                  }
                }}
                role="button"
                tabIndex={i === currentIndex ? 0 : -1}
              >
                <img
                  src={slide.image}
                  className="w-[90%] max-w-full h-auto max-h-[110px] object-contain max-[1200px]:max-h-[95px] max-[992px]:max-h-[80px] max-md:w-full max-md:max-h-[80px] max-md:rounded-lg max-[400px]:max-h-none"
                  alt={slide.alt}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Next arrow */}
        <button
          className="bg-brand-red border-0 text-white cursor-pointer p-3 rounded-full transition-all duration-200 flex items-center justify-center shrink-0 w-10 h-10 min-w-10 hover:bg-brand-dark-red hover:scale-110 hover:shadow-[0_4px_12px_rgba(226,0,33,0.4)] max-[1200px]:w-9 max-[1200px]:h-9 max-[1200px]:min-w-9 max-[992px]:w-8 max-[992px]:h-8 max-[992px]:min-w-8 max-md:p-2 max-md:w-8 max-md:h-8 max-md:min-w-8 max-[400px]:w-7 max-[400px]:h-7 max-[400px]:min-w-7 max-[400px]:p-[6px]"
          onClick={goNext}
          aria-label="Next promotion"
          style={{ display: currentIndex < total - 1 ? "flex" : "none" }}
        >
          <i className="fas fa-chevron-right text-[16px] font-bold max-[992px]:text-sm max-md:text-xs max-[400px]:text-[11px]" />
        </button>
      </div>
    </div>
  );
}
