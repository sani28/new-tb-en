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

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const TOUR_WIDGET_PRICES: Record<string, { adult: number; child: number }> = {
  tour01: { adult: 27, child: 18 },
  tour02: { adult: 27, child: 18 },
  tour04: { adult: 24, child: 15 },
};

const clamp = (n: number) => Math.max(0, Math.min(10, n));

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
  /* ── Hero slider state ── */
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progressKey, setProgressKey] = useState(0); // forces CSS animation restart
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToSlide = useCallback((idx: number) => {
    setActiveSlide(((idx % SLIDES.length) + SLIDES.length) % SLIDES.length);
    setProgressKey(k => k + 1);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (!isPlaying) return;
    intervalRef.current = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % SLIDES.length);
      setProgressKey(k => k + 1);
    }, SLIDE_DELAY);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, activeSlide]);

  const onDotClick = (idx: number) => { goToSlide(idx); };

  /* ── Booking widget state ── */
  const [tour, setTour] = useState("tour01");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const calendarRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());

  const prices = TOUR_WIDGET_PRICES[tour] ?? TOUR_WIDGET_PRICES.tour01;

  // Close calendar on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) setCalendarOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Calendar grid */
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  type Cell = { day: number; disabled: boolean; soldOut: boolean } | null;
  const cells: Cell[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(viewYear, viewMonth, d);
    const isPast = dt < todayMidnight;
    const isMonday = dt.getDay() === 1;
    const soldOut = !isMonday && !isPast && (d + viewMonth + viewYear) % 5 === 0;
    cells.push({ day: d, disabled: isPast || isMonday, soldOut });
  }

  const dateDisplay = selectedDate
    ? selectedDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "Select a date";

  const prevMonth = () => { if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); } else setViewMonth(m => m + 1); };

  const isSelected = (d: number) =>
    selectedDate !== null && selectedDate.getFullYear() === viewYear && selectedDate.getMonth() === viewMonth && selectedDate.getDate() === d;

  /* ── Course carousel sync ── */
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

  const onBook = () => {
    // If a promo tour selection modal exists, dispatch the promo event instead
    if (document.getElementById("promoTourSelectionModal")) {
      document.dispatchEvent(new CustomEvent("tb:openPromoTourSelectionFromHero", {
        detail: { preferredTour: tour },
      }));
      return;
    }
    // Otherwise open the standard booking modal
    document.dispatchEvent(new CustomEvent("tb:openBookingModal", {
      detail: { tour, adults: adultCount, children: childCount, date: selectedDate?.toISOString() },
    }));
  };

  return (
    <>
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-slider">
          {SLIDES.map((src, i) => (
            <div key={i} className={`slide${i === activeSlide ? " active" : ""}`} style={{ backgroundImage: `url('${src}')` }} />
          ))}
          <div className="slider-controls">
            <div className="controls-row">
              <div className="slider-dots">
                {SLIDES.map((_, i) => (
                  <span key={i} className={`dot${i === activeSlide ? " active" : ""}`} onClick={() => onDotClick(i)}>
                    <div className="progress-bar">
                      <div key={`pf-${progressKey}-${i}`} className={`progress-fill${isPlaying && i === activeSlide ? " running" : ""}`} />
                    </div>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="logo">
          <img src="/imgs/logo.svg" alt="Seoul City Tour Tiger Bus" />
        </div>

        {/* Promo Tab Carousel — kept as static markup; wired by promoTabCarousel behavior */}
        <div className="promo-tab-carousel">
          <div className="promo-tabs-container">
            <div className="promo-progress-bars">
              <button className="promo-pause-btn" aria-label="Pause carousel"><i className="fas fa-pause"></i></button>
            </div>
            <button className="promo-nav-arrow prev" aria-label="Previous promo"><i className="fas fa-chevron-left"></i></button>
            <div className="promo-slides">
              {[1, 2, 3].map(n => (
                <div key={n} className={`promo-slide${n === 1 ? " active" : ""}`} data-promo={String(n)}>
                  <div className="promo-content promo-clickable" data-promo-popup={String(n)} style={{ cursor: "pointer" }}>
                    <img src={`/imgs/promotion-${n}.png`} className="promo-banner-img" alt={`Promotion ${n}`} />
                  </div>
                </div>
              ))}
            </div>
            <button className="promo-nav-arrow next" aria-label="Next promo"><i className="fas fa-chevron-right"></i></button>
          </div>
        </div>

        {/* Booking Widget */}
        <div className="booking-widget">
          <div className="select-container">
            <div className="tour-select">
              <select id="booking-tour-select" value={tour} onChange={e => setTour(e.target.value)}>
                <option value="tour01">Tour 01 Downtown Palace Namsan Course (Hop On, Hop Off)</option>
                <option value="tour02">Tour 02 Panorama Course</option>
                <option value="tour04">Tour 04 Night View Course (Non Stop)</option>
              </select>
            </div>
            <div className="date-select" ref={calendarRef}>
              <div className="date-picker-wrapper">
                <button className="date-picker-trigger" onClick={() => setCalendarOpen(o => !o)}>
                  <span className="selected-date">{dateDisplay}</span>
                  <img src="/imgs/calendar.svg" alt="Calendar" className="calendar-icon" />
                </button>
                {calendarOpen && (
                  <div className="calendar-dropdown active">
                    <div className="calendar-header">
                      <button className="prev-month" onClick={prevMonth}>←</button>
                      <h3 className="current-month">{MONTH_NAMES[viewMonth]} {viewYear}</h3>
                      <button className="next-month" onClick={nextMonth}>→</button>
                    </div>
                    <div className="calendar-grid">
                      <div className="weekdays">{WEEKDAYS.map(w => <span key={w}>{w}</span>)}</div>
                      <div className="days">
                        {cells.map((cell, i) => {
                          if (!cell) return <div key={`e-${i}`} className="day empty" />;
                          const cls = ["day", cell.disabled ? "disabled" : "", cell.soldOut ? "sold-out disabled" : "",
                            !cell.disabled && !cell.soldOut ? "available" : "", isSelected(cell.day) ? "selected" : ""].filter(Boolean).join(" ");
                          return (
                            <div key={cell.day} className={cls}
                              title={new Date(viewYear, viewMonth, cell.day).getDay() === 1 ? "Closed on Mondays" : undefined}
                              onClick={() => { if (cell.disabled || cell.soldOut) return; setSelectedDate(new Date(viewYear, viewMonth, cell.day)); setCalendarOpen(false); }}>
                              {cell.day}
                              {!cell.disabled && <span className={`dot ${cell.soldOut ? "sold-out" : "available"}`} />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="calendar-footer">
                      <div className="availability-legend">
                        <div className="legend-item"><span className="dot available" /><span>Available</span></div>
                        <div className="legend-item"><span className="dot sold-out" /><span>Sold Out</span></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="passenger-counter">
            <div className="counter-group">
              <label>Adult</label>
              <div className="counter-info">
                <span className="price">${prices.adult} USD</span>
                <div className="counter">
                  <button className="decrease" style={{ opacity: adultCount === 0 ? 0.3 : 1 }} onClick={() => setAdultCount(c => clamp(c - 1))}>-</button>
                  <span className="count">{adultCount}</span>
                  <button className="increase" style={{ opacity: adultCount === 10 ? 0.3 : 1 }} onClick={() => setAdultCount(c => clamp(c + 1))}>+</button>
                </div>
              </div>
            </div>
            <div className="counter-group">
              <label>Child</label>
              <div className="counter-info">
                <span className="price">${prices.child} USD</span>
                <div className="counter">
                  <button className="decrease" style={{ opacity: childCount === 0 ? 0.3 : 1 }} onClick={() => setChildCount(c => clamp(c - 1))}>-</button>
                  <span className="count">{childCount}</span>
                  <button className="increase" style={{ opacity: childCount === 10 ? 0.3 : 1 }} onClick={() => setChildCount(c => clamp(c + 1))}>+</button>
                </div>
              </div>
            </div>
          </div>
          <button className="book-now" onClick={onBook}>Book</button>
        </div>
      </header>

      {/* Gradient Section — driven by courseCarousel event */}
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
