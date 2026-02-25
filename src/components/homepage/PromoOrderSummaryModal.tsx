export default function PromoOrderSummaryModal() {
  return (
    <div className="promo-modal-overlay" id="promoOrderSummaryModal" aria-hidden="true">
      <div className="promo-modal promo-order-modal" role="dialog" aria-modal="true" aria-labelledby="promoOrderSummaryTitle">
        <button className="close-popup" id="closeOrderSummary" type="button" aria-label="Close">
          &times;
        </button>
        <div className="popup-content">
          <div className="promo-progress-indicator" aria-hidden="true">
            <div className="progress-step completed" data-step="1">
              <div className="step-circle">1</div>
              <div className="step-line" />
            </div>
            <div className="progress-step completed" data-step="2">
              <div className="step-circle">2</div>
              <div className="step-line" />
            </div>
            <div className="progress-step completed" data-step="3">
              <div className="step-circle">3</div>
              <div className="step-line" />
            </div>
            <div className="progress-step active" data-step="4">
              <div className="step-circle">4</div>
            </div>
          </div>

          <div className="popup-scrollable-content">
            <div className="step-title-section">
              <h2 id="promoOrderSummaryTitle">Order Summary</h2>
              <p>Review your order before payment.</p>
            </div>

            <div className="promo-order-summary">
              <div className="promo-order-section" id="orderTourTicketsSection">
                <div className="promo-order-section-header">
                  <h4>Tour Tickets</h4>
                  <div className="promo-order-section-meta" id="orderTourDate" />
                </div>
                <div className="order-summary-items" id="orderTourTickets" />
              </div>

              <div className="promo-order-section" id="orderAddonsSection">
                <div className="promo-order-section-header">
                  <h4>Add-ons</h4>
                </div>
                <div className="order-summary-items" id="orderUpsellItemsList" />
              </div>

              <div className="promo-order-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span id="upsellSubtotal">$0.00</span>
                </div>
                <div className="total-row" id="orderSavingsRow" style={{ display: "none" }}>
                  <span>You Save</span>
                  <span id="orderSavings">$0.00</span>
                </div>
                <div className="total-row grand">
                  <span>Total</span>
                  <span id="orderGrandTotal">$0.00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky-bottom-section">
            <div className="popup-actions order-actions">
              <button className="back-btn" id="orderBackBtn" type="button">
                Back
              </button>
              <button className="add-to-cart-btn" id="proceedToPaymentBtn" type="button">
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

