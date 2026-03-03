/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SLIDES = [
  "/imgs/hero-slider-image-2.png",
  "https://res.cloudinary.com/dnx3bdypw/image/upload/v1753770618/Screenshot_2025-07-29_at_3.30.10_PM_zxelxv.png",
  "/imgs/hero-slider-image-3.png",
  "/imgs/hero-slider-image-4.jpg",
  "/imgs/hero-slider-image-5.jpg",
];

const SLIDE_DELAY = 7000;

export default function HeroSlider() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progressKey, setProgressKey] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = SLIDES.length;

  const goToSlide = useCallback((idx: number) => {
    setActiveSlide(((idx % total) + total) % total);
    setProgressKey((k) => k + 1);
  }, [total]);

  /* Auto-advance */
  useEffect(() => {
    if (!isPlaying) return;
    intervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % total);
      setProgressKey((k) => k + 1);
    }, SLIDE_DELAY);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, activeSlide, total]);

  /* Image preloading */
  useEffect(() => {
    SLIDES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  /* Touch / swipe handling */
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
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) goToSlide(activeSlide + 1);
      else goToSlide(activeSlide - 1);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const onDotClick = (idx: number) => goToSlide(idx);

  const togglePlay = () => setIsPlaying((p) => !p);

  return (
    <div
      className="hero-slider"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        // Scope ArrowLeft/ArrowRight navigation to when the slider (or its children)
        // has focus so we don't hijack other controls (e.g. booking <select>).
        if (e.defaultPrevented) return;
        if (e.altKey || e.ctrlKey || e.metaKey) return;

        if (e.key === "ArrowLeft") {
          e.preventDefault();
          goToSlide(activeSlide - 1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          goToSlide(activeSlide + 1);
        }
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero image slider"
    >
      {SLIDES.map((src, i) => (
        <div
          key={i}
          className={`slide${i === activeSlide ? " active" : ""}`}
          style={{ backgroundImage: `url('${src}')` }}
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${i + 1} of ${total}`}
          aria-hidden={i !== activeSlide}
        />
      ))}

      {/* Slider controls — progress dots */}
      <div className="slider-controls">
        <div className="controls-row">
          <div className="slider-dots">
            {SLIDES.map((_, i) => (
              <span
                key={i}
                className={`dot${i === activeSlide ? " active" : ""}`}
                onClick={() => onDotClick(i)}
                role="button"
                aria-label={`Go to slide ${i + 1}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onDotClick(i);
                  }

                  if (e.key === " " || e.key === "Spacebar") {
                    e.preventDefault();
                    onDotClick(i);
                  }
                }}
              >
                <div className="progress-bar">
                  <div
                    key={`pf-${progressKey}-${i}`}
                    className={`progress-fill${isPlaying && i === activeSlide ? " running" : ""}`}
                  />
                </div>
              </span>
            ))}
          </div>

          <button
            className={`slider-pause${!isPlaying ? " paused" : ""}`}
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause slider" : "Play slider"}
            style={{
              background: "rgba(255,255,255,0.25)",
              border: "none",
              color: "white",
              width: 28,
              height: 28,
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              marginLeft: 8,
            }}
          >
            <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
