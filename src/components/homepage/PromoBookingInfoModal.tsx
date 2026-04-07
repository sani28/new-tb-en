"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePromoCheckout, TOUR_PRICES, getTourPrices, formatPrice } from "./checkout/PromoCheckoutContext";

type StepStatus = "completed" | "active" | "pending";
function ProgressIndicator({ statuses }: { statuses: StepStatus[] }) {
  return (
    <div className="flex items-center justify-center gap-[10px] py-[18px] px-[18px] bg-[#001e53] shrink-0" aria-hidden="true">
      {statuses.map((status, i) => (
        <div key={i} className="flex items-center gap-[10px]">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[13px] border-2 ${
            status === "completed" ? "border-white bg-white text-[#001e53]"
            : status === "active"  ? "border-[#FF0000] bg-[#FF0000] text-white"
            :                        "border-white/30 text-white/40"
          }`}>
            {status === "completed" ? "✓" : i + 1}
          </div>
          {i < statuses.length - 1 && <div className="w-8 h-px bg-white/20" />}
        </div>
      ))}
    </div>
  );
}

export default function PromoBookingInfoModal() {
  const {
    step, cartItems, selectedTourId, selectedDate, adultQty, childQty, tourSkipped,
    contactForm, setContactField,
    proceedFromBookingInfo, goBackFromBookingInfo, closeCheckout,
  } = usePromoCheckout();

  const t = useTranslations("PromoModal");
  const tc = useTranslations("Common");
  const locale = useLocale();
  const localeTag = locale === "ko" ? "ko-KR" : "en-US";

  if (step !== "bookingInfo") return null;

  const allPrices = getTourPrices(locale);
  const prices = allPrices[selectedTourId] ?? allPrices["tour01"]!;
  const ticketSubtotal = tourSkipped ? 0 : adultQty * prices.adult + childQty * prices.child;
  const addonsSubtotal = cartItems.reduce((s, i) => s + i.computedLinePrice, 0);
  const subtotal = ticketSubtotal + addonsSubtotal;

  const tourDateLabel = selectedDate
    ? selectedDate.toLocaleDateString(localeTag, { weekday: "short", year: "numeric", month: "short", day: "numeric" })
    : "";

  const inputCls = "w-full py-3 px-3 border border-[#E5E5E5] rounded-lg text-[16px] focus:outline-none focus:border-brand-red";

  return (
    <div className="promo-modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) closeCheckout(); }}>
      <div
        className="promo-order-modal bg-white w-[90%] max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col relative shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        style={{ borderRadius: "4px", fontFamily: "'SUIT-Bold', sans-serif" }}
        role="dialog" aria-modal="true" aria-labelledby="promoStep3Title"
      >
        <button className="absolute top-[10px] right-[10px] w-[42px] h-[42px] border-none bg-white/10 text-white text-[28px] leading-none cursor-pointer z-[2] flex items-center justify-center hover:bg-white/20"
          type="button" aria-label="Close" onClick={closeCheckout}>&times;</button>

        <div className="flex flex-col h-full min-h-0">
          <ProgressIndicator statuses={["completed", "completed", "active", "pending"]} />

          <div className="flex-1 overflow-y-auto min-h-0 p-[18px]">
            <h2 id="promoStep3Title" className="text-[18px] text-black mb-6" style={{ fontFamily: "'SUIT-Heavy', sans-serif" }}>
              {t("enterYourInfo")}
            </h2>

            <button
              className="inline-flex items-center justify-center gap-[6px] bg-white border-2 border-[#FF0000] text-[#FF0000] text-[13px] font-bold px-4 py-2 mb-4 cursor-pointer transition-all hover:bg-[#FF0000] hover:text-white"
              style={{ borderRadius: "2px" }}
              type="button" onClick={goBackFromBookingInfo}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="15 18 9 12 15 6" /></svg>
              <span>{tc("back").replace("← ", "")}</span>
            </button>

            {/* Order summary */}
            <div className="step2-order-summary bg-[#f8f9fa] rounded-xl p-5 mb-5">
              <h4 className="text-lg font-semibold mb-4">{tc("orderSummary")}</h4>

              {!tourSkipped && (
                <div className="mb-4">
                  <div className="text-sm font-semibold text-[#666] mb-3">{tc("tourTickets")}</div>
                  {tourDateLabel && (
                    <div className="inline-block text-[#E20021] text-sm font-semibold mb-3 px-3 py-2 bg-[rgba(226,0,33,0.08)] rounded-md">
                      {tourDateLabel}
                    </div>
                  )}
                  {adultQty > 0 && (
                    <div className="order-item flex justify-between items-center py-2">
                      <span>{tc("adult")} × {adultQty}</span>
                      <span>{formatPrice(adultQty * prices.adult, locale)}</span>
                    </div>
                  )}
                  {childQty > 0 && (
                    <div className="order-item flex justify-between items-center py-2">
                      <span>{tc("child")} × {childQty}</span>
                      <span>{formatPrice(childQty * prices.child, locale)}</span>
                    </div>
                  )}
                </div>
              )}

              {cartItems.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-semibold text-[#666] mb-3">{tc("addOns")}</div>
                  {cartItems.map((item, i) => (
                    <div key={i} className="order-item addon-item flex justify-between items-center py-2">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{formatPrice(item.computedLinePrice, locale)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t-2 border-[#ddd]">
                <div className="flex justify-between mb-2">
                  <span>{t("subtotal")}</span><span>{formatPrice(subtotal, locale)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>{tc("total")}</span><span>{formatPrice(subtotal, locale)}</span>
                </div>
              </div>
            </div>

            {/* User info form */}
            <form className="mt-5" id="promoUserInfoForm" onSubmit={(e) => { e.preventDefault(); proceedFromBookingInfo(); }}>
              <div className="mb-6">
                <label className="block mb-2 text-[#666] text-[16px]">{t("name")}</label>
                <input type="text" placeholder={t("namePlaceholder")} autoComplete="name" className={inputCls}
                  value={contactForm.name} onChange={(e) => setContactField("name", e.target.value)} />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-[#666] text-[16px]">{t("email")}</label>
                <input type="email" placeholder={t("emailPlaceholder")} autoComplete="email" className={inputCls}
                  value={contactForm.email} onChange={(e) => setContactField("email", e.target.value)} />
                <div className="flex items-center text-[#666] text-[14px] mt-2 gap-2">
                  <span className="w-4 h-4 bg-[#666] rounded-full text-white text-[12px] flex items-center justify-center shrink-0">i</span>
                  {t("emailInfo")}
                </div>
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-[#666] text-[16px]">{t("phone")}</label>
                <input type="tel" placeholder={t("phonePlaceholder")} autoComplete="tel" className={inputCls}
                  value={contactForm.phone} onChange={(e) => setContactField("phone", e.target.value)} />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-[#666] text-[16px]">{t("password")}</label>
                <input type="password" placeholder={t("passwordPlaceholder")} className={inputCls}
                  value={contactForm.password} onChange={(e) => setContactField("password", e.target.value)} />
                <div className="flex items-center text-[#666] text-[14px] mt-2 gap-2">
                  <span className="w-4 h-4 bg-[#666] rounded-full text-white text-[12px] flex items-center justify-center shrink-0">i</span>
                  {t("passwordInfo")}
                </div>
              </div>

              {/* Cancellation policy */}
              <div className="bg-[#FFF8E7] border border-[#F0D78C] rounded-lg p-4 mb-5">
                <p className="m-0 mb-3 text-[14px] text-[#333] font-semibold"><strong>{t("cancellationTitle")}</strong></p>
                <ul className="m-0 pl-5 list-disc">
                  <li className="text-[13px] text-[#555] leading-[1.6] mb-1.5">{t("refund100")}</li>
                  <li className="text-[13px] text-[#555] leading-[1.6] mb-1.5">{t("refund50")}</li>
                  <li className="text-[13px] text-[#555] leading-[1.6] mb-1.5">{t("noRefund")}</li>
                  <li className="text-[13px] text-[#555] leading-[1.6] mb-1.5">{t("nightNonRefundable")}</li>
                  <li className="text-[13px] text-[#555] leading-[1.6] mb-1.5">{t("refundProcessing")}</li>
                  <li className="text-[13px] text-[#555] leading-[1.6]">{t("seoulTime")}</li>
                </ul>
              </div>

              {/* Terms */}
              <div className="mb-6">
                <div className="bg-[#F5F5F5] p-4 rounded-lg text-[14px] mb-4">
                  <p className="m-0 mb-2">{t("personalInfo")}</p>
                  <p className="m-0 text-[#555]">{t("personalInfoDetail")}</p>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <input type="checkbox" id="promoTerms" className="w-4 h-4 cursor-pointer"
                    checked={contactForm.agreedToTerms}
                    onChange={(e) => setContactField("agreedToTerms", e.target.checked)} />
                  <label htmlFor="promoTerms" className="text-[14px] text-[#333] cursor-pointer">{t("agreeTerms")}</label>
                </div>
                <div className="bg-[#F5F5F5] p-4 rounded-lg text-[14px] text-[#555]">
                  {t("termsFooter")}
                </div>
              </div>
            </form>
          </div>

          {/* Sticky bottom */}
          <div className="sticky bottom-0 bg-[#001e53] border-t border-white/10 py-[14px] px-[18px] shrink-0">
            <button
              className="border-none px-4 py-[14px] text-[14px] font-bold cursor-pointer w-full uppercase tracking-wide bg-[#FF0000] text-white hover:bg-[#E00000] transition-colors"
              style={{ borderRadius: "2px" }}
              type="button" onClick={proceedFromBookingInfo}
            >
              {t("continueToPayment")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
