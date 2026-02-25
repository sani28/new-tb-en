import { jsonFetch } from "@/lib/api/http";
import type { BookingRequest, BookingResponse } from "@/types/booking";

// Booking + payment related API helpers.

export async function createBooking(payload: BookingRequest): Promise<BookingResponse> {
  return jsonFetch<BookingResponse>("/bookings", {
    method: "POST",
    body: payload,
    cache: "no-store",
  });
}

export async function fetchBookingByReference(referenceCode: string): Promise<BookingResponse> {
  return jsonFetch<BookingResponse>(`/bookings/${encodeURIComponent(referenceCode)}`, {
    method: "GET",
    cache: "no-store",
  });
}

