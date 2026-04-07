import type { PromoProductType } from "@/types/promo";

export type BookingCartItem = {
  productId: string;
  name: string;
  type: PromoProductType;
  category: string;
  price: number;
  originalPrice: number;
  image: string | null;
  placeholder: string | null;

  // Optional per-ticket pricing for ticket-based add-ons.
  // (Needed so adult/child quantity adjustments can keep computedLinePrice correct.)
  adultPrice?: number;
  childPrice?: number;

  variant: string;
  color?: string | null;

  selectedDate?: string | null;
  selectedTime?: string | null;
  selectedTimeSlot?: string | null;
  validUntil?: string | null;

  cruiseType?: string | null;
  cruiseTypeName?: string | null;

  adultQty?: number;
  childQty?: number;

  quantity: number;
  computedLinePrice: number;
};

export type BookingCartState = {
  items: BookingCartItem[];
};

export type BookingCartAction =
  | { type: "ADD_ITEMS"; items: BookingCartItem[] }
  | { type: "REPLACE_ITEMS"; items: BookingCartItem[] }
  | { type: "SET_INDEX"; index: number; item: BookingCartItem }
  | { type: "REMOVE_INDEX"; index: number }
  | { type: "CLEAR" };

export const getBookingCartItemKey = (i: BookingCartItem) => {
  // Everyday language:
  // This key controls *when two add-on selections should merge into one line item*.
  // Example: if someone adds the same physical product + same variant/color twice,
  // we want one cart row with quantity=2 (not two separate rows).
  if (i.type === "physical") return `${i.productId}-${i.variant}-${i.color || "default"}`;
  if (i.type === "scheduled")
    return `${i.productId}-${i.variant}-${i.selectedDate || "no-date"}-${i.selectedTime || "no-time"}`;
  if (i.type === "validityPass") return `${i.productId}-${i.variant}-validity`;
  if (i.type === "cruise")
    return `${i.productId}-${i.cruiseType || "no-cruise"}-${i.selectedDate || "no-date"}-${i.selectedTimeSlot || "no-slot"}`;
  return `${i.productId}-${i.variant}`;
};

export function bookingCartReducer(
  state: BookingCartState,
  action: BookingCartAction,
): BookingCartState {
  if (action.type === "CLEAR") return { items: [] };

  if (action.type === "REPLACE_ITEMS") return { items: action.items };

  if (action.type === "SET_INDEX") {
    const next = state.items.slice();
    if (action.index < 0 || action.index >= next.length) return state;
    next[action.index] = action.item;
    return { items: next };
  }

  if (action.type === "REMOVE_INDEX") {
    const next = state.items.slice();
    next.splice(action.index, 1);
    return { items: next };
  }

  if (action.type === "ADD_ITEMS") {
    const next = state.items.slice();

    action.items.forEach((incoming) => {
      const key = getBookingCartItemKey(incoming);
      const idx = next.findIndex((i) => getBookingCartItemKey(i) === key);
      if (idx < 0) {
        next.push(incoming);
        return;
      }

      const existing = next[idx]!;
      if (incoming.type === "physical") {
        existing.quantity += incoming.quantity;
        existing.computedLinePrice = existing.price * existing.quantity;
        return;
      }

      // For ticket-based add-ons, merge adult/child when present, otherwise merge quantity.
      const nextAdult = (existing.adultQty || 0) + (incoming.adultQty || 0);
      const nextChild = (existing.childQty || 0) + (incoming.childQty || 0);
      if (nextAdult + nextChild > 0) {
        existing.adultQty = nextAdult;
        existing.childQty = nextChild;
        existing.quantity = nextAdult + nextChild;
      } else {
        existing.quantity += incoming.quantity;
      }

      existing.computedLinePrice += incoming.computedLinePrice;
    });

    return { items: next };
  }

  return state;
}

export function getBookingCartTotal(items: BookingCartItem[]) {
  return items.reduce((sum, i) => sum + (i.computedLinePrice ?? i.price * i.quantity), 0);
}

export function getBookingCartOriginalTotal(items: BookingCartItem[]) {
  return items.reduce((sum, i) => sum + (i.originalPrice ?? i.price) * i.quantity, 0);
}

export function getBookingCartItemCount(items: BookingCartItem[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
