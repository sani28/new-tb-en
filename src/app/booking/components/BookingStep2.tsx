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
      <div className="step-title-section">
        <span className="step-number">2</span>
        <span className="step-title">Your Information</span>
      </div>
      <div className="booking-inner-container">
        <button className="back-btn" onClick={onBack}>← Back</button>

        {/* Order Summary */}
        <div className="order-summary">
          <h4>Order Summary</h4>

          <div className="order-section">
            <div className="order-section-title">Tour Tickets</div>
            {dateLabel && (
              <div className="order-tour-date">{dateLabel}</div>
            )}

            {step1.adultCount > 0 && (
              <div className="order-item">
                <div className="order-item-info">
                  <div className="order-item-details">
                    <h5>{TOUR_NAMES[step1.tourId] ?? step1.tourId}</h5>
                    <span className="order-item-meta">Adult</span>
                  </div>
                </div>
                <div className="order-item-controls">
                  <div className="order-item-qty">
                    <button className="step2-ticket-decrease" onClick={() => bookingStep1Store.dec("adult")}>-</button>
                    <span>{step1.adultCount}</span>
                    <button className="step2-ticket-increase" onClick={() => bookingStep1Store.inc("adult")}>+</button>
                  </div>
                  <div className="order-item-price">
                    <span className="order-item-current">{formatUsd(adultLineTotal)}</span>
                  </div>
                </div>
              </div>
            )}

            {step1.childCount > 0 && (
              <div className="order-item">
                <div className="order-item-info">
                  <div className="order-item-details">
                    <h5>{TOUR_NAMES[step1.tourId] ?? step1.tourId}</h5>
                    <span className="order-item-meta">Child</span>
                  </div>
                </div>
                <div className="order-item-controls">
                  <div className="order-item-qty">
                    <button className="step2-ticket-decrease" onClick={() => bookingStep1Store.dec("child")}>-</button>
                    <span>{step1.childCount}</span>
                    <button className="step2-ticket-increase" onClick={() => bookingStep1Store.inc("child")}>+</button>
                  </div>
                  <div className="order-item-price">
                    <span className="order-item-current">{formatUsd(childLineTotal)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {addonsCount > 0 && (
            <div className="order-section">
              <div className="order-section-title">Add-ons</div>
              {cart.items.map((item, index) => {
                const itemTotal = item.computedLinePrice ?? item.price * item.quantity;
                const meta = buildAddonMeta(item);
                return (
                  <div className="order-item" key={`${item.productId}-${index}`}>
                    <div className="order-item-info">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="order-item-image" />
                      ) : (
                        <div
                          className="order-item-image"
                          style={{ background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", borderRadius: "8px" }}
                        >
                          {item.placeholder || "📦"}
                        </div>
                      )}
                      <div className="order-item-details">
                        <h5>{item.name}</h5>
                        <span className="order-item-meta">{meta}</span>
                      </div>
                    </div>
                    <div className="order-item-controls">
                      <div className="order-item-qty">
                        <button
                          className="step2-addon-decrease"
                          onClick={() => bookingCartStore.updateItemQuantity(index, Math.max(1, item.quantity - 1))}
                        >-</button>
                        <span>{item.quantity}</span>
                        <button
                          className="step2-addon-increase"
                          onClick={() => bookingCartStore.updateItemQuantity(index, item.quantity + 1)}
                        >+</button>
                      </div>
                      <div className="order-item-price">
                        <span className="order-item-current">{formatUsd(itemTotal)}</span>
                      </div>
                      <button
                        className="step2-remove-addon-btn"
                        onClick={() => bookingCartStore.removeIndex(index)}
                        title="Remove add-on"
                      >×</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="order-totals">
            <div className="subtotal">
              <span>Subtotal</span>
              <span>{formatUsd(grandOriginal)}</span>
            </div>
            {savings > 0 && (
              <div className="savings">
                <span>You Save</span>
                <span>-{formatUsd(savings)}</span>
              </div>
            )}
            <div className="total">
              <span>Total</span>
              <span>{formatUsd(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Contact Info Form */}
        <div className="user-info-form">
          <div className="form-group">
            <label htmlFor="full-name">Full Name *</label>
            <input
              type="text"
              id="full-name"
              placeholder="Enter your full name"
              value={contact.fullName}
              onChange={(e) => set("fullName", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={contact.email}
              onChange={(e) => set("email", e.target.value)}
            />
            <div className="info-text">
              <span className="info-icon">i</span>
              <span>Your ticket will be sent to this email</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              placeholder="Enter your phone number"
              value={contact.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </div>

          <div className="cancellation-policy-section">
            <p><strong>Cancellation &amp; Refund Policy</strong></p>
            <ul>
              <li>100% refund for cancellations made 24 hours before the tour</li>
              <li>50% refund for cancellations made 12 hours before the tour</li>
              <li>No refund for cancellations made less than 12 hours before the tour</li>
              <li>Night View Course (Tour 04) tickets are non-refundable on the day of the tour</li>
              <li>Refund processing may take 3-5 business days</li>
              <li>All times are based on local Seoul time (KST)</li>
            </ul>
          </div>

          <div className="terms-section">
            <div className="terms-text-box">
              <p><strong>Terms and Conditions</strong></p>
              <p>By proceeding with this booking, you agree to our terms of service and cancellation policy. Tickets are non-transferable and must be used on the selected date. Please arrive at least 15 minutes before departure time.</p>
            </div>
            <div className="terms-checkbox">
              <input
                type="checkbox"
                id="terms-agree"
                checked={contact.termsAgreed}
                onChange={(e) => set("termsAgreed", e.target.checked)}
              />
              <label htmlFor="terms-agree">I agree to the Terms and Conditions</label>
            </div>
            <div className="terms-checkbox">
              <input
                type="checkbox"
                id="marketing-agree"
                checked={contact.marketingAgreed}
                onChange={(e) => set("marketingAgreed", e.target.checked)}
              />
              <label htmlFor="marketing-agree">I agree to receive marketing communications (optional)</label>
            </div>
          </div>
        </div>

        <button className="continue-btn" onClick={onContinue}>Continue to Payment</button>
      </div>
    </>
  );
}
