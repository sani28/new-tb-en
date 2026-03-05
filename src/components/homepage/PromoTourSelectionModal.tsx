/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { usePromoCheckout, TOUR_PRICES, TOUR_META } from "./checkout/PromoCheckoutContext";
import PromoEnhanceSeoulAddonsCarousel from "@/components/homepage/PromoEnhanceSeoulAddonsCarousel";

/* ── Progress indicator ──────────────────────────────────────────────────────── */
type StepStatus = "completed" | "active" | "pending";
function ProgressIndicator({ statuses }: { statuses: StepStatus[] }) {
  return (
    <div className="flex items-center justify-center gap-[10px] py-[18px] px-[18px] border-b border-[#eee] bg-white shrink-0" aria-hidden="true">
      {statuses.map((status, i) => (
        <div key={i} className="flex items-center gap-[10px]">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[14px] border-2 bg-white ${
            status === "completed" ? "border-[#2e7d32] text-[#2e7d32]"
            : status === "active"  ? "border-brand-red text-brand-red"
            :                        "border-[#ddd] text-[#666]"
          }`}>
            {i + 1}
          </div>
          {i < statuses.length - 1 && <div className="w-12 h-0.5 bg-[#e5e5e5]" />}
        </div>
      ))}
    </div>
  );
}

/* ── Mini calendar ───────────────────────────────────────────────────────────── */
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function PromoCalendar({
  selectedDate,
  onSelect,
  onClose,
}: {
  selectedDate: Date | null;
  onSelect: (d: Date) => void;
  onClose: () => void;
}) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const cells: ({ day: number; disabled: boolean; soldOut: boolean } | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(viewYear, viewMonth, d);
    const isPast = date < todayMidnight;
    const isMonday = date.getDay() === 1;
    const soldOut = !isPast && !isMonday && (d + viewMonth + viewYear) % 5 === 0;
    cells.push({ day: d, disabled: isPast || isMonday, soldOut });
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  return (
    <div className="calendar-dropdown promo-calendar-dropdown active">
      <div className="flex justify-between items-center mb-5 relative">
        <button className="bg-transparent border-none text-[20px] p-2 cursor-pointer text-[#666] rounded-full hover:bg-[#f5f5f5]" type="button" onClick={prevMonth} aria-label="Previous month">←</button>
        <h3 className="text-[18px] font-semibold text-[#333] m-0 flex-1 text-center">{MONTH_NAMES[viewMonth]} {viewYear}</h3>
        <button className="bg-transparent border-none text-[20px] p-2 cursor-pointer text-[#666] rounded-full hover:bg-[#f5f5f5]" type="button" onClick={nextMonth} aria-label="Next month">→</button>
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent border-none text-[24px] text-[#666] cursor-pointer w-[30px] h-[30px] flex items-center justify-center rounded-full hover:bg-[#f5f5f5]"
          type="button" onClick={onClose} aria-label="Close"
        >×</button>
      </div>
      <div className="grid grid-cols-7 text-center font-semibold text-[#666] mb-2.5 py-2.5">
        {WEEKDAYS.map(w => <span key={w} className="text-[14px]">{w}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-2 px-1">
        {cells.map((cell, i) => {
          if (!cell) return <span key={`e-${i}`} />;
          const isSelected = selectedDate &&
            selectedDate.getFullYear() === viewYear &&
            selectedDate.getMonth() === viewMonth &&
            selectedDate.getDate() === cell.day;
          const base = "day relative text-center p-2 rounded-full text-sm flex items-center justify-center";
          let cls = base;
          if (cell.disabled) cls += " disabled text-[#999] bg-[#f0f0f0] cursor-not-allowed opacity-60";
          else if (isSelected) cls += " selected bg-[#E20021] text-white cursor-pointer";
          else if (cell.soldOut) cls += " sold-out disabled cursor-not-allowed text-[#999]";
          else cls += " available cursor-pointer hover:bg-gray-100";
          return (
            <span
              key={cell.day}
              className={cls}
              onClick={() => {
                if (cell.disabled || cell.soldOut) return;
                onSelect(new Date(viewYear, viewMonth, cell.day));
                onClose();
              }}
            >
              {cell.day}
              {!cell.disabled && (
                <span className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full dot ${cell.soldOut ? "sold-out bg-[#F44336]" : "available bg-[#4CAF50]"}`} />
              )}
            </span>
          );
        })}
      </div>
      <div className="flex justify-center gap-[30px] mt-5 pt-[15px] border-t border-[#eee]">
        <div className="flex items-center gap-2 text-[14px] text-[#666]">
          <span className="w-2 h-2 rounded-full bg-[#4CAF50]" /><span>Available</span>
        </div>
        <div className="flex items-center gap-2 text-[14px] text-[#666]">
          <span className="w-2 h-2 rounded-full bg-brand-red" /><span>Sold Out</span>
        </div>
      </div>
    </div>
  );
}

/* ── Tour info ────────────────────────────────────────────────────────────────── */
function TourInfoContent({ className, items, tour }: { className: string; items: string[]; tour: string }) {
  return (
    <div className={`tour-info-content ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <ul className="m-0 pl-[18px] text-[#444] text-[13px] leading-[1.5] flex-1">
          {items.map((text, i) => <li key={i}>{text}</li>)}
        </ul>
        <div className="shrink-0">
          <button
            className="promo-tour-map-btn flex items-center gap-[6px] px-4 py-[10px] bg-white border border-brand-red text-brand-red rounded-lg text-[14px] font-medium cursor-pointer hover:bg-brand-red hover:text-white"
            data-tour={tour}
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
            </svg>
            Map
          </button>
        </div>
      </div>
    </div>
  );
}

const TOUR_INFO: Record<string, string[]> = {
  tour01: ["Hop On, Hop Off", "15 stops across Downtown • Palaces • Namsan", "Key stops: Gwanghwamun, Myeongdong, N Seoul Tower, DDP", "Select your tour date below to continue"],
  tour02: ["Panorama Course - scenic views of Seoul", "First Bus: 10:00AM, Last Bus: 5:00PM", "Interval: Every 45 minutes", "Total Course Time: 2 hours"],
  tour04: ["Night View Course (Non Stop)", "8 stops featuring bridges, skyline & city lights", "Key stops: Banpo Bridge, Seongsu Bridge, N Seoul Tower", "Select your tour date below to continue"],
};

/* ── Main component ──────────────────────────────────────────────────────────── */
export default function PromoTourSelectionModal() {
  const {
    step, selectedTourId, selectedDate, adultQty, childQty, tourOptional,
    setSelectedTourId, setSelectedDate, setAdultQty, setChildQty,
    proceedFromTourSelection, skipTourSelection, closeCheckout,
  } = usePromoCheckout();

  const [calendarOpen, setCalendarOpen] = useState(false);

  if (step !== "tourSelection") return null;

  const tourMeta = TOUR_META[selectedTourId] ?? TOUR_META["tour01"]!;
  const prices = TOUR_PRICES[selectedTourId] ?? TOUR_PRICES["tour01"]!;
  const ticketTotal = adultQty * prices.adult + childQty * prices.child;
  const ticketOrigTotal = adultQty * prices.adultOrig + childQty * prices.childOrig;
  const canContinue = !!selectedDate && adultQty + childQty >= 1;

  const dateLabel = selectedDate
    ? selectedDate.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })
    : "Please select a date";

  return (
    <div className="promo-modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) closeCheckout(); }}>
      <div
        className="promo-tour-modal bg-white w-[90%] max-w-[600px] max-h-[90vh] rounded-xl overflow-hidden flex flex-col relative shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="promoTourModalTitle"
      >
        <button
          className="absolute top-[10px] right-[10px] w-[42px] h-[42px] rounded-full border-none bg-black/[0.06] text-[#333] text-[28px] leading-none cursor-pointer z-[2] flex items-center justify-center hover:bg-black/[0.10]"
          type="button" aria-label="Close" onClick={closeCheckout}
        >
          &times;
        </button>

        <div className="flex flex-col h-full min-h-0">
          <ProgressIndicator statuses={["completed", "active", "pending", "pending"]} />

          <div className="popup-scrollable-content">
            {/* Tour display card */}
            <div className="rounded-[14px] overflow-hidden relative bg-[#f5f5f5]">
              <div
                className="absolute top-[14px] left-[14px] px-[10px] py-[6px] rounded-full text-white font-extrabold text-[13px] tracking-[0.5px]"
                style={{ background: tourMeta.labelColor }}
              >
                {tourMeta.label}
              </div>
              {tourMeta.isPopular && (
                <div className="absolute top-[14px] right-[14px] px-[10px] py-[6px] rounded-full bg-black text-white font-extrabold text-[12px]">
                  POPULAR
                </div>
              )}
              <img src={tourMeta.image} alt="Tour" className="w-full h-[280px] object-cover block" />
              <div className="absolute left-0 right-0 bottom-0 px-[14px] py-3 bg-gradient-to-b from-transparent to-black/65 text-white font-extrabold text-[14px] tracking-[0.4px]">
                {tourMeta.title}
              </div>
            </div>

            {/* Details */}
            <div className="pt-4 px-0.5">
              <h2 id="promoTourModalTitle" className="m-0 mb-2 text-[22px] font-bold text-[#111]">Select Your Tour</h2>
              <p className="m-0 mb-[14px] text-[#666] text-[14px] leading-[1.5]">
                Choose a tour to pair with your selected add-on
              </p>

              {/* Tour select */}
              <select
                value={selectedTourId}
                onChange={(e) => setSelectedTourId(e.target.value)}
                className="w-full py-3 px-[14px] rounded-[10px] border border-[#ddd] bg-white text-[14px] font-semibold"
              >
                <option value="tour01">Tour 01 Downtown Palace Namsan Course (Hop On, Hop Off)</option>
                <option value="tour02">Tour 02 Panorama Course</option>
                <option value="tour04">Tour 04 Night View Course (Non Stop)</option>
              </select>

              {/* Tour info panel */}
              <div className="mt-3 p-[12px_14px] border border-[#eee] rounded-xl bg-[#fafafa]" id="promoTourInfoPanel">
                {Object.entries(TOUR_INFO).map(([tourId, items]) => (
                  <TourInfoContent
                    key={tourId}
                    className={`promo-${tourId}-info${selectedTourId === tourId ? " active" : ""}`}
                    items={items}
                    tour={tourId}
                  />
                ))}
              </div>

              {/* Date selector */}
              <div className="mt-4">
                <h3 className="m-0 mb-3 text-[16px] font-semibold text-[#333]">Select Date</h3>
                <div className="relative w-full z-[99999]">
                  <button
                    type="button"
                    className="w-full py-3 px-[15px] bg-white border border-[#E5E5E5] rounded-lg flex justify-between items-center cursor-pointer text-[14px] text-left hover:border-brand-red transition-colors"
                    onClick={() => setCalendarOpen((o) => !o)}
                  >
                    <span className="truncate flex-1">{dateLabel}</span>
                    <img src="/imgs/calendar.svg" alt="" className="w-5 h-5 opacity-70 shrink-0" aria-hidden="true" />
                  </button>
                  {calendarOpen && (
                    <PromoCalendar
                      selectedDate={selectedDate}
                      onSelect={(d) => { setSelectedDate(d); setCalendarOpen(false); }}
                      onClose={() => setCalendarOpen(false)}
                    />
                  )}
                </div>
              </div>

              {/* Ticket selector */}
              <div className="mt-4">
                <h3 className="m-0 mb-3 text-[16px] font-semibold text-[#333]">Select Tickets</h3>
                <div className="bg-white border border-[#E5E5E5] rounded-xl">
                  {/* Adult */}
                  <div className="flex justify-between items-center p-4 border-b border-[#E5E5E5]">
                    <div className="text-[16px] font-medium text-[#333]">Adult</div>
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-end">
                        <span className="text-brand-red font-semibold text-[16px]">${prices.adult.toFixed(2)} USD</span>
                        <span className="text-[#999] line-through text-[14px]">${prices.adultOrig.toFixed(2)} USD</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="w-7 h-7 border border-[#E5E5E5] rounded-full bg-white text-[18px] flex items-center justify-center cursor-pointer hover:bg-[#f5f5f5]" type="button" onClick={() => setAdultQty(Math.max(0, adultQty - 1))}>-</button>
                        <span className="min-w-[24px] text-center text-[16px] font-medium">{adultQty}</span>
                        <button className="w-7 h-7 border border-[#E5E5E5] rounded-full bg-white text-[18px] flex items-center justify-center cursor-pointer hover:bg-[#f5f5f5]" type="button" onClick={() => setAdultQty(Math.min(10, adultQty + 1))}>+</button>
                      </div>
                    </div>
                  </div>
                  {/* Child */}
                  <div className="flex justify-between items-center p-4">
                    <div className="text-[16px] font-medium text-[#333]">Child</div>
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-end">
                        <span className="text-brand-red font-semibold text-[16px]">${prices.child.toFixed(2)} USD</span>
                        <span className="text-[#999] line-through text-[14px]">${prices.childOrig.toFixed(2)} USD</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="w-7 h-7 border border-[#E5E5E5] rounded-full bg-white text-[18px] flex items-center justify-center cursor-pointer hover:bg-[#f5f5f5]" type="button" onClick={() => setChildQty(Math.max(0, childQty - 1))}>-</button>
                        <span className="min-w-[24px] text-center text-[16px] font-medium">{childQty}</span>
                        <button className="w-7 h-7 border border-[#E5E5E5] rounded-full bg-white text-[18px] flex items-center justify-center cursor-pointer hover:bg-[#f5f5f5]" type="button" onClick={() => setChildQty(Math.min(10, childQty + 1))}>+</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="bg-[#f8f9fa] rounded-xl p-5 mt-4 mb-5 border border-[#eee]">
                <div className="flex justify-between items-center gap-3">
                  <div className="text-[18px] font-bold text-[#333]">Total Amount</div>
                  <div className="flex items-center gap-3 flex-wrap justify-end">
                    <span className="text-[24px] font-extrabold text-brand-red">${ticketTotal.toFixed(2)} USD</span>
                    <span className="text-[16px] text-[#888] line-through">${ticketOrigTotal.toFixed(2)} USD</span>
                  </div>
                </div>
              </div>

              {/* Add-on carousel */}
              <PromoEnhanceSeoulAddonsCarousel />
            </div>
          </div>

          {/* Sticky bottom */}
          <div className="sticky bottom-0 bg-white border-t border-[#eee] py-[14px] px-[18px] shrink-0">
            <div className="flex gap-[10px]">
              {tourOptional && (
                <button
                  className="border-none rounded-xl px-4 py-[14px] text-[15px] font-extrabold cursor-pointer flex-1 bg-[#f2f2f2] text-[#333]"
                  type="button"
                  onClick={skipTourSelection}
                >
                  Continue without Tour
                </button>
              )}
              <button
                className="border-none rounded-xl px-4 py-[14px] text-[15px] font-extrabold cursor-pointer flex-1 bg-brand-red text-white disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                disabled={!canContinue}
                onClick={proceedFromTourSelection}
              >
                Continue with Tour
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
