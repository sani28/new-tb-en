export default function PromoFloatingCart() {
  return (
    <>
      {/* Promo Floating Cart Summary Bar */}
      <div className="promo-upsell-cart-bar" id="promoUpsellCartBar" aria-hidden="true">
        <div className="cart-bar-expanded" id="promoCartExpanded">
          <div className="cart-expanded-header">
            <h4>Your Cart</h4>
            <button className="collapse-cart-btn" id="promoCollapseCartBtn" type="button" aria-label="Collapse cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </button>
          </div>
          <div className="cart-items-list" id="promoCartItemsList" />
          <div className="cart-expanded-footer">
            <div className="cart-savings" id="promoCartSavingsRow" style={{ display: "none" }}>
              <span>You Save</span>
              <span id="promoCartSavings">$0.00</span>
            </div>
            <div className="cart-total-row">
              <span>Cart Total</span>
              <span id="promoCartTotalExpanded">$0.00</span>
            </div>
          </div>
        </div>
        <div className="cart-bar-content">
          <div className="cart-bar-left">
            <span className="promo-cart-timer" id="promoCartTimer" aria-live="polite" />
          </div>
          <div className="cart-bar-right">
            <div className="cart-bar-right-summary">
              <div className="cart-bar-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span className="cart-badge" id="promoCartItemCount">0</span>
              </div>
              <div className="cart-bar-right-meta">
                <span className="cart-bar-total">
                  Total: <strong id="promoCartTotalPrice">$0.00</strong> USD
                </span>
                <span className="promo-cart-feedback" id="promoCartFeedback" aria-live="polite" />
              </div>
            </div>
            <div className="cart-bar-right-actions">
              <button className="view-cart-btn" id="promoViewCartBtn" type="button">
                View Cart
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <button className="view-cart-btn" id="promoContinueToBookingBtn" type="button">
                Continue to Booking
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Center toast feedback */}
      <div className="promo-cart-toast" id="promoCartToast" role="status" aria-live="polite" aria-atomic="true">
        <div className="promo-cart-toast-inner">
          <svg className="promo-cart-toast-check" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="#16A34A" />
            <path d="M7.5 12.2l3 3 6-6" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="promo-cart-toast-message" id="promoCartToastMessage">Added to cart</span>
        </div>
      </div>
    </>
  );
}

