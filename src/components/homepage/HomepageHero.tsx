/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { HeroSlider, PromoTabCarousel, BookingWidget } from "./hero";

/*
  Course slides data — driven by tb:courseSlideChange events
  dispatched from the HomepageCourseCarousel behavior.
*/
const COURSE_SLIDES = [
  { title: "Downtown Namsan Palace Course", color: "white", bg: "#001C2C", icon: "/imgs/palacetour01.png" },
  { title: "Nightview Course(Non Stop)", color: "black", bg: "#FCD700", icon: "/imgs/nighttouricon.png" },
  { title: "Panorama Course", color: "white", bg: "#C41E3A", icon: "/imgs/sctbbusicon.png" },
];

const GRADIENT_BACKGROUNDS = [
  "linear-gradient(180deg, #C6F5FF 0%, #E1F7FF 30.56%, #E2601E 100%)",
  "linear-gradient(180deg, #C6F5FF 5%, #FF8C36 80%, #E2601E 100%)",
  "linear-gradient(180deg, #FFB3B3 0%, #E24C5E 50%, #C41E3A 100%)",
];

export default function HomepageHero() {
  /* Course carousel sync — listen for slide changes from the courses section */
  const [courseIndex, setCourseIndex] = useState(0);

  useEffect(() => {
    const handler = (e: Event) => {
      const idx = (e as CustomEvent).detail?.index ?? 0;
      setCourseIndex(idx);
    };
    document.addEventListener("tb:courseSlideChange", handler);
    return () => document.removeEventListener("tb:courseSlideChange", handler);
  }, []);

  const courseSlide = COURSE_SLIDES[courseIndex] ?? COURSE_SLIDES[0];
  const gradientBg = GRADIENT_BACKGROUNDS[courseIndex] ?? GRADIENT_BACKGROUNDS[0];

  return (
    <>
      {/* ── Hero Section ── */}
      <header data-section="hero" className="h-[calc(100vh-100px)] pt-[100px] relative overflow-visible z-[50]">
        <HeroSlider />

        <div className="pl-10 w-[28%]">
          <img src="/imgs/logo.svg" alt="Seoul City Tour Tiger Bus" />
        </div>

        <PromoTabCarousel />
        <BookingWidget />
      </header>

      {/* ── Gradient Section — driven by courseCarousel event ── */}
      <div
        className="relative z-[1] w-full h-[250px] flex justify-center items-end mb-[30px] -mt-px transition-[background] duration-500"
        style={{ background: gradientBg }}
      >
        {/* Tour icon — replaces the legacy ::after pseudo-element */}
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[120px] z-[1] transition-opacity duration-300">
          <img
            src={courseSlide.icon}
            alt=""
            className="w-full h-full object-contain"
          />
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black/60 text-white/90 text-xs font-mono px-2 py-0.5 rounded pointer-events-none z-10 select-none">300×120px</span>
        </div>

        <h1
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] max-w-[1100px] m-0 p-[25px] text-center rounded-t-[20px] z-[3] text-4xl font-semibold shadow-[0_-4px_10px_rgba(0,0,0,0.1)] block transition-[background-color] duration-500"
          style={{ color: courseSlide.color, background: courseSlide.bg }}
        >
          {courseSlide.title}
        </h1>
      </div>
    </>
  );
}
