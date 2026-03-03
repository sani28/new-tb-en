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
    <div className="booking-widget" role="form" aria-label="Tour booking">
      {/* Tour & Date selectors */}
      <div className="select-container">
        <div className="tour-select">
          <select
            id="booking-tour-select"
            value={tour}
            onChange={(e) => setTour(e.target.value)}
            aria-label="Select tour"
          >
            {TOUR_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="date-select" ref={calendarRef}>
          <div className="date-picker-wrapper">
            <button
              className="date-picker-trigger"
              onClick={() => setCalendarOpen((o) => !o)}
              aria-expanded={calendarOpen}
              aria-haspopup="dialog"
              aria-label="Select date"
            >
              <span className="selected-date">{dateDisplay}</span>
              <img src="/imgs/calendar.svg" alt="" className="calendar-icon" aria-hidden="true" />
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
      <div className="passenger-counter">
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

      <button className="book-now" onClick={onBook} aria-label="Book tour">
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
    <div className="counter-group">
      <label>{label}</label>
      <div className="counter-info">
        <span className="price">${price} USD</span>
        <div className="counter" role="group" aria-label={`${label} count`}>
          <button
            className="decrease"
            style={{ opacity: count === 0 ? 0.3 : 1 }}
            onClick={onDecrement}
            aria-label={`Decrease ${label.toLowerCase()} count`}
            disabled={count === 0}
          >
            -
          </button>
          <span className="count" aria-live="polite">
            {count}
          </span>
          <button
            className="increase"
            style={{ opacity: count === 10 ? 0.3 : 1 }}
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
