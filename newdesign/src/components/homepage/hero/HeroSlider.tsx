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
      className="absolute top-0 left-0 w-full h-full p-[50px] max-md:p-5"
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero image slider"
    >
      <div
        className="relative w-full h-full rounded-[20px] max-md:rounded-[12px] overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        tabIndex={0}
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
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
      >
      {SLIDES.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${i === activeSlide ? "opacity-100" : "opacity-0"}`}
          style={{ backgroundImage: `url('${src}')` }}
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${i + 1} of ${total}`}
          aria-hidden={i !== activeSlide}
        >
        </div>
      ))}

      {/* Slider controls — progress dots */}
      <div className="absolute top-[30px] left-1/2 -translate-x-1/2 flex items-center gap-5 z-[10]">
        <div className="flex items-center gap-[10px]">
          <div className="hidden">
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

        </div>
      </div>
      </div>{/* end rounded container */}

      {/* Tagline overlay — outside overflow-hidden so it sits on top of the slider edge */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/imgs/valueprop.svg"
        alt="Seoul City Tour Tiger Bus"
        className="absolute top-[40px] left-[70px] w-[18%] max-w-[156px] max-md:w-[22%] max-md:max-w-[90px] max-md:top-[150px] max-md:left-[38px] z-[20] animate-[fadeInLuxury_1.8s_cubic-bezier(0.25,0.1,0.25,1)_0.3s_both]"
      />
    </div>
  );
}
