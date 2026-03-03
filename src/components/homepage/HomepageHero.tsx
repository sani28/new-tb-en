/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { HeroSlider, PromoTabCarousel, BookingWidget } from "./hero";

/*
  Course slides data — driven by tb:courseSlideChange events
  dispatched from the HomepageCourseCarousel behavior.
*/
const COURSE_SLIDES = [
  { title: "Downtown Namsan Palace Course", color: "white", bg: "#001C2C" },
  { title: "Nightview Course(Non Stop)", color: "black", bg: "#FCD700" },
  { title: "Panorama Course", color: "white", bg: "#C41E3A" },
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
      <header className="hero">
        <HeroSlider />

        <div className="logo">
          <img src="/imgs/logo.svg" alt="Seoul City Tour Tiger Bus" />
        </div>

        <PromoTabCarousel />
        <BookingWidget />
      </header>

      {/* ── Gradient Section — driven by courseCarousel event ── */}
      <div
        className={`gradient-section slide-${courseIndex + 1}`}
        style={{ background: gradientBg }}
      >
        <h1
          className="course-title"
          style={{ color: courseSlide.color, background: courseSlide.bg }}
        >
          {courseSlide.title}
        </h1>
      </div>
    </>
  );
}
