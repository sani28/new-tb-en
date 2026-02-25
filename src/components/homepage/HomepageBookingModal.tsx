/* eslint-disable @next/next/no-img-element */

export default function HomepageBookingModal() {
  return (
    <div className="modal-overlay" id="bookingModal" aria-hidden="true">
      <div className="booking-modal" id="step1" role="dialog" aria-modal="true" aria-labelledby="bookingModalTitle">
        <div className="modal-header">
          <h3 id="bookingModalTitle">Cart Reservation</h3>
          <button className="close-modal" aria-label="Close">&times;</button>
        </div>
        <div className="booking-container">
          <div className="step-title-section">
            <div className="step-number">1</div>
            <div className="step-title">Select Your Items</div>
          </div>

          <div className="tour-selector">
            <select id="tourSelect">
              <option value="tour01">Tour 01 Downtown Palace Namsan Course (Hop On, Hop Off)</option>
              <option value="tour02">Tour 02 Panorama Course</option>
              <option value="tour04">Tour 04 Night View Course (Non Stop)</option>
            </select>
          </div>

          <div className="date-selector">
            <div className="date-picker-wrapper">
              <button className="date-picker-trigger modal-date-trigger" type="button">
                <span id="selectedDateDisplay" className="selected-date">Please select a date</span>
                <img src="/imgs/calendar.svg" alt="Calendar" className="calendar-icon" />
              </button>
              <div className="calendar-dropdown modal-calendar">
                <div className="calendar-header">
                  <button className="prev-month" type="button">←</button>
                  <h3 className="current-month">September 2023</h3>
                  <button className="next-month" type="button">→</button>
                  <button className="close-calendar" type="button" aria-label="Close">&times;</button>
                </div>
                <div className="calendar-grid">
                  <div className="weekdays">
                    <span>Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                  </div>
                  <div className="days">{/* Days populated by JS */}</div>
                </div>
                <div className="calendar-footer">
                  <div className="availability-legend">
                    <div className="legend-item">
                      <span className="dot available"></span>
                      <span>Available</span>
                    </div>
                    <div className="legend-item">
                      <span className="dot sold-out"></span>
                      <span>Sold Out</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="ticket-selection">
            <div className="ticket-type">
              <div className="ticket-info">
                <div className="ticket-label">Adult</div>
              </div>
              <div className="price-counter">
                <div className="price">
                  <span className="current-price">$20.00 USD</span>
                  <span className="original-price">$27.00 USD</span>
                </div>
                <div className="counter">
                  <button className="minus" type="button">-</button>
                  <input type="number" defaultValue={0} min={0} max={10} />
                  <button className="plus" type="button">+</button>
                </div>
              </div>
            </div>

            <div className="ticket-type">
              <div className="ticket-info">
                <div className="ticket-label">Child</div>
              </div>
              <div className="price-counter">
                <div className="price">
                  <span className="current-price">$14.00 USD</span>
                  <span className="original-price">$18.00 USD</span>
                </div>
                <div className="counter">
                  <button className="minus" type="button">-</button>
                  <input type="number" defaultValue={0} min={0} max={10} />
                  <button className="plus" type="button">+</button>
                </div>
              </div>
            </div>

            <div className="total-summary">
              <div className="ticket-total">
                <div className="total-label">Total Amount</div>
                <div className="total-price">
                  <span className="current-total">$0.00 USD</span>
                  <span className="original-total">$0.00 USD</span>
                </div>
              </div>
            </div>
          </div>

          <button className="continue-btn" id="step1ContinueBtn" type="button">Continue</button>
        </div>
      </div>
    </div>
  );
}

