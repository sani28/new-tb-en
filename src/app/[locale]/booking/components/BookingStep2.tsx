"use client";

import { useTranslations, useLocale } from "next-intl";
import { bookingStep1Store, useBookingStep1 } from "../step1/store";
import { bookingCartStore } from "../cart/store";
import { useBookingCart } from "../cart/useBookingCart";
import {
  getBookingCartItemCount,
  getBookingCartOriginalTotal,
  getBookingCartTotal,
  type BookingCartItem,
} from "../lib/cart";
import type { SelectedTour } from "./BookingPackageStep";

export type ContactInfo = {
  fullName: string;
  email: string;
  phone: string;
  termsAgreed: boolean;
  marketingAgreed: boolean;
};

type Props = {
  contact: ContactInfo;
  onContactChange: (next: ContactInfo) => void;
  selectedTour: SelectedTour | null;
  onBack: () => void;
  onContinue: () => void;
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

export default function BookingStep2({ contact, onContactChange, selectedTour, onBack, onContinue }: Props) {
  const step1 = useBookingStep1();
  const cart = useBookingCart();
  const locale = useLocale();
  const localeTag = locale === "ko" ? "ko-KR" : "en-US";
  const t = useTranslations("BookingStep3");
  const tc = useTranslations("Common");

  const adultPrice = selectedTour?.adultPrice ?? 0;
  const childPrice = selectedTour?.childPrice ?? 0;
  const adultLineTotal = step1.adultCount * adultPrice;
  const childLineTotal = step1.childCount * childPrice;
  const ticketsTotal = adultLineTotal + childLineTotal;

  const addonsTotal = getBookingCartTotal(cart.items);
  const addonsOriginal = getBookingCartOriginalTotal(cart.items);
  const addonsCount = getBookingCartItemCount(cart.items);

  const grandTotal = ticketsTotal + addonsTotal;
  const grandOriginal = ticketsTotal + addonsOriginal;
  const savings = grandOriginal - grandTotal;

  const dateLabel = step1.selectedDate
    ? step1.selectedDate.toLocaleDateString(localeTag, { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : null;

  const set = (field: keyof ContactInfo, value: string | boolean) =>
    onContactChange({ ...contact, [field]: value });

  return (
    <>
      {/* Step Title */}
      <div className="flex items-center gap-3 border-b border-[#eee] px-6 py-5">
        <span className="flex size-8 items-center justify-center rounded-full bg-brand-red text-base font-semibold text-white">3</span>
        <span className="text-lg font-semibold text-text-dark">{t("stepTitle")}</span>
      </div>
      <div className="p-6 max-md:p-4">
        <button className="mb-2.5 border-none bg-transparent py-2.5 text-base text-text-gray hover:text-text-dark" onClick={onBack}>{tc("back")}</button>

        {/* Order Summary */}
        <div className="mb-5 rounded-xl bg-[#f8f9fa] p-5">
          <h4 className="mb-4 text-lg font-semibold">{tc("orderSummary")}</h4>

          <div className="mb-4">
            <div className="mb-3 text-sm font-semibold text-text-gray">{tc("tourTickets")}</div>
            {dateLabel && (
              <div className="mb-3 inline-block rounded-md bg-brand-red/[0.08] px-3 py-2 text-sm font-semibold text-brand-red">{dateLabel}</div>
            )}

            {step1.adultCount > 0 && (
              <div className="flex items-center justify-between border-b border-[#eee] py-3">
                <div className="flex items-center gap-3">
                  <div>
                    <h5 className="mb-1 text-sm font-semibold">{selectedTour?.name ?? "Tour"}</h5>
                    <span className="text-xs text-text-gray">{tc("adult")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button className="flex size-7 cursor-pointer items-center justify-center rounded border border-[#ddd] bg-white" onClick={() => bookingStep1Store.dec("adult")}>-</button>
                    <span className="font-semibold">{step1.adultCount}</span>
                    <button className="flex size-7 cursor-pointer items-center justify-center rounded border border-[#ddd] bg-white" onClick={() => bookingStep1Store.inc("adult")}>+</button>
                  </div>
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
                  <div className="flex items-center gap-2">
                    <button className="flex size-7 cursor-pointer items-center justify-center rounded border border-[#ddd] bg-white" onClick={() => bookingStep1Store.dec("child")}>-</button>
                    <span className="font-semibold">{step1.childCount}</span>
                    <button className="flex size-7 cursor-pointer items-center justify-center rounded border border-[#ddd] bg-white" onClick={() => bookingStep1Store.inc("child")}>+</button>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-semibold text-brand-red">{formatUsd(childLineTotal)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {addonsCount > 0 && (
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
                      <div className="flex items-center gap-2">
                        <button
                          className="flex size-7 cursor-pointer items-center justify-center rounded border border-[#ddd] bg-white"
                          onClick={() => bookingCartStore.updateItemQuantity(index, Math.max(1, item.quantity - 1))}
                        >-</button>
                        <span className="font-semibold">{item.quantity}</span>
                        <button
                          className="flex size-7 cursor-pointer items-center justify-center rounded border border-[#ddd] bg-white"
                          onClick={() => bookingCartStore.updateItemQuantity(index, item.quantity + 1)}
                        >+</button>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-semibold text-brand-red">{formatUsd(itemTotal)}</span>
                      </div>
                      <button
                        className="ml-2 rounded border-none bg-transparent px-2 py-1 text-lg text-[#999] transition-all hover:bg-brand-red/10 hover:text-brand-red"
                        onClick={() => bookingCartStore.removeIndex(index)}
                      >×</button>
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

        {/* Contact Info Form */}
        <div>
          <div className="mb-5">
            <label htmlFor="full-name" className="mb-2 block text-sm font-semibold text-text-dark">{t("fullName")}</label>
            <input type="text" id="full-name" placeholder={t("fullNamePlaceholder")} value={contact.fullName} onChange={(e) => set("fullName", e.target.value)} className="w-full rounded-lg border border-[#ddd] px-4 py-3.5 text-[15px] focus:border-brand-red focus:outline-none" />
          </div>
          <div className="mb-5">
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-text-dark">{t("email")}</label>
            <input type="email" id="email" placeholder={t("emailPlaceholder")} value={contact.email} onChange={(e) => set("email", e.target.value)} className="w-full rounded-lg border border-[#ddd] px-4 py-3.5 text-[15px] focus:border-brand-red focus:outline-none" />
            <div className="mt-2 flex items-center gap-2 text-xs text-text-gray">
              <span className="flex size-4 items-center justify-center rounded-full bg-[#ddd] text-[10px]">i</span>
              <span>{t("emailInfo")}</span>
            </div>
          </div>
          <div className="mb-5">
            <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-text-dark">{t("phone")}</label>
            <input type="tel" id="phone" placeholder={t("phonePlaceholder")} value={contact.phone} onChange={(e) => set("phone", e.target.value)} className="w-full rounded-lg border border-[#ddd] px-4 py-3.5 text-[15px] focus:border-brand-red focus:outline-none" />
          </div>

          <div className="mb-5 rounded-lg border border-[#ffc107] bg-[#fff8e1] p-4">
            <p className="mb-2.5 text-sm font-bold">{t("cancellationTitle")}</p>
            <ul className="m-0 pl-5">
              <li className="mb-1.5 text-[13px] text-text-gray">{t("refund100")}</li>
              <li className="mb-1.5 text-[13px] text-text-gray">{t("refund50")}</li>
              <li className="mb-1.5 text-[13px] text-text-gray">{t("noRefund")}</li>
              <li className="mb-1.5 text-[13px] text-text-gray">{t("nightNonRefundable")}</li>
              <li className="mb-1.5 text-[13px] text-text-gray">{t("refundProcessing")}</li>
              <li className="mb-0 text-[13px] text-text-gray">{t("seoulTime")}</li>
            </ul>
          </div>

          <div className="py-3">
            <div className="mb-4 max-h-[120px] overflow-y-auto rounded-lg bg-[#f8f9fa] p-4 text-[13px] text-text-gray">
              <p className="font-bold">{t("termsTitle")}</p>
              <p>{t("termsText")}</p>
            </div>
            <div className="mb-3 flex items-center gap-2.5">
              <input type="checkbox" id="terms-agree" checked={contact.termsAgreed} onChange={(e) => set("termsAgreed", e.target.checked)} className="size-[18px] cursor-pointer" />
              <label htmlFor="terms-agree" className="cursor-pointer text-sm text-text-dark">{t("agreeTerms")}</label>
            </div>
            <div className="mb-3 flex items-center gap-2.5">
              <input type="checkbox" id="marketing-agree" checked={contact.marketingAgreed} onChange={(e) => set("marketingAgreed", e.target.checked)} className="size-[18px] cursor-pointer" />
              <label htmlFor="marketing-agree" className="cursor-pointer text-sm text-text-dark">{t("agreeMarketing")}</label>
            </div>
          </div>
        </div>

        <button className="mt-5 w-full rounded-lg bg-brand-red p-4 text-base font-semibold text-white transition-colors hover:bg-brand-dark-red" onClick={onContinue}>{t("continueToPayment")}</button>
      </div>
    </>
  );
}
