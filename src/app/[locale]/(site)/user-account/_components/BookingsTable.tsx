"use client";

import { useTranslations, useLocale } from "next-intl";
import type {
  BookingLineItem,
  BookingResponseExpanded,
} from "@/types/booking";
import RefundStatusBadge from "./RefundStatusBadge";
import { isRefundEligible } from "./refundHelpers";

function getItemStatusKey(item: BookingLineItem): string {
  if (
    item.kind === "physical" &&
    item.status === "active" &&
    item.pickupStatus === "not_picked_up"
  ) {
    return "not_picked_up";
  }
  return item.status;
}

function useProductName(item: BookingLineItem) {
  const tp = useTranslations("ProductNames");
  const id = item.productId;
  try { return tp(id); } catch { return item.productName; }
}

function ProductNameDisplay({ item }: { item: BookingLineItem }) {
  const name = useProductName(item);
  return <div className="font-medium text-gray-800">{name}</div>;
}

function ProductMeta({ item }: { item: BookingLineItem }) {
  const t = useTranslations("Bookings");
  const locale = useLocale();
  const localeTag = locale === "ko" ? "ko-KR" : "en-US";
  const lines: string[] = [];

  switch (item.kind) {
    case "tour":
    case "exclusive":
      if (item.adultQty) lines.push(`${t("adult")} x${item.adultQty}`);
      if (item.childQty) lines.push(`${t("child")} x${item.childQty}`);
      if (item.tourDate) {
        lines.push(
          new Date(item.tourDate).toLocaleDateString(localeTag, {
            month: "short", day: "numeric", year: "numeric", timeZone: "Asia/Seoul",
          }),
        );
      }
      break;
    case "physical":
      if (item.variant) lines.push(`${t("variant")}: ${item.variant}`);
      if (item.color) lines.push(`${t("color")}: ${item.color}`);
      lines.push(`${t("qty")}: ${item.quantity}`);
      break;
    case "scheduled":
      if (item.selectedDate) {
        lines.push(
          `${t("date")}: ${new Date(item.selectedDate).toLocaleDateString(localeTag, {
            month: "short", day: "numeric", year: "numeric", timeZone: "Asia/Seoul",
          })}`,
        );
      }
      if (item.selectedTime) lines.push(`${t("time")}: ${item.selectedTime}`);
      if (item.adultQty) lines.push(`${t("adult")} x${item.adultQty}`);
      if (item.childQty) lines.push(`${t("child")} x${item.childQty}`);
      break;
    case "validityPass":
      if (item.validUntil) {
        lines.push(
          `${t("validUntil")}: ${new Date(item.validUntil).toLocaleDateString(localeTag, {
            month: "short", day: "numeric", year: "numeric",
          })}`,
        );
      }
      if (item.adultQty) lines.push(`${t("adult")} x${item.adultQty}`);
      if (item.childQty) lines.push(`${t("child")} x${item.childQty}`);
      break;
    case "cruise":
      if (item.cruiseTypeName) lines.push(item.cruiseTypeName);
      if (item.selectedDate) {
        lines.push(
          `${t("date")}: ${new Date(item.selectedDate).toLocaleDateString(localeTag, {
            month: "short", day: "numeric", year: "numeric", timeZone: "Asia/Seoul",
          })}`,
        );
      }
      if (item.selectedTimeSlot) lines.push(`${t("time")}: ${item.selectedTimeSlot}`);
      if (item.adultQty) lines.push(`${t("adult")} x${item.adultQty}`);
      if (item.childQty) lines.push(`${t("child")} x${item.childQty}`);
      break;
  }

  return (
    <>
      {lines.map((l) => (
        <span key={l} className="mt-0.5 block text-xs text-gray-400 md:text-sm">{l}</span>
      ))}
    </>
  );
}

function useStatusLabels() {
  const t = useTranslations("Bookings");
  return {
    active: { bg: "bg-green-50", text: "text-green-800", label: t("upcoming") },
    used: { bg: "bg-gray-100", text: "text-gray-600", label: t("used") },
    expired: { bg: "bg-red-50", text: "text-red-800", label: t("expired") },
    cancelled: { bg: "bg-gray-100", text: "text-gray-500", label: t("cancelled") },
    not_picked_up: { bg: "bg-orange-50", text: "text-orange-700", label: t("notPickedUp") },
  } as Record<string, { bg: string; text: string; label: string }>;
}

function useKindLabels() {
  const t = useTranslations("Bookings");
  return {
    tour: { bg: "bg-red-50", text: "text-red-800", label: t("tour") },
    exclusive: { bg: "bg-orange-50", text: "text-orange-800", label: t("exclusive") },
    physical: { bg: "bg-blue-50", text: "text-blue-800", label: t("productType") },
    scheduled: { bg: "bg-emerald-50", text: "text-emerald-800", label: t("scheduled") },
    validityPass: { bg: "bg-amber-50", text: "text-amber-800", label: t("pass") },
    cruise: { bg: "bg-purple-50", text: "text-purple-800", label: t("cruise") },
  } as Record<string, { bg: string; text: string; label: string }>;
}

function useRefundActionLabel() {
  const t = useTranslations("Bookings");
  return (kind: string) => {
    if (kind === "tour") return t("cancelTour");
    if (kind === "exclusive") return t("cancelPackage");
    return t("requestRefund");
  };
}

function MobileCard({ item, onAction }: { item: BookingLineItem; onAction: () => void }) {
  const statusStyles = useStatusLabels();
  const kindBadges = useKindLabels();
  const getActionLabel = useRefundActionLabel();
  const locale = useLocale();
  const productName = useProductName(item);

  const statusKey = getItemStatusKey(item);
  const statusCfg = statusStyles[statusKey] ?? statusStyles.active;
  const kindCfg = kindBadges[item.kind];
  const eligible = isRefundEligible(item);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-medium ${kindCfg.bg} ${kindCfg.text}`}>{kindCfg.label}</span>
        <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-medium ${statusCfg.bg} ${statusCfg.text}`}>{statusCfg.label}</span>
      </div>
      <p className="text-sm font-semibold text-gray-800">{productName}</p>
      <ProductMeta item={item} />
      <p className="mt-2 text-sm font-medium text-gray-700">
        {locale === "ko" ? `₩${item.lineTotal.toLocaleString()}` : `$${item.lineTotal.toFixed(2)}`}
      </p>
      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
        <RefundStatusBadge status={item.refundStatus} deniedReason={item.refundDeniedReason} />
        {eligible && (
          <button type="button" onClick={onAction} className="rounded-full bg-[#E20021] px-4 py-2 text-xs font-semibold text-white active:bg-[#cc0000]">
            {getActionLabel(item.kind)}
          </button>
        )}
      </div>
    </div>
  );
}

export default function BookingsTable({
  bookings,
  onRefundAction,
}: {
  bookings: BookingResponseExpanded[];
  onRefundAction: (item: BookingLineItem, allLineItems: BookingLineItem[]) => void;
}) {
  const t = useTranslations("Bookings");
  const locale = useLocale();
  const localeTag = locale === "ko" ? "ko-KR" : "en-US";
  const statusStyles = useStatusLabels();
  const kindBadges = useKindLabels();
  const getActionLabel = useRefundActionLabel();

  return (
    <>
      {/* Mobile: card layout */}
      <div className="flex flex-col gap-5 md:hidden">
        {bookings.map((booking) => (
          <div key={booking.bookingId}>
            <div className="mb-2 flex items-baseline gap-2">
              <span className="text-xs font-semibold text-gray-500">#{booking.referenceCode}</span>
              <span className="text-[11px] text-gray-400">
                {new Date(booking.purchasedAt).toLocaleDateString(localeTag, { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {booking.lineItems.map((item) => (
                <MobileCard key={item.lineItemId} item={item} onAction={() => onRefundAction(item, booking.lineItems)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table layout */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-base">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border-b border-gray-300 px-3 py-3 font-medium text-gray-800">{t("product")}</th>
              <th className="border-b border-gray-300 px-3 py-3 font-medium text-gray-800">{t("type")}</th>
              <th className="border-b border-gray-300 px-3 py-3 font-medium text-gray-800">{t("status")}</th>
              <th className="border-b border-gray-300 px-3 py-3 font-medium text-gray-800">{t("refund")}</th>
              <th className="border-b border-gray-300 px-3 py-3 font-medium text-gray-800">{t("action")}</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <>
                <tr key={`header-${booking.bookingId}`}>
                  <td colSpan={5} className="border-b border-gray-200 bg-gray-50 px-3 py-2">
                    <span className="text-xs font-semibold text-gray-500">{t("booking")} #{booking.referenceCode}</span>
                    <span className="ml-3 text-xs text-gray-400">
                      {new Date(booking.purchasedAt).toLocaleDateString(localeTag, { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                  </td>
                </tr>
                {booking.lineItems.map((item) => {
                  const statusKey = getItemStatusKey(item);
                  const statusCfg = statusStyles[statusKey] ?? statusStyles.active;
                  const kindCfg = kindBadges[item.kind];
                  const eligible = isRefundEligible(item);
                  return (
                    <tr key={item.lineItemId}>
                      <td className="border-b border-gray-200 px-3 py-3 text-gray-600">
                        <ProductNameDisplay item={item} />
                        <ProductMeta item={item} />
                      </td>
                      <td className="border-b border-gray-200 px-3 py-3">
                        <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${kindCfg.bg} ${kindCfg.text}`}>{kindCfg.label}</span>
                      </td>
                      <td className="border-b border-gray-200 px-3 py-3">
                        <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${statusCfg.bg} ${statusCfg.text}`}>{statusCfg.label}</span>
                      </td>
                      <td className="border-b border-gray-200 px-3 py-3">
                        <RefundStatusBadge status={item.refundStatus} deniedReason={item.refundDeniedReason} />
                      </td>
                      <td className="border-b border-gray-200 px-3 py-3">
                        {eligible && (
                          <button type="button" onClick={() => onRefundAction(item, booking.lineItems)} className="whitespace-nowrap text-sm font-medium text-[#E20021] hover:underline">
                            {getActionLabel(item.kind)}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
