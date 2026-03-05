"use client";

import { useEffect, useRef, useState } from "react";

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

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else { setViewMonth((m) => m - 1); }
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else { setViewMonth((m) => m + 1); }
  };

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
      className={
        "w-full relative z-[100] flex flex-wrap items-stretch gap-2 rounded-none bg-white/95 px-5 py-4 shadow-none backdrop-blur-xl " +
        "md:absolute md:bottom-20 md:left-1/2 md:w-auto md:-translate-x-1/2 md:flex-nowrap md:items-center md:gap-5 md:rounded-[20px] md:border md:border-white/60 " +
        "md:bg-gradient-to-br md:from-white/98 md:to-white/95 md:px-7 md:py-5 " +
        "md:shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] " +
        "md:hover:shadow-[0_12px_40px_rgba(0,0,0,0.15),0_4px_12px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] md:transition-shadow"
      }
      role="form"
      aria-label="Tour booking"
    >
      {/* Tour & Date selectors */}
      <div className="flex basis-full items-center gap-2 md:basis-auto md:gap-4 max-[400px]:gap-1.5">
        {/* Tour select */}
        <div className="min-w-0 w-[70%] max-[400px]:w-[58%] md:w-auto">
          <select
            id="booking-tour-select"
            value={tour}
            onChange={(e) => setTour(e.target.value)}
            aria-label="Select tour"
            className={
              "w-full min-w-0 min-h-11 cursor-pointer rounded-full border-2 border-[#E8E8E8] bg-gradient-to-b from-white to-[#FAFAFA] " +
              "px-4 py-3.5 pr-10 text-[14px] font-[var(--font-sans-medium)] text-[var(--color-text-dark)] shadow-sm transition-colors " +
              "hover:border-[#D40004] focus:border-[#D40004] focus:outline-none focus:ring-4 focus:ring-[#D40004]/15 " +
              "md:min-w-[350px] " +
              "max-md:px-3 max-md:py-3 max-md:text-[13px] " +
              "max-[400px]:min-h-10 max-[400px]:px-2 max-[400px]:py-2 max-[400px]:text-[12px]"
            }
          >
            {TOUR_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date picker */}
        <div className="relative min-w-0 w-[30%] max-[400px]:w-[42%] md:w-auto z-[99999]" ref={calendarRef}>
          <button
            onClick={() => setCalendarOpen((o) => !o)}
            aria-expanded={calendarOpen}
            aria-haspopup="dialog"
            aria-label="Select date"
            type="button"
            className={
              "flex w-full min-w-0 min-h-11 items-center justify-between gap-2 rounded-full border-2 border-[#E8E8E8] " +
              "bg-gradient-to-b from-white to-[#FAFAFA] px-4 py-3.5 text-left text-[14px] font-[var(--font-sans-medium)] " +
              "text-[var(--color-text-dark)] shadow-sm transition-colors hover:border-[#D40004] " +
              "focus:border-[#D40004] focus:outline-none focus:ring-4 focus:ring-[#D40004]/15 " +
              "max-md:px-3 max-md:py-3 max-md:text-[13px] " +
              "max-[400px]:min-h-10 max-[400px]:px-2 max-[400px]:py-2 max-[400px]:text-[12px] " +
              "max-[400px]:justify-start max-[400px]:gap-1.5"
            }
          >
            <span className="min-w-0 flex-1 truncate">{dateDisplay}</span>
            <img
              src="/imgs/calendar.svg"
              alt=""
              className="h-4 w-4 shrink-0 opacity-70 max-[400px]:h-3.5 max-[400px]:w-3.5"
              aria-hidden="true"
            />
          </button>

          {/* Calendar dropdown — conditionally rendered (no display:none toggle needed) */}
          {calendarOpen && (
            <div
              className={
                "absolute top-[calc(100%+8px)] left-0 w-[350px] bg-white rounded-2xl p-5 " +
                "shadow-[0_8px_32px_rgba(0,0,0,0.15),0_2px_8px_rgba(0,0,0,0.1)] z-[100001] " +
                "max-md:fixed max-md:top-1/2 max-md:left-1/2 max-md:-translate-x-1/2 max-md:-translate-y-1/2 " +
                "max-md:w-[90%] max-md:max-w-[350px] max-md:max-h-[90vh] max-md:overflow-y-auto max-md:z-[999999]"
              }
              role="dialog"
              aria-label="Date picker"
            >
              {/* Header — month navigation */}
              <div className="flex justify-between items-center mb-5">
                <button
                  className="bg-transparent border-none text-[20px] cursor-pointer px-3 py-2 rounded text-[#666] transition-colors hover:bg-[#f5f5f5]"
                  onClick={prevMonth}
                  aria-label="Previous month"
                >
                  &larr;
                </button>
                <h3 className="text-[18px] font-semibold text-[#333] m-0">
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </h3>
                <button
                  className="bg-transparent border-none text-[20px] cursor-pointer px-3 py-2 rounded text-[#666] transition-colors hover:bg-[#f5f5f5]"
                  onClick={nextMonth}
                  aria-label="Next month"
                >
                  &rarr;
                </button>
              </div>

              {/* Grid */}
              <div role="grid">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 text-center font-semibold text-[#666] mb-2.5 py-2.5" role="row">
                  {WEEKDAYS.map((w) => (
                    <span key={w} className="text-[14px]" role="columnheader">
                      {w}
                    </span>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-2 px-1">
                  {cells.map((cell, i) => {
                    if (!cell) return <div key={`e-${i}`} className="aspect-square" />;

                    const sel = isSelected(cell.day);
                    const dayCls = [
                      "aspect-square flex flex-col items-center justify-center rounded-full relative p-2 text-[14px] transition-colors",
                      cell.disabled
                        ? "text-[#999] bg-[#f0f0f0] cursor-not-allowed opacity-60 pointer-events-none"
                        : cell.soldOut
                          ? "text-[#ccc] cursor-not-allowed"
                          : "cursor-pointer hover:bg-[#f5f5f5]",
                      sel ? "!bg-brand-red !text-white" : "",
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <div
                        key={cell.day}
                        className={dayCls}
                        role="gridcell"
                        aria-disabled={cell.disabled || cell.soldOut}
                        aria-selected={sel}
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
                          if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                            e.preventDefault();
                            onSelectDay(cell.day);
                          }
                        }}
                      >
                        {cell.day}
                        {!cell.disabled && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${cell.soldOut ? "bg-brand-red" : "bg-[#4CAF50]"}`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer — availability legend */}
              <div className="flex justify-center gap-[30px] mt-5 pt-[15px] border-t border-[#eee]">
                <div className="flex items-center gap-2 text-[14px] text-[#666]">
                  <span className="w-2 h-2 rounded-full inline-block bg-[#4CAF50]" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2 text-[14px] text-[#666]">
                  <span className="w-2 h-2 rounded-full inline-block bg-brand-red" />
                  <span>Sold Out</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Passenger counters */}
      <div className="shrink-0 flex items-center gap-1.5 md:flex md:items-center md:gap-[15px]">
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
        className={
          "flex-1 min-w-0 rounded-[10px] py-3 text-[14px] bg-[var(--color-brand-red)] " +
          "font-[var(--font-copperplate)] font-bold uppercase tracking-[0.3px] text-white transition-colors " +
          "hover:bg-[#C4001C] " +
          "md:flex-none md:shrink-0 md:min-w-[140px] md:self-stretch md:px-12 md:py-4 md:text-[16px] md:tracking-[0.2px]"
        }
        onClick={onBook}
        aria-label="Book tour"
        type="button"
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
    <div
      className={
        "shrink-0 flex items-center gap-1.5 overflow-hidden rounded-full bg-[var(--color-brand-red)] px-3 py-2.5 text-white shadow-sm " +
        "md:flex-[0_1_auto] md:gap-3 md:px-[18px] md:py-3 md:shadow-[0_2px_6px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.6)] md:hover:bg-[#C4001C] md:transition-colors"
      }
    >
      <div className="flex flex-col items-start md:flex-row md:items-center md:gap-3">
        <label className="text-[9px] font-bold uppercase tracking-[0.5px] text-white/90 md:text-[13px] md:font-semibold md:tracking-[0.5px]">
          {label}
        </label>
        <span className="hidden whitespace-nowrap text-white md:inline md:text-[20px] md:font-extrabold">
          ${price} USD
        </span>
      </div>
      <div
        className="flex items-center gap-1 rounded-[5px] bg-black/10 p-0.5 md:gap-2 md:rounded-[10px] md:bg-black/5 md:px-2 md:py-1"
        role="group"
        aria-label={`${label} count`}
      >
        <button
          className={
            "grid h-[18px] w-[18px] place-items-center rounded-[4px] bg-white/95 text-[12px] font-semibold text-[var(--color-text-dark)] " +
            "transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 " +
            "md:h-7 md:w-7 md:rounded-[8px] md:text-[18px] md:hover:scale-110 md:transition-transform " +
            "max-[400px]:!text-[11px]"
          }
          onClick={onDecrement}
          aria-label={`Decrease ${label.toLowerCase()} count`}
          disabled={count === 0}
          type="button"
        >
          -
        </button>
        <span
          className="min-w-[10px] text-center text-[11px] font-bold md:min-w-6 md:text-[16px]"
          aria-live="polite"
        >
          {count}
        </span>
        <button
          className={
            "grid h-[18px] w-[18px] place-items-center rounded-[4px] bg-white/95 text-[12px] font-semibold text-[var(--color-text-dark)] " +
            "transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 " +
            "md:h-7 md:w-7 md:rounded-[8px] md:text-[18px] md:hover:scale-110 md:transition-transform " +
            "max-[400px]:!text-[11px]"
          }
          onClick={onIncrement}
          aria-label={`Increase ${label.toLowerCase()} count`}
          disabled={count === 10}
          type="button"
        >
          +
        </button>
      </div>
    </div>
  );
}
