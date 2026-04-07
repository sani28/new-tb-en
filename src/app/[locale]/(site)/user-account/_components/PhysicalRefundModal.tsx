"use client";

import { useState } from "react";
import type { BookingLineItem } from "@/types/booking";
import RefundModal from "./RefundModal";
import { formatCurrency } from "./refundHelpers";

export default function PhysicalRefundModal({
  item,
  onClose,
  onSubmit,
}: {
  item: BookingLineItem;
  onClose: () => void;
  onSubmit: (lineItemId: string, reason: string, pickedUp: boolean) => void;
}) {
  const [pickedUp, setPickedUp] = useState<boolean | null>(null);
  const [reason, setReason] = useState("");

  const canSubmit = pickedUp !== null && reason.trim().length > 0;

  return (
    <RefundModal
      title="Request Refund — Physical Item"
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
            onClick={() => onSubmit(item.lineItemId, reason, pickedUp!)}
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
          {item.variant && <p>Variant: {item.variant}</p>}
          {item.color && <p>Color: {item.color}</p>}
          <p>Quantity: {item.quantity}</p>
          <p>Total: {formatCurrency(item.lineTotal, item.currency)}</p>
        </div>
      </div>

      {/* Pickup status question */}
      <div className="mb-5">
        <p className="mb-3 text-sm font-medium text-gray-700">
          Has this item been picked up?
        </p>
        <div className="flex gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name="pickedUp"
              checked={pickedUp === true}
              onChange={() => setPickedUp(true)}
              className="accent-[#E20021]"
            />
            Yes, I picked it up
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name="pickedUp"
              checked={pickedUp === false}
              onChange={() => setPickedUp(false)}
              className="accent-[#E20021]"
            />
            No, not yet
          </label>
        </div>
      </div>

      {/* Reason textarea */}
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

      {/* Info notice */}
      <div className="rounded-md bg-blue-50 p-3">
        <p className="text-xs text-blue-700">
          Physical item refund requests are reviewed by our team. You will
          receive an email notification once a decision has been made. Processing
          may take 3-5 business days.
        </p>
      </div>
    </RefundModal>
  );
}
