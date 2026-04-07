"use client";

import { useState } from "react";
import type { BookingLineItem } from "@/types/booking";
import RefundModal from "./RefundModal";
import { formatCurrency } from "./refundHelpers";

const USAGE_LABELS = {
  unused: { label: "Not yet used", color: "bg-green-50 text-green-800" },
  partially_used: {
    label: "Partially used",
    color: "bg-orange-50 text-orange-700",
  },
  fully_used: { label: "Fully used", color: "bg-red-50 text-red-800" },
} as const;

export default function ValidityPassRefundModal({
  item,
  onClose,
  onSubmit,
}: {
  item: BookingLineItem;
  onClose: () => void;
  onSubmit: (lineItemId: string, reason: string) => void;
}) {
  const [reason, setReason] = useState("");

  const isFullyUsed = item.usageStatus === "fully_used";
  const isExpired = item.validUntil
    ? new Date(item.validUntil).getTime() < Date.now()
    : false;
  const blocked = isFullyUsed || isExpired;
  const canSubmit = !blocked && reason.trim().length > 0;

  const usageCfg = item.usageStatus
    ? USAGE_LABELS[item.usageStatus]
    : USAGE_LABELS.unused;

  return (
    <RefundModal
      title="Request Refund — Validity Pass"
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
          {item.adultQty != null && (
            <p>
              Adult x{item.adultQty}
              {item.childQty ? `, Child x${item.childQty}` : ""}
            </p>
          )}
          <p>Total: {formatCurrency(item.lineTotal, item.currency)}</p>
        </div>
      </div>

      {/* Validity period */}
      <div className="mb-4 rounded-md bg-gray-50 p-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">
            Valid until:{" "}
            {item.validUntil
              ? new Date(item.validUntil).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "—"}
          </p>
          <span
            className={`inline-block rounded px-2 py-1 text-xs font-medium ${usageCfg.color}`}
          >
            {usageCfg.label}
          </span>
        </div>
      </div>

      {/* Blocked notices */}
      {isFullyUsed && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
          <p className="text-sm font-medium text-red-700">
            This pass has been fully used and is not eligible for a refund.
          </p>
        </div>
      )}

      {isExpired && !isFullyUsed && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
          <p className="text-sm font-medium text-red-700">
            This pass has expired and is no longer eligible for a refund.
          </p>
        </div>
      )}

      {/* Reason textarea */}
      {!blocked && (
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
          Validity pass refund requests require verification of usage status by
          our team. Processing may take 3-5 business days.
        </p>
      </div>
    </RefundModal>
  );
}
