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

export type LegacyUpsellCartApi = {
  addItem: (item: unknown) => void;
  removeItem: (index: number) => void;
  updateItemQuantity: (index: number, qty: number) => void;
  setTicketQuantities: (index: number, adultQty: number, childQty: number) => void;
  clear: () => void;
  getTotal: () => number;
  getOriginalTotal: () => number;
  getItemCount: () => number;
  getOrderPayload: () => Array<Record<string, unknown>>;
  updateCartUI: () => void;
  save: () => void;
  items: BookingCartItem[];
};

type UpsellCartQueuedEvent =
  | { type: "addItem"; item: unknown }
  | { type: "removeItem"; index: number }
  | { type: "updateItemQuantity"; index: number; qty: number }
  | { type: "setTicketQuantities"; index: number; adultQty: number; childQty: number }
  | { type: "clear" };

type WindowWithUpsellCartQueue = Window & {
  __tbUpsellCartQueue?: UpsellCartQueuedEvent[];
};

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

  // Everyday language:
  // `productId` is the stable identifier we will send to the backend as `addonId`.
  // Everything else here is "what the customer picked" (variant/color/date/time/adult/child split).

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
  // React subscription API
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return state;
  },

  // Actions
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

  /**
   * Legacy API compatibility.
   * For ticket-based items, this adjusts adult/child quantities proportionally.
   */
  updateItemQuantity(index: number, quantity: number) {
    const item = state.items[index];
    if (!item) return;

    if (quantity <= 0) {
      dispatch({ type: "REMOVE_INDEX", index });
      return;
    }

    const nextQty = Math.max(1, Math.floor(quantity));

    // Ticket-based: preserve adult/child split if present.
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

    // Simple quantity.
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

  // Derived helpers
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

export function ensureUpsellCartOnWindow() {
  if (typeof window === "undefined") return;
  const w = window as Window & { UpsellCart?: LegacyUpsellCartApi };

  const existing = w.UpsellCart as (LegacyUpsellCartApi & { __tbIsStub?: boolean }) | undefined;
  const isStub = Boolean(existing?.__tbIsStub);
  if (existing && !isStub) return;

  const api: Omit<LegacyUpsellCartApi, "items"> = {
    addItem: (item: unknown) => bookingCartStore.addItem(item),
    removeItem: (index: number) => bookingCartStore.removeIndex(index),
    updateItemQuantity: (index: number, qty: number) => bookingCartStore.updateItemQuantity(index, qty),
    setTicketQuantities: (index: number, adultQty: number, childQty: number) =>
      bookingCartStore.setTicketQuantities(index, adultQty, childQty),
    clear: () => bookingCartStore.clear(),
    getTotal: () => bookingCartStore.getTotal(),
    getOriginalTotal: () => bookingCartStore.getOriginalTotal(),
    getItemCount: () => bookingCartStore.getItemCount(),
	    // NOTE:
	    // - This shape is meant for legacy JS compatibility and debugging.
	    // - It is intentionally close to what the backend should accept as `BookingRequest.addons`.
	    // - The backend should treat these as "line items" and validate required fields based on add-on type.
	    getOrderPayload: () =>
      bookingCartStore.getSnapshot().items.map((item) => ({
        addonId: item.productId,
	        title: item.name,
        type: item.type,
        category: item.category,
        selectedDate: item.selectedDate || null,
        selectedTime: item.selectedTime || null,
        quantity: item.quantity,
        adultQty: item.adultQty ?? null,
        childQty: item.childQty ?? null,
        validUntil: item.validUntil || null,
        variant: item.variant,
        color: item.color || null,
        computedLinePrice: item.computedLinePrice ?? item.price * item.quantity,
      })),
    // Legacy no-ops
    updateCartUI: () => {},
    save: () => {},
  };

  Object.defineProperty(api, "items", {
    get() {
      return bookingCartStore.getSnapshot().items;
    },
    set(next: unknown) {
      // Legacy code sometimes assigns UpsellCart.items = []
      if (Array.isArray(next) && next.length === 0) {
        bookingCartStore.clear();
      }
    },
    enumerable: true,
  });


  // Replace any stub and replay queued actions if present.
  w.UpsellCart = api as unknown as LegacyUpsellCartApi;
  try {
    const ww = window as WindowWithUpsellCartQueue;
    const q = ww.__tbUpsellCartQueue;
    if (Array.isArray(q) && q.length > 0) {
      q.forEach((e) => {
        if (e.type === "addItem") bookingCartStore.addItem(e.item);
        if (e.type === "removeItem") bookingCartStore.removeIndex(Number(e.index));
        if (e.type === "updateItemQuantity") bookingCartStore.updateItemQuantity(Number(e.index), Number(e.qty));
        if (e.type === "setTicketQuantities")
          bookingCartStore.setTicketQuantities(Number(e.index), Number(e.adultQty), Number(e.childQty));
        if (e.type === "clear") bookingCartStore.clear();
      });
      ww.__tbUpsellCartQueue = [];
    }
  } catch {
    // ignore
  }
}
