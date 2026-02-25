/* eslint-disable @next/next/no-img-element */

export default function HomepageHero() {
  return (
    <>
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-slider">
          <div className="slide active" style={{ backgroundImage: "url('/imgs/hero-slider-image-2.png')" }}></div>
          <div
            className="slide"
            style={{
              backgroundImage:
                "url('https://res.cloudinary.com/dnx3bdypw/image/upload/v1753770618/Screenshot_2025-07-29_at_3.30.10_PM_zxelxv.png')",
            }}
          ></div>
          <div className="slide" style={{ backgroundImage: "url('/imgs/hero-slider-image-3.png')" }}></div>
          <div className="slide" style={{ backgroundImage: "url('/imgs/hero-slider-image-4.jpg')" }}></div>
          <div className="slide" style={{ backgroundImage: "url('/imgs/hero-slider-image-5.jpg')" }}></div>
          <div className="slider-controls">
            <div className="controls-row">
              <div className="slider-dots">
                <span className="dot active">
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                </span>
                <span className="dot">
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                </span>
                <span className="dot">
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                </span>
                <span className="dot">
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                </span>
                <span className="dot">
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="logo">
          <img src="/imgs/logo.svg" alt="Seoul City Tour Tiger Bus" />
        </div>

        {/* Promo Tab Carousel */}
        <div className="promo-tab-carousel">
          <div className="promo-tabs-container">
            <div className="promo-progress-bars">
              <button className="promo-pause-btn" aria-label="Pause carousel">
                <i className="fas fa-pause"></i>
              </button>
            </div>
            <button className="promo-nav-arrow prev" aria-label="Previous promo">
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="promo-slides">
              <div className="promo-slide active" data-promo="1">
                <div className="promo-content promo-clickable" data-promo-popup="1" style={{ cursor: "pointer" }}>
                  <img src="/imgs/promotion-1.png" className="promo-banner-img" alt="Promotion 1" />
                </div>
              </div>
              <div className="promo-slide" data-promo="2">
                <div className="promo-content promo-clickable" data-promo-popup="2" style={{ cursor: "pointer" }}>
                  <img src="/imgs/promotion-2.png" className="promo-banner-img" alt="Promotion 2" />
                </div>
              </div>
              <div className="promo-slide" data-promo="3">
                <div className="promo-content promo-clickable" data-promo-popup="3" style={{ cursor: "pointer" }}>
                  <img src="/imgs/promotion-3.png" className="promo-banner-img" alt="Promotion 3" />
                </div>
              </div>
            </div>
            <button className="promo-nav-arrow next" aria-label="Next promo">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Booking Widget */}
        <div className="booking-widget">
          <div className="select-container">
            <div className="tour-select">
              <select id="booking-tour-select">
                <option value="tour01">Tour 01 Downtown Palace Namsan Course (Hop On, Hop Off)</option>
                <option value="tour02">Tour 02 Panorama Course</option>
                <option value="tour04">Tour 04 Night View Course (Non Stop)</option>
              </select>
            </div>
            <div className="date-select">
              <div className="date-picker-wrapper">
                <button className="date-picker-trigger">
                  <span className="selected-date">Select a date</span>
                  <img src="/imgs/calendar.svg" alt="Calendar" className="calendar-icon" />
                </button>
                <div className="calendar-dropdown">
                  <div className="calendar-header">
                    <button className="prev-month">←</button>
                    <h3 className="current-month">September 2023</h3>
                    <button className="next-month">→</button>
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
                    <div className="days">{/* Days will be populated by JavaScript */}</div>
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
          </div>
          <div className="passenger-counter">
            <div className="counter-group">
              <label>Adult</label>
              <div className="counter-info">
                <span className="price">$27 USD</span>
                <div className="counter">
                  <button className="decrease">-</button>
                  <span className="count">0</span>
                  <button className="increase">+</button>
                </div>
              </div>
            </div>
            <div className="counter-group">
              <label>Child</label>
              <div className="counter-info">
                <span className="price">$18 USD</span>
                <div className="counter">
                  <button className="decrease">-</button>
                  <span className="count">0</span>
                  <button className="increase">+</button>
                </div>
              </div>
            </div>
          </div>
          <button className="book-now">Book</button>
        </div>
      </header>

      {/* Gradient Section */}
      <div
        className="gradient-section"
        data-slide-colors='["linear-gradient(180deg, #C6F5FF 0%, #E1F7FF 30.56%, #E2601E 100%)", "linear-gradient(180deg, #C6F5FF 5%, #FF8C36 80%, #E2601E 100%)", "linear-gradient(180deg, #FFB3B3 0%, #E24C5E 50%, #C41E3A 100%)"]'
      >
        <h1
          className="course-title"
          data-slide-colors='["#001C2C", "#FFD51B", "#FFFFFF"]'
        >
          Downtown Namsan Palace Course
        </h1>
      </div>
    </>
  );
}
