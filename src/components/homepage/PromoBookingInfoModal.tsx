export default function PromoBookingInfoModal() {
  return (
    <div className="promo-modal-overlay" id="promoBookingInfoModal" aria-hidden="true">
      <div className="promo-modal promo-order-modal" role="dialog" aria-modal="true" aria-labelledby="promoStep3Title">
        <button className="close-popup" id="closeBookingInfo" type="button" aria-label="Close">
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
            <div className="progress-step active" data-step="3">
              <div className="step-circle">3</div>
              <div className="step-line" />
            </div>
            <div className="progress-step" data-step="4">
              <div className="step-circle">4</div>
            </div>
          </div>

          <div className="popup-scrollable-content">
            <div className="popup-details">
              <div className="step-title-section">
                <div className="step-number">3</div>
                <div className="step-title" id="promoStep3Title">Enter Your Information</div>
              </div>

              <button
                className="prominent-back-btn promo-step3-back-btn"
                id="promoStep3ProminentBackBtn"
                type="button"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span>Back</span>
              </button>

              <div className="order-summary step2-order-summary" id="promoStep3OrderSummary">
                <h4>Order Summary</h4>
                <div className="order-section" id="promoStep3TicketsSection">
                  <div className="order-section-title">Tour Tickets</div>
                  <div className="order-tour-date" id="promoStep3TourDate" />
                  <div id="promoStep3OrderTickets">{/* Tickets populated by JS */}</div>
                </div>
                <div className="order-section" id="promoStep3AddonsSection" style={{ display: "none" }}>
                  <div className="order-section-title">Add-ons</div>
                  <div id="promoStep3OrderAddons">{/* Add-ons populated by JS */}</div>
                </div>
                <div className="order-totals">
                  <div className="subtotal">
                    <span>Subtotal</span>
                    <span id="promoStep3Subtotal">$0.00</span>
                  </div>
                  <div className="total">
                    <span>Total</span>
                    <span id="promoStep3Total">$0.00</span>
                  </div>
                </div>
              </div>

              <form className="user-info-form" id="promoUserInfoForm">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" placeholder="Enter your full name" id="promoUserName" name="name" autoComplete="name" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="Enter your email" id="promoUserEmail" name="email" autoComplete="email" />
                  <div className="info-text">
                    <span className="info-icon">i</span>
                    Your ticket will be sent to this email
                  </div>
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" placeholder="Enter your phone number" id="promoUserPhone" name="tel" autoComplete="tel" />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" placeholder="Create a password" id="promoUserPassword" />
                  <div className="info-text">
                    <span className="info-icon">i</span>
                    For managing your bookings
                  </div>
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
                    <p>1. Collection, use and purpose of personal information</p>
                    <p>- Minimum personal information is provided for identity verification and is used for boarding reservation, confirmation, change, and cancellation of other services.</p>
                    <p>- You must provide accurate information. Seoul City Tour is not responsible for reservation accidents due to inaccurate information.</p>
                  </div>
                  <div className="terms-checkbox">
                    <input type="checkbox" id="promoTerms" />
                    <label htmlFor="promoTerms">I agree to the Terms &amp; Conditions</label>
                  </div>
                  <div className="terms-content">
                    By proceeding, you agree to our booking terms, cancellation policy, and privacy policy.
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="sticky-bottom-section">
            <div className="popup-actions order-actions">
              <button className="add-to-cart-btn" id="proceedToOrderSummaryBtn" type="button">
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

