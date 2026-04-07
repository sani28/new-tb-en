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

type Cell = { day: number; disabled: boolean; soldOut: boolean } | null;

function getDayCls(cell: NonNullable<Cell>, selected: boolean): string {
  const base = "p-2.5 text-center rounded-full relative flex items-center justify-center text-sm";
  if (cell.disabled) return `${base} text-[#999] bg-[#f0f0f0] cursor-not-allowed opacity-60`;
  if (selected) return `${base} bg-[#E20021] text-white cursor-pointer`;
  if (cell.soldOut) return `${base} cursor-not-allowed`;
  return `${base} cursor-pointer hover:bg-gray-100`;
}

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
    <div className="mb-5">
      <div className="relative w-full" ref={wrapperRef}>
        {/* Trigger */}
        <div
          className="w-full px-4 py-3.5 border border-[#ddd] rounded-lg bg-white flex justify-between items-center cursor-pointer text-[15px] box-border"
          id="date-trigger"
          onClick={() => setIsOpen((o) => !o)}
        >
          <span>{displayText}</span>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-[350px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] z-50 mt-2 p-4 box-border"
            id="calendar-dropdown"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                className="bg-transparent border-0 cursor-pointer text-lg p-2"
                onClick={prevMonth}
              >←</button>
              <span className="text-base font-semibold" id="current-month">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <button
                className="bg-transparent border-0 cursor-pointer text-lg p-2"
                onClick={nextMonth}
              >→</button>
            </div>

            {/* Weekday labels */}
            <div className="grid grid-cols-7 text-center mb-2">
              {WEEKDAYS.map((d) => (
                <span key={d} className="text-xs text-[#666] p-2">{d}</span>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-1" id="calendar-days">
              {cells.map((cell, i) => {
                if (!cell) return <span key={`empty-${i}`} />;
                const selected = isSelected(cell.day);
                return (
                  <span
                    key={cell.day}
                    className={getDayCls(cell, selected)}
                    onClick={() => {
                      if (cell.disabled || cell.soldOut) return;
                      onDateSelect(new Date(viewYear, viewMonth, cell.day));
                      setIsOpen(false);
                    }}
                  >
                    {cell.day}
                    {!cell.disabled && (
                      <span
                        className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full ${
                          cell.soldOut ? "bg-[#F44336]" : "bg-[#4CAF50]"
                        }`}
                      />
                    )}
                  </span>
                );
              })}
            </div>

            {/* Footer legend */}
            <div className="mt-4 pt-4 border-t border-[#eee]">
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-xs text-[#666]">
                  <span className="w-2 h-2 rounded-full bg-[#4CAF50]" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#666]">
                  <span className="w-2 h-2 rounded-full bg-[#F44336]" />
                  <span>Sold Out</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
