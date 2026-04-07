"use client";

import { useTranslations } from "next-intl";
import { bookingStep1Store, useBookingStep1 } from "../step1/store";
import BookingCalendar from "./BookingCalendar";

type Props = {
  onContinue: () => void;
};

export default function BookingStep1({ onContinue }: Props) {
  const step1 = useBookingStep1();
  const t = useTranslations("BookingStep1");
  const tc = useTranslations("Common");

  return (
    <>
      {/* Step Title */}
      <div className="flex items-center gap-3 border-b border-[#eee] px-6 py-5">
        <span className="flex size-8 items-center justify-center rounded-full bg-brand-red text-base font-semibold text-white">1</span>
        <span className="text-lg font-semibold text-text-dark">{t("stepTitle")}</span>
      </div>
      <div className="p-6 max-md:p-4">

        {/* Date Selector */}
        <BookingCalendar
          selectedDate={step1.selectedDate}
          onDateSelect={(d) => bookingStep1Store.setSelectedDate(d)}
        />

        {/* Ticket Selection */}
        <div className="mb-5 flex gap-3">
          {/* Adult ticket */}
          <div className="flex-1 rounded-xl border border-[#eee] bg-[#f8f9fa] px-4 py-3" data-type="adult">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-text-dark">{tc("adult")}</div>
                <div className="text-xs text-text-gray">{t("agesAdult")}</div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-[#eee] bg-white px-2 py-1.5">
                <button className="flex size-6 cursor-pointer items-center justify-center rounded-md border border-[#ddd] bg-white text-sm hover:bg-[#f5f5f5]" onClick={() => bookingStep1Store.dec("adult")}>-</button>
                <input type="text" readOnly className="w-6 rounded-md border border-[#ddd] text-center text-sm" value={step1.adultCount} />
                <button className="flex size-6 cursor-pointer items-center justify-center rounded-md border border-[#ddd] bg-white text-sm hover:bg-[#f5f5f5]" onClick={() => bookingStep1Store.inc("adult")}>+</button>
              </div>
            </div>
          </div>
          {/* Child ticket */}
          <div className="flex-1 rounded-xl border border-[#eee] bg-[#f8f9fa] px-4 py-3" data-type="child">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-text-dark">{tc("child")}</div>
                <div className="text-xs text-text-gray">{t("agesChild")}</div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-[#eee] bg-white px-2 py-1.5">
                <button className="flex size-6 cursor-pointer items-center justify-center rounded-md border border-[#ddd] bg-white text-sm hover:bg-[#f5f5f5]" onClick={() => bookingStep1Store.dec("child")}>-</button>
                <input type="text" readOnly className="w-6 rounded-md border border-[#ddd] text-center text-sm" value={step1.childCount} />
                <button className="flex size-6 cursor-pointer items-center justify-center rounded-md border border-[#ddd] bg-white text-sm hover:bg-[#f5f5f5]" onClick={() => bookingStep1Store.inc("child")}>+</button>
              </div>
            </div>
          </div>
        </div>

        {/* Cancellation / Refund policy */}
        <div className="mt-5 rounded-xl bg-[#fff9e6] p-5">
          <h3 className="mb-3 text-base font-semibold text-text-dark">{t("cancellationTitle")}</h3>
          <div>
            <p className="mb-1.5 text-sm text-text-gray">• {t("refund100")}</p>
            <p className="mb-1.5 text-sm text-text-gray">• {t("refund90")}</p>
            <p className="mb-1.5 text-sm text-text-gray">• {t("refund80")}</p>
            <p className="mb-1.5 text-sm text-text-gray">• {t("refund70")}</p>
          </div>
          <p className="mt-3 text-xs text-brand-red">
            * {t("noRefundNight")}
          </p>
        </div>

        <button className="mt-5 w-full rounded-lg bg-brand-red p-4 text-base font-semibold text-white transition-colors hover:bg-brand-dark-red" onClick={onContinue}>{t("findAvailableTours")}</button>
      </div>
    </>
  );
}
