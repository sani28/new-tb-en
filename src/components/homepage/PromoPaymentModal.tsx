/* eslint-disable @next/next/no-img-element */
"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePromoCheckout, formatPrice } from "./checkout/PromoCheckoutContext";

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

export default function PromoPaymentModal() {
  const {
    step, cartItems, orderData,
    goBackFromPayment, makePayment, closeCheckout,
  } = usePromoCheckout();

  const t = useTranslations("PromoModal");
  const tc = useTranslations("Common");
  const locale = useLocale();

  if (step !== "payment") return null;

  const addonsTotal = cartItems.reduce((s, i) => s + i.computedLinePrice, 0);
  const ticketTotal = orderData
    ? orderData.adultQty * orderData.adultPrice + orderData.childQty * orderData.childPrice
    : 0;
  const subtotal = ticketTotal + addonsTotal;

  const origTicketTotal = orderData
    ? orderData.adultQty * orderData.adultOrigPrice + orderData.childQty * orderData.childOrigPrice
    : 0;
  const origAddonsTotal = cartItems.reduce((s, i) => s + (i.originalPrice ?? i.price) * i.quantity, 0);
  const origTotal = origTicketTotal + origAddonsTotal;
  const savings = origTotal - subtotal;

  return (
    <div className="promo-modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) closeCheckout(); }}>
      <div
        className="promo-order-modal bg-white w-[90%] max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col relative shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        style={{ borderRadius: "4px", fontFamily: "'SUIT-Bold', sans-serif" }}
        role="dialog" aria-modal="true" aria-labelledby="promoPaymentTitle"
      >
        <button className="absolute top-[10px] right-[10px] w-[42px] h-[42px] border-none bg-white/10 text-white text-[28px] leading-none cursor-pointer z-[2] flex items-center justify-center hover:bg-white/20"
          type="button" aria-label="Close" onClick={closeCheckout}>&times;</button>

        <div className="flex flex-col h-full min-h-0">
          <ProgressIndicator statuses={["completed", "completed", "completed", "active"]} />

          <div className="flex-1 overflow-y-auto min-h-0 p-[18px]">
            <div className="mb-4">
              <div className="text-[18px] font-semibold text-[#333]" id="promoPaymentTitle">{t("paymentInfo")}</div>
            </div>

            {/* Order summary */}
            <div className="bg-[#f8f9fa] rounded-xl p-5 mb-5 border border-[#eee]">
              <h4 className="text-[18px] font-semibold m-0 mb-4">{tc("orderSummary")}</h4>

              {orderData && (orderData.adultQty > 0 || orderData.childQty > 0) && (
                <div className="mb-4">
                  <div className="text-[14px] font-semibold text-[#666] mb-3">{tc("tourTickets")}</div>
                  {orderData.tourDate && (
                    <div className="text-brand-red text-[14px] font-semibold mb-3">{orderData.tourDate}</div>
                  )}
                  {orderData.adultQty > 0 && (
                    <div className="flex justify-between text-[14px] py-1">
                      <span>{tc("adult")} × {orderData.adultQty}</span>
                      <span>{formatPrice(orderData.adultQty * orderData.adultPrice, locale)}</span>
                    </div>
                  )}
                  {orderData.childQty > 0 && (
                    <div className="flex justify-between text-[14px] py-1">
                      <span>{tc("child")} × {orderData.childQty}</span>
                      <span>{formatPrice(orderData.childQty * orderData.childPrice, locale)}</span>
                    </div>
                  )}
                </div>
              )}

              {cartItems.length > 0 && (
                <div className="mb-4">
                  <div className="text-[14px] font-semibold text-[#666] mb-3">{tc("addOns")}</div>
                  {cartItems.map((item, i) => (
                    <div key={i} className="flex justify-between text-[14px] py-1">
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
                {savings > 0.005 && (
                  <div className="flex justify-between mb-2">
                    <span>{tc("youSave")}</span><span className="text-[#2e7d32]">-{formatPrice(savings, locale)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[18px] font-bold">
                  <span>{tc("total")}</span><span>{formatPrice(subtotal, locale)}</span>
                </div>
              </div>
            </div>

            {/* Payment methods */}
            <div className="mb-5">
              <div className="mb-4">
                <h4 className="text-[16px] font-semibold mb-3 m-0">Credit/Debit Card</h4>
                <div className="flex items-center gap-3 flex-wrap">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" style={{ height: 30, width: "auto" }} />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" style={{ height: 30, width: "auto" }} />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" alt="American Express" style={{ height: 30, width: "auto" }} />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 p-3 border border-[#eee] rounded-lg cursor-pointer hover:bg-[#f9f9f9]">
                  <img src="https://developers.kakao.com/tool/resource/static/img/button/pay/payment_icon_yellow_medium.png" alt="KakaoPay" style={{ height: 30, width: "auto" }} />
                  <span className="text-[14px] font-medium">KakaoPay</span>
                </div>
                <div className="flex items-center gap-3 p-3 border border-[#eee] rounded-lg cursor-pointer hover:bg-[#f9f9f9]">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Naver_Logotype.svg/2560px-Naver_Logotype.svg.png" alt="NaverPay" style={{ height: 30, width: "auto" }} />
                  <span className="text-[14px] font-medium">NaverPay</span>
                </div>
              </div>
            </div>

            <p className="text-center text-[12px] text-[#999] mb-4">
              {t("securedBy")}{" "}
              <a href="#" className="text-brand-red hover:underline">{t("termsConditions")}</a>
            </p>
          </div>

          {/* Sticky bottom */}
          <div className="sticky bottom-0 bg-[#001e53] border-t border-white/10 py-[14px] px-[18px] shrink-0">
            <div className="flex gap-[10px]">
              <button
                className="border-none px-4 py-[14px] text-[13px] font-bold cursor-pointer flex-[0_0_auto] bg-white/10 text-white hover:bg-white/20 transition-colors uppercase tracking-wide"
                style={{ borderRadius: "2px" }}
                type="button" onClick={goBackFromPayment}
              >
                {tc("back").replace("← ", "")}
              </button>
              <button
                className="border-none px-4 py-[14px] text-[14px] font-bold cursor-pointer flex-1 bg-[#FF0000] text-white hover:bg-[#E00000] transition-colors uppercase tracking-wide"
                style={{ borderRadius: "2px" }}
                type="button" onClick={makePayment}
              >
                {t("completePayment")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
