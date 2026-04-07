import type { BookingLineItem, BookingLineItemKind } from "@/types/booking";

const KST_TZ = "Asia/Seoul";

/** Get current time in KST as a Date. */
function nowKST(): Date {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: KST_TZ }),
  );
}

/** Parse an ISO date string and interpret it in KST. */
function parseKST(iso: string): Date {
  return new Date(
    new Date(iso).toLocaleString("en-US", { timeZone: KST_TZ }),
  );
}

export interface TourRefundResult {
  percentage: number; // 100, 50, or 0
  refundAmount: number;
  label: string;
  eligible: boolean;
}

/**
 * Compute refund % for tour/exclusive cancellations.
 *
 * Rules:
 *  - 100% if cancelled 24h+ before tour
 *  - 50%  if cancelled 12-24h before tour
 *  - 0%   if <12h before tour
 *  - Tour 04 (night view): non-refundable on day of tour
 */
export function computeTourRefundPercentage(
  tourDate: string,
  productId: string,
  lineTotal: number,
  basedOnTourId?: string,
): TourRefundResult {
  const now = nowKST();
  const tour = parseKST(tourDate);
  const hoursUntil = (tour.getTime() - now.getTime()) / (1000 * 60 * 60);

  // Tour 04 special rule: non-refundable on day of tour
  const isTour04 =
    productId === "tour04" || basedOnTourId === "tour04";
  if (isTour04) {
    const sameDay =
      now.getFullYear() === tour.getFullYear() &&
      now.getMonth() === tour.getMonth() &&
      now.getDate() === tour.getDate();
    if (sameDay || hoursUntil <= 0) {
      return {
        percentage: 0,
        refundAmount: 0,
        label: "Night View Course (Tour 04) — non-refundable on day of tour",
        eligible: false,
      };
    }
  }

  if (hoursUntil >= 24) {
    return {
      percentage: 100,
      refundAmount: lineTotal,
      label: "100% refund — more than 24 hours before tour",
      eligible: true,
    };
  }
  if (hoursUntil >= 12) {
    return {
      percentage: 50,
      refundAmount: Math.round(lineTotal * 0.5 * 100) / 100,
      label: "50% refund — 12-24 hours before tour",
      eligible: true,
    };
  }
  return {
    percentage: 0,
    refundAmount: 0,
    label: "No refund — less than 12 hours before tour",
    eligible: false,
  };
}

/** Hours + minutes remaining until a date string. */
export function timeRemaining(isoDate: string): {
  hours: number;
  minutes: number;
  passed: boolean;
} {
  const now = nowKST();
  const target = parseKST(isoDate);
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { hours: 0, minutes: 0, passed: true };
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { hours, minutes, passed: false };
}

/** Whether a line item can have a refund action shown. */
export function isRefundEligible(item: BookingLineItem): boolean {
  // Already refunded/cancelled/in-progress
  if (item.refundStatus !== "none") return false;
  if (item.status !== "active") return false;

  switch (item.kind) {
    case "tour":
    case "exclusive":
      return true; // modal will show the % / eligibility

    case "physical":
      return true; // always let them request

    case "scheduled":
      // Can't refund if date already passed
      if (item.selectedDate) {
        const d = parseKST(item.selectedDate);
        if (d.getTime() < nowKST().getTime()) return false;
      }
      return true;

    case "validityPass":
      if (item.usageStatus === "fully_used") return false;
      if (item.validUntil) {
        const d = parseKST(item.validUntil);
        if (d.getTime() < nowKST().getTime()) return false;
      }
      return true;

    case "cruise":
      if (item.selectedDate) {
        const d = parseKST(item.selectedDate);
        if (d.getTime() < nowKST().getTime()) return false;
      }
      return true;

    default:
      return false;
  }
}

/** Action button label per product kind. */
export function getRefundActionLabel(kind: BookingLineItemKind): string {
  if (kind === "tour" || kind === "exclusive") return "Cancel Reservation";
  return "Request Refund";
}

/** Format currency amount. */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
): string {
  if (currency === "KRW") {
    return `₩${amount.toLocaleString()}`;
  }
  return `$${amount.toFixed(2)}`;
}
