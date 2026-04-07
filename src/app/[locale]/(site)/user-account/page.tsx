"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type {
  BookingLineItem,
  BookingResponseExpanded,
} from "@/types/booking";
import BookingsTable from "./_components/BookingsTable";
import TourRefundModal from "./_components/TourRefundModal";
import PhysicalRefundModal from "./_components/PhysicalRefundModal";
import ScheduledRefundModal from "./_components/ScheduledRefundModal";
import ValidityPassRefundModal from "./_components/ValidityPassRefundModal";
import CruiseRefundModal from "./_components/CruiseRefundModal";

/* ── placeholder user (replace with real auth) ── */
const USER_INFO = {
  email: "sanny@kakao.com",
  nickname: "Sani",
  registration: "kakao.com",
};

/* ── helper: date N days from now as ISO string ── */
function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

/* ── Realistic mock bookings covering every product type ── */
function buildMockBookings(): BookingResponseExpanded[] {
  return [
    // ─── Booking 1: Tour + physical addon + scheduled addon ───
    {
      bookingId: "bk-001",
      referenceCode: "REF-20260405-001",
      status: "confirmed",
      payment: { currency: "USD", subtotal: 77, discounts: 0, total: 77 },
      tourId: "tour01",
      tourName: "Tour 01 Downtown Namsan Palace Course",
      tourDate: daysFromNow(2),
      purchasedAt: "2026-04-05T09:30:00+09:00",
      lineItems: [
        {
          lineItemId: "li-001-tour",
          kind: "tour",
          productId: "tour01",
          productName: "Tour 01 Downtown Namsan Palace Course",
          unitPrice: 22,
          quantity: 3,
          lineTotal: 60,
          currency: "USD",
          adultQty: 2,
          childQty: 1,
          tourDate: daysFromNow(2),
          status: "active",
          refundStatus: "none",
        },
        {
          lineItemId: "li-001-kwangjuyo",
          kind: "physical",
          productId: "kwangjuyo",
          productName: "Kwangjuyo Ceramics",
          unitPrice: 25,
          quantity: 2,
          lineTotal: 50,
          currency: "USD",
          variant: "Sound Cup",
          color: "Soft Blush",
          pickupStatus: "not_picked_up",
          tourOptional: false,
          status: "active",
          refundStatus: "none",
        },
        {
          lineItemId: "li-001-sejong",
          kind: "scheduled",
          productId: "sejong-backstage",
          productName: "Backstage Pass Sejong Centre",
          unitPrice: 8,
          quantity: 2,
          lineTotal: 13,
          currency: "USD",
          adultQty: 1,
          childQty: 1,
          selectedDate: daysFromNow(2),
          selectedTime: "14:00",
          tourOptional: false,
          status: "active",
          refundStatus: "none",
        },
      ],
    },

    // ─── Booking 2: Exclusive (tour04-based) + cruise ───
    {
      bookingId: "bk-002",
      referenceCode: "REF-20260401-002",
      status: "confirmed",
      payment: { currency: "USD", subtotal: 130, discounts: 0, total: 130 },
      tourId: "tour04",
      tourName: "BTS the City Seoul — Night",
      tourDate: daysFromNow(5),
      purchasedAt: "2026-04-01T15:00:00+09:00",
      lineItems: [
        {
          lineItemId: "li-002-bts",
          kind: "exclusive",
          productId: "pkg-bts-night",
          productName: "BTS the City Seoul — Night",
          unitPrice: 45,
          quantity: 2,
          lineTotal: 80,
          currency: "USD",
          adultQty: 1,
          childQty: 1,
          tourDate: daysFromNow(5),
          basedOnTourId: "tour04",
          status: "active",
          refundStatus: "none",
        },
        {
          lineItemId: "li-002-cruise",
          kind: "cruise",
          productId: "han-river-cruise",
          productName: "Han River Cruise",
          unitPrice: 30,
          quantity: 2,
          lineTotal: 50,
          currency: "USD",
          adultQty: 1,
          childQty: 1,
          cruiseType: "sunset",
          cruiseTypeName: "Sunset Cruise",
          selectedDate: daysFromNow(5),
          selectedTimeSlot: "5:00 PM - 9:00 PM",
          tourOptional: false,
          status: "active",
          refundStatus: "none",
        },
      ],
    },

    // ─── Booking 3: Validity pass + hanbok (refund requested) + expired tour ───
    {
      bookingId: "bk-003",
      referenceCode: "REF-20260310-003",
      status: "confirmed",
      payment: { currency: "USD", subtotal: 82, discounts: 0, total: 82 },
      tourId: "tour02",
      tourName: "Tour 02 Panorama Course",
      tourDate: "2026-03-15T10:00:00+09:00",
      purchasedAt: "2026-03-10T11:00:00+09:00",
      lineItems: [
        {
          lineItemId: "li-003-tour02",
          kind: "tour",
          productId: "tour02",
          productName: "Tour 02 Panorama Course",
          unitPrice: 22,
          quantity: 2,
          lineTotal: 42,
          currency: "USD",
          adultQty: 1,
          childQty: 1,
          tourDate: "2026-03-15T10:00:00+09:00",
          status: "expired",
          refundStatus: "none",
        },
        {
          lineItemId: "li-003-museum",
          kind: "validityPass",
          productId: "museum-pass",
          productName: "Museum Pass",
          unitPrice: 25,
          quantity: 2,
          lineTotal: 40,
          currency: "USD",
          adultQty: 1,
          childQty: 1,
          validUntil: "2026-06-30",
          usageStatus: "unused",
          tourOptional: false,
          status: "active",
          refundStatus: "none",
        },
        {
          lineItemId: "li-003-hanbok",
          kind: "scheduled",
          productId: "hanbok-rental",
          productName: "Hanbok Rental",
          unitPrice: 20,
          quantity: 1,
          lineTotal: 20,
          currency: "USD",
          adultQty: 1,
          selectedDate: "2026-04-20",
          selectedTime: "10:00",
          tourOptional: true,
          status: "active",
          refundStatus: "requested",
          refundRequestedAt: "2026-04-06T14:00:00+09:00",
        },
      ],
    },

    // ─── Booking 4: Old booking with a denied refund ───
    {
      bookingId: "bk-004",
      referenceCode: "REF-20260220-004",
      status: "confirmed",
      payment: { currency: "USD", subtotal: 45, discounts: 0, total: 45 },
      tourId: "tour01",
      tourName: "Tour 01 Downtown Namsan Palace Course",
      tourDate: "2026-02-25T09:00:00+09:00",
      purchasedAt: "2026-02-20T08:00:00+09:00",
      lineItems: [
        {
          lineItemId: "li-004-tour",
          kind: "tour",
          productId: "tour01",
          productName: "Tour 01 Downtown Namsan Palace Course",
          unitPrice: 22,
          quantity: 1,
          lineTotal: 22,
          currency: "USD",
          adultQty: 1,
          tourDate: "2026-02-25T09:00:00+09:00",
          status: "used",
          refundStatus: "none",
        },
        {
          lineItemId: "li-004-kwangjuyo",
          kind: "physical",
          productId: "kwangjuyo",
          productName: "Kwangjuyo Ceramics",
          unitPrice: 25,
          quantity: 1,
          lineTotal: 25,
          currency: "USD",
          variant: "Sound Cup",
          color: "White",
          pickupStatus: "picked_up",
          tourOptional: false,
          status: "active",
          refundStatus: "denied",
          refundDeniedReason:
            "Item was already picked up and opened. Physical items that have been collected are not eligible for refund per our policy.",
          refundRequestedAt: "2026-02-26T10:00:00+09:00",
          refundResolvedAt: "2026-02-28T16:00:00+09:00",
        },
      ],
    },
  ];
}

type ModalState = {
  item: BookingLineItem;
  allLineItems: BookingLineItem[];
} | null;

export default function UserAccountPage() {
  const t = useTranslations("UserAccount");
  const locale = useLocale();
  const [couponCode, setCouponCode] = useState("");
  const [bookings, setBookings] = useState<BookingResponseExpanded[]>(
    buildMockBookings,
  );
  const [activeModal, setActiveModal] = useState<ModalState>(null);

  /* ── Handlers ── */

  function handleRefundAction(
    item: BookingLineItem,
    allLineItems: BookingLineItem[],
  ) {
    setActiveModal({ item, allLineItems });
  }

  function closeModal() {
    setActiveModal(null);
  }

  /** Tour/exclusive: auto-process cancellation. */
  function handleTourCancel(
    lineItemId: string,
    refundAmount: number,
    percentage: number,
  ) {
    setBookings((prev) =>
      prev.map((b) => ({
        ...b,
        lineItems: b.lineItems.map((li) => {
          if (li.lineItemId === lineItemId) {
            return {
              ...li,
              status: "cancelled" as const,
              refundStatus: percentage === 100 ? ("refunded" as const) : ("approved" as const),
              refundAmount,
              refundPercentage: percentage,
            };
          }
          // Cascade cancel non-optional addons in the same booking
          if (
            activeModal &&
            activeModal.allLineItems.some((a) => a.lineItemId === li.lineItemId) &&
            li.lineItemId !== lineItemId &&
            !li.tourOptional &&
            li.kind !== "tour" &&
            li.kind !== "exclusive" &&
            li.status === "active"
          ) {
            return {
              ...li,
              status: "cancelled" as const,
              refundStatus: "approved" as const,
              refundAmount: li.lineTotal,
              refundPercentage: 100,
            };
          }
          return li;
        }),
      })),
    );
    closeModal();
  }

  /** Add-on team review: mark as "requested". */
  function handleRefundRequest(lineItemId: string) {
    setBookings((prev) =>
      prev.map((b) => ({
        ...b,
        lineItems: b.lineItems.map((li) =>
          li.lineItemId === lineItemId
            ? {
                ...li,
                refundStatus: "requested" as const,
                refundRequestedAt: new Date().toISOString(),
              }
            : li,
        ),
      })),
    );
    closeModal();
  }

  /* ── Render modal based on active item kind ── */
  function renderModal() {
    if (!activeModal) return null;
    const { item, allLineItems } = activeModal;

    switch (item.kind) {
      case "tour":
      case "exclusive":
        return (
          <TourRefundModal
            item={item}
            allLineItems={allLineItems}
            onClose={closeModal}
            onConfirm={handleTourCancel}
          />
        );
      case "physical":
        return (
          <PhysicalRefundModal
            item={item}
            onClose={closeModal}
            onSubmit={(id, _reason, _pickedUp) => handleRefundRequest(id)}
          />
        );
      case "scheduled":
        return (
          <ScheduledRefundModal
            item={item}
            onClose={closeModal}
            onSubmit={(id) => handleRefundRequest(id)}
          />
        );
      case "validityPass":
        return (
          <ValidityPassRefundModal
            item={item}
            onClose={closeModal}
            onSubmit={(id) => handleRefundRequest(id)}
          />
        );
      case "cruise":
        return (
          <CruiseRefundModal
            item={item}
            onClose={closeModal}
            onSubmit={(id) => handleRefundRequest(id)}
          />
        );
      default:
        return null;
    }
  }

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-6 min-h-[calc(100vh-600px)] md:px-5 md:py-10">
      {/* User Information */}
      <section className="mb-5 rounded-xl bg-white p-4 shadow-sm md:mb-8 md:p-8">
        <h2 className="mb-5 text-2xl font-semibold text-gray-800">
          {t("userInfo")}
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {(
            [
              [t("emailLabel"), USER_INFO.email],
              [t("nickname"), USER_INFO.nickname],
              [t("registration"), USER_INFO.registration],
              [t("adsAgreement"), locale === "ko" ? "동의" : "Yes"],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="mb-2">
              <div className="text-sm text-gray-500">{label}:</div>
              <div className="mt-1 font-medium text-gray-800">{value}</div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <button className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm transition-colors hover:bg-gray-100">
            {t("edit")}
          </button>
          <button className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm transition-colors hover:bg-gray-100">
            {t("cancelAccount")}
          </button>
        </div>
      </section>

      {/* My Bookings */}
      <section className="rounded-xl bg-white p-4 shadow-sm md:p-8">
        <h2 className="mb-5 text-2xl font-semibold text-gray-800">
          {t("myBookings")}
        </h2>
        <BookingsTable
          bookings={bookings}
          onRefundAction={handleRefundAction}
        />
      </section>

      {/* Coupon Section */}
      <section className="mt-5 rounded-xl bg-white p-4 shadow-sm md:mt-8 md:p-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-800 md:mb-5 md:text-2xl">{t("coupon")}</h2>
        <div className="mb-5 flex gap-2.5">
          <input
            type="text"
            placeholder={t("enterCoupon")}
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-3 text-base"
          />
          <button className="cursor-pointer rounded-md bg-[#E20021] px-6 py-3 font-medium text-white transition-colors hover:bg-[#cc0000]">
            {t("register")}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border-b border-gray-300 px-3 py-3 font-medium text-gray-800">
                  {t("colCoupon")}
                </th>
                <th className="border-b border-gray-300 px-3 py-3 font-medium text-gray-800">
                  {t("colBenefits")}
                </th>
                <th className="border-b border-gray-300 px-3 py-3 font-medium text-gray-800">
                  {t("colIssuedDate")}
                </th>
                <th className="border-b border-gray-300 px-3 py-3 font-medium text-gray-800">
                  {t("colUsePeriod")}
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Coupon rows will be populated from API */}
            </tbody>
          </table>
        </div>
      </section>

      {/* Refund modals */}
      {renderModal()}
    </main>
  );
}
