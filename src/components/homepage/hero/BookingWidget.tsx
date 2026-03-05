"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* eslint-disable @next/next/no-img-element */

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TOUR_PRICES: Record<string, { adult: number; child: number }> = {
  tour01: { adult: 27, child: 18 },
  tour02: { adult: 27, child: 18 },
  tour04: { adult: 24, child: 15 },
};

const TOUR_OPTIONS = [
  { value: "tour01", label: "Tour 01 Downtown Palace Namsan Course (Hop On, Hop Off)" },
  { value: "tour02", label: "Tour 02 Panorama Course" },
  { value: "tour04", label: "Tour 04 Night View Course (Non Stop)" },
];

const clamp = (n: number, min = 0, max = 10) => Math.max(min, Math.min(max, n));

type CalendarCell = { day: number; disabled: boolean; soldOut: boolean } | null;

export default function BookingWidget() {
  const [tour, setTour] = useState("tour01");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const calendarRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());

  const prices = TOUR_PRICES[tour] ?? TOUR_PRICES.tour01;

  /* Close calendar on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCalendarOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  /* Calendar grid computation */
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const cells: CalendarCell[] = [];
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

  const prevMonth = useCallback(() => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }, [viewMonth]);

  const nextMonth = useCallback(() => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }, [viewMonth]);

  const isSelected = (d: number) =>
    selectedDate !== null &&
    selectedDate.getFullYear() === viewYear &&
    selectedDate.getMonth() === viewMonth &&
    selectedDate.getDate() === d;

  const onSelectDay = (day: number) => {
    setSelectedDate(new Date(viewYear, viewMonth, day));
    setCalendarOpen(false);
  };

  /* Book action — dispatch event for promo or standard flow */
  const onBook = () => {
    if (document.getElementById("promoTourSelectionModal")) {
      document.dispatchEvent(
        new CustomEvent("tb:openPromoTourSelectionFromHero", {
          detail: { preferredTour: tour },
        }),
      );
      return;
    }
    document.dispatchEvent(
      new CustomEvent("tb:openBookingModal", {
        detail: {
          tour,
          adults: adultCount,
          children: childCount,
          date: selectedDate?.toISOString(),
        },
      }),
    );
  };

  return (
    <div
      className="absolute bottom-[80px] left-1/2 -translate-x-1/2 flex items-center gap-5 bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.95)_100%)] backdrop-blur-[20px] pt-5 pb-5 pl-7 pr-7 rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] border border-white/60 z-[100] transition-[box-shadow] duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15),0_4px_12px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] max-md:relative max-md:bottom-auto max-md:left-auto max-md:w-full max-md:translate-x-0 max-md:rounded-none max-md:pt-4 max-md:pb-4 max-md:pl-7 max-md:pr-7 max-md:bg-white/[0.98] max-md:flex-row max-md:flex-wrap max-md:items-stretch max-md:gap-[10px] max-md:shadow-none max-md:border-t-0 max-md:z-[100] max-md:mt-0 max-[400px]:pl-5 max-[400px]:pr-5"
      role="form"
      aria-label="Tour booking"
    >
      {/* Tour & Date selectors */}
      <div className="flex gap-[15px] items-center max-md:flex max-md:gap-[10px] max-md:w-full max-md:flex-[0_0_100%] max-[400px]:gap-[6px]">
        {/*
          Keep tour-select + date-select CSS class names so that:
          - .tour-select select { background-gradient + SVG arrow } from styles.css still applies
          - Mobile responsive overrides in styles.css still apply
        */}
        <div className="tour-select max-md:w-[70%] max-[400px]:w-[58%]">
          <select
            id="booking-tour-select"
            value={tour}
            onChange={(e) => setTour(e.target.value)}
            aria-label="Select tour"
            className="rounded-[999px] font-sans-medium max-[400px]:p-2 max-[400px]:text-xs max-[400px]:min-h-[40px] max-[400px]:border-[1.5px] max-[400px]:rounded-[10px]"
          >
            {TOUR_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="date-select max-md:w-[30%] max-[400px]:w-[42%]" ref={calendarRef}>
          <div className="relative w-full z-[99999]">
            <button
              className="group w-full min-w-[200px] pt-[14px] pb-[14px] pl-[18px] pr-[18px] bg-[linear-gradient(180deg,#FFFFFF_0%,#FAFAFA_100%)] border-2 border-[#E8E8E8] rounded-[999px] flex justify-between items-center cursor-pointer text-sm font-medium text-[#333] transition-all duration-[250ms] shadow-[0_2px_4px_rgba(0,0,0,0.04)] font-sans-medium hover:border-[#D40004] hover:shadow-[0_4px_8px_rgba(212,0,4,0.1)] focus:outline-none focus:border-[#D40004] focus:shadow-[0_0_0_3px_rgba(212,0,4,0.15)] max-[400px]:p-2 max-[400px]:text-xs max-[400px]:min-h-[40px] max-[400px]:border-[1.5px] max-[400px]:rounded-[10px] max-[400px]:justify-start max-[400px]:gap-[6px]"
              onClick={() => setCalendarOpen((o) => !o)}
              aria-expanded={calendarOpen}
              aria-haspopup="dialog"
              aria-label="Select date"
            >
              <span className="whitespace-nowrap overflow-hidden text-ellipsis text-sm text-[#555] font-sans-medium max-[400px]:text-xs">
                {dateDisplay}
              </span>
              <img
                src="/imgs/calendar.svg"
                alt=""
                className="w-5 h-5 opacity-70 transition-opacity duration-200 group-hover:opacity-100 max-[400px]:w-[14px] max-[400px]:h-[14px]"
                aria-hidden="true"
              />
            </button>

            {calendarOpen && (
              <div className="calendar-dropdown active" role="dialog" aria-label="Date picker">
                <div className="calendar-header">
                  <button className="prev-month" onClick={prevMonth} aria-label="Previous month">
                    &larr;
                  </button>
                  <h3 className="current-month">
                    {MONTH_NAMES[viewMonth]} {viewYear}
                  </h3>
                  <button className="next-month" onClick={nextMonth} aria-label="Next month">
                    &rarr;
                  </button>
                </div>
                <div className="calendar-grid" role="grid">
                  <div className="weekdays" role="row">
                    {WEEKDAYS.map((w) => (
                      <span key={w} role="columnheader">
                        {w}
                      </span>
                    ))}
                  </div>
                  <div className="days">
                    {cells.map((cell, i) => {
                      if (!cell) return <div key={`e-${i}`} className="day empty" />;
                      const cls = [
                        "day",
                        cell.disabled ? "disabled" : "",
                        cell.soldOut ? "sold-out disabled" : "",
                        !cell.disabled && !cell.soldOut ? "available" : "",
                        isSelected(cell.day) ? "selected" : "",
                      ]
                        .filter(Boolean)
                        .join(" ");
                      return (
                        <div
                          key={cell.day}
                          className={cls}
                          role="gridcell"
                          aria-disabled={cell.disabled || cell.soldOut}
                          aria-selected={isSelected(cell.day)}
                          title={
                            new Date(viewYear, viewMonth, cell.day).getDay() === 1
                              ? "Closed on Mondays"
                              : undefined
                          }
                          tabIndex={!cell.disabled && !cell.soldOut ? 0 : -1}
                          onClick={() => {
                            if (cell.disabled || cell.soldOut) return;
                            onSelectDay(cell.day);
                          }}
                          onKeyDown={(e) => {
                            if (cell.disabled || cell.soldOut) return;
                            if (e.key === "Enter") {
                              e.preventDefault();
                              onSelectDay(cell.day);
                            }
                            if (e.key === " " || e.key === "Spacebar") {
                              e.preventDefault();
                              onSelectDay(cell.day);
                            }
                          }}
                        >
                          {cell.day}
                          {!cell.disabled && (
                            <span className={`dot ${cell.soldOut ? "sold-out" : "available"}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="calendar-footer">
                  <div className="availability-legend">
                    <div className="legend-item">
                      <span className="dot available" />
                      <span>Available</span>
                    </div>
                    <div className="legend-item">
                      <span className="dot sold-out" />
                      <span>Sold Out</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Passenger counters */}
      {/*
        max-md:contents makes this div invisible to layout on mobile,
        letting counter-groups become direct flex children of the booking-widget.
      */}
      <div className="flex gap-[15px] max-md:contents">
        <CounterGroup
          label="Adult"
          price={prices.adult}
          count={adultCount}
          onDecrement={() => setAdultCount((c) => clamp(c - 1))}
          onIncrement={() => setAdultCount((c) => clamp(c + 1))}
        />
        <CounterGroup
          label="Child"
          price={prices.child}
          count={childCount}
          onDecrement={() => setChildCount((c) => clamp(c - 1))}
          onIncrement={() => setChildCount((c) => clamp(c + 1))}
        />
      </div>

      <button
        className="bg-brand-red text-white border-0 rounded-[10px] pt-4 pb-4 pl-12 pr-12 cursor-pointer text-[16px] font-bold tracking-[0.2px] whitespace-nowrap transition-all duration-300 relative overflow-hidden uppercase font-copperplate hover:bg-[#C4001C] active:bg-[#A50000] max-md:flex-[1_1_0] max-md:self-stretch max-md:pt-3 max-md:pb-3 max-md:pl-5 max-md:pr-5 max-md:text-[15px] max-md:min-w-[80px]"
        onClick={onBook}
        aria-label="Book tour"
      >
        Book
      </button>
    </div>
  );
}

/* ── Counter sub-component ── */
interface CounterGroupProps {
  label: string;
  price: number;
  count: number;
  onDecrement: () => void;
  onIncrement: () => void;
}

function CounterGroup({ label, price, count, onDecrement, onIncrement }: CounterGroupProps) {
  return (
    <div className="bg-brand-red rounded-[999px] py-3 px-[18px] text-white flex items-center gap-3 font-bold text-[15px] shadow-[0_2px_6px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-[250ms] ease-in-out hover:bg-[#C4001C] hover:shadow-[0_3px_8px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.7)] max-md:flex-[0_1_auto] max-md:py-[5px] max-md:px-[6px] max-md:gap-1 max-md:min-w-0 max-md:overflow-hidden">
      <label className="font-semibold mr-2 uppercase text-[13px] tracking-[0.5px] text-white/[0.92] max-md:text-[9px] max-md:font-bold max-md:tracking-[0.3px] max-md:mr-0">
        {label}
      </label>
      <div className="flex flex-col">
        <span className="text-[20px] font-extrabold text-white whitespace-nowrap max-md:hidden">
          ${price} USD
        </span>
        <div
          className="flex items-center gap-2 bg-black/[0.06] py-1 px-2 rounded-[10px] max-md:gap-0.5 max-md:p-0.5 max-md:rounded-[5px]"
          role="group"
          aria-label={`${label} count`}
        >
          <button
            className="bg-white/95 border-0 text-[#333] cursor-pointer text-lg font-semibold p-0 flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 hover:bg-white hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed max-md:text-xs max-md:w-[18px] max-md:h-[18px] max-md:rounded"
            onClick={onDecrement}
            aria-label={`Decrease ${label.toLowerCase()} count`}
            disabled={count === 0}
          >
            -
          </button>
          <span className="min-w-6 text-center font-bold text-[16px] max-md:min-w-[10px] max-md:text-[11px]" aria-live="polite">
            {count}
          </span>
          <button
            className="bg-white/95 border-0 text-[#333] cursor-pointer text-lg font-semibold p-0 flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 hover:bg-white hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed max-md:text-xs max-md:w-[18px] max-md:h-[18px] max-md:rounded"
            onClick={onIncrement}
            aria-label={`Increase ${label.toLowerCase()} count`}
            disabled={count === 10}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
