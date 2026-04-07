"use client";

import { useState } from "react";

export function useCarousel(total: number) {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(total - 1, i + 1));
  return { index, prev, next };
}

export function CarouselDots({ total, active }: { total: number; active: number }) {
  if (total <= 1) return null;
  return (
    <div className="mt-3 flex justify-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`block size-2 rounded-full transition-colors ${i === active ? "bg-brand-red" : "bg-[#ddd]"}`}
        />
      ))}
    </div>
  );
}

export function CarouselArrows({
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
}: {
  onPrev: () => void;
  onNext: () => void;
  prevDisabled: boolean;
  nextDisabled: boolean;
}) {
  return (
    <>
      <button
        className="absolute -left-4 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-red text-white shadow-md disabled:opacity-40 max-md:-left-3"
        onClick={onPrev}
        disabled={prevDisabled}
        aria-label="Previous"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        className="absolute -right-4 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-red text-white shadow-md disabled:opacity-40 max-md:-right-3"
        onClick={onNext}
        disabled={nextDisabled}
        aria-label="Next"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </>
  );
}
