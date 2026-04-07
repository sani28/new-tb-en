"use client";

import { useState } from "react";
import type { BookingLineItem } from "@/types/booking";
import RefundModal from "./RefundModal";
import { formatCurrency, timeRemaining } from "./refundHelpers";

export default function ScheduledRefundModal({
  item,
  onClose,
  onSubmit,
}: {
  item: BookingLineItem;
  onClose: () => void;
  onSubmit: (lineItemId: string, reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const remaining = item.selectedDate
    ? timeRemaining(item.selectedDate)
    : null;
  const datePassed = remaining?.passed ?? false;
  const canSubmit = !datePassed && reason.trim().length > 0;

  return (
    <RefundModal
      title="Request Refund — Scheduled Experience"
      onClose={onClose}
      footer={
        <div className="flex w-full flex-col-reverse gap-2 md:w-auto md:flex-row md:gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 md:w-auto md:py-2 md:rounded-md"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => onSubmit(item.lineItemId, reason)}
            className={`w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors md:w-auto md:py-2 md:rounded-md ${
              canSubmit
                ? "bg-[#E20021] active:bg-[#b8001b] md:hover:bg-[#cc0000]"
                : "cursor-not-allowed bg-gray-300 text-gray-500"
            }`}
          >
            Submit Request
          </button>
        </div>
      }
    >
      {/* Product details */}
      <div className="mb-5">
        <p className="text-base font-semibold text-gray-800">
          {item.productName}
        </p>
        <div className="mt-2 space-y-1 text-sm text-gray-500">
          {item.selectedDate && (
            <p>
              Date:{" "}
              {new Date(item.selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "Asia/Seoul",
              })}
            </p>
          )}
          {item.selectedTime && <p>Time: {item.selectedTime}</p>}
          {item.adultQty != null && (
            <p>
              Adult x{item.adultQty}
              {item.childQty ? `, Child x${item.childQty}` : ""}
            </p>
          )}
          <p>Total: {formatCurrency(item.lineTotal, item.currency)}</p>
        </div>
      </div>

      {/* Date passed warning */}
      {datePassed && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
          <p className="text-sm font-medium text-red-700">
            This experience has already passed. Refunds are not available.
          </p>
        </div>
      )}

      {/* Tour dependency notice */}
      {item.tourOptional === false && (
        <div className="mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-3">
          <p className="text-sm text-yellow-800">
            This add-on was purchased with your tour. If you cancel the tour,
            this item will also be cancelled automatically.
          </p>
        </div>
      )}

      {/* Reason textarea */}
      {!datePassed && (
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Reason for refund <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please describe why you'd like a refund..."
            rows={4}
            className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-[#E20021] focus:outline-none"
          />
        </div>
      )}

      <div className="rounded-md bg-blue-50 p-3">
        <p className="text-xs text-blue-700">
          Scheduled experience refund requests are reviewed by our team. You
          will receive an email notification once a decision has been made.
        </p>
      </div>
    </RefundModal>
  );
}
