import type { TourId } from "@/types/tours";

export type TicketKind = "adult" | "child";

export interface TicketSelection {
  kind: TicketKind;
  quantity: number;
  unitPrice: number;
}

export interface AddonSelection {
  /**
   * Stable add-on product identifier.
   *
   * Everyday language: this is the "SKU" the backend cares about.
   * The backend should NOT need the full product object from the frontend.
   */
  addonId: string;

  /**
   * How many of this add-on the customer is buying.
   *
   * Important: depending on the add-on type, this can mean different things:
   * - physical: simple quantity
   * - scheduled / validityPass: we still send a total quantity, but we also send
   *   the adult/child split so the backend can price correctly.
   */
  quantity: number;

  // Optional selection fields (only present when relevant to the add-on type)
  variant?: string | null;
  color?: string | null;
  selectedDate?: string | null; // ISO date (yyyy-mm-dd)
  selectedTime?: string | null; // e.g. "14:00"
  selectedTimeSlot?: string | null; // e.g. "10:00-17:00"
  validUntil?: string | null;
  adultQty?: number | null;
  childQty?: number | null;
}

export interface BookingContact {
  fullName: string;
  email: string;
  phoneNumber: string;
  countryCode?: string;
}

export interface BookingPaymentSummary {
  currency: string; // e.g. "USD"
  subtotal: number;
  discounts: number;
  total: number;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface BookingRequest {
  tourId: TourId | null;
  // ISO date (yyyy-mm-dd)
  date: string | null;
  tickets: TicketSelection[];
  addons: AddonSelection[];
  contact: BookingContact;
}

export interface BookingResponse {
  bookingId: string;
  referenceCode: string;
  status: BookingStatus;
  payment: BookingPaymentSummary;
}

