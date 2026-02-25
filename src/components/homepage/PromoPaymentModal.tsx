/* eslint-disable @next/next/no-img-element */

export default function PromoPaymentModal() {
  return (
    <div className="promo-modal-overlay" id="promoPaymentModal" aria-hidden="true">
      <div className="promo-modal promo-order-modal" role="dialog" aria-modal="true" aria-labelledby="promoPaymentTitle">
        <button className="close-popup" id="closePayment" type="button" aria-label="Close">
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
            <div className="popup-details">
              <div className="step-title-section">
                <div className="step-title" id="promoPaymentTitle">Payment Information</div>
              </div>

              <div className="order-summary" id="promoPaymentOrderSummary">
                <h4>Order Summary</h4>
                <div className="order-section" id="promoPaymentTicketsSection">
                  <div className="order-section-title">Tour Tickets</div>
                  <div className="order-tour-date" id="promoPaymentTourDate" />
                  <div id="promoPaymentOrderTickets">{/* Tickets populated by JS */}</div>
                </div>
                <div className="order-section" id="promoPaymentAddonsSection" style={{ display: "none" }}>
                  <div className="order-section-title">Add-ons</div>
                  <div id="promoPaymentOrderAddons">{/* Add-ons populated by JS */}</div>
                </div>
                <div className="order-totals">
                  <div className="subtotal">
                    <span>Subtotal</span>
                    <span id="promoPaymentSubtotal">$0.00</span>
                  </div>
                  <div className="savings" id="promoPaymentSavingsRow" style={{ display: "none" }}>
                    <span>You Save</span>
                    <span id="promoPaymentSavings">-$0.00</span>
                  </div>
                  <div className="total">
                    <span>Total</span>
                    <span id="promoPaymentTotal">$0.00</span>
                  </div>
                </div>
              </div>

              <div className="payment-methods">
                <div className="credit-card-section">
                  <h4>Credit/Debit Card</h4>
                  <div className="card-logos">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
                      alt="Visa"
                      style={{ height: 30, width: "auto" }}
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
                      alt="Mastercard"
                      style={{ height: 30, width: "auto" }}
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png"
                      alt="American Express"
                      style={{ height: 30, width: "auto" }}
                    />
                  </div>
                </div>

                <div className="alternative-payments">
                  <div className="payment-option">
                    <img
                      src="https://developers.kakao.com/tool/resource/static/img/button/pay/payment_icon_yellow_medium.png"
                      alt="KakaoPay"
                      style={{ height: 30, width: "auto" }}
                    />
                    <span>KakaoPay</span>
                  </div>
                  <div className="payment-option">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Naver_Logotype.svg/2560px-Naver_Logotype.svg.png"
                      alt="NaverPay"
                      style={{ height: 30, width: "auto" }}
                    />
                    <span>NaverPay</span>
                  </div>
                </div>
              </div>

              <div className="footer-info">
                Secured by Eximbay <a href="#">Terms &amp; Conditions</a>
              </div>
            </div>
          </div>

          <div className="sticky-bottom-section">
            <div className="popup-actions order-actions">
              <button className="back-btn" id="paymentBackBtn" type="button">
                Back
              </button>
              <button className="add-to-cart-btn" id="makePaymentBtn" type="button">
                Make Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

