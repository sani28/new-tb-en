"use client";

import type { BookingLineItem } from "@/types/booking";
import RefundModal from "./RefundModal";
import {
  computeTourRefundPercentage,
  formatCurrency,
  timeRemaining,
} from "./refundHelpers";

export default function TourRefundModal({
  item,
  allLineItems,
  onClose,
  onConfirm,
}: {
  item: BookingLineItem;
  allLineItems: BookingLineItem[];
  onClose: () => void;
  onConfirm: (lineItemId: string, refundAmount: number, percentage: number) => void;
}) {
  const tourDate = item.tourDate ?? item.selectedDate ?? "";
  const refund = computeTourRefundPercentage(
    tourDate,
    item.productId,
    item.lineTotal,
    item.basedOnTourId,
  );
  const remaining = timeRemaining(tourDate);

  // Find non-optional addons that will cascade-cancel
  const cascadeItems = allLineItems.filter(
    (li) =>
      li.lineItemId !== item.lineItemId &&
      li.status === "active" &&
      !li.tourOptional &&
      li.kind !== "tour" &&
      li.kind !== "exclusive",
  );

  const refundBoxColor = refund.percentage === 100
    ? "bg-green-50 border-green-200 text-green-800"
    : refund.percentage === 50
      ? "bg-orange-50 border-orange-200 text-orange-800"
      : "bg-red-50 border-red-200 text-red-800";

  return (
    <RefundModal
      title={
        item.kind === "exclusive"
          ? "Cancel Exclusive Package"
          : "Cancel Tour Reservation"
      }
      onClose={onClose}
      footer={
        <div className="flex w-full flex-col-reverse gap-2 md:w-auto md:flex-row md:gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 md:w-auto md:py-2 md:rounded-md"
          >
            Keep Booking
          </button>
          <button
            type="button"
            disabled={!refund.eligible}
            onClick={() =>
              onConfirm(item.lineItemId, refund.refundAmount, refund.percentage)
            }
            className={`w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors md:w-auto md:py-2 md:rounded-md ${
              refund.eligible
                ? "bg-[#E20021] active:bg-[#b8001b] md:hover:bg-[#cc0000]"
                : "cursor-not-allowed bg-gray-300 text-gray-500"
            }`}
          >
            Cancel &amp; Refund
          </button>
        </div>
      }
    >
      {/* Product info */}
      <div className="mb-4">
        <p className="text-base font-semibold text-gray-800">
          {item.productName}
        </p>
        {item.adultQty != null && (
          <p className="mt-1 text-sm text-gray-500">
            Adult x{item.adultQty}
            {item.childQty ? `, Child x${item.childQty}` : ""}
          </p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Total: {formatCurrency(item.lineTotal, item.currency)}
        </p>
      </div>

      {/* Tour date & time remaining */}
      {tourDate && (
        <div className="mb-4 rounded-md bg-gray-50 p-3">
          <p className="text-sm font-medium text-gray-700">
            Tour date:{" "}
            {new Date(tourDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "Asia/Seoul",
            })}
          </p>
          {!remaining.passed && (
            <p className="mt-1 text-sm text-gray-500">
              Time remaining: {remaining.hours}h {remaining.minutes}m
            </p>
          )}
          {remaining.passed && (
            <p className="mt-1 text-sm text-red-600">
              This tour date has already passed.
            </p>
          )}
        </div>
      )}

      {/* Refund amount box */}
      <div className={`mb-4 rounded-md border p-4 ${refundBoxColor}`}>
        <p className="text-sm font-semibold">{refund.label}</p>
        {refund.eligible && (
          <p className="mt-1 text-lg font-bold">
            {formatCurrency(refund.refundAmount, item.currency)}
          </p>
        )}
      </div>

      {/* Cascade warning */}
      {cascadeItems.length > 0 && (
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3">
          <p className="text-sm font-medium text-yellow-800">
            Cancelling this tour will also cancel:
          </p>
          <ul className="mt-2 list-inside list-disc text-sm text-yellow-700">
            {cascadeItems.map((ci) => (
              <li key={ci.lineItemId}>{ci.productName}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Policy note */}
      <p className="mt-4 text-xs text-gray-400">
        All times are based on local Seoul time (KST). Refund processing may
        take 3-5 business days.
      </p>
    </RefundModal>
  );
}
