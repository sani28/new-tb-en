/* eslint-disable @next/next/no-img-element */
"use client";

import { HeroSlider, PromoTabCarousel, BookingWidget } from "./hero";

export default function HomepageHero() {
  return (
    <>
      {/* ── Hero Section ── */}
      <header data-section="hero" className="h-[calc(100vh-80px)] max-md:h-auto max-md:min-h-screen relative overflow-visible z-[50] bg-[var(--color-brand-red)]">
        <HeroSlider />


        <div className="max-md:absolute max-md:bottom-0 max-md:left-0 max-md:right-0 md:contents">
          <PromoTabCarousel />
          <BookingWidget />
        </div>
      </header>

      {/* ── Elevating Journey Banner ── */}
      <div className="w-full -mt-px overflow-hidden p-[50px] max-md:p-5" style={{ background: "#001e53" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/home-imgs/elevating.png"
          alt="Elevating Your Journey"
          className="w-full h-auto block rounded-[16px]"
        />
      </div>
    </>
  );
}
