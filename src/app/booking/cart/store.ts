"use client";

import {
  bookingCartReducer,
  getBookingCartItemCount,
  getBookingCartOriginalTotal,
  getBookingCartTotal,
  type BookingCartAction,
  type BookingCartItem,
  type BookingCartState,
} from "../lib/cart";

const STORAGE_KEY = "tb_booking_upsell_cart_v1";

let state: BookingCartState = { items: [] };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function persist(next: BookingCartState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next.items));
  } catch {
    // ignore
  }
}

function dispatch(action: BookingCartAction) {
  const next = bookingCartReducer(state, action);
  state = next;
  persist(next);
  emit();
}

function coerceIncomingItem(raw: unknown): BookingCartItem | null {
  const r = raw as Partial<BookingCartItem> | null;
  if (!r || typeof r !== "object") return null;
  if (!r.productId || !r.name || !r.type) return null;

  const quantity = Number(r.quantity ?? 1) || 1;
  const price = Number(r.price ?? 0) || 0;
  const originalPrice = Number(r.originalPrice ?? price) || price;

  const adultQty = typeof r.adultQty === "number" ? r.adultQty : undefined;
  const childQty = typeof r.childQty === "number" ? r.childQty : undefined;
  const adultUnit = typeof r.adultPrice === "number" ? r.adultPrice : price;
  const childUnit = typeof r.childPrice === "number" ? r.childPrice : price;
  const hasTicketQty = typeof adultQty === "number" || typeof childQty === "number";
  const ticketLinePrice = hasTicketQty ? (adultQty ?? 0) * adultUnit + (childQty ?? 0) * childUnit : null;

  const computedLinePrice =
    typeof ticketLinePrice === "number"
      ? ticketLinePrice
      : typeof r.computedLinePrice === "number" && Number.isFinite(r.computedLinePrice)
        ? r.computedLinePrice
        : price * quantity;

  return {
    productId: String(r.productId),
    name: String(r.name),
    type: r.type,
    category: String(r.category ?? ""),
    price,
    originalPrice,
    image: (r.image ?? null) as string | null,
    placeholder: (r.placeholder ?? null) as string | null,

    adultPrice: typeof r.adultPrice === "number" ? r.adultPrice : undefined,
    childPrice: typeof r.childPrice === "number" ? r.childPrice : undefined,

    variant: String(r.variant ?? "Standard"),
    color: (r.color ?? null) as string | null,

    selectedDate: (r.selectedDate ?? null) as string | null,
    selectedTime: (r.selectedTime ?? null) as string | null,
    selectedTimeSlot: (r.selectedTimeSlot ?? null) as string | null,
    validUntil: (r.validUntil ?? null) as string | null,

    cruiseType: (r.cruiseType ?? null) as string | null,
    cruiseTypeName: (r.cruiseTypeName ?? null) as string | null,

    adultQty,
    childQty,

    quantity,
    computedLinePrice,
  };
}

export const bookingCartStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return state;
  },

  addItem(rawItem: unknown) {
    const item = coerceIncomingItem(rawItem);
    if (!item) return;
    dispatch({ type: "ADD_ITEMS", items: [item] });
  },

  removeIndex(index: number) {
    dispatch({ type: "REMOVE_INDEX", index });
  },

  clear() {
    dispatch({ type: "CLEAR" });
  },

  updateItemQuantity(index: number, quantity: number) {
    const item = state.items[index];
    if (!item) return;

    if (quantity <= 0) {
      dispatch({ type: "REMOVE_INDEX", index });
      return;
    }

    const nextQty = Math.max(1, Math.floor(quantity));

    const oldAdult = item.adultQty ?? 0;
    const oldChild = item.childQty ?? 0;
    const oldTotal = oldAdult + oldChild;

    if (oldTotal > 0) {
      const ratio = nextQty / oldTotal;
      const nextAdult = Math.max(0, Math.round(oldAdult * ratio));
      const nextChild = Math.max(0, nextQty - nextAdult);

      const adultUnit = item.adultPrice ?? item.price;
      const childUnit = item.childPrice ?? item.price;

      const nextItem: BookingCartItem = {
        ...item,
        adultQty: nextAdult,
        childQty: nextChild,
        quantity: nextAdult + nextChild,
        computedLinePrice: nextAdult * adultUnit + nextChild * childUnit,
      };

      if (nextItem.quantity <= 0) {
        dispatch({ type: "REMOVE_INDEX", index });
      } else {
        dispatch({ type: "SET_INDEX", index, item: nextItem });
      }
      return;
    }

    const nextItem: BookingCartItem = {
      ...item,
      quantity: nextQty,
      computedLinePrice: item.price * nextQty,
    };
    dispatch({ type: "SET_INDEX", index, item: nextItem });
  },

  setTicketQuantities(index: number, adultQty: number, childQty: number) {
    const item = state.items[index];
    if (!item) return;

    const a = Math.max(0, Math.floor(adultQty));
    const c = Math.max(0, Math.floor(childQty));
    const total = a + c;

    if (total <= 0) {
      dispatch({ type: "REMOVE_INDEX", index });
      return;
    }

    const adultUnit = item.adultPrice ?? item.price;
    const childUnit = item.childPrice ?? item.price;

    const nextItem: BookingCartItem = {
      ...item,
      adultQty: a,
      childQty: c,
      quantity: total,
      computedLinePrice: a * adultUnit + c * childUnit,
    };
    dispatch({ type: "SET_INDEX", index, item: nextItem });
  },

  getTotal() {
    return getBookingCartTotal(state.items);
  },
  getOriginalTotal() {
    return getBookingCartOriginalTotal(state.items);
  },
  getItemCount() {
    return getBookingCartItemCount(state.items);
  },
};

function tryHydrateFromStorage() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return;

    const items: BookingCartItem[] = parsed
      .map((i) => coerceIncomingItem(i))
      .filter(Boolean) as BookingCartItem[];
    state = { items };
  } catch {
    // ignore
  }
}

tryHydrateFromStorage();
