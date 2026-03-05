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
      className="promo-tab-carousel"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Promotional offers"
    >
      <div className="promo-tabs-container">
        {/* Progress bars */}
        <div className="promo-progress-bars">
          {PROMO_SLIDES.map((_, i) => (
            <div
              key={i}
              className="promo-progress-bar"
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
                className="promo-fill"
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
            className={`promo-pause-btn${isPaused ? " paused" : ""}`}
            onClick={togglePause}
            aria-label={isPaused ? "Resume carousel" : "Pause carousel"}
          >
            <i className={`fas ${isPaused ? "fa-play" : "fa-pause"}`} />
          </button>
        </div>

        {/* Prev arrow */}
        <button
          className="promo-nav-arrow prev"
          onClick={goPrev}
          aria-label="Previous promotion"
          style={{ display: currentIndex > 0 ? "flex" : "none" }}
        >
          <i className="fas fa-chevron-left" />
        </button>

        {/* Slides */}
        <div className="promo-slides">
          {PROMO_SLIDES.map((slide, i) => (
            <div
              key={slide.id}
              className={`promo-slide${i === currentIndex ? " active" : ""}`}
              data-promo={String(slide.id)}
              role="group"
              aria-roledescription="slide"
              aria-label={`Promotion ${slide.id} of ${total}`}
              aria-hidden={i !== currentIndex}
            >
              <div
                className="promo-content promo-clickable"
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
                <div className="relative">
                  <img
                    src={slide.image}
                    className="promo-banner-img"
                    alt={slide.alt}
                    loading="lazy"
                  />
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/60 text-white/90 text-xs font-mono px-2 py-0.5 rounded pointer-events-none z-10 select-none">640×110px</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Next arrow */}
        <button
          className="promo-nav-arrow next"
          onClick={goNext}
          aria-label="Next promotion"
          style={{ display: currentIndex < total - 1 ? "flex" : "none" }}
        >
          <i className="fas fa-chevron-right" />
        </button>
      </div>
    </div>
  );
}
