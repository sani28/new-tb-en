"use client";

import { useEffect } from "react";

type BookingWindow = Window & {
  __tbBookingState?: {
    selectedDate?: unknown;
  };
};

function formatSelectedDate(d: Date) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function sameYmd(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function BookingCalendarBridge() {
  useEffect(() => {
    const dateTrigger = document.getElementById("date-trigger");
    const calendarDropdown = document.getElementById("calendar-dropdown");
    const prevMonth = document.getElementById("prev-month");
    const nextMonth = document.getElementById("next-month");
    const currentMonthEl = document.getElementById("current-month");
    const daysContainer = document.getElementById("calendar-days");
    const selectedDateLabel = document.querySelector<HTMLElement>(".selected-date");

    if (!dateTrigger || !calendarDropdown || !prevMonth || !nextMonth || !currentMonthEl || !daysContainer || !selectedDateLabel) {
      return;
    }

    const w = window as BookingWindow;

	    // Everyday language:
	    // We store the selected date on `window.__tbBookingState.selectedDate` so BOTH worlds can read it:
	    // - legacy booking.html JS (still running)
	    // - React bridges / future `createBooking()` payload builder
	    // When we submit the booking to the backend, we should convert this to ISO `yyyy-mm-dd`.
    w.__tbBookingState = w.__tbBookingState || {};

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    const getSelectedDate = () => {
      const raw = w.__tbBookingState?.selectedDate;
      if (raw instanceof Date) return raw;
      if (typeof raw === "string" || typeof raw === "number") {
        const d = new Date(raw);
        return Number.isFinite(d.getTime()) ? d : null;
      }
      return null;
    };

    const setSelectedDate = (d: Date | null) => {
      if (!w.__tbBookingState) w.__tbBookingState = {};
      w.__tbBookingState.selectedDate = d;
    };

    const renderCalendar = () => {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      currentMonthEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
      daysContainer.innerHTML = "";

      const firstDay = new Date(currentYear, currentMonth, 1).getDay();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const selected = getSelectedDate();

      for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        empty.className = "day disabled";
        daysContainer.appendChild(empty);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement("div");
        dayEl.className = "day";
        dayEl.textContent = String(day);

        const dateToCheck = new Date(currentYear, currentMonth, day);
        const isMonday = dateToCheck.getDay() === 1;
        const isPast = dateToCheck < todayStart;

	        if (isMonday || isPast) {
          dayEl.classList.add("disabled");
          if (isMonday) dayEl.title = "Closed on Mondays";
        } else {
	          // Prototype-only availability.
	          // Everyday language: this is where we will replace the fake rule with a real API call:
	          // `GET /tours/{tourId}/availability?date=YYYY-MM-DD`
	          // so the backend can decide which dates are sold out.
	          //
	          // Deterministic availability (avoid Math.random changing every render)
          const isAvailable = (day + currentMonth + currentYear) % 5 !== 0;
          const dot = document.createElement("span");
          dot.className = `dot ${isAvailable ? "available" : "sold-out"}`;
          dayEl.appendChild(dot);

          if (isAvailable) {
            dayEl.addEventListener("click", () => {
              const d = new Date(currentYear, currentMonth, day);
              setSelectedDate(d);
              selectedDateLabel.textContent = formatSelectedDate(d);
              calendarDropdown.classList.remove("active");
              renderCalendar();
            });
          } else {
            dayEl.classList.add("disabled");
          }
        }

        if (selected && sameYmd(selected, dateToCheck)) {
          dayEl.classList.add("selected");
        }

        daysContainer.appendChild(dayEl);
      }
    };

    const onTriggerClick = (e: Event) => {
      e.preventDefault();
      calendarDropdown.classList.toggle("active");
    };

    const onPrev = (e: Event) => {
      e.preventDefault();
      currentMonth -= 1;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear -= 1;
      }
      renderCalendar();
    };

    const onNext = (e: Event) => {
      e.preventDefault();
      currentMonth += 1;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear += 1;
      }
      renderCalendar();
    };

    const onDocClick = (e: MouseEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (!t.closest(".date-picker-wrapper")) calendarDropdown.classList.remove("active");
    };

    dateTrigger.addEventListener("click", onTriggerClick);
    prevMonth.addEventListener("click", onPrev);
    nextMonth.addEventListener("click", onNext);
    document.addEventListener("click", onDocClick);

    renderCalendar();

    return () => {
      dateTrigger.removeEventListener("click", onTriggerClick);
      prevMonth.removeEventListener("click", onPrev);
      nextMonth.removeEventListener("click", onNext);
      document.removeEventListener("click", onDocClick);
    };
  }, []);

  return null;
}

