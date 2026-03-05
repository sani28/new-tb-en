"use client";

import { usePromoCheckout, TOUR_PRICES } from "./checkout/PromoCheckoutContext";

type StepStatus = "completed" | "active" | "pending";
function ProgressIndicator({ statuses }: { statuses: StepStatus[] }) {
  return (
    <div className="flex items-center justify-center gap-[10px] py-[18px] px-[18px] border-b border-[#eee] bg-white shrink-0" aria-hidden="true">
      {statuses.map((status, i) => (
        <div key={i} className="flex items-center gap-[10px]">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[14px] border-2 bg-white ${
            status === "completed" ? "border-[#2e7d32] text-[#2e7d32]"
            : status === "active"  ? "border-brand-red text-brand-red"
            :                        "border-[#ddd] text-[#666]"
          }`}>
            {i + 1}
          </div>
          {i < statuses.length - 1 && <div className="w-12 h-0.5 bg-[#e5e5e5]" />}
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

  if (step !== "bookingInfo") return null;

  const prices = TOUR_PRICES[selectedTourId] ?? TOUR_PRICES["tour01"]!;
  const ticketSubtotal = tourSkipped ? 0 : adultQty * prices.adult + childQty * prices.child;
  const addonsSubtotal = cartItems.reduce((s, i) => s + i.computedLinePrice, 0);
  const subtotal = ticketSubtotal + addonsSubtotal;

  const tourDateLabel = selectedDate
    ? selectedDate.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })
    : "";

  const inputCls = "w-full py-3 px-3 border border-[#E5E5E5] rounded-lg text-[16px] focus:outline-none focus:border-brand-red";

  return (
    <div className="promo-modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) closeCheckout(); }}>
      <div
        className="promo-order-modal bg-white w-[90%] max-w-[600px] max-h-[90vh] rounded-xl overflow-hidden flex flex-col relative shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        role="dialog" aria-modal="true" aria-labelledby="promoStep3Title"
      >
        <button
          className="absolute top-[10px] right-[10px] w-[42px] h-[42px] rounded-full border-none bg-black/[0.06] text-[#333] text-[28px] leading-none cursor-pointer z-[2] flex items-center justify-center hover:bg-black/[0.10]"
          type="button" aria-label="Close" onClick={closeCheckout}
        >
          &times;
        </button>

        <div className="flex flex-col h-full min-h-0">
          <ProgressIndicator statuses={["completed", "completed", "active", "pending"]} />

          <div className="flex-1 overflow-y-auto min-h-0 p-[18px]">
            {/* Step header */}
            <div className="relative flex items-center bg-[#FF2D55] h-[60px] w-full rounded-[15px] overflow-hidden mb-6 max-md:h-[50px] max-md:mb-5">
              <div className="absolute left-[6px] top-1/2 -translate-y-1/2 w-12 h-12 bg-[#8B0014] rounded-full flex items-center justify-center text-white text-2xl font-bold border-2 border-white/10 max-md:w-9 max-md:h-9 max-md:text-lg max-md:left-[7px]">3</div>
              <div className="text-white text-xl font-semibold tracking-[0.5px] pl-[70px] max-md:text-base max-md:pl-[55px]" id="promoStep3Title">Enter Your Information</div>
            </div>

            {/* Back button */}
            <button
              className="inline-flex items-center justify-center gap-[6px] bg-white border-2 border-brand-red text-brand-red text-[14px] font-bold px-5 py-[10px] mb-4 rounded-lg cursor-pointer transition-all hover:bg-brand-red hover:text-white"
              type="button" onClick={goBackFromBookingInfo}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>Back</span>
            </button>

            {/* Order summary */}
            <div className="step2-order-summary bg-[#f8f9fa] rounded-xl p-5 mb-5">
              <h4 className="text-lg font-semibold mb-4">Order Summary</h4>

              {!tourSkipped && (
                <div className="mb-4">
                  <div className="text-sm font-semibold text-[#666] mb-3">Tour Tickets</div>
                  {tourDateLabel && (
                    <div className="inline-block text-[#E20021] text-sm font-semibold mb-3 px-3 py-2 bg-[rgba(226,0,33,0.08)] rounded-md">
                      {tourDateLabel}
                    </div>
                  )}
                  {adultQty > 0 && (
                    <div className="order-item flex justify-between items-center py-2">
                      <span>Adult × {adultQty}</span>
                      <span>${(adultQty * prices.adult).toFixed(2)}</span>
                    </div>
                  )}
                  {childQty > 0 && (
                    <div className="order-item flex justify-between items-center py-2">
                      <span>Child × {childQty}</span>
                      <span>${(childQty * prices.child).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}

              {cartItems.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-semibold text-[#666] mb-3">Add-ons</div>
                  {cartItems.map((item, i) => (
                    <div key={i} className="order-item addon-item flex justify-between items-center py-2">
                      <span>{item.name} × {item.quantity}</span>
                      <span>${item.computedLinePrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t-2 border-[#ddd]">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span><span>${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* User info form */}
            <form className="mt-5" id="promoUserInfoForm" onSubmit={(e) => { e.preventDefault(); proceedFromBookingInfo(); }}>
              <div className="mb-6">
                <label className="block mb-2 text-[#666] text-[16px]">Name</label>
                <input type="text" placeholder="Enter your full name" autoComplete="name" className={inputCls}
                  value={contactForm.name} onChange={(e) => setContactField("name", e.target.value)} />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-[#666] text-[16px]">Email</label>
                <input type="email" placeholder="Enter your email" autoComplete="email" className={inputCls}
                  value={contactForm.email} onChange={(e) => setContactField("email", e.target.value)} />
                <div className="flex items-center text-[#666] text-[14px] mt-2 gap-2">
                  <span className="w-4 h-4 bg-[#666] rounded-full text-white text-[12px] flex items-center justify-center shrink-0">i</span>
                  Your ticket will be sent to this email
                </div>
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-[#666] text-[16px]">Phone</label>
                <input type="tel" placeholder="Enter your phone number" autoComplete="tel" className={inputCls}
                  value={contactForm.phone} onChange={(e) => setContactField("phone", e.target.value)} />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-[#666] text-[16px]">Password</label>
                <input type="password" placeholder="Create a password" className={inputCls}
                  value={contactForm.password} onChange={(e) => setContactField("password", e.target.value)} />
                <div className="flex items-center text-[#666] text-[14px] mt-2 gap-2">
                  <span className="w-4 h-4 bg-[#666] rounded-full text-white text-[12px] flex items-center justify-center shrink-0">i</span>
                  For managing your bookings
                </div>
              </div>

              {/* Cancellation policy */}
              <div className="bg-[#FFF8E7] border border-[#F0D78C] rounded-lg p-4 mb-5">
                <p className="m-0 mb-3 text-[14px] text-[#333] font-semibold"><strong>Cancellation &amp; Refund Policy</strong></p>
                <ul className="m-0 pl-5 list-disc">
                  <li className="text-[13px] text-[#555] leading-[1.6] mb-1.5">100% refund for cancellations made 24 hours before the tour</li>
                  <li className="text-[13px] text-[#555] leading-[1.6] mb-1.5">50% refund for cancellations made 12 hours before the tour</li>
                  <li className="text-[13px] text-[#555] leading-[1.6] mb-1.5">No refund for cancellations made less than 12 hours before the tour</li>
                  <li className="text-[13px] text-[#555] leading-[1.6] mb-1.5">Night View Course (Tour 04) tickets are non-refundable on the day of the tour</li>
                  <li className="text-[13px] text-[#555] leading-[1.6] mb-1.5">Refund processing may take 3-5 business days</li>
                  <li className="text-[13px] text-[#555] leading-[1.6]">All times are based on local Seoul time (KST)</li>
                </ul>
              </div>

              {/* Terms */}
              <div className="mb-6">
                <div className="bg-[#F5F5F5] p-4 rounded-lg text-[14px] mb-4">
                  <p className="m-0 mb-2">1. Collection, use and purpose of personal information</p>
                  <p className="m-0 text-[#555]">- Minimum personal information is provided for identity verification and is used for boarding reservation, confirmation, change, and cancellation of other services.</p>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <input type="checkbox" id="promoTerms" className="w-4 h-4 cursor-pointer"
                    checked={contactForm.agreedToTerms}
                    onChange={(e) => setContactField("agreedToTerms", e.target.checked)} />
                  <label htmlFor="promoTerms" className="text-[14px] text-[#333] cursor-pointer">I agree to the Terms &amp; Conditions</label>
                </div>
                <div className="bg-[#F5F5F5] p-4 rounded-lg text-[14px] text-[#555]">
                  By proceeding, you agree to our booking terms, cancellation policy, and privacy policy.
                </div>
              </div>
            </form>
          </div>

          {/* Sticky bottom */}
          <div className="sticky bottom-0 bg-white border-t border-[#eee] py-[14px] px-[18px] shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
            <button
              className="border-none rounded-xl px-4 py-[14px] text-[15px] font-extrabold cursor-pointer w-full bg-brand-red text-white hover:bg-brand-dark-red transition-colors"
              type="button" onClick={proceedFromBookingInfo}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
