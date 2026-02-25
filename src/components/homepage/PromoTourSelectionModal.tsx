/* eslint-disable @next/next/no-img-element */

import PromoEnhanceSeoulAddonsCarousel from "@/components/homepage/PromoEnhanceSeoulAddonsCarousel";

export default function PromoTourSelectionModal() {
  return (
    <div className="promo-modal-overlay" id="promoTourSelectionModal" aria-hidden="true">
      <div className="promo-modal promo-tour-modal" role="dialog" aria-modal="true" aria-labelledby="promoTourModalTitle">
        <button className="close-popup" id="closeTourSelection" type="button" aria-label="Close">
          &times;
        </button>
        <div className="popup-content">
          <div className="promo-progress-indicator" aria-hidden="true">
            <div className="progress-step completed" data-step="1">
              <div className="step-circle">1</div>
              <div className="step-line" />
            </div>
            <div className="progress-step active" data-step="2">
              <div className="step-circle">2</div>
              <div className="step-line" />
            </div>
            <div className="progress-step" data-step="3">
              <div className="step-circle">3</div>
              <div className="step-line" />
            </div>
            <div className="progress-step" data-step="4">
              <div className="step-circle">4</div>
            </div>
          </div>

          <div className="popup-scrollable-content">
            <div className="promo-tour-display" id="promoTourDisplay">
              <div className="tour-label" id="promoTourLabel" style={{ background: "#000080" }}>
                TOUR 01
              </div>
              <div className="popular-badge" id="promoPopularBadge" style={{ display: "none" }}>
                POPULAR
              </div>
              <img src="/imgs/tour01__.png" alt="Tour Image" id="promoTourImage" />
              <div className="tour-title" id="promoTourTitle">
                DOWNTOWN PALACE NAMSAN COURSE
              </div>
            </div>

            <div className="popup-details">
              <h2 id="promoTourModalTitle">Select Your Tour</h2>
              <p id="tourSelectionSubtitle">Choose a tour to pair with your selected add-on</p>

              <div className="tour-selector">
                <select id="promoTourSelect" defaultValue="tour01">
                  <option value="tour01">Tour 01 Downtown Palace Namsan Course (Hop On, Hop Off)</option>
                  <option value="tour02">Tour 02 Panorama Course</option>
                  <option value="tour04">Tour 04 Night View Course (Non Stop)</option>
                </select>
              </div>

              {/* Tour Info Panel */}
              <div className="tour-info-panel" id="promoTourInfoPanel">
                <TourInfoContent
                  className="promo-tour01-info active"
                  items={[
                    "Hop On, Hop Off",
                    "15 stops across Downtown • Palaces • Namsan",
                    "Key stops: Gwanghwamun, Myeongdong, N Seoul Tower, DDP",
                    "Select your tour date below to continue",
                  ]}
                  tour="tour01"
                />
                <TourInfoContent
                  className="promo-tour04-info"
                  items={[
                    "Night View Course (Non Stop)",
                    "8 stops featuring bridges, skyline & city lights",
                    "Key stops: Banpo Bridge, Seongsu Bridge, N Seoul Tower",
                    "Select your tour date below to continue",
                  ]}
                  tour="tour04"
                />
                <TourInfoContent
                  className="promo-tour02-info"
                  items={[
                    "Panorama Course - scenic views of Seoul",
                    "First Bus: 10:00AM, Last Bus: 5:00PM",
                    "Interval: Every 45 minutes",
                    "Total Course Time: 2 hours",
                  ]}
                  tour="tour02"
                />
              </div>

              {/* Date Selector */}
              <div className="promo-date-section" style={{ marginTop: 16 }}>
                <h3>Select Date</h3>
                <div className="date-picker-wrapper promo-date-picker-wrapper">
                  <button className="date-picker-trigger promo-date-trigger" id="promoDateTrigger" type="button">
                    <span id="promoSelectedDateDisplay" className="selected-date promo-selected-date">
                      Please select a date
                    </span>
                    <img src="/imgs/calendar.svg" alt="Calendar" className="calendar-icon" />
                  </button>
                  <div className="promo-calendar promo-calendar-dropdown" id="promoCalendarDropdown" aria-hidden="true">
                    <div className="calendar-header">
                      <button className="promo-prev-month" type="button">←</button>
                      <h3 className="promo-current-month">September 2023</h3>
                      <button className="promo-next-month" type="button">→</button>
                      <button className="promo-close-calendar" type="button" aria-label="Close">&times;</button>
                    </div>
                    <div className="calendar-grid">
                      <div className="weekdays">
                        <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                      </div>
                      <div className="days promo-calendar-days" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticket Selector */}
              <div className="promo-ticket-section" style={{ marginTop: 16 }}>
                <h3>Select Tickets</h3>
                <div className="ticket-selection promo-tour-ticket-selection">
                  <div className="ticket-type">
                    <div className="ticket-info"><div className="ticket-label">Adult</div></div>
                    <div className="price-counter">
                      <div className="price">
                        <span className="current-price" id="promoAdultUnitPrice">$20.00 USD</span>
                        <span className="original-price" id="promoAdultUnitOrigPrice">$27.00 USD</span>
                      </div>
                      <div className="counter">
                        <button className="promo-adult-minus" type="button">-</button>
                        <span className="promo-count" id="promoAdultCount">1</span>
                        <button className="promo-adult-plus" type="button">+</button>
                      </div>
                    </div>
                  </div>
                  <div className="ticket-type">
                    <div className="ticket-info"><div className="ticket-label">Child</div></div>
                    <div className="price-counter">
                      <div className="price">
                        <span className="current-price" id="promoChildUnitPrice">$14.00 USD</span>
                        <span className="original-price" id="promoChildUnitOrigPrice">$18.00 USD</span>
                      </div>
                      <div className="counter">
                        <button className="promo-child-minus" type="button">-</button>
                        <span className="promo-count" id="promoChildCount">0</span>
                        <button className="promo-child-plus" type="button">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Amount Summary */}
              <div className="total-summary">
                <div className="ticket-total">
                  <div className="total-label">Total Amount</div>
                  <div className="total-price">
                    <span className="current-total" id="promoTotalPrice">$20.00 USD</span>
                    <span className="original-total" id="promoOriginalTotal">$27.00 USD</span>
                  </div>
                </div>
              </div>

              {/* Upsell Carousel Section */}
			  <PromoEnhanceSeoulAddonsCarousel />
            </div>
          </div>

          <div className="sticky-bottom-section">
            <div className="popup-actions tour-selection-actions">
              <button className="skip-tour-btn" id="skipTourBtn" type="button" style={{ display: "none" }}>
                Continue without Tour
              </button>
              <button className="add-to-cart-btn" id="tourSelectionContinueBtn" type="button">
                Continue with Tour
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small sub-component used to reduce repetition for tour info panels */
/* ------------------------------------------------------------------ */

function TourInfoContent({
  className,
  items,
  tour,
}: {
  className: string;
  items: string[];
  tour: string;
}) {
  return (
    <div className={`tour-info-content ${className}`}>
      <div className="tour-info-row">
        <ul>
          {items.map((text, i) => (
            <li key={i}>{text}</li>
          ))}
        </ul>
        <div className="tour-map-btn-wrapper">
          <button className="tour-map-btn promo-tour-map-btn" data-tour={tour} type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
            Map
          </button>
        </div>
      </div>
    </div>
  );
}
