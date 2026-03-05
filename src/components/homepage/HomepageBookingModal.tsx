/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useState } from "react";

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const TOUR_PRICES: Record<string, { adult: number; adultOrig: number; child: number; childOrig: number }> = {
  tour01: { adult: 20, adultOrig: 27, child: 14, childOrig: 18 },
  tour02: { adult: 22, adultOrig: 29, child: 15, childOrig: 20 },
  tour04: { adult: 18, adultOrig: 24, child: 12, childOrig: 16 },
};

const clamp = (n: number) => Math.max(0, Math.min(10, n));

export default function HomepageBookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [tour, setTour] = useState("tour01");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());

  /* Listen for open event from hero booking widget */
  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent).detail ?? {};
      if (d.tour) setTour(d.tour);
      if (typeof d.adults === "number") setAdultCount(d.adults);
      if (typeof d.children === "number") setChildCount(d.children);
      if (d.date) {
        const parsed = new Date(d.date);
        if (!isNaN(parsed.getTime())) {
          setSelectedDate(parsed);
          setViewMonth(parsed.getMonth());
          setViewYear(parsed.getFullYear());
        }
      }
      setIsOpen(true);
    };
    document.addEventListener("tb:openBookingModal", handler);
    return () => document.removeEventListener("tb:openBookingModal", handler);
  }, []);

  /* Body class + escape key */
  useEffect(() => {
    if (isOpen) document.body.classList.add("booking-modal-open");
    else document.body.classList.remove("booking-modal-open");
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && isOpen) setIsOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("booking-modal-open");
    };
  }, [isOpen]);

  const close = useCallback(() => { setIsOpen(false); setCalendarOpen(false); }, []);

  const prices = TOUR_PRICES[tour] ?? TOUR_PRICES.tour01;
  const currentTotal = adultCount * prices.adult + childCount * prices.child;
  const originalTotal = adultCount * prices.adultOrig + childCount * prices.childOrig;

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
    : "Please select a date";

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const onContinue = () => {
    if (adultCount + childCount <= 0) { alert("Please select at least 1 passenger."); return; }
    if (!selectedDate) { alert("Please select a date."); setCalendarOpen(true); return; }
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    window.location.href = `/booking?${new URLSearchParams({ tour, date: `${y}-${m}-${day}`, adults: String(adultCount), children: String(childCount) })}`;
  };

  const isSelected = (d: number) =>
    selectedDate !== null &&
    selectedDate.getFullYear() === viewYear &&
    selectedDate.getMonth() === viewMonth &&
    selectedDate.getDate() === d;

  if (!isOpen) return null;

  return (
    /* Overlay */
    <div
      id="bookingModal"
      className="fixed inset-0 bg-black/50 z-[2000] overflow-y-auto flex items-start justify-center pt-6 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      aria-modal="true"
    >
      {/* Modal card */}
      <div
        className="relative w-full max-w-[600px] mx-auto my-10 bg-white rounded-xl overflow-hidden"
        role="dialog"
        aria-labelledby="bookingModalTitle"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-[#eee]">
          <h3 id="bookingModalTitle" className="text-[18px] font-semibold text-[#333] m-0">
            Cart Reservation
          </h3>
          <button
            className="bg-transparent border-none text-[24px] cursor-pointer text-[#666] leading-none"
            aria-label="Close"
            onClick={close}
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-brand-red text-white rounded-full flex items-center justify-center font-semibold text-[14px] shrink-0">
              1
            </div>
            <div className="text-[16px] font-semibold text-[#333]">Select Your Items</div>
          </div>

          {/* Tour selector */}
          <div className="mb-5">
            <select
              id="tourSelect"
              value={tour}
              onChange={(e) => setTour(e.target.value)}
              className="w-full py-3 px-[15px] border border-[#ddd] rounded text-[16px] bg-white"
            >
              <option value="tour01">Tour 01 Downtown Palace Namsan Course (Hop On, Hop Off)</option>
              <option value="tour02">Tour 02 Panorama Course</option>
              <option value="tour04">Tour 04 Night View Course (Non Stop)</option>
            </select>
          </div>

          {/* Date picker */}
          <div className="mb-5 relative">
            <button
              className="w-full py-3 px-[15px] bg-white border border-[#E5E5E5] rounded-lg flex justify-between items-center cursor-pointer text-[16px] text-left"
              type="button"
              onClick={() => setCalendarOpen(o => !o)}
              aria-expanded={calendarOpen}
              aria-haspopup="dialog"
            >
              <span id="selectedDateDisplay">{dateDisplay}</span>
              <img src="/imgs/calendar.svg" alt="Calendar" className="w-5 h-5 opacity-70" />
            </button>

            {/* Modal calendar — fixed centered overlay */}
            {calendarOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 bg-black/30 z-[1999]"
                  onClick={() => setCalendarOpen(false)}
                />
                <div
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[350px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] z-[2000]"
                  role="dialog"
                  aria-label="Date picker"
                >
                  {/* Calendar header */}
                  <div className="p-[15px] border-b border-[#E5E5E5] flex items-center relative">
                    <button
                      className="bg-transparent border-none text-[20px] p-2 cursor-pointer text-[#666] rounded-full transition-colors hover:bg-[#f5f5f5]"
                      type="button"
                      onClick={prevMonth}
                      aria-label="Previous month"
                    >
                      ←
                    </button>
                    <h3 className="flex-1 text-center text-[18px] font-semibold text-[#333] m-0">
                      {MONTH_NAMES[viewMonth]} {viewYear}
                    </h3>
                    <button
                      className="bg-transparent border-none text-[20px] p-2 cursor-pointer text-[#666] rounded-full transition-colors hover:bg-[#f5f5f5]"
                      type="button"
                      onClick={nextMonth}
                      aria-label="Next month"
                    >
                      →
                    </button>
                    <button
                      className="absolute right-[10px] top-2 bg-transparent border-none text-[24px] text-[#666] cursor-pointer p-[5px] flex items-center justify-center w-[30px] h-[30px] rounded-full transition-colors hover:bg-[#f5f5f5] z-[2]"
                      type="button"
                      aria-label="Close calendar"
                      onClick={() => setCalendarOpen(false)}
                    >
                      &times;
                    </button>
                  </div>

                  {/* Calendar grid */}
                  <div className="p-4" role="grid">
                    <div className="grid grid-cols-7 text-center font-semibold text-[#666] mb-2.5 py-2.5" role="row">
                      {WEEKDAYS.map(w => (
                        <span key={w} className="text-[14px]" role="columnheader">{w}</span>
                      ))}
                    </div>
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
                        ].filter(Boolean).join(" ");
                        return (
                          <div
                            key={cell.day}
                            className={dayCls}
                            role="gridcell"
                            aria-disabled={cell.disabled || cell.soldOut}
                            aria-selected={sel}
                            title={new Date(viewYear, viewMonth, cell.day).getDay() === 1 ? "Closed on Mondays" : undefined}
                            tabIndex={!cell.disabled && !cell.soldOut ? 0 : -1}
                            onClick={() => {
                              if (cell.disabled || cell.soldOut) return;
                              setSelectedDate(new Date(viewYear, viewMonth, cell.day));
                              setCalendarOpen(false);
                            }}
                            onKeyDown={(e) => {
                              if (cell.disabled || cell.soldOut) return;
                              if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                                e.preventDefault();
                                setSelectedDate(new Date(viewYear, viewMonth, cell.day));
                                setCalendarOpen(false);
                              }
                            }}
                          >
                            {cell.day}
                            {!cell.disabled && (
                              <span className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${cell.soldOut ? "bg-brand-red" : "bg-[#4CAF50]"}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Availability legend */}
                  <div className="flex justify-center gap-[30px] py-[15px] px-5 border-t border-[#eee]">
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
              </>
            )}
          </div>

          {/* Ticket selection */}
          <div className="bg-white border border-[#E5E5E5] rounded-xl mb-6">
            {/* Adult */}
            <div className="flex justify-between items-center p-4 border-b border-[#E5E5E5]">
              <div className="flex-1">
                <div className="text-[16px] font-medium text-[#333]">Adult</div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-brand-red font-semibold text-[16px]">${prices.adult.toFixed(2)} USD</span>
                  <span className="text-[#999] line-through text-[14px]">${prices.adultOrig.toFixed(2)} USD</span>
                </div>
                <div className="flex items-center gap-3" role="group" aria-label="Adult count">
                  <button
                    className="w-7 h-7 border border-[#E5E5E5] rounded-full bg-white text-[18px] flex items-center justify-center cursor-pointer hover:bg-[#f5f5f5] disabled:opacity-40 disabled:cursor-not-allowed"
                    type="button"
                    onClick={() => setAdultCount(c => clamp(c - 1))}
                    disabled={adultCount === 0}
                    aria-label="Decrease adult count"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={adultCount}
                    min={0}
                    max={10}
                    readOnly
                    className="w-6 text-center border-none text-[16px] font-medium"
                    aria-live="polite"
                  />
                  <button
                    className="w-7 h-7 border border-[#E5E5E5] rounded-full bg-white text-[18px] flex items-center justify-center cursor-pointer hover:bg-[#f5f5f5] disabled:opacity-40 disabled:cursor-not-allowed"
                    type="button"
                    onClick={() => setAdultCount(c => clamp(c + 1))}
                    disabled={adultCount === 10}
                    aria-label="Increase adult count"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Child */}
            <div className="flex justify-between items-center p-4">
              <div className="flex-1">
                <div className="text-[16px] font-medium text-[#333]">Child</div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-brand-red font-semibold text-[16px]">${prices.child.toFixed(2)} USD</span>
                  <span className="text-[#999] line-through text-[14px]">${prices.childOrig.toFixed(2)} USD</span>
                </div>
                <div className="flex items-center gap-3" role="group" aria-label="Child count">
                  <button
                    className="w-7 h-7 border border-[#E5E5E5] rounded-full bg-white text-[18px] flex items-center justify-center cursor-pointer hover:bg-[#f5f5f5] disabled:opacity-40 disabled:cursor-not-allowed"
                    type="button"
                    onClick={() => setChildCount(c => clamp(c - 1))}
                    disabled={childCount === 0}
                    aria-label="Decrease child count"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={childCount}
                    min={0}
                    max={10}
                    readOnly
                    className="w-6 text-center border-none text-[16px] font-medium"
                    aria-live="polite"
                  />
                  <button
                    className="w-7 h-7 border border-[#E5E5E5] rounded-full bg-white text-[18px] flex items-center justify-center cursor-pointer hover:bg-[#f5f5f5] disabled:opacity-40 disabled:cursor-not-allowed"
                    type="button"
                    onClick={() => setChildCount(c => clamp(c + 1))}
                    disabled={childCount === 10}
                    aria-label="Increase child count"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Total summary */}
          <div className="bg-[#f8f9fa] rounded-xl p-5 mb-5 border border-[#eee]">
            <div className="flex justify-between items-center">
              <div className="text-[18px] font-bold text-[#333]">Total Amount</div>
              <div className="flex items-center gap-3">
                <span className="text-[24px] font-extrabold text-brand-red">
                  ${currentTotal.toFixed(2)} USD
                </span>
                {originalTotal > currentTotal && (
                  <span className="text-[16px] text-[#888] line-through">
                    ${originalTotal.toFixed(2)} USD
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Continue */}
          <button
            id="step1ContinueBtn"
            className="w-full py-4 bg-brand-red text-white border-none rounded-lg text-[18px] font-semibold cursor-pointer mb-6 transition-colors hover:bg-brand-dark-red"
            type="button"
            onClick={onContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
