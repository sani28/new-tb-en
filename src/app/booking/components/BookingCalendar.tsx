"use client";

import { useEffect, useRef, useState } from "react";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Props = {
  selectedDate: Date | null;
  onDateSelect: (d: Date) => void;
};

export default function BookingCalendar({ selectedDate, onDateSelect }: Props) {
  const today = new Date();
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };

  // Build day grid cells
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  type Cell = { day: number; disabled: boolean; soldOut: boolean } | null;
  const cells: Cell[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(viewYear, viewMonth, d);
    const isPast = cellDate < todayMidnight;
    const isMonday = cellDate.getDay() === 1; // tours closed Mondays
    // Deterministic availability pattern (placeholder until real API)
    const soldOut = !isMonday && !isPast && (d + viewMonth + viewYear) % 5 === 0;
    cells.push({ day: d, disabled: isPast || isMonday, soldOut });
  }

  const displayText = selectedDate
    ? selectedDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "Select a date";

  const isSelected = (day: number) =>
    selectedDate !== null &&
    selectedDate.getFullYear() === viewYear &&
    selectedDate.getMonth() === viewMonth &&
    selectedDate.getDate() === day;

  return (
    <div className="date-selector">
      <div className="date-picker-wrapper" ref={wrapperRef}>
        <div className="date-picker-trigger" id="date-trigger" onClick={() => setIsOpen((o) => !o)}>
          <span className="selected-date">{displayText}</span>
          <svg className="calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>

        {isOpen && (
          <div className="calendar-dropdown" id="calendar-dropdown">
            <div className="calendar-header">
              <button className="prev-month" onClick={prevMonth}>←</button>
              <span className="current-month" id="current-month">{MONTH_NAMES[viewMonth]} {viewYear}</span>
              <button className="next-month" onClick={nextMonth}>→</button>
            </div>
            <div className="weekdays">
              {WEEKDAYS.map((d) => <span key={d}>{d}</span>)}
            </div>
            <div className="days" id="calendar-days">
              {cells.map((cell, i) => {
                if (!cell) return <span key={`empty-${i}`} className="day empty" />;
                const cls = [
                  "day",
                  cell.disabled ? "disabled" : "",
                  cell.soldOut ? "sold-out" : "",
                  isSelected(cell.day) ? "selected" : "",
                ].filter(Boolean).join(" ");
                return (
                  <span
                    key={cell.day}
                    className={cls}
                    onClick={() => {
                      if (cell.disabled || cell.soldOut) return;
                      onDateSelect(new Date(viewYear, viewMonth, cell.day));
                      setIsOpen(false);
                    }}
                  >
                    {cell.day}
                    {!cell.disabled && (
                      <span className={`dot ${cell.soldOut ? "sold-out" : "available"}`} />
                    )}
                  </span>
                );
              })}
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
  );
}

