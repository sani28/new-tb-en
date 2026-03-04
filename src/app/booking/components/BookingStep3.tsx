"use client";

import { useBookingStep1 } from "@/app/booking/step1/store";
import { bookingStep1Store } from "@/app/booking/step1/store";
import { useBookingCart } from "@/app/booking/cart/useBookingCart";
import {
  getBookingCartOriginalTotal,
  getBookingCartTotal,
  type BookingCartItem,
} from "@/app/booking/lib/cart";

type Props = {
  isSubmitting: boolean;
  error: string | null;
  onBack: () => void;
  onMakePayment: () => void;
};

const TOUR_NAMES: Record<string, string> = {
  tour01: "Downtown Palace Namsan Course",
  tour02: "Panorama Course",
  tour04: "Night View Course",
};

function formatUsd(n: number) {
  return `$${n.toFixed(2)}`;
}

function buildAddonMeta(item: BookingCartItem) {
  if (item.type === "scheduled") {
    const dateStr = item.selectedDate ?? "";
    const timeStr = item.selectedTime ? ` @ ${item.selectedTime}` : "";
    let meta = `${dateStr}${timeStr}`.trim();
    if (item.adultQty || item.childQty) {
      meta += `${meta ? " " : ""}• Adult: ${item.adultQty || 0}, Child: ${item.childQty || 0}`;
    }
    return meta;
  }
  if (item.type === "physical") {
    return `${item.variant}${item.color ? ` - ${item.color}` : ""}`;
  }
  if (item.type === "validityPass") {
    return `Adult: ${item.adultQty || 0}, Child: ${item.childQty || 0}`;
  }
  return item.variant || "";
}

export default function BookingStep3({ isSubmitting, error, onBack, onMakePayment }: Props) {
  const step1 = useBookingStep1();
  const cart = useBookingCart();

  const pricing = bookingStep1Store.getPricing(step1.tourId);
  const adultLineTotal = step1.adultCount * pricing.adult.current;
  const adultLineOriginal = step1.adultCount * pricing.adult.original;
  const childLineTotal = step1.childCount * pricing.child.current;
  const childLineOriginal = step1.childCount * pricing.child.original;

  const ticketsTotal = adultLineTotal + childLineTotal;
  const ticketsOriginal = adultLineOriginal + childLineOriginal;

  const addonsTotal = getBookingCartTotal(cart.items);
  const addonsOriginal = getBookingCartOriginalTotal(cart.items);

  const grandTotal = ticketsTotal + addonsTotal;
  const grandOriginal = ticketsOriginal + addonsOriginal;
  const savings = grandOriginal - grandTotal;

  const dateLabel = step1.selectedDate
    ? step1.selectedDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <>
      {/* Step Title */}
      <div className="flex items-center gap-3 border-b border-[#eee] px-6 py-5">
        <span className="flex size-8 items-center justify-center rounded-full bg-brand-red text-base font-semibold text-white">3</span>
        <span className="text-lg font-semibold text-text-dark">Payment</span>
      </div>
      <div className="p-6 max-md:p-4">
        <button className="mb-2.5 border-none bg-transparent py-2.5 text-base text-text-gray hover:text-text-dark" onClick={onBack}>← Back</button>

        {/* Read-only Order Summary */}
        <div className="mb-5 rounded-xl bg-[#f8f9fa] p-5">
          <h4 className="mb-4 text-lg font-semibold">Order Summary</h4>

          <div className="mb-4">
            <div className="mb-3 text-sm font-semibold text-text-gray">Tour Tickets</div>
            {dateLabel && <div className="mb-3 inline-block rounded-md bg-brand-red/[0.08] px-3 py-2 text-sm font-semibold text-brand-red">{dateLabel}</div>}

            {step1.adultCount > 0 && (
              <div className="flex items-center justify-between border-b border-[#eee] py-3">
                <div className="flex items-center gap-3">
                  <div>
                    <h5 className="mb-1 text-sm font-semibold">{TOUR_NAMES[step1.tourId] ?? step1.tourId}</h5>
                    <span className="text-xs text-text-gray">Adult</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-text-gray">× {step1.adultCount}</span>
                  <div className="text-right">
                    <span className="text-base font-semibold text-brand-red">{formatUsd(adultLineTotal)}</span>
                    {adultLineOriginal > adultLineTotal && (
                      <span className="ml-2 text-xs text-text-light-gray line-through">{formatUsd(adultLineOriginal)}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step1.childCount > 0 && (
              <div className="flex items-center justify-between border-b border-[#eee] py-3">
                <div className="flex items-center gap-3">
                  <div>
                    <h5 className="mb-1 text-sm font-semibold">{TOUR_NAMES[step1.tourId] ?? step1.tourId}</h5>
                    <span className="text-xs text-text-gray">Child</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-text-gray">× {step1.childCount}</span>
                  <div className="text-right">
                    <span className="text-base font-semibold text-brand-red">{formatUsd(childLineTotal)}</span>
                    {childLineOriginal > childLineTotal && (
                      <span className="ml-2 text-xs text-text-light-gray line-through">{formatUsd(childLineOriginal)}</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {cart.items.length > 0 && (
            <div className="mb-4">
              <div className="mb-3 text-sm font-semibold text-text-gray">Add-ons</div>
              {cart.items.map((item, index) => {
                const itemTotal = item.computedLinePrice ?? item.price * item.quantity;
                const meta = buildAddonMeta(item);
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
            <div className="mb-2 flex justify-between">
              <span>Subtotal</span>
              <span>{formatUsd(grandOriginal)}</span>
            </div>
            {savings > 0 && (
              <div className="mb-2 flex justify-between text-[#4CAF50]">
                <span>You Save</span>
                <span>-{formatUsd(savings)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatUsd(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-5">
          <div>
            <h4 className="mb-3 text-base font-semibold">Credit/Debit Card</h4>
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
          {isSubmitting ? "Processing..." : "Make Payment"}
        </button>

        <div className="mt-5 text-center text-xs text-text-gray">
          Secured by Eximbay | <a href="#" className="text-brand-red">Terms &amp; Conditions</a>
        </div>
      </div>
    </>
  );
}
