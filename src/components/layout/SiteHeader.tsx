/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */

"use client";

import { useEffect, useRef, useState } from "react";

export default function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocumentClick = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (languageRef.current && languageRef.current.contains(target)) return;
      setIsLanguageOpen(false);
    };

    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, []);

  return (
    <>
      {/* Promo notification bar */}
      <div className="promo-notification-bar">
        <div className="marquee-container">
          <div className="marquee-content">
            <span>
              🚨 IMPORTANT NOTICE: Saturday, Dec 19, Service disruption.{" "}
	              <a href="/notices">Please see full announcement details</a>
            </span>
          </div>
        </div>
      </div>

      {/* Top notification bar */}
      <div className="notification-bar">
        <button
          className="mobile-menu-btn"
          type="button"
          aria-label="Open menu"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <i className="fas fa-bars" />
        </button>

        <a href="#" className="directions">
          Directions to Gwanghwamun ticket office{" "}
          <img
            src="/imgs/googleicon.png"
            alt="Google"
            style={{ width: 25, height: 20 }}
          />
          <img
            src="/imgs/navericon.png"
            alt="Naver"
            style={{ width: 22, height: 20 }}
          />
        </a>

        <div className="right-section">
          <div className="customer-service">
	            <p>customer service:</p> <span className="phone-number">02 777 6090</span>
          </div>

          <div className="language-selector" ref={languageRef}>
            <button
              className="language-btn"
              type="button"
              aria-label="Language"
              onClick={(e) => {
                e.stopPropagation();
                setIsLanguageOpen((v) => !v);
              }}
            >
              <img src="/imgs/globe.svg" alt="Language" className="globe-icon" />
            </button>

            <div className={`language-dropdown${isLanguageOpen ? " active" : ""}`}>
              <a
                href="https://tb-en.netlify.app/"
                data-lang="en"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsLanguageOpen(false)}
              >
                English
              </a>
              <a
                href="https://tb-kr.netlify.app/"
                data-lang="kr"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsLanguageOpen(false)}
              >
                한국어
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="mobile-header">
        <button
          className="mobile-menu-btn"
          type="button"
          aria-label="Open menu"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          ☰
        </button>
        <div className="logo">
          <a href="/">
            <img src="/imgs/redlogo-tigerbus.png" alt="Seoul City Tour Tiger Bus" />
          </a>
        </div>
	        <div className="nav-buttons">
	          <a href="/booking" className="booking-btn">
	            <img src="/imgs/bookingicon.png" alt="Booking" />
	            BOOKING
	          </a>
	          <a href="/my-booking" className="login-btn">
	            <img src="/imgs/myaccounticon.png" alt="My Account" />
	            MY BOOKING
	          </a>
	        </div>
      </div>

      {/* Navigation bar */}
	      <nav className="main-nav">
        <ul className="nav-links">
          <li>
	            <a href="/tours">Tours</a>
          </li>
          <li>
	            <a href="/map">Map</a>
          </li>
          <li>
	            <a href="/notices">Notices</a>
          </li>
          <li>
	            <a href="/blog">Discover</a>
          </li>
          <li>
	            <a href="/discounts">Discounts</a>
          </li>
          <li>
	            <a href="/help">Help</a>
          </li>
        </ul>
        <div className="nav-buttons">
	          <a href="/booking" className="booking-btn">
	            <img src="/imgs/bookingicon.png" alt="Booking" />
	            BOOKING
	          </a>
	          <a href="/my-booking" className="login-btn">
	            <img src="/imgs/myaccounticon.png" alt="My Account" />
	            MY BOOKING
	          </a>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu${isMobileMenuOpen ? " active" : ""}`}>
        <button
          className="mobile-menu-close"
          type="button"
          aria-label="Close menu"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          ×
        </button>
        <ul className="mobile-menu-links">
          <li>
	            <a href="/tours" onClick={() => setIsMobileMenuOpen(false)}>
              Tours
            </a>
          </li>
          <li>
	            <a href="/map" onClick={() => setIsMobileMenuOpen(false)}>
              Map
            </a>
          </li>
          <li>
	            <a href="/notices" onClick={() => setIsMobileMenuOpen(false)}>
              Notices
            </a>
          </li>
          <li>
	            <a href="/blog" onClick={() => setIsMobileMenuOpen(false)}>
              Discover
            </a>
          </li>
          <li>
	            <a href="/discounts" onClick={() => setIsMobileMenuOpen(false)}>
              Discounts
            </a>
          </li>
          <li>
	            <a href="/help" onClick={() => setIsMobileMenuOpen(false)}>
              Help
            </a>
          </li>
        </ul>
        <div className="logo">
          <a href="/">
            <img src="/imgs/redlogo-tigerbus.png" alt="Seoul City Tour Tiger Bus" />
          </a>
        </div>
      </div>
    </>
  );
}
