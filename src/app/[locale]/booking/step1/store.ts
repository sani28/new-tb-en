"use client";

import { useSyncExternalStore } from "react";

export type Step1State = {
  adultCount: number;
  childCount: number;
  selectedDate: Date | null;
};

let state: Step1State = { adultCount: 0, childCount: 0, selectedDate: null };
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

  setSelectedDate(d: Date | null) {
    state = { ...state, selectedDate: d };
    emit();
  },
};

export function useBookingStep1() {
  return useSyncExternalStore(bookingStep1Store.subscribe, bookingStep1Store.getSnapshot, bookingStep1Store.getSnapshot);
}
