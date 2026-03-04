"use client";

import { bookingStep1Store, useBookingStep1 } from "@/app/booking/step1/store";
import { bookingCartStore } from "@/app/booking/cart/store";
import { useBookingCart } from "@/app/booking/cart/useBookingCart";
import {
  getBookingCartItemCount,
  getBookingCartOriginalTotal,
  getBookingCartTotal,
  type BookingCartItem,
} from "@/app/booking/lib/cart";

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
  onBack: () => void;
  onContinue: () => void;
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

export default function BookingStep2({ contact, onContactChange, onBack, onContinue }: Props) {
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
  const addonsCount = getBookingCartItemCount(cart.items);

  const grandTotal = ticketsTotal + addonsTotal;
  const grandOriginal = ticketsOriginal + addonsOriginal;
  const savings = grandOriginal - grandTotal;

  const dateLabel = step1.selectedDate
    ? step1.selectedDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : null;

  const set = (field: keyof ContactInfo, value: string | boolean) =>
    onContactChange({ ...contact, [field]: value });

  return (
    <>
      {/* Step Title */}
      <div className="flex items-center gap-3 border-b border-[#eee] px-6 py-5">
        <span className="flex size-8 items-center justify-center rounded-full bg-brand-red text-base font-semibold text-white">2</span>
        <span className="text-lg font-semibold text-text-dark">Your Information</span>
      </div>
      <div className="p-6 max-md:p-4">
        <button className="mb-2.5 border-none bg-transparent py-2.5 text-base text-text-gray hover:text-text-dark" onClick={onBack}>← Back</button>

        {/* Order Summary */}
        <div className="mb-5 rounded-xl bg-[#f8f9fa] p-5">
          <h4 className="mb-4 text-lg font-semibold">Order Summary</h4>

          <div className="mb-4">
            <div className="mb-3 text-sm font-semibold text-text-gray">Tour Tickets</div>
            {dateLabel && (
              <div className="mb-3 inline-block rounded-md bg-brand-red/[0.08] px-3 py-2 text-sm font-semibold text-brand-red">{dateLabel}</div>
            )}

            {step1.adultCount > 0 && (
              <div className="flex items-center justify-between border-b border-[#eee] py-3">
                <div className="flex items-center gap-3">
                  <div>
                    <h5 className="mb-1 text-sm font-semibold">{TOUR_NAMES[step1.tourId] ?? step1.tourId}</h5>
                    <span className="text-xs text-text-gray">Adult</span>
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
                    <h5 className="mb-1 text-sm font-semibold">{TOUR_NAMES[step1.tourId] ?? step1.tourId}</h5>
                    <span className="text-xs text-text-gray">Child</span>
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
                        title="Remove add-on"
                      >×</button>
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

        {/* Contact Info Form */}
        <div>
          <div className="mb-5">
            <label htmlFor="full-name" className="mb-2 block text-sm font-semibold text-text-dark">Full Name *</label>
            <input
              type="text"
              id="full-name"
              placeholder="Enter your full name"
              value={contact.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              className="w-full rounded-lg border border-[#ddd] px-4 py-3.5 text-[15px] focus:border-brand-red focus:outline-none"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-text-dark">Email Address *</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={contact.email}
              onChange={(e) => set("email", e.target.value)}
              className="w-full rounded-lg border border-[#ddd] px-4 py-3.5 text-[15px] focus:border-brand-red focus:outline-none"
            />
            <div className="mt-2 flex items-center gap-2 text-xs text-text-gray">
              <span className="flex size-4 items-center justify-center rounded-full bg-[#ddd] text-[10px]">i</span>
              <span>Your ticket will be sent to this email</span>
            </div>
          </div>
          <div className="mb-5">
            <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-text-dark">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              placeholder="Enter your phone number"
              value={contact.phone}
              onChange={(e) => set("phone", e.target.value)}
              className="w-full rounded-lg border border-[#ddd] px-4 py-3.5 text-[15px] focus:border-brand-red focus:outline-none"
            />
          </div>

          <div className="mb-5 rounded-lg border border-[#ffc107] bg-[#fff8e1] p-4">
            <p className="mb-2.5 text-sm font-bold">Cancellation &amp; Refund Policy</p>
            <ul className="m-0 pl-5">
              <li className="mb-1.5 text-[13px] text-text-gray">100% refund for cancellations made 24 hours before the tour</li>
              <li className="mb-1.5 text-[13px] text-text-gray">50% refund for cancellations made 12 hours before the tour</li>
              <li className="mb-1.5 text-[13px] text-text-gray">No refund for cancellations made less than 12 hours before the tour</li>
              <li className="mb-1.5 text-[13px] text-text-gray">Night View Course (Tour 04) tickets are non-refundable on the day of the tour</li>
              <li className="mb-1.5 text-[13px] text-text-gray">Refund processing may take 3-5 business days</li>
              <li className="mb-0 text-[13px] text-text-gray">All times are based on local Seoul time (KST)</li>
            </ul>
          </div>

          <div className="py-3">
            <div className="mb-4 max-h-[120px] overflow-y-auto rounded-lg bg-[#f8f9fa] p-4 text-[13px] text-text-gray">
              <p className="font-bold">Terms and Conditions</p>
              <p>By proceeding with this booking, you agree to our terms of service and cancellation policy. Tickets are non-transferable and must be used on the selected date. Please arrive at least 15 minutes before departure time.</p>
            </div>
            <div className="mb-3 flex items-center gap-2.5">
              <input
                type="checkbox"
                id="terms-agree"
                checked={contact.termsAgreed}
                onChange={(e) => set("termsAgreed", e.target.checked)}
                className="size-[18px] cursor-pointer"
              />
              <label htmlFor="terms-agree" className="cursor-pointer text-sm text-text-dark">I agree to the Terms and Conditions</label>
            </div>
            <div className="mb-3 flex items-center gap-2.5">
              <input
                type="checkbox"
                id="marketing-agree"
                checked={contact.marketingAgreed}
                onChange={(e) => set("marketingAgreed", e.target.checked)}
                className="size-[18px] cursor-pointer"
              />
              <label htmlFor="marketing-agree" className="cursor-pointer text-sm text-text-dark">I agree to receive marketing communications (optional)</label>
            </div>
          </div>
        </div>

        <button className="mt-5 w-full rounded-lg bg-brand-red p-4 text-base font-semibold text-white transition-colors hover:bg-brand-dark-red" onClick={onContinue}>Continue to Payment</button>
      </div>
    </>
  );
}
