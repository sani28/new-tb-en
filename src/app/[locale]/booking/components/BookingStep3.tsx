"use client";

import { useTranslations, useLocale } from "next-intl";
import { useBookingStep1 } from "../step1/store";
import { useBookingCart } from "../cart/useBookingCart";
import {
  getBookingCartOriginalTotal,
  getBookingCartTotal,
  type BookingCartItem,
} from "../lib/cart";
import type { SelectedTour } from "./BookingPackageStep";

type Props = {
  isSubmitting: boolean;
  error: string | null;
  selectedTour: SelectedTour | null;
  onBack: () => void;
  onMakePayment: () => void;
};

function formatUsd(n: number) {
  return `$${n.toFixed(2)}`;
}

function buildAddonMeta(item: BookingCartItem, adultLabel: string, childLabel: string) {
  if (item.type === "scheduled") {
    const dateStr = item.selectedDate ?? "";
    const timeStr = item.selectedTime ? ` @ ${item.selectedTime}` : "";
    let meta = `${dateStr}${timeStr}`.trim();
    if (item.adultQty || item.childQty) {
      meta += `${meta ? " " : ""}• ${adultLabel}: ${item.adultQty || 0}, ${childLabel}: ${item.childQty || 0}`;
    }
    return meta;
  }
  if (item.type === "physical") {
    return `${item.variant}${item.color ? ` - ${item.color}` : ""}`;
  }
  if (item.type === "validityPass") {
    return `${adultLabel}: ${item.adultQty || 0}, ${childLabel}: ${item.childQty || 0}`;
  }
  return item.variant || "";
}

export default function BookingStep3({ isSubmitting, error, selectedTour, onBack, onMakePayment }: Props) {
  const step1 = useBookingStep1();
  const cart = useBookingCart();
  const locale = useLocale();
  const localeTag = locale === "ko" ? "ko-KR" : "en-US";
  const t = useTranslations("BookingStep4");
  const tc = useTranslations("Common");

  const adultPrice = selectedTour?.adultPrice ?? 0;
  const childPrice = selectedTour?.childPrice ?? 0;
  const adultLineTotal = step1.adultCount * adultPrice;
  const childLineTotal = step1.childCount * childPrice;
  const ticketsTotal = adultLineTotal + childLineTotal;

  const addonsTotal = getBookingCartTotal(cart.items);
  const addonsOriginal = getBookingCartOriginalTotal(cart.items);

  const grandTotal = ticketsTotal + addonsTotal;
  const grandOriginal = ticketsTotal + addonsOriginal;
  const savings = grandOriginal - grandTotal;

  const dateLabel = step1.selectedDate
    ? step1.selectedDate.toLocaleDateString(localeTag, { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <>
      {/* Step Title */}
      <div className="flex items-center gap-3 border-b border-[#eee] px-6 py-5">
        <span className="flex size-8 items-center justify-center rounded-full bg-brand-red text-base font-semibold text-white">4</span>
        <span className="text-lg font-semibold text-text-dark">{t("stepTitle")}</span>
      </div>
      <div className="p-6 max-md:p-4">
        <button className="mb-2.5 border-none bg-transparent py-2.5 text-base text-text-gray hover:text-text-dark" onClick={onBack}>{tc("back")}</button>

        {/* Read-only Order Summary */}
        <div className="mb-5 rounded-xl bg-[#f8f9fa] p-5">
          <h4 className="mb-4 text-lg font-semibold">{tc("orderSummary")}</h4>

          <div className="mb-4">
            <div className="mb-3 text-sm font-semibold text-text-gray">{tc("tourTickets")}</div>
            {dateLabel && <div className="mb-3 inline-block rounded-md bg-brand-red/[0.08] px-3 py-2 text-sm font-semibold text-brand-red">{dateLabel}</div>}

            {step1.adultCount > 0 && (
              <div className="flex items-center justify-between border-b border-[#eee] py-3">
                <div className="flex items-center gap-3">
                  <div>
                    <h5 className="mb-1 text-sm font-semibold">{selectedTour?.name ?? "Tour"}</h5>
                    <span className="text-xs text-text-gray">{tc("adult")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-text-gray">× {step1.adultCount}</span>
                  <div className="text-right">
                    <span className="text-base font-semibold text-brand-red">{formatUsd(adultLineTotal)}</span>
                  </div>
                </div>
              </div>
            )}

            {step1.childCount > 0 && (
              <div className="flex items-center justify-between border-b border-[#eee] py-3">
                <div className="flex items-center gap-3">
                  <div>
                    <h5 className="mb-1 text-sm font-semibold">{selectedTour?.name ?? "Tour"}</h5>
                    <span className="text-xs text-text-gray">{tc("child")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-text-gray">× {step1.childCount}</span>
                  <div className="text-right">
                    <span className="text-base font-semibold text-brand-red">{formatUsd(childLineTotal)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {cart.items.length > 0 && (
            <div className="mb-4">
              <div className="mb-3 text-sm font-semibold text-text-gray">{tc("addOns")}</div>
              {cart.items.map((item, index) => {
                const itemTotal = item.computedLinePrice ?? item.price * item.quantity;
                const meta = buildAddonMeta(item, tc("adult"), tc("child"));
                return (
                  <div className="flex items-center justify-between border-b border-[#eee] py-3" key={`${item.productId}-${index}`}>
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="size-[60px] rounded-lg object-cover" />
                      ) : (
                        <div className="flex size-[60px] items-center justify-center rounded-lg bg-[#f5f5f5] text-2xl">
                          {item.placeholder || "📦"}
                        </div>
                      )}
                      <div>
                        <h5 className="mb-1 text-sm font-semibold">{item.name}</h5>
                        <span className="text-xs text-text-gray">{meta}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-text-gray">× {item.quantity}</span>
                      <div className="text-right">
                        <span className="text-base font-semibold text-brand-red">{formatUsd(itemTotal)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4 border-t-2 border-[#ddd] pt-4">
            {savings > 0 && (
              <div className="mb-2 flex justify-between text-[#4CAF50]">
                <span>{tc("youSave")}</span>
                <span>-{formatUsd(savings)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold">
              <span>{tc("total")}</span>
              <span>{formatUsd(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-5">
          <div>
            <h4 className="mb-3 text-base font-semibold">{t("creditDebitCard")}</h4>
            <div className="mb-5 flex gap-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-[30px] w-auto" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-[30px] w-auto" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" alt="American Express" className="h-[30px] w-auto" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#ddd] p-3 hover:border-brand-red">
              <img src="https://developers.kakao.com/tool/resource/static/img/button/pay/payment_icon_yellow_medium.png" alt="KakaoPay" className="h-6 w-auto" />
              <span>KakaoPay</span>
            </div>
            <div className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#ddd] p-3 hover:border-brand-red">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Naver_Logotype.svg/2560px-Naver_Logotype.svg.png" alt="NaverPay" className="h-6 w-auto" />
              <span>NaverPay</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-brand-red bg-[#fff0f0] px-4 py-3 text-sm text-brand-red">
            {error}
          </div>
        )}

        <button
          className={`mt-5 w-full rounded-lg bg-brand-red p-4 text-base font-semibold text-white transition-colors hover:bg-brand-dark-red${isSubmitting ? " opacity-70" : ""}`}
          onClick={onMakePayment}
          disabled={isSubmitting}
        >
          {isSubmitting ? t("processing") : t("makePayment")}
        </button>

        <div className="mt-5 text-center text-xs text-text-gray">
          {t("securedBy")} <a href="#" className="text-brand-red">{t("termsConditions")}</a>
        </div>
      </div>
    </>
  );
}
