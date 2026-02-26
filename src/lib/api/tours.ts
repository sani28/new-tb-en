import { jsonFetch } from "@/lib/api/http";
import type { Tour, TourAvailability, TourId } from "@/types/tours";

// All paths here are relative to NEXT_PUBLIC_API_BASE_URL.

export async function fetchTours(): Promise<Tour[]> {
  return jsonFetch<Tour[]>("/tours", { method: "GET", cache: "no-store" });
}

export async function fetchTourAvailability(
  tourId: TourId,
  date: string,
): Promise<TourAvailability[]> {
  // Backend contract note:
  // Availability is expected to be date-aware. We pass `date` as a query param
  // so the Python service can return a simple list of time/seat availability.
  return jsonFetch<TourAvailability[]>(
    `/tours/${tourId}/availability?date=${encodeURIComponent(date)}`,
    {
    method: "GET",
    cache: "no-store",
    },
  );
}

