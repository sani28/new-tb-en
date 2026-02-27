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
        if (!isNaN(parsed.getTime())) { setSelectedDate(parsed); setViewMonth(parsed.getMonth()); setViewYear(parsed.getFullYear()); }
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
    return () => { document.removeEventListener("keydown", onKey); document.body.classList.remove("booking-modal-open"); };
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

  const prevMonth = () => { if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); } else setViewMonth(m => m + 1); };

  const onContinue = () => {
    if (adultCount + childCount <= 0) { alert("Please select at least 1 passenger."); return; }
    if (!selectedDate) { alert("Please select a date."); setCalendarOpen(true); return; }
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    window.location.href = `/booking?${new URLSearchParams({ tour, date: `${y}-${m}-${day}`, adults: String(adultCount), children: String(childCount) })}`;
  };

  const isSelected = (d: number) =>
    selectedDate !== null && selectedDate.getFullYear() === viewYear && selectedDate.getMonth() === viewMonth && selectedDate.getDate() === d;

  return (
    <div className={`modal-overlay${isOpen ? " active" : ""}`} id="bookingModal" aria-hidden={!isOpen}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="bookingModalTitle">
        <div className="modal-header">
          <h3 id="bookingModalTitle">Cart Reservation</h3>
          <button className="close-modal" aria-label="Close" onClick={close}>&times;</button>
        </div>
        <div className="booking-container">
          <div className="step-title-section">
            <div className="step-number">1</div>
            <div className="step-title">Select Your Items</div>
          </div>

          <div className="tour-selector">
            <select id="tourSelect" value={tour} onChange={(e) => setTour(e.target.value)}>
              <option value="tour01">Tour 01 Downtown Palace Namsan Course (Hop On, Hop Off)</option>
              <option value="tour02">Tour 02 Panorama Course</option>
              <option value="tour04">Tour 04 Night View Course (Non Stop)</option>
            </select>
          </div>

          <div className="date-selector">
            <div className="date-picker-wrapper">
              <button className="date-picker-trigger modal-date-trigger" type="button" onClick={() => setCalendarOpen(o => !o)}>
                <span id="selectedDateDisplay" className="selected-date">{dateDisplay}</span>
                <img src="/imgs/calendar.svg" alt="Calendar" className="calendar-icon" />
              </button>
              {calendarOpen && (
                <div className="calendar-dropdown modal-calendar active">
                  <div className="calendar-header">
                    <button className="prev-month" type="button" onClick={prevMonth}>←</button>
                    <h3 className="current-month">{MONTH_NAMES[viewMonth]} {viewYear}</h3>
                    <button className="next-month" type="button" onClick={nextMonth}>→</button>
                    <button className="close-calendar" type="button" aria-label="Close" onClick={() => setCalendarOpen(false)}>&times;</button>
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

          <div className="ticket-selection">
            {/* Adult */}
            <div className="ticket-type">
              <div className="ticket-info"><div className="ticket-label">Adult</div></div>
              <div className="price-counter">
                <div className="price">
                  <span className="current-price">${prices.adult.toFixed(2)} USD</span>
                  <span className="original-price">${prices.adultOrig.toFixed(2)} USD</span>
                </div>
                <div className="counter">
                  <button className="minus" type="button" onClick={() => setAdultCount(c => clamp(c - 1))}>-</button>
                  <input type="number" value={adultCount} min={0} max={10} readOnly />
                  <button className="plus" type="button" onClick={() => setAdultCount(c => clamp(c + 1))}>+</button>
                </div>
              </div>
            </div>
            {/* Child */}
            <div className="ticket-type">
              <div className="ticket-info"><div className="ticket-label">Child</div></div>
              <div className="price-counter">
                <div className="price">
                  <span className="current-price">${prices.child.toFixed(2)} USD</span>
                  <span className="original-price">${prices.childOrig.toFixed(2)} USD</span>
                </div>
                <div className="counter">
                  <button className="minus" type="button" onClick={() => setChildCount(c => clamp(c - 1))}>-</button>
                  <input type="number" value={childCount} min={0} max={10} readOnly />
                  <button className="plus" type="button" onClick={() => setChildCount(c => clamp(c + 1))}>+</button>
                </div>
              </div>
            </div>
            <div className="total-summary">
              <div className="ticket-total">
                <div className="total-label">Total Amount</div>
                <div className="total-price">
                  <span className="current-total">${currentTotal.toFixed(2)} USD</span>
                  <span className="original-total">${originalTotal.toFixed(2)} USD</span>
                </div>
              </div>
            </div>
          </div>

          <button className="continue-btn" id="step1ContinueBtn" type="button" onClick={onContinue}>Continue</button>
        </div>
      </div>
    </div>
  );
}

