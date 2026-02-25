"use client";

import { useEffect, useRef } from "react";
import { bookingStep1Store, useBookingStep1, type Step1TourId } from "./step1/store";

type LegacyWindow = Window & {
  updateTourDisplay?: (tourId: string) => void;
  updateProductCardCompatibility?: (tourId: string) => void;
};

function formatUsd(n: number) {
  return `$${n.toFixed(2)}`;
}

function coerceTourId(v: string): Step1TourId {
  if (v === "tour01" || v === "tour02" || v === "tour04") return v;
  return "tour01";
}

export default function BookingStep1Bridge() {
  const s = useBookingStep1();
  const prevTourIdRef = useRef<Step1TourId | null>(null);

  // Bind DOM -> store.
  useEffect(() => {
    const step1 = document.getElementById("step1");
    if (!step1) return;

    const tourSelect = document.getElementById("tour-select") as HTMLSelectElement | null;
    const adultInput = document.getElementById("adult-count") as HTMLInputElement | null;
    const childInput = document.getElementById("child-count") as HTMLInputElement | null;

    // Mirror legacy URL preselect logic so Step 1 works even if legacy init changes.
    const urlTour = new URLSearchParams(window.location.search).get("tour");
    if (tourSelect && (urlTour === "tour01" || urlTour === "tour02" || urlTour === "tour04")) {
      tourSelect.value = urlTour;
    }

    // Initial hydrate from DOM (legacy initTourSelector may already set the value).
    if (tourSelect) bookingStep1Store.setTourId(coerceTourId(tourSelect.value));
    bookingStep1Store.setCounts(parseInt(adultInput?.value || "0", 10) || 0, parseInt(childInput?.value || "0", 10) || 0);

    const cleanups: Array<() => void> = [];

    if (tourSelect) {
      const onChange = () => bookingStep1Store.setTourId(coerceTourId(tourSelect.value));
      tourSelect.addEventListener("change", onChange);
      cleanups.push(() => tourSelect.removeEventListener("change", onChange));
    }

    step1.querySelectorAll<HTMLButtonElement>(".ticket-type .counter button").forEach((btn) => {
      const type = btn.dataset.type === "child" ? "child" : "adult";
      const isInc = btn.classList.contains("increase");
      const isDec = btn.classList.contains("decrease");
      if (!isInc && !isDec) return;

      const onClick = (e: Event) => {
        e.preventDefault();
        if (isInc) bookingStep1Store.inc(type);
        else bookingStep1Store.dec(type);
      };
      btn.addEventListener("click", onClick);
      cleanups.push(() => btn.removeEventListener("click", onClick));
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  // Store -> DOM (prices + totals + selected tour side effects).
  useEffect(() => {
    const tourSelect = document.getElementById("tour-select") as HTMLSelectElement | null;
    if (tourSelect && tourSelect.value !== s.tourId) tourSelect.value = s.tourId;

    const adultInput = document.getElementById("adult-count") as HTMLInputElement | null;
    const childInput = document.getElementById("child-count") as HTMLInputElement | null;
    if (adultInput) adultInput.value = String(s.adultCount);
    if (childInput) childInput.value = String(s.childCount);

    const pricing = bookingStep1Store.getPricing(s.tourId);
    const adultPrice = document.getElementById("adult-price");
    const adultOriginal = document.getElementById("adult-original");
    const childPrice = document.getElementById("child-price");
    const childOriginal = document.getElementById("child-original");

    if (adultPrice) adultPrice.textContent = formatUsd(pricing.adult.current);
    if (adultOriginal) adultOriginal.textContent = formatUsd(pricing.adult.original);
    if (childPrice) childPrice.textContent = formatUsd(pricing.child.current);
    if (childOriginal) childOriginal.textContent = formatUsd(pricing.child.original);

    const { currentTotal, originalTotal } = bookingStep1Store.getTotals(s);
    const currentTotalEl = document.getElementById("current-total");
    const originalTotalEl = document.getElementById("original-total");
    if (currentTotalEl) currentTotalEl.textContent = formatUsd(currentTotal);
    if (originalTotalEl) {
      originalTotalEl.textContent = formatUsd(originalTotal);
      (originalTotalEl as HTMLElement).style.display = originalTotal > currentTotal ? "inline" : "none";
    }

    // Tour info panel state
    const tour01Info = document.querySelector(".tour01-info");
    const tour02Info = document.querySelector(".tour02-info");
    const tour04Info = document.querySelector(".tour04-info");
    tour01Info?.classList.toggle("active", s.tourId === "tour01");
    tour02Info?.classList.toggle("active", s.tourId === "tour02");
    tour04Info?.classList.toggle("active", s.tourId === "tour04");

    if (prevTourIdRef.current !== s.tourId) {
      prevTourIdRef.current = s.tourId;
      const w = window as LegacyWindow;
      w.updateTourDisplay?.(s.tourId);
      w.updateProductCardCompatibility?.(s.tourId);
    }
  }, [s]);

  return null;
}

