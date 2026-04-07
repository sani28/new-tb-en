// Shared tour-related types for frontend/backend collaboration.

export type TourId = string;

export interface Tour {
  id: TourId;
  name: string;
  description?: string;
  durationMinutes?: number;
  imageUrl?: string;
  // e.g. "Gwanghwamun 1 Namsan 1 Dongdaemun"
  routeSummary?: string;
}

export interface TourPricing {
  tourId: TourId;
  currency: string; // e.g. "USD"
  adultPrice: number;
  childPrice: number;
}

export interface TourAvailability {
  tourId: TourId;
  // ISO date (yyyy-mm-dd)
  date: string;
  available: boolean;
  remainingSeats?: number | null;
}

