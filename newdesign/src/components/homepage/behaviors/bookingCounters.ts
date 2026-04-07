import type { Cleanup } from "./types";

export function initBookingWidgetCountersAndCalendar(): Cleanup {
  const datePicker = document.querySelector<HTMLElement>(".date-picker-trigger");
  const calendarDropdown = document.querySelector<HTMLElement>(".calendar-dropdown");
  const selectedDateSpan = document.querySelector<HTMLElement>(".selected-date");

  let selectedDate: Date | null = null;
  let calendarOriginalParent: HTMLElement | null = null;
  let calendarOriginalNextSibling: Element | null = null;

  const cleanups: Cleanup[] = [];

  // Passenger counters (homepage booking widget)
  const counterGroups = Array.from(document.querySelectorAll<HTMLElement>(".passenger-counter .counter-group"));
  counterGroups.forEach((group) => {
    const decreaseBtn = group.querySelector<HTMLButtonElement>(".decrease");
    const increaseBtn = group.querySelector<HTMLButtonElement>(".increase");
    const countElement = group.querySelector<HTMLElement>(".count");
    if (!decreaseBtn || !increaseBtn || !countElement) return;

    let count = parseInt(countElement.textContent ?? "0", 10) || 0;

    const updateCount = (newCount: number) => {
      const clamped = Math.max(0, Math.min(10, newCount));
      count = clamped;
      countElement.textContent = String(count);
      decreaseBtn.disabled = count === 0;
      increaseBtn.disabled = count === 10;
      decreaseBtn.style.opacity = count === 0 ? "0.3" : "1";
      increaseBtn.style.opacity = count === 10 ? "0.3" : "1";
    };

    const onDec = () => updateCount(count - 1);
    const onInc = () => updateCount(count + 1);

    decreaseBtn.addEventListener("click", onDec);
    increaseBtn.addEventListener("click", onInc);
    updateCount(count);

    cleanups.push(() => {
      decreaseBtn.removeEventListener("click", onDec);
      increaseBtn.removeEventListener("click", onInc);
    });
  });

  // Widget price updates
  const tourSelect = document.querySelector<HTMLSelectElement>(".tour-select select");
  const bookingWidget = document.querySelector<HTMLElement>(".booking-widget");
  const adultPrice = bookingWidget?.querySelector<HTMLElement>(".counter-group:first-child .price");
  const childPrice = bookingWidget?.querySelector<HTMLElement>(".counter-group:last-child .price");

  const tourPricing: Record<string, { adult: number; child: number }> = {
    tour01: { adult: 27, child: 18 },
    // Prototype only explicitly defines Tour 01 and Tour 04 pricing; keep Tour 02 same as Tour 01 for now.
    tour02: { adult: 27, child: 18 },
    tour04: { adult: 24, child: 15 },
  };

  const updateHomepageWidgetPrices = () => {
    if (!tourSelect || !adultPrice || !childPrice) return;
    const pricing = tourPricing[tourSelect.value] ?? tourPricing.tour01;
    adultPrice.textContent = `$${pricing.adult} USD`;
    childPrice.textContent = `$${pricing.child} USD`;
  };

  if (tourSelect) {
    updateHomepageWidgetPrices();
    tourSelect.addEventListener("change", updateHomepageWidgetPrices);
    cleanups.push(() => tourSelect.removeEventListener("change", updateHomepageWidgetPrices));
  }

  // Calendar dropdown
  if (datePicker && calendarDropdown && selectedDateSpan) {
    calendarOriginalParent = calendarDropdown.parentElement;
    calendarOriginalNextSibling = calendarDropdown.nextElementSibling;

    const onDatePickerClick = (e: MouseEvent) => {
      e.stopPropagation();
      const isOpening = !calendarDropdown.classList.contains("active");
      calendarDropdown.classList.toggle("active");

      if (window.innerWidth <= 768) {
        if (isOpening) {
          document.body.appendChild(calendarDropdown);
          document.body.classList.add("calendar-open");
        } else {
          if (calendarOriginalParent) {
            if (calendarOriginalNextSibling) {
              calendarOriginalParent.insertBefore(calendarDropdown, calendarOriginalNextSibling);
            } else {
              calendarOriginalParent.appendChild(calendarDropdown);
            }
          }
          document.body.classList.remove("calendar-open");
        }
      }
    };

    datePicker.addEventListener("click", onDatePickerClick);
    cleanups.push(() => datePicker.removeEventListener("click", onDatePickerClick));

    const currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];

    // IMPORTANT: scope all calendar selectors to the widget dropdown to avoid conflicts
    // with other calendars on the page (e.g. the booking modal calendar).
    const currentMonthEl = calendarDropdown.querySelector<HTMLElement>(".current-month");
    const daysEl = calendarDropdown.querySelector<HTMLElement>(".days");

    const renderCalendar = () => {
      if (!currentMonthEl || !daysEl) return;
      const firstDay = new Date(currentYear, currentMonth, 1).getDay();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      currentMonthEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
      daysEl.innerHTML = "";

      for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement("div");
        emptyDay.className = "day";
        daysEl.appendChild(emptyDay);
      }

      for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement("div");
        day.className = "day";
        day.textContent = String(i);

        const dayDate = new Date(currentYear, currentMonth, i);
        const isMonday = dayDate.getDay() === 1;
        const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

        if (dayDate < today || isMonday) {
          day.classList.add("disabled");
          if (isMonday) day.title = "Closed on Mondays";
        } else {
          // PLACEHOLDER: replace with real availability API
          const isAvailable = Math.random() > 0.2;
          const availability = isAvailable ? "available" : "sold-out";
          const dot = document.createElement("span");
          dot.className = `dot ${availability}`;
          day.appendChild(dot);

          if (isAvailable) {
            day.classList.add("available");

            if (
              selectedDate &&
              selectedDate.getDate() === i &&
              selectedDate.getMonth() === currentMonth &&
              selectedDate.getFullYear() === currentYear
            ) {
              day.classList.add("selected");
            }

            const onDayClick = () => {
              daysEl.querySelectorAll(".day").forEach((d) => d.classList.remove("selected"));
              day.classList.add("selected");

              selectedDate = new Date(currentYear, currentMonth, i);
              const formattedDate = selectedDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              selectedDateSpan.textContent = formattedDate;

              calendarDropdown.classList.remove("active");
              document.body.classList.remove("calendar-open");

              if (window.innerWidth <= 768 && calendarOriginalParent) {
                if (calendarOriginalNextSibling) {
                  calendarOriginalParent.insertBefore(calendarDropdown, calendarOriginalNextSibling);
                } else {
                  calendarOriginalParent.appendChild(calendarDropdown);
                }
              }
            };

            day.addEventListener("click", onDayClick);
          } else {
            day.classList.add("sold-out", "disabled");
          }
        }

        daysEl.appendChild(day);
      }
    };

    const prevMonthBtn = calendarDropdown.querySelector<HTMLButtonElement>(".prev-month");
    const nextMonthBtn = calendarDropdown.querySelector<HTMLButtonElement>(".next-month");

    const onPrevMonth = () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar();
    };

    const onNextMonth = () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar();
    };

    prevMonthBtn?.addEventListener("click", onPrevMonth);
    nextMonthBtn?.addEventListener("click", onNextMonth);
    cleanups.push(() => {
      prevMonthBtn?.removeEventListener("click", onPrevMonth);
      nextMonthBtn?.removeEventListener("click", onNextMonth);
    });

    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (!calendarDropdown.contains(target) && !datePicker.contains(target)) {
        calendarDropdown.classList.remove("active");
        document.body.classList.remove("calendar-open");
        if (window.innerWidth <= 768 && calendarOriginalParent) {
          if (calendarOriginalNextSibling) {
            calendarOriginalParent.insertBefore(calendarDropdown, calendarOriginalNextSibling);
          } else {
            calendarOriginalParent.appendChild(calendarDropdown);
          }
        }
      }
    };
    document.addEventListener("click", onDocClick);
    cleanups.push(() => document.removeEventListener("click", onDocClick));

    renderCalendar();
  }

  return () => {
    // Ensure calendar is put back if it was portaled
    if (calendarDropdown && calendarOriginalParent && calendarDropdown.parentElement === document.body) {
      if (calendarOriginalNextSibling) {
        calendarOriginalParent.insertBefore(calendarDropdown, calendarOriginalNextSibling);
      } else {
        calendarOriginalParent.appendChild(calendarDropdown);
      }
    }
    document.body.classList.remove("calendar-open");
    calendarDropdown?.classList.remove("active");
    cleanups.forEach((fn) => fn());
  };
}
