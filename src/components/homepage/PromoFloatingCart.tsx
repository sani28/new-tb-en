"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePromoCheckout, TOUR_META, TOUR_NAMES, getTourMeta, getTourName, formatPrice } from "./checkout/PromoCheckoutContext";
import { promoProductData } from "@/lib/data/promoProducts";

export default function PromoFloatingCart() {
  const {
    cartItems, count, total, origTotal,
    timerText, timerExpiring, cartExpanded, toast,
    step, selectedTourId, selectedDate, adultQty, childQty,
    tourReservedAt, reservationTimeLeft, reservationExpiring,
    removeFromCart, setCartExpanded, openTourSelection,
    resumeFromReservation, cancelReservation,
  } = usePromoCheckout();

  const tc = useTranslations("Common");
  const locale = useLocale();
  const localeTag = locale === "ko" ? "ko-KR" : "en-US";

  const savings = origTotal - total;
  const visible = count > 0;
  const reservationVisible = !!tourReservedAt && step === "idle";

  // Show the new-style bar for both reservation state AND when cart has items from homepage
  const showNewBar = reservationVisible || (visible && step === "idle");

  const cartItemRows = cartItems.map((item, index) => {
    const product = promoProductData[item.productId] as { image?: string | null; placeholder?: string | null } | undefined;
    const imageUrl = item.image ?? product?.image ?? null;
    const placeholder = item.placeholder ?? product?.placeholder ?? "🛒";
    const linePrice = item.computedLinePrice;

    let metaInfo = "";
    if (item.type === "physical") metaInfo = `${item.variant}${item.color ? ` - ${item.color}` : ""}`;
    else if (item.type === "scheduled") metaInfo = `${item.selectedDate ?? ""} ${item.selectedTime ?? ""}`.trim();
    else if (item.type === "cruise") metaInfo = `${item.cruiseTypeName ?? item.variant} - ${item.selectedDate ?? ""} ${item.selectedTimeSlot ?? ""}`.trim();
    else if (item.type === "validityPass") metaInfo = `Valid until ${item.validUntil ?? "N/A"}`;

    return { index, item, imageUrl, placeholder, linePrice, metaInfo };
  });

  const tourMeta = getTourMeta(selectedTourId, locale);
  const tourName = getTourName(selectedTourId, locale);
  const reservationDateLabel = selectedDate
    ? selectedDate.toLocaleDateString(localeTag, { weekday: "short", month: "short", day: "numeric" })
    : "";

  // Use first cart item image as fallback when no tour is reserved
  const barImage = tourMeta?.image ?? cartItems[0]?.image ?? null;
  const barTitle = reservationVisible
    ? tourName
    : `${count} ${count !== 1 ? (locale === "ko" ? "개 상품" : "items") : (locale === "ko" ? "개 상품" : "item")}`;

  return (
    <>
      {/* New-style dark bar — shows for both reservation and cart-with-items */}
      {showNewBar && (
        <div className="fixed inset-x-0 bottom-0 z-[var(--z-cart-bar)] bg-[#1a1a2e] text-white shadow-[0_-4px_20px_rgba(0,0,0,0.25)] transition-transform duration-300">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3 max-md:flex-col max-md:items-start max-md:gap-2">
            <div className="flex items-center gap-4 min-w-0">
              {reservationVisible && barImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={barImage} alt="" className="h-10 w-14 shrink-0 rounded-lg object-cover" />
              ) : (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/80">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                </div>
              )}
              <div className="min-w-0">
                <div className="truncate text-[14px] font-bold ko-scale-ipad-md">{barTitle}</div>
                <div className="flex flex-wrap items-center gap-2 text-[12px] text-white/70 ko-scale-ipad-xs">
                  {reservationDateLabel && <span>{reservationDateLabel}</span>}
                  {reservationVisible && adultQty > 0 && <span>{adultQty} {adultQty > 1 ? tc("adults") : tc("adult")}</span>}
                  {reservationVisible && childQty > 0 && <span>{childQty} {childQty > 1 ? tc("children") : tc("child")}</span>}
                  {!reservationVisible && <span>{tc("total")}: {formatPrice(total, locale)}</span>}
                </div>
              </div>
              {reservationTimeLeft && (
                <span className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-bold ${reservationExpiring ? "bg-[#E20021] text-white" : "bg-white/20 text-white"}`}>
                  ⏱ {reservationTimeLeft}
                </span>
              )}
              {!reservationVisible && timerText && (
                <span className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-bold ${timerExpiring ? "bg-[#E20021] text-white" : "bg-white/20 text-white"}`}>
                  ⏱ {timerText}
                </span>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {reservationVisible ? (
                <>
                  <button
                    type="button"
                    className="rounded-lg border border-white/30 bg-transparent px-4 py-2 text-[13px] font-semibold text-white/80 hover:bg-white/10 transition-colors ko-scale-ipad-btn"
                    onClick={cancelReservation}
                  >
                    {locale === "ko" ? "취소" : "Cancel"}
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-brand-red px-5 py-2 text-[13px] font-bold text-white hover:bg-[#C4001C] transition-colors ko-scale-ipad-btn"
                    onClick={resumeFromReservation}
                  >
                    {locale === "ko" ? "예약 계속하기 →" : "Continue Booking →"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="rounded-lg border border-white/30 bg-transparent px-4 py-2 text-[13px] font-semibold text-white/80 hover:bg-white/10 transition-colors ko-scale-ipad-btn"
                    onClick={() => setCartExpanded(!cartExpanded)}
                  >
                    {cartExpanded
                      ? (locale === "ko" ? "카트 닫기" : "Hide Cart")
                      : (locale === "ko" ? "카트 보기" : "View Cart")}
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-brand-red px-5 py-2 text-[13px] font-bold text-white hover:bg-[#C4001C] transition-colors ko-scale-ipad-btn"
                    onClick={() => {
                      setCartExpanded(false);
                      openTourSelection({ tourOptional: true, pendingItems: [] });
                    }}
                  >
                    {locale === "ko" ? "예약 계속하기 →" : "Continue Booking →"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Expanded cart panel */}
          {cartExpanded && !reservationVisible && cartItemRows.length > 0 && (
            <div className="border-t border-white/10 bg-[#111827]">
              <div className="mx-auto max-w-[1200px] px-5 py-4">
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {cartItemRows.map(({ index, item, imageUrl, placeholder, linePrice, metaInfo }) => (
                    <div key={index} className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                      <div className="size-12 shrink-0 overflow-hidden rounded-lg">
                        {imageUrl
                          ? <img src={imageUrl} alt={item.name} className="size-full object-cover" /> /* eslint-disable-line @next/next/no-img-element */
                          : <div className="size-full flex items-center justify-center bg-white/10 text-lg">{placeholder}</div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-white truncate ko-scale-ipad-btn">{item.name}</div>
                        {metaInfo && <div className="text-[11px] text-white/50">{metaInfo}</div>}
                      </div>
                      <div className="text-[14px] font-bold text-white ko-scale-ipad-md">{formatPrice(linePrice, locale)}</div>
                      <button
                        type="button"
                        className="shrink-0 size-7 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white text-sm"
                        onClick={() => removeFromCart(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                  {savings > 0.005 && origTotal > 0 && (
                    <span className="text-[13px] text-[#4CAF50] font-semibold">
                      {tc("youSave")}: {Math.round((savings / origTotal) * 100)}%
                    </span>
                  )}
                  <span className="text-[15px] font-bold text-white ml-auto">
                    {tc("total")}: {formatPrice(total, locale)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div id="promoCartToast" className="show" role="status" aria-live="polite" aria-atomic="true">
          <div className="inline-flex items-center gap-[10px] py-[14px] px-[18px] rounded-[14px] bg-white/[0.96] border border-black/[0.08] text-[#0f172a] shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-[10px]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="#16A34A" />
              <path d="M7.5 12.2l3 3 6-6" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[15px] font-extrabold tracking-[0.2px]">{toast}</span>
          </div>
        </div>
      )}
    </>
  );
}
