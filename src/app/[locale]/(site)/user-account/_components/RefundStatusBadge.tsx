"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { RefundStatus } from "@/types/booking";

export default function RefundStatusBadge({
  status,
  deniedReason,
}: {
  status: RefundStatus;
  deniedReason?: string;
}) {
  const [showReason, setShowReason] = useState(false);
  const t = useTranslations("Bookings");

  if (status === "none") return null;

  const configs: Record<Exclude<RefundStatus, "none">, { bg: string; text: string; label: string }> = {
    requested: { bg: "bg-yellow-50", text: "text-yellow-800", label: t("requested") },
    approved: { bg: "bg-green-50", text: "text-green-800", label: t("approved") },
    denied: { bg: "bg-red-50", text: "text-red-800", label: t("denied") },
    refunded: { bg: "bg-gray-100", text: "text-gray-500", label: t("refunded") },
  };

  const cfg = configs[status];

  return (
    <div className="relative inline-block">
      <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${cfg.bg} ${cfg.text}`}>
        {cfg.label}
        {status === "denied" && deniedReason && (
          <button
            type="button"
            className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-200 text-[10px] font-bold text-red-800"
            onClick={() => setShowReason(!showReason)}
            aria-label="Show denial reason"
          >
            ?
          </button>
        )}
      </span>
      {showReason && deniedReason && (
        <div className="absolute left-0 top-full z-10 mt-1 w-56 rounded-md border border-gray-200 bg-white p-3 text-xs text-gray-700 shadow-lg">
          <p>{deniedReason}</p>
        </div>
      )}
    </div>
  );
}
