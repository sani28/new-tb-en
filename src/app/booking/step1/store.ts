"use client";

import { useSyncExternalStore } from "react";

export type Step1TourId = "tour01" | "tour02" | "tour04";

export type Step1State = {
  tourId: Step1TourId;
  adultCount: number;
  childCount: number;
};

type TourPricing = {
  adult: { current: number; original: number };
  child: { current: number; original: number };
};

// Mirrors legacy booking.html pricing (and fills tour02 to avoid crashes).
const TOUR_PRICING: Record<Step1TourId, TourPricing> = {
  tour01: { adult: { current: 20, original: 25 }, child: { current: 15, original: 20 } },
  // booking.html doesn't define tour02 pricing yet; keep same as tour01 for now.
  tour02: { adult: { current: 20, original: 25 }, child: { current: 15, original: 20 } },
  tour04: { adult: { current: 18, original: 22 }, child: { current: 12, original: 15 } },
};

let state: Step1State = { tourId: "tour01", adultCount: 0, childCount: 0 };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function clampCount(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.floor(n));
}

export const bookingStep1Store = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return state;
  },

  getPricing(tourId: Step1TourId) {
    return TOUR_PRICING[tourId] ?? TOUR_PRICING.tour01;
  },
  getTotals(s: Step1State) {
    const p = this.getPricing(s.tourId);
    const currentTotal = s.adultCount * p.adult.current + s.childCount * p.child.current;
    const originalTotal = s.adultCount * p.adult.original + s.childCount * p.child.original;
    return { currentTotal, originalTotal };
  },

  setTourId(tourId: Step1TourId) {
    if (state.tourId === tourId) return;
    state = { ...state, tourId };
    emit();
  },

  setCounts(adultCount: number, childCount: number) {
    const nextAdult = clampCount(adultCount);
    const nextChild = clampCount(childCount);
    if (state.adultCount === nextAdult && state.childCount === nextChild) return;
    state = { ...state, adultCount: nextAdult, childCount: nextChild };
    emit();
  },

  inc(type: "adult" | "child") {
    if (type === "adult") this.setCounts(state.adultCount + 1, state.childCount);
    else this.setCounts(state.adultCount, state.childCount + 1);
  },
  dec(type: "adult" | "child") {
    if (type === "adult") this.setCounts(state.adultCount - 1, state.childCount);
    else this.setCounts(state.adultCount, state.childCount - 1);
  },
};

export function useBookingStep1() {
  return useSyncExternalStore(bookingStep1Store.subscribe, bookingStep1Store.getSnapshot, bookingStep1Store.getSnapshot);
}

