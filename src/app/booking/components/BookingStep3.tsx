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
      <div className="step-title-section">
        <span className="step-number">3</span>
        <span className="step-title">Payment</span>
      </div>
      <div className="booking-inner-container">
        <button className="back-btn" onClick={onBack}>← Back</button>

        {/* Read-only Order Summary */}
        <div className="order-summary">
          <h4>Order Summary</h4>

          <div className="order-section">
            <div className="order-section-title">Tour Tickets</div>
            {dateLabel && <div className="order-tour-date">{dateLabel}</div>}

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
                    <span className="qty-display">× {step1.adultCount}</span>
                  </div>
                  <div className="order-item-price">
                    <span className="order-item-current">{formatUsd(adultLineTotal)}</span>
                    {adultLineOriginal > adultLineTotal && (
                      <span className="order-item-original">{formatUsd(adultLineOriginal)}</span>
                    )}
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
                    <span className="qty-display">× {step1.childCount}</span>
                  </div>
                  <div className="order-item-price">
                    <span className="order-item-current">{formatUsd(childLineTotal)}</span>
                    {childLineOriginal > childLineTotal && (
                      <span className="order-item-original">{formatUsd(childLineOriginal)}</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {cart.items.length > 0 && (
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
                        <span className="qty-display">× {item.quantity}</span>
                      </div>
                      <div className="order-item-price">
                        <span className="order-item-current">{formatUsd(itemTotal)}</span>
                      </div>
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

        {/* Payment Methods */}
        <div className="payment-methods">
          <div className="credit-card-section">
            <h4>Credit/Debit Card</h4>
            <div className="card-logos">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" alt="American Express" />
            </div>
          </div>
          <div className="alternative-payments">
            <div className="payment-option">
              <img src="https://developers.kakao.com/tool/resource/static/img/button/pay/payment_icon_yellow_medium.png" alt="KakaoPay" />
              <span>KakaoPay</span>
            </div>
            <div className="payment-option">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Naver_Logotype.svg/2560px-Naver_Logotype.svg.png" alt="NaverPay" />
              <span>NaverPay</span>
            </div>
          </div>
        </div>

        {error && (
          <div style={{ color: "#E20021", background: "#fff0f0", border: "1px solid #E20021", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px", fontSize: "14px" }}>
            {error}
          </div>
        )}

        <button
          className="continue-btn"
          onClick={onMakePayment}
          disabled={isSubmitting}
          style={{ opacity: isSubmitting ? 0.7 : 1 }}
        >
          {isSubmitting ? "Processing..." : "Make Payment"}
        </button>

        <div className="footer-info">
          Secured by Eximbay | <a href="#">Terms &amp; Conditions</a>
        </div>
      </div>
    </>
  );
}
