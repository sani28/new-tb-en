import type { Cleanup } from "./types";

export function initHomepageBookingModal(): Cleanup {
  const openButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(".book-now"));
  if (openButtons.length === 0) return () => {};

  // If the full promo modal exists on the page, use it as the booking-start UI so the hero flow
  // matches the add-on-first flow (tour image preview, bullets, map button, add-on carousel, etc.).
  const promoTourSelectionModal = document.getElementById("promoTourSelectionModal");
  if (promoTourSelectionModal) {
    const cleanups: Cleanup[] = [];

    const detectTourContext = (fromEl: Element): string | null => {
      const slide = fromEl.closest(".homepage-carousel-slide");
      const label = slide?.querySelector<HTMLElement>(".tour-label-fixed");
      const text = label?.textContent?.trim().toUpperCase() ?? "";
      if (text.includes("TOUR 01")) return "tour01";
      if (text.includes("TOUR 02")) return "tour02";
      if (text.includes("TOUR 04")) return "tour04";
      return null;
    };

    const openPromoFromHero = (e: MouseEvent) => {
      e.preventDefault();

      const btn = e.currentTarget as Element | null;
      const sourceTour = btn ? detectTourContext(btn) : null;

      // Best-effort prefill from the booking widget if present.
      const widget = document.querySelector<HTMLElement>(".booking-widget");
      const widgetTour = widget?.querySelector<HTMLSelectElement>(".tour-select select");
      const widgetDate = widget?.querySelector<HTMLElement>(".date-picker-trigger .selected-date");
      const widgetCounts = widget?.querySelectorAll<HTMLElement>(".passenger-counter .counter-group .count");

      const adultCount = widgetCounts?.[0] ? parseInt(widgetCounts[0].textContent ?? "0", 10) || 0 : undefined;
      const childCount = widgetCounts?.[1] ? parseInt(widgetCounts[1].textContent ?? "0", 10) || 0 : undefined;
      const dateText = (widgetDate?.textContent ?? "").trim() || undefined;

      document.dispatchEvent(
        new CustomEvent("tb:openPromoTourSelectionFromHero", {
          detail: {
            preferredTour: widgetTour?.value || sourceTour || null,
            adultCount,
            childCount,
            dateText,
          },
        })
      );
    };

    openButtons.forEach((btn) => {
      btn.addEventListener("click", openPromoFromHero);
      cleanups.push(() => btn.removeEventListener("click", openPromoFromHero));
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }

  // ---- Fallback: legacy homepage booking widget modal ----
  const bookingModal = document.getElementById("bookingModal");
  const step1 = document.getElementById("step1");

  if (!bookingModal || !step1) return () => {};

  const cleanups: Cleanup[] = [];

  const tourSelect = bookingModal.querySelector<HTMLSelectElement>("#tourSelect");
  const selectedDateDisplay = bookingModal.querySelector<HTMLElement>("#selectedDateDisplay");
  const continueBtn = document.getElementById("step1ContinueBtn");

  const dateTrigger = bookingModal.querySelector<HTMLButtonElement>(".modal-date-trigger");
  const calendarDropdown = bookingModal.querySelector<HTMLElement>(".modal-calendar");

  const prices: Record<string, { adult: number; adultOrig: number; child: number; childOrig: number }> = {
    tour01: { adult: 20, adultOrig: 27, child: 14, childOrig: 18 },
    tour04: { adult: 18, adultOrig: 24, child: 12, childOrig: 16 },
    tour02: { adult: 22, adultOrig: 29, child: 15, childOrig: 20 },
  };

  const getTourPrices = () => prices[tourSelect?.value ?? "tour01"] ?? prices.tour01;

  const getTicketInputs = () =>
    Array.from(step1.querySelectorAll<HTMLInputElement>('.ticket-type .counter input[type="number"]'));

  const getCounts = () => {
    const inputs = getTicketInputs();
    const adultCount = inputs[0] ? parseInt(inputs[0].value, 10) || 0 : 0;
    const childCount = inputs[1] ? parseInt(inputs[1].value, 10) || 0 : 0;
    return { adultCount, childCount };
  };

  const clamp = (n: number) => Math.max(0, Math.min(10, n));

  const setCounts = (adultCount: number, childCount: number) => {
    const inputs = getTicketInputs();
    if (inputs[0]) inputs[0].value = String(clamp(adultCount));
    if (inputs[1]) inputs[1].value = String(clamp(childCount));
  };

  const updateTicketPriceRows = () => {
    const p = getTourPrices();
    const ticketTypes = Array.from(step1.querySelectorAll<HTMLElement>(".ticket-type"));
    const adultRow = ticketTypes[0];
    const childRow = ticketTypes[1];

    const setRowPrices = (row: HTMLElement | undefined, current: number, orig: number) => {
      if (!row) return;
      const currentEl = row.querySelector<HTMLElement>(".price .current-price");
      const origEl = row.querySelector<HTMLElement>(".price .original-price");
      if (currentEl) currentEl.textContent = `$${current.toFixed(2)} USD`;
      if (origEl) origEl.textContent = `$${orig.toFixed(2)} USD`;
    };

    setRowPrices(adultRow, p.adult, p.adultOrig);
    setRowPrices(childRow, p.child, p.childOrig);
  };

  const updateTotals = () => {
    const p = getTourPrices();
    const { adultCount, childCount } = getCounts();
    const currentTotal = adultCount * p.adult + childCount * p.child;
    const originalTotal = adultCount * p.adultOrig + childCount * p.childOrig;

    const currentTotalEl = step1.querySelector<HTMLElement>(".total-summary .current-total");
    const originalTotalEl = step1.querySelector<HTMLElement>(".total-summary .original-total");
    if (currentTotalEl) currentTotalEl.textContent = `$${currentTotal.toFixed(2)} USD`;
    if (originalTotalEl) originalTotalEl.textContent = `$${originalTotal.toFixed(2)} USD`;
  };

  const updateUI = () => {
    updateTicketPriceRows();
    updateTotals();
  };

  // ---- Modal open/close ----
  const openModal = () => {
    // Sync tour/date/counts from the booking widget
    const widget = document.querySelector<HTMLElement>(".booking-widget");
    const widgetTour = widget?.querySelector<HTMLSelectElement>(".tour-select select");
    const widgetDate = widget?.querySelector<HTMLElement>(".date-picker-trigger .selected-date");
    const widgetCounts = widget?.querySelectorAll<HTMLElement>(".passenger-counter .counter-group .count");

    if (tourSelect && widgetTour) tourSelect.value = widgetTour.value;

    const adultFromWidget = widgetCounts?.[0] ? parseInt(widgetCounts[0].textContent ?? "0", 10) || 0 : 0;
    const childFromWidget = widgetCounts?.[1] ? parseInt(widgetCounts[1].textContent ?? "0", 10) || 0 : 0;
    setCounts(adultFromWidget, childFromWidget);

    // Copy selected date if present
    const widgetDateText = (widgetDate?.textContent ?? "").trim();
    if (selectedDateDisplay) {
      if (widgetDateText && widgetDateText !== "Select a date") {
        selectedDateDisplay.textContent = widgetDateText;
      } else {
        selectedDateDisplay.textContent = "Please select a date";
      }
    }

    if (widgetDateText && widgetDateText !== "Select a date") {
      const parsed = new Date(widgetDateText);
      if (!Number.isNaN(parsed.getTime())) {
        selectedDate = parsed;
        currentMonth = parsed.getMonth();
        currentYear = parsed.getFullYear();
      }
    }

    bookingModal.classList.add("active");
    step1.classList.add("active");
    bookingModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("booking-modal-open");

    updateUI();
    renderCalendar();
  };

  const closeModal = () => {
    bookingModal.classList.remove("active");
    step1.classList.remove("active");
    bookingModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("booking-modal-open");
    calendarDropdown?.classList.remove("active");
  };

  openButtons.forEach((btn) => {
    btn.addEventListener("click", openModal);
    cleanups.push(() => btn.removeEventListener("click", openModal));
  });

  const closeButtons = Array.from(bookingModal.querySelectorAll<HTMLButtonElement>(".close-modal"));
  closeButtons.forEach((btn) => {
    const onClose = (e: Event) => {
      e.preventDefault();
      closeModal();
    };
    btn.addEventListener("click", onClose);
    cleanups.push(() => btn.removeEventListener("click", onClose));
  });

  const onOverlayClick = (e: MouseEvent) => {
    if (e.target === bookingModal) closeModal();
  };
  bookingModal.addEventListener("click", onOverlayClick);
  cleanups.push(() => bookingModal.removeEventListener("click", onOverlayClick));

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && bookingModal.classList.contains("active")) closeModal();
  };
  document.addEventListener("keydown", onKeydown);
  cleanups.push(() => document.removeEventListener("keydown", onKeydown));

  // ---- Tour + ticket counters ----
  const onTourChange = () => updateUI();
  tourSelect?.addEventListener("change", onTourChange);
  cleanups.push(() => tourSelect?.removeEventListener("change", onTourChange));

  const ticketTypes = Array.from(step1.querySelectorAll<HTMLElement>(".ticket-type"));
  ticketTypes.forEach((row, index) => {
    const minus = row.querySelector<HTMLButtonElement>(".counter .minus");
    const plus = row.querySelector<HTMLButtonElement>(".counter .plus");
    const input = row.querySelector<HTMLInputElement>('.counter input[type="number"]');
    if (!minus || !plus || !input) return;

    const bump = (delta: number) => {
      const next = clamp((parseInt(input.value, 10) || 0) + delta);
      input.value = String(next);
      updateTotals();
    };

    const onMinus = () => bump(-1);
    const onPlus = () => bump(1);
    const onInput = () => {
      input.value = String(clamp(parseInt(input.value, 10) || 0));
      updateTotals();
    };

    minus.addEventListener("click", onMinus);
    plus.addEventListener("click", onPlus);
    input.addEventListener("change", onInput);
    input.addEventListener("input", onInput);

    cleanups.push(() => {
      minus.removeEventListener("click", onMinus);
      plus.removeEventListener("click", onPlus);
      input.removeEventListener("change", onInput);
      input.removeEventListener("input", onInput);
    });

    // Ensure inputs have sensible defaults
    if (index === 0 || index === 1) input.value = String(clamp(parseInt(input.value, 10) || 0));
  });

  // ---- Modal calendar ----
  let selectedDate: Date | null = null;
  const now = new Date();
  let currentMonth = now.getMonth();
  let currentYear = now.getFullYear();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const openCalendar = () => {
    if (!calendarDropdown) return;
    calendarDropdown.classList.add("active");
    renderCalendar();
  };

  const closeCalendar = () => {
    calendarDropdown?.classList.remove("active");
  };

  const onDateTrigger = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!calendarDropdown) return;
    calendarDropdown.classList.toggle("active");
    if (calendarDropdown.classList.contains("active")) renderCalendar();
  };
  dateTrigger?.addEventListener("click", onDateTrigger);
  cleanups.push(() => dateTrigger?.removeEventListener("click", onDateTrigger));

  const closeCalendarBtn = calendarDropdown?.querySelector<HTMLButtonElement>(".close-calendar");
  const onCloseCalendarClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    closeCalendar();
  };
  closeCalendarBtn?.addEventListener("click", onCloseCalendarClick);
  cleanups.push(() => closeCalendarBtn?.removeEventListener("click", onCloseCalendarClick));

  const currentMonthEl = calendarDropdown?.querySelector<HTMLElement>(".current-month");
  const daysEl = calendarDropdown?.querySelector<HTMLElement>(".days");
  const prevMonthBtn = calendarDropdown?.querySelector<HTMLButtonElement>(".prev-month");
  const nextMonthBtn = calendarDropdown?.querySelector<HTMLButtonElement>(".next-month");

  const renderCalendar = () => {
    if (!calendarDropdown || !currentMonthEl || !daysEl) return;
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    currentMonthEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    daysEl.innerHTML = "";

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement("div");
      empty.className = "day empty";
      daysEl.appendChild(empty);
    }

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const day = document.createElement("div");
      day.className = "day";
      day.textContent = String(dayNum);

      const dayDate = new Date(currentYear, currentMonth, dayNum);
      const isMonday = dayDate.getDay() === 1;

      if (dayDate < today || isMonday) {
        day.classList.add("disabled");
        if (isMonday) day.title = "Closed on Mondays";
        daysEl.appendChild(day);
        continue;
      }

      const isAvailable = Math.random() > 0.2;
      const availability = isAvailable ? "available" : "sold-out";
      const dot = document.createElement("span");
      dot.className = `dot ${availability}`;
      day.appendChild(dot);

      if (!isAvailable) {
        day.classList.add("sold-out", "disabled");
        daysEl.appendChild(day);
        continue;
      }

      day.classList.add("available");

      if (
        selectedDate &&
        selectedDate.getDate() === dayNum &&
        selectedDate.getMonth() === currentMonth &&
        selectedDate.getFullYear() === currentYear
      ) {
        day.classList.add("selected");
      }

      day.addEventListener("click", () => {
        daysEl.querySelectorAll(".day").forEach((d) => d.classList.remove("selected"));
        day.classList.add("selected");
        selectedDate = new Date(currentYear, currentMonth, dayNum);
        const formatted = selectedDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        if (selectedDateDisplay) selectedDateDisplay.textContent = formatted;
        closeCalendar();
      });

      daysEl.appendChild(day);
    }
  };

  const onPrevMonth = (e: MouseEvent) => {
    e.preventDefault();
    currentMonth -= 1;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear -= 1;
    }
    renderCalendar();
  };
  const onNextMonth = (e: MouseEvent) => {
    e.preventDefault();
    currentMonth += 1;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear += 1;
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
    if (!calendarDropdown || !dateTrigger) return;
    const target = e.target as Node | null;
    if (!target) return;
    if (!calendarDropdown.contains(target) && !dateTrigger.contains(target)) closeCalendar();
  };
  document.addEventListener("click", onDocClick);
  cleanups.push(() => document.removeEventListener("click", onDocClick));

  // ---- Continue CTA ----
  const formatIsoDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const onContinue = () => {
    const { adultCount, childCount } = getCounts();
    if (adultCount + childCount <= 0) {
      alert("Please select at least 1 passenger.");
      return;
    }
    if (!selectedDate) {
      alert("Please select a date.");
      openCalendar();
      return;
    }

    const tour = tourSelect?.value ?? "tour01";
    const params = new URLSearchParams({
      tour,
      date: formatIsoDate(selectedDate),
      adults: String(adultCount),
      children: String(childCount),
    });
    window.location.href = `/booking?${params.toString()}`;
  };

  continueBtn?.addEventListener("click", onContinue);
  cleanups.push(() => continueBtn?.removeEventListener("click", onContinue));

  return () => {
    closeModal();
    cleanups.forEach((fn) => fn());
  };
}
