"use client";

import { usePromoCheckout } from "./checkout/PromoCheckoutContext";
import { promoProductData } from "@/lib/data/promoProducts";

export default function PromoFloatingCart() {
  const {
    cartItems, count, total, origTotal,
    timerText, timerExpiring, cartExpanded, toast,
    removeFromCart, setCartExpanded, openTourSelection,
  } = usePromoCheckout();

  const savings = origTotal - total;
  const visible = count > 0;

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

  if (!visible && !toast) return null;

  return (
    <>
      {/* Floating cart bar */}
      <div
        className={`promo-upsell-cart-bar ${visible ? "visible" : ""}`}
        aria-hidden={visible ? "false" : "true"}
      >
        {/* Expanded panel */}
        {cartExpanded && (
          <div className="cart-bar-expanded">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#eee]">
              <h4 className="m-0 text-[16px] font-semibold text-[#333]">Your Cart</h4>
              <button
                className="collapse-cart-btn bg-transparent border-none cursor-pointer text-[#666] p-1 flex items-center justify-center rounded hover:bg-[#f5f5f5] transition-colors"
                type="button"
                aria-label="Collapse cart"
                onClick={() => setCartExpanded(false)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </button>
            </div>

            <div className="cart-items-list">
              {cartItemRows.length === 0 ? (
                <div className="p-5 text-center text-[#666]">Your cart is empty</div>
              ) : (
                cartItemRows.map(({ index, item, imageUrl, placeholder, linePrice, metaInfo }) => (
                  <div key={index} className="cart-item">
                    <div className="cart-item-image">
                      {imageUrl
                        ? <img src={imageUrl} alt={item.name} /> /* eslint-disable-line @next/next/no-img-element */
                        : <div className="cart-item-placeholder">{placeholder}</div>
                      }
                    </div>
                    <div className="cart-item-details">
                      <div className="cart-item-name">{item.name}</div>
                      {metaInfo && (
                        <div className="cart-item-meta">
                          <div className="cart-item-meta-line">{metaInfo}</div>
                        </div>
                      )}
                      <div className="cart-item-price">${linePrice.toFixed(2)}</div>
                    </div>
                    <button
                      className="cart-item-remove"
                      type="button"
                      aria-label="Remove"
                      onClick={() => removeFromCart(index)}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="px-5 py-3 border-t border-[#eee]">
              {savings > 0.005 && (
                <div className="flex justify-between text-[14px] mb-1">
                  <span className="text-[#666]">You Save</span>
                  <span className="text-[#2e7d32] font-semibold">${savings.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[15px] font-bold">
                <span>Cart Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Bar row */}
        <div className="cart-bar-content">
          <div className="cart-bar-left">
            {timerText && (
              <span
                className={`promo-cart-timer show${timerExpiring ? " expiring" : ""}`}
                aria-live="polite"
              >
                {timerText}
              </span>
            )}
          </div>
          <div className="cart-bar-right">
            <div className="cart-bar-right-summary">
              <div className="cart-bar-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <span className="cart-badge">{count}</span>
              </div>
              <div className="cart-bar-right-meta">
                <span className="cart-bar-total">
                  Total: <strong>${total.toFixed(2)}</strong> USD
                </span>
              </div>
            </div>
            <div className="cart-bar-right-actions">
              <button
                className="view-cart-btn"
                type="button"
                onClick={() => setCartExpanded(!cartExpanded)}
              >
                {cartExpanded ? "Hide Cart" : "View Cart"}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points={cartExpanded ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
                </svg>
              </button>
              <button
                className="view-cart-btn"
                type="button"
                onClick={() => {
                  setCartExpanded(false);
                  openTourSelection({ tourOptional: true, pendingItems: [] });
                }}
              >
                Continue to Booking
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

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
