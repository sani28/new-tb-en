import type { TourId } from "@/types/tours";
import type { PromoProductWithId } from "@/types/promo";

export type TicketKind = "adult" | "child";

export interface TicketSelection {
  kind: TicketKind;
  quantity: number;
  unitPrice: number;
}

export interface AddonSelection {
  product: PromoProductWithId;
  quantity: number;
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

