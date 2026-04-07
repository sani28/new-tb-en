"use client";

import { useSyncExternalStore } from "react";
import type { BookingCartState } from "../lib/cart";
import { bookingCartStore } from "./store";

export function useBookingCart(): BookingCartState {
  return useSyncExternalStore(bookingCartStore.subscribe, bookingCartStore.getSnapshot, bookingCartStore.getSnapshot);
}
