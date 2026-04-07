"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { TOURS, type TourId, type TourData } from "./tourData";
import { Utensils, PersonStanding, CloudSun } from "lucide-react";

/* ── Inline SVG icon component ── */
function TourIcon({
  type,
  className = "w-5 h-5 flex-shrink-0 text-[#E20021]",
}: {
  type: string;
  className?: string;
}) {
  const props = {
    xmlns: "http://www.w3.org/2000/svg",
    className,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.75,
    "aria-hidden": true as const,
  };

  switch (type) {
    case "users":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          {/* left person */}
          <circle cx="4.5" cy="8.5" r="2.5" />
          <path d="M0 20c0-2.76 2.015-5 4.5-5h.268C3.73 16.07 3 17.7 3 19.5V20H0z" />
          {/* right person */}
          <circle cx="19.5" cy="8.5" r="2.5" />
          <path d="M21 20v-.5c0-1.8-.73-3.43-1.768-4.5H19.5C21.985 15 24 17.24 24 20h-3z" />
          {/* centre person (front) */}
          <circle cx="12" cy="7" r="3.5" />
          <path d="M5 21c0-3.866 3.134-7 7-7s7 3.134 7 7H5z" />
        </svg>
      );
    case "clock":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
        </svg>
      );
    case "utensils":
      return <Utensils className={className} aria-hidden />;
    case "walking":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          {/* Person standing — lucide PersonStanding paths, slightly muted */}
          <circle cx="12" cy="5" r="1" stroke="#888" strokeWidth="1.75" />
          <path d="m9 20 3-6 3 6" stroke="#888" strokeWidth="1.75" />
          <path d="m6 8 6 2 6-2" stroke="#888" strokeWidth="1.75" />
          <path d="m12 10v4" stroke="#888" strokeWidth="1.75" />
          {/* Prohibited circle */}
          <circle cx="12" cy="12" r="9.5" stroke="#E20021" strokeWidth="2" />
          {/* Diagonal slash — top-right to bottom-left */}
          <path d="M18.7 5.3 5.3 18.7" stroke="#E20021" strokeWidth="2" />
        </svg>
      );
    case "cloud-rain":
      return <CloudSun className={className} aria-hidden />;
    case "sun":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      );
    case "snowflake":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
        </svg>
      );
    case "camera":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      );
    case "thermometer":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" />
        </svg>
      );
    case "moon":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      );
    case "map":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      );
    case "info":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8h.01M12 12v4" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case "chevron-left":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
        </svg>
      );
    case "chevron-right":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
        </svg>
      );
    default:
      return null;
  }
}

/* ── Section anchor links per tour ── */
const SECTION_LINKS: Record<TourId, { label: string; href: string }[]> = {
  tour01: [
    { label: "Boarding", href: "#important-info" },
    { label: "Bus Types", href: "#bus-types" },
    { label: "Timetable", href: "#timetable" },
    { label: "Map", href: "#course-map" },
  ],
  tour02: [
    { label: "Boarding", href: "#important-info" },
    { label: "Bus Types", href: "#bus-types" },
    { label: "Map", href: "#course-map" },
  ],
  tour04: [
    { label: "Boarding", href: "#important-info" },
    { label: "Bus Types", href: "#bus-types" },
    { label: "Map", href: "#course-map" },
  ],
};

/* ── Tab bar ── */
function TourTabBar({
  tours,
  activeTourId,
  onSelect,
}: {
  tours: TourData[];
  activeTourId: TourId;
  onSelect: (id: TourId) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeTour = tours.find((t) => t.id === activeTourId)!;
  const sectionLinks = SECTION_LINKS[activeTourId];

  function scroll(dir: "left" | "right") {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -220 : 220,
      behavior: "smooth",
    });
  }

  return (
    <div data-tour-tabbar className="bg-white border-b border-gray-200 sticky top-[135px] z-[100] shadow-sm">
      <div className="max-w-[1000px] mx-auto px-4 pt-5 pb-0">
        <p className="text-xs text-gray-500 font-medium mb-3 uppercase tracking-wider">
          Select a Tour:
        </p>

        {/* Tour tab buttons row */}
        <div className="flex items-center gap-2">
          {/* Left scroll arrow — mobile only */}
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors lg:hidden"
          >
            <TourIcon type="chevron-left" className="w-4 h-4 text-gray-600" />
          </button>

          {/* Scrollable tab container */}
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto flex-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {tours.map((tour) => {
              const isActive = tour.id === activeTourId;
              return (
                <button
                  key={tour.id}
                  type="button"
                  onClick={() => onSelect(tour.id)}
                  aria-pressed={isActive}
                  className={`flex-shrink-0 flex flex-col items-start py-3 px-4 rounded-t-lg text-left transition-all duration-200 ${
                    isActive
                      ? "shadow-md"
                      : "bg-[#f0f0f0] text-[#333] hover:bg-[#e0e0e0] hover:shadow-sm"
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: activeTour.accentColor,
                          color: activeTour.textOnAccent === "dark" ? "#333" : "white",
                        }
                      : undefined
                  }
                >
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
                    {tour.shortLabel}
                  </span>
                  <span className="text-sm font-bold leading-tight mt-0.5 whitespace-nowrap">
                    {tour.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right scroll arrow — mobile only */}
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors lg:hidden"
          >
            <TourIcon type="chevron-right" className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Submenu anchor links — below the active tab */}
        <div
          className="flex items-center gap-1 overflow-x-auto py-2.5 border-t mt-0"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            borderColor: `${activeTour.accentColor}30`,
          }}
        >
          {sectionLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-full transition-all duration-150"
              style={{
                color: activeTour.accentDark ?? activeTour.accentColor,
                backgroundColor: `${activeTour.accentColor}18`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = `${activeTour.accentColor}35`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = `${activeTour.accentColor}18`;
              }}
              onClick={(e) => {
                e.preventDefault();
                const id = link.href.replace("#", "");
                const target = document.getElementById(id);
                if (!target) return;
                const tabBar = document.querySelector("[data-tour-tabbar]");
                const offset = tabBar ? tabBar.getBoundingClientRect().bottom : 0;
                const top = target.getBoundingClientRect().top + window.scrollY - offset - 8;
                window.scrollTo({ top, behavior: "smooth" });
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Section divider ── */
function SectionDivider({ title }: { title: string }) {
  return (
    <div className="bg-[#E20021] px-6 py-4 md:px-8">
      <h3 className="text-white font-bold uppercase tracking-widest text-base md:text-lg m-0">
        {title}
      </h3>
    </div>
  );
}

/* ── Tour header ── */
function TourHeader({ tour }: { tour: TourData }) {
  const onAccentText = tour.textOnAccent === "dark" ? "#333" : "white";

  return (
    <div className="flex flex-col md:flex-row min-h-[420px]">
      {/* Left: header image */}
      <div className="relative w-full md:w-1/2 min-h-[260px] md:min-h-0">
        <Image
          src={tour.headerImage}
          alt={`${tour.label} bus`}
          fill
          unoptimized
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Right: info panels */}
      <div className="w-full md:w-1/2 flex flex-col">
        {/* Top box — accent color */}
        <div
          className="flex flex-col gap-4 p-6 md:p-8 flex-1"
          style={{ backgroundColor: tour.accentColor, color: onAccentText }}
        >
          {/* Course type badge */}
          <span
            className="inline-block self-start rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider"
            style={{
              backgroundColor: tour.badgeBg,
              color: tour.badgeText === "dark" ? "#333" : "white",
            }}
          >
            {tour.courseType}
          </span>

          {/* Title */}
          <h1
            className="text-2xl md:text-3xl font-bold leading-tight m-0"
            style={{ color: onAccentText }}
          >
            {tour.shortLabel} | {tour.label}
          </h1>

          {/* Schedule */}
          <div className="flex items-center gap-2">
            <TourIcon
              type="calendar"
              className={`w-4 h-4 flex-shrink-0 ${tour.textOnAccent === "dark" ? "text-[#333]" : "text-white"}`}
            />
            <span className="text-sm font-medium" style={{ color: onAccentText }}>
              {tour.schedule}
            </span>
          </div>

          {/* Audio guide */}
          <div className="flex items-center gap-3 mt-auto pt-2">
            <span
              className="text-sm font-semibold"
              style={{ color: onAccentText, opacity: 0.9 }}
            >
              12 Language Audio Guide
            </span>
            <div className="relative w-[120px] h-[32px] flex-shrink-0">
              <Image
                src="/imgs/audio_guides.png"
                alt="Audio language guides"
                fill
                unoptimized
                className="object-contain object-left"
                sizes="120px"
              />
            </div>
          </div>
        </div>

        {/* Bottom box — red overview */}
        <div className="bg-[#E20021] text-white p-6 md:p-8">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-3 opacity-80 m-0">
            Overview
          </h3>
          <p className="text-sm leading-relaxed m-0">{tour.overview}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Highlights + carousel ── */
function HighlightsSection({ tour }: { tour: TourData }) {
  const [index, setIndex] = useState(0);
  const images = tour.carouselImages;
  const total = images.length;

  function prev() {
    setIndex((i) => (i - 1 + total) % total);
  }
  function next() {
    setIndex((i) => (i + 1) % total);
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[320px]">
      {/* Left: highlights */}
      <div className="w-full md:w-1/2 bg-white p-6 md:p-10 flex flex-col justify-center">
        <h3
          className="text-lg md:text-xl font-bold uppercase tracking-wider mb-6 m-0"
          style={{ color: tour.accentColor }}
        >
          Highlights
        </h3>
        <ul className="list-none p-0 m-0 flex flex-col gap-5">
          {tour.highlights.map((h, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5"
                style={{ backgroundColor: tour.accentColor }}
              >
                {i + 1}
              </span>
              <div className="flex flex-col gap-1.5">
                <p className="text-sm text-[#333] leading-relaxed m-0">
                  {h.before && <span>{h.before} </span>}
                  <strong className="font-bold">{h.bold}</strong>
                  {h.after && <span> {h.after}</span>}
                </p>
                {h.note && (
                  <div className="rounded-md bg-black/5 px-3 py-2 flex flex-col gap-0.5">
                    {h.note.map((line, j) => (
                      <span key={j} className="text-xs font-medium text-[#444]">{line}</span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: image carousel */}
      <div className="relative w-full md:w-1/2 min-h-[280px] md:min-h-0 overflow-hidden bg-black">
        {/* Images — cross-fade */}
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`${tour.label} — image ${i + 1}`}
            fill
            unoptimized
            className="object-cover transition-opacity duration-500"
            style={{ opacity: i === index ? 1 : 0 }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ))}

        {/* Prev / Next arrows */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#E20021] text-white flex items-center justify-center shadow-md hover:bg-[#cc0000] transition-colors"
            >
              <TourIcon type="chevron-left" className="w-4 h-4 text-white" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#E20021] text-white flex items-center justify-center shadow-md hover:bg-[#cc0000] transition-colors"
            >
              <TourIcon type="chevron-right" className="w-4 h-4 text-white" />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to image ${i + 1}`}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i === index ? '#E20021' : 'rgba(255,255,255,0.6)',
                  transform: i === index ? 'scale(1.3)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Boarding information ── */
function BoardingSection({ tour }: { tour: TourData }) {
  return (
    <section id="important-info" className="mt-2 scroll-mt-[300px]">
      <SectionDivider title="Boarding Information" />

      {/* Closed Monday notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-8 text-center my-6 mx-4 md:mx-6">
        <h2 className="text-xl md:text-2xl font-bold text-[#333] m-0 mb-2">
          Closed Every Monday
        </h2>
        <p className="text-sm text-gray-600 m-0">
          Tours operate as usual on public holidays, including Mondays.
        </p>
      </div>

      {/* Ticket process */}
      <div className="px-4 md:px-8 py-6 text-center">
        <h2 className="text-lg md:text-xl font-bold text-[#333] mb-3">
          How to get your physical ticket after reserving
        </h2>
        <p className="text-sm text-[#555] mb-8 leading-relaxed max-w-xl mx-auto">
          You can board <strong>after</strong> exchanging the physical ticket at the ticket office of Gwanghwamun Stop.
        </p>

        {/* Steps */}
        <div className="flex items-center justify-center gap-4 md:gap-8">
          {["1", "2", "3"].map((step, i) => (
            <div key={step} className="flex items-center gap-4 md:gap-8">
              <div className="flex flex-col items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#E20021] text-white flex items-center justify-center text-sm font-bold">
                  {step}
                </div>
                <div className="relative w-[90px] h-[90px] md:w-[120px] md:h-[120px]">
                  <Image
                    src={`/imgs/${step}.svg`}
                    alt={`Step ${step}`}
                    fill
                    unoptimized
                    className="object-contain"
                    sizes="120px"
                  />
                </div>
              </div>
              {i < 2 && (
                <TourIcon
                  type="chevron-right"
                  className="w-7 h-7 text-gray-300 flex-shrink-0"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Boarding notices — 2 cards */}
      <div className="flex flex-col md:flex-row gap-4 px-4 md:px-8 pb-6">
        {tour.boardingNotices.map((notice, i) => (
          <div
            key={i}
            className="flex-1 bg-white border border-gray-200 rounded-xl p-5 flex gap-4"
          >
            <TourIcon
              type={notice.iconType}
              className="w-6 h-6 flex-shrink-0 text-[#E20021] mt-0.5"
            />
            <div>
              {notice.lines.map((line, j) => (
                <p key={j} className="text-sm text-[#333] leading-relaxed m-0 mb-1 last:mb-0">
                  {line}
                </p>
              ))}
              {notice.tip && (
                <p className="text-xs text-gray-500 mt-2 m-0 italic">{notice.tip}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Features grid — bus rules + tour tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-gray-100">
        {/* Bus rules */}
        <div className="bg-gray-50 p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-200">
          <h4 className="text-sm font-bold uppercase tracking-widest text-[#E20021] mb-4">
            Bus Features &amp; Rules
          </h4>
          <ul className="list-none p-0 m-0 flex flex-col gap-3">
            {tour.busRules.map((rule, i) => (
              <li key={i} className="flex items-start gap-3">
                <TourIcon type={rule.iconType} className="w-5 h-5 flex-shrink-0 text-[#E20021] mt-0.5" />
                <span className="text-sm text-[#333] leading-relaxed">{rule.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tour tips */}
        <div className="bg-white p-6 md:p-8">
          <h4 className="text-sm font-bold uppercase tracking-widest text-[#E20021] mb-4">
            {tour.tipsTitle}
          </h4>
          <ul className="list-none p-0 m-0 flex flex-col gap-3">
            {tour.tourTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <TourIcon type={tip.iconType} className="w-5 h-5 flex-shrink-0 text-[#E20021] mt-0.5" />
                <span className="text-sm text-[#333] leading-relaxed">{tip.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ── Bus types ── */
function BusTypesSection() {
  const BUS_TYPES = [
    { src: "/imgs/bus-open-top.png", label: "Open-top double-decker bus" },
    { src: "/imgs/bus-glass-top.png", label: "Glass-top double-decker bus" },
    { src: "/imgs/bus-single-decker.png", label: "Semi-open single-decker bus" },
  ];

  return (
    <section id="bus-types" className="mt-2 scroll-mt-[300px]">
      <SectionDivider title="Bus Types" />
      <div className="px-4 md:px-8 py-6">
        <p className="text-sm text-[#555] leading-relaxed mb-6">
          The course may operate with an open double-decker bus, a glass-top double-decker bus, or a semi-open single-decker bus, depending on reservations, traffic, and vehicle availability.
        </p>
        <div className="flex gap-4 overflow-x-auto py-2 pb-4">
          {BUS_TYPES.map(({ src, label }) => (
            <div key={src} className="flex-none w-[280px] md:w-[calc(33.333%-11px)] rounded-xl overflow-hidden bg-gray-100 shrink-0">
              <Image
                src={src}
                alt={label}
                width={560}
                height={350}
                unoptimized
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Timetable ── */
function TimetableSection({ imageUrl }: { imageUrl: string }) {
  return (
    <section id="timetable" className="mt-2 scroll-mt-[300px]">
      <SectionDivider title="Timetable" />
      <div className="px-4 md:px-8 py-6">
        <div className="relative w-full">
          <Image
            src={imageUrl}
            alt="Tour Timetable"
            width={1200}
            height={600}
            unoptimized
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}

/* ── Course map ── */
function CourseMapSection({ mapNotification }: { mapNotification?: string }) {
  return (
    <section id="course-map" className="mt-2 scroll-mt-[300px]">
      <SectionDivider title="Course Map" />
      <div className="px-4 md:px-8 py-6">
        {mapNotification && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 flex gap-3 my-4 rounded-r-lg">
            <TourIcon
              type="info"
              className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5"
            />
            <p className="text-sm text-amber-800 whitespace-pre-line leading-relaxed m-0">
              {mapNotification}
            </p>
          </div>
        )}

        {/* Map placeholder */}
        <div className="bg-gray-100 rounded-xl h-[400px] flex flex-col items-center justify-center gap-3 text-gray-400 my-4">
          <TourIcon type="map" className="w-12 h-12 text-gray-300" />
          <p className="text-lg font-medium m-0">Interactive Map</p>
          <p className="text-sm m-0">Course map coming soon</p>
        </div>

        {/* Stops placeholder */}
        <div className="h-20 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 text-sm mt-4 border border-gray-200">
          Stops carousel coming soon
        </div>
      </div>
    </section>
  );
}

/* ── CTA ── */
function CTASection() {
  return (
    <div className="bg-gray-200 w-full h-40 flex items-center justify-center mt-12">
      <p className="text-2xl text-gray-500">Call to Action — To be reviewed</p>
    </div>
  );
}

/* ── Main export ── */
export default function ToursPageClient() {
  const [activeTourId, setActiveTourId] = useState<TourId>("tour01");

  const tour = TOURS.find((t) => t.id === activeTourId) ?? TOURS[0];

  return (
    <main className="min-h-screen bg-white pt-8 md:pt-12">
      {/* Tab bar */}
      <TourTabBar
        tours={TOURS}
        activeTourId={activeTourId}
        onSelect={setActiveTourId}
      />

      {/* Tour content */}
      <div className="max-w-[1000px] mx-auto">
        {/* A. Header */}
        <TourHeader tour={tour} />

        {/* B. Highlights + carousel */}
        <HighlightsSection key={tour.id} tour={tour} />

        {/* C. Boarding information */}
        <BoardingSection tour={tour} />

        {/* D. Bus types */}
        <BusTypesSection />

        {/* E. Timetable (conditional) */}
        {tour.timetableImage && (
          <TimetableSection imageUrl={tour.timetableImage} />
        )}

        {/* F. Course map */}
        <CourseMapSection mapNotification={tour.mapNotification} />

        {/* G. CTA */}
        <CTASection />
      </div>
    </main>
  );
}
