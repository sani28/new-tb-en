/* eslint-disable @next/next/no-img-element */

export default function HomepageCoursesSection() {
  return (
    <>
      {/* Course Section */}
      <section
        className="courses"
        data-slide-colors='["#001C2C", "#FCD700", "#C41E3A"]'
      >
        <div
          className="courses-inner"
          data-slide-colors='["#001C2C", "#FCD700", "#C41E3A"]'
        >
          <div
            className="homepage-carousel"
            data-slide-colors='["#001C2C", "#FCD700", "#C41E3A"]'
          >
            <div
              className="homepage-carousel-container"
              data-slide-colors='["#001C2C", "#FCD700", "#C41E3A"]'
            >
              <div className="homepage-carousel-slides">
                {/* Slide 1 */}
                <div className="homepage-carousel-slide active">
                  <div className="slide-content">
                    <div className="tour-label-fixed">TOUR 01</div>
                    <div className="homepage-carousel-image">
                      <img src="/imgs/tour01home.png" alt="Downtown Palace Course" />
                    </div>
                    <div className="homepage-carousel-content">
                      <h2>Hop on, Hop off anytime!</h2>
                      <div className="tour-info-list">
                        <div className="info-item">
                          <i className="fas fa-clock"></i>
                          <span>First Bus: 9:20AM | Last bus: 4:50pm</span>
                        </div>
                        <div className="info-item">
                          <i className="fas fa-hourglass-half"></i>
                          <span>Interval: Every 30 Minutes</span>
                        </div>
                        <div className="info-item">
                          <i className="fas fa-route"></i>
                          <span>Total Course Time: 1hr 30 min</span>
                        </div>
                      </div>
                      <div className="tour-pricing">
                        <div className="price-row">
                          <span className="price-label">Adult</span>
                          <span className="price-line"></span>
                          <div className="price-details">
                            <span className="original-price">
                              <span className="price-from">from</span>{" "}
                              <span className="price-strikethrough">$45.00</span>
                            </span>
                            <span className="sale-price">
                              <span className="price-amount">$32.00</span>
                            </span>
                          </div>
                        </div>
                        <hr className="price-divider" />
                        <div className="price-row">
                          <span className="price-label">Children</span>
                          <span className="price-line"></span>
                          <div className="price-details">
                            <span className="original-price">
                              <span className="price-from">from</span>{" "}
                              <span className="price-strikethrough">$32.00</span>
                            </span>
                            <span className="sale-price">
                              <span className="price-amount">$23.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="homepage-carousel-actions">
                        <a href="/tours" className="more-info-btn">
                          More Info
                        </a>
                        <a href="/booking?tour=tour01" className="book-ticket-btn">
                          Book Ticket
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="card-section">
                    <h3 className="card-section-title">Enhance your experience with...</h3>
                    <div className="card-carousel-wrapper">
                      <button
                        className="card-carousel-nav card-prev"
                        data-carousel="tour01-cards"
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <div
                        className="card-carousel-container"
                        id="tour01-cards"
                      >
                        <div className="card-carousel-track">
                          <div className="card" data-product-id="kwangjuyo">
                            <div className="card-image">
                              <div className="card-number">1</div>
                              <img src="/imgs/kwangjuyo.png" alt="Kwangjuyo" />
                            </div>
                            <h4 className="card-title">Kwangjuyo</h4>
                            <p>
                              Experience traditional Korean ceramics at the renowned
                              Kwangjuyo pottery studio.
                            </p>
                            <div className="card-actions">
                              <a
                                href="#"
                                className="more-info card-more-info-btn"
                              >
                                Add to Cart
                              </a>
                            </div>
                          </div>
                          <div className="card" data-product-id="museum-pass">
                            <div className="card-image">
                              <div className="card-number">2</div>
                              <img src="/imgs/monet-addon.png" alt="Museum Pass" />
                            </div>
                            <h4 className="card-title">Museum Pass</h4>
                            <p>
                              Get access to multiple museums with our exclusive museum
                              pass package.
                            </p>
                            <div className="card-actions">
                              <a
                                href="#"
                                className="more-info card-more-info-btn"
                              >
                                Add to Cart
                              </a>
                            </div>
                          </div>
                          <div className="card" data-product-id="sejong-backstage">
                            <div className="card-image">
                              <div className="card-number">3</div>
                              <img
                                src="/imgs/sejong-addon.png"
                                alt="Sejong Centre Backstage Pass"
                              />
                            </div>
                            <h4 className="card-title">Sejong Centre Backstage Pass</h4>
                            <p>
                              Go behind the scenes at the prestigious Sejong Center for
                              the Performing Arts.
                            </p>
                            <div className="card-actions">
                              <a
                                href="#"
                                className="more-info card-more-info-btn"
                              >
                                Add to Cart
                              </a>
                            </div>
                          </div>
                          <div className="card" data-product-id="hanbok-rental">
                            <div className="card-image">
                              <div className="card-number">4</div>
                              <img src="/imgs/hanbok-addon.png" alt="Hanbok Rental" />
                            </div>
                            <h4 className="card-title">Hanbok Rental</h4>
                            <p>
                              Dress up in beautiful traditional Korean attire and explore
                              the palaces in style.
                            </p>
                            <div className="card-actions">
                              <a
                                href="#"
                                className="more-info card-more-info-btn"
                              >
                                Add to Cart
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        className="card-carousel-nav card-next"
                        data-carousel="tour01-cards"
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Slide 2 - Tour 04 Night View Course */}
                <div className="homepage-carousel-slide">
                  <div className="slide-content">
                    <div className="tour-label-fixed">TOUR 04</div>
                    <div className="homepage-carousel-image">
                      <img src="/imgs/tour04home.png" alt="Night View Course" />
                    </div>
                    <div className="homepage-carousel-content">
                      <h2>Sparkling Night Views</h2>
                      <div className="tour-info-list">
                        <div className="info-item">
                          <i className="fas fa-route"></i>
                          <span>Non Stop Course</span>
                        </div>
                        <div className="info-item">
                          <i className="fas fa-clock"></i>
                          <span>Departure time: 7:00pm</span>
                        </div>
                        <div className="info-item">
                          <i className="fas fa-camera"></i>
                          <span>30 Min Photo Time at N Seoul Tower</span>
                        </div>
                        <div className="info-item">
                          <i className="fas fa-hourglass-half"></i>
                          <span>Total time: ~1 hour</span>
                        </div>
                      </div>
                      <div className="tour-pricing">
                        <div className="price-row">
                          <span className="price-label">Adult</span>
                          <span className="price-line"></span>
                          <div className="price-details">
                            <span className="original-price">
                              <span className="price-from">from</span>{" "}
                              <span className="price-strikethrough">$36.00</span>
                            </span>
                            <span className="sale-price">
                              <span className="price-amount">$26.00</span>
                            </span>
                          </div>
                        </div>
                        <hr className="price-divider" />
                        <div className="price-row">
                          <span className="price-label">Children</span>
                          <span className="price-line"></span>
                          <div className="price-details">
                            <span className="original-price">
                              <span className="price-from">from</span>{" "}
                              <span className="price-strikethrough">$22.00</span>
                            </span>
                            <span className="sale-price">
                              <span className="price-amount">$16.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="homepage-carousel-actions">
                        <a href="/tour04" className="more-info-btn">
                          More Info
                        </a>
                        <a href="/booking?tour=tour04" className="book-ticket-btn">
                          Book Ticket
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="card-section">
                    <h3 className="card-section-title">Enhance your experience with...</h3>
                    <div className="card-carousel-wrapper">
                      <button
                        className="card-carousel-nav card-prev"
                        data-carousel="tour04-cards"
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <div
                        className="card-carousel-container"
                        id="tour04-cards"
                      >
                        <div className="card-carousel-track">
                          <div className="card" data-product-id="kwangjuyo">
                            <div className="card-image">
                              <div className="card-number">1</div>
                              <img src="/imgs/kwangjuyo.png" alt="Kwangjuyo" />
                            </div>
                            <h4 className="card-title">Kwangjuyo</h4>
                            <p>
                              Experience traditional Korean ceramics at the renowned
                              Kwangjuyo pottery studio.
                            </p>
                            <div className="card-actions">
                              <a
                                href="#"
                                className="more-info card-more-info-btn"
                              >
                                Add to Cart
                              </a>
                            </div>
                          </div>
                          <div className="card" data-product-id="hanbok-rental">
                            <div className="card-image">
                              <div className="card-number">2</div>
                              <img src="/imgs/hanbok-addon.png" alt="Hanbok Rental" />
                            </div>
                            <h4 className="card-title">Hanbok Rental</h4>
                            <p>
                              Dress up in beautiful traditional Korean attire and explore
                              the palaces in style.
                            </p>
                            <div className="card-actions">
                              <a
                                href="#"
                                className="more-info card-more-info-btn"
                              >
                                Add to Cart
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        className="card-carousel-nav card-next"
                        data-carousel="tour04-cards"
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Slide 3 - Tour 02 Panorama Course */}
                <div className="homepage-carousel-slide">
                  <div className="slide-content">
                    <div className="tour-label-fixed">TOUR 02</div>
                    <div className="homepage-carousel-image">
                      <img src="/imgs/panorama.png" alt="Panorama Course" />
                    </div>
                    <div
                      className="homepage-carousel-content"
                      style={{ background: "rgba(226, 60, 80, 0.80)" }}
                    >
                      <h2>Panorama Course</h2>
                      <div className="tour-info-list">
                        <div className="info-item">
                          <i className="fas fa-clock"></i>
                          <span>First Bus: 10:00AM | Last bus: 5:00pm</span>
                        </div>
                        <div className="info-item">
                          <i className="fas fa-hourglass-half"></i>
                          <span>Interval: Every 45 Minutes</span>
                        </div>
                        <div className="info-item">
                          <i className="fas fa-route"></i>
                          <span>Total Course Time: 2hr 00 min</span>
                        </div>
                      </div>
                      <div className="tour-pricing">
                        <div className="price-row">
                          <span className="price-label">Adult</span>
                          <span className="price-line"></span>
                          <div className="price-details">
                            <span className="original-price">
                              <span className="price-from">from</span>{" "}
                              <span className="price-strikethrough">$50.00</span>
                            </span>
                            <span className="sale-price">
                              <span className="price-amount">$38.00</span>
                            </span>
                          </div>
                        </div>
                        <hr className="price-divider" />
                        <div className="price-row">
                          <span className="price-label">Children</span>
                          <span className="price-line"></span>
                          <div className="price-details">
                            <span className="original-price">
                              <span className="price-from">from</span>{" "}
                              <span className="price-strikethrough">$38.00</span>
                            </span>
                            <span className="sale-price">
                              <span className="price-amount">$28.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="homepage-carousel-actions">
                        <a href="#" className="more-info-btn">
                          More Info
                        </a>
                        <a href="/booking?tour=tour02" className="book-ticket-btn">
                          Book Ticket
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="card-section">
                    <h3 className="card-section-title">Enhance your experience with...</h3>
                    <div className="card-carousel-wrapper">
                      <button
                        className="card-carousel-nav card-prev"
                        data-carousel="tour02-cards"
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <div
                        className="card-carousel-container"
                        id="tour02-cards"
                      >
                        <div className="card-carousel-track">
                          <div className="card" data-product-id="kwangjuyo">
                            <div className="card-image">
                              <div className="card-number">1</div>
                              <img src="/imgs/kwangjuyo.png" alt="Kwangjuyo" />
                            </div>
                            <h4 className="card-title">Kwangjuyo</h4>
                            <p>
                              Experience traditional Korean ceramics at the renowned
                              Kwangjuyo pottery studio.
                            </p>
                            <div className="card-actions">
                              <a
                                href="#"
                                className="more-info card-more-info-btn"
                              >
                                Add to Cart
                              </a>
                            </div>
                          </div>
                          <div className="card" data-product-id="han-river-cruise">
                            <div className="card-image">
                              <div className="card-number">3</div>
                              <img src="/imgs/daycruise.png" alt="Han River Cruise" />
                            </div>
                            <h4 className="card-title">Han River Cruise</h4>
                            <p>
                              Enjoy a scenic cruise along the beautiful Han River with
                              stunning city views.
                            </p>
                            <div className="card-actions">
                              <a
                                href="#"
                                className="more-info card-more-info-btn"
                              >
                                Add to Cart
                              </a>
                            </div>
                          </div>
                          <div className="card" data-product-id="hanbok-rental">
                            <div className="card-image">
                              <div className="card-number">4</div>
                              <img src="/imgs/hanbok-addon.png" alt="Hanbok Rental" />
                            </div>
                            <h4 className="card-title">Hanbok Rental</h4>
                            <p>
                              Dress up in beautiful traditional Korean attire and explore
                              the palaces in style.
                            </p>
                            <div className="card-actions">
                              <a
                                href="#"
                                className="more-info card-more-info-btn"
                              >
                                Add to Cart
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        className="card-carousel-nav card-next"
                        data-carousel="tour02-cards"
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Navigation buttons */}
            <button className="carousel-nav prev">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="carousel-nav next">
              <i className="fas fa-chevron-right"></i>
            </button>
            {/* Dots */}
            <div className="carousel-dots">
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        </div>
      </section>

      {/* Bus Features */}
      <div className="bus-features">
        <div className="bus-features-content">
          <h3>Bus Features</h3>
          <div className="feature-icons">
            <div className="feature">
              <img src="/imgs/1.png" alt="Free Audio Guide" />
              <span>Free Audio</span>
            </div>
            <div className="feature">
              <img src="/imgs/2.png" alt="Free USB Charger" />
              <span>Free USB</span>
            </div>
            <div className="feature">
              <img src="/imgs/3.png" alt="Double Decker Bus" />
              <span>Double Decker</span>
            </div>
            <div className="feature">
              <img src="/imgs/4.png" alt="Single Decker Bus" />
              <span>Single Decker</span>
            </div>
            <div className="feature">
              <img src="/imgs/5.png" alt="Free Wi-Fi" />
              <span>Free Wi-Fi</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
