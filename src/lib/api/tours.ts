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
  return jsonFetch<TourAvailability[]>(`/tours/${tourId}/availability`, {
    method: "GET",
    cache: "no-store",
  });
}

