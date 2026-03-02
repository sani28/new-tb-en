/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */

"use client";

import { useEffect, useRef, useState } from "react";

function NavButtons() {
  return (
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
  );
}

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
		            <p>T:</p> <span className="phone-number">02 777 6090</span>
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
	              <a
	                href="#"
	                data-lang="ja"
	                aria-disabled="true"
	                onClick={(e) => {
	                  e.preventDefault();
	                  setIsLanguageOpen(false);
	                }}
	              >
	                日本語
	              </a>
	              <a
	                href="#"
	                data-lang="zh"
	                aria-disabled="true"
	                onClick={(e) => {
	                  e.preventDefault();
	                  setIsLanguageOpen(false);
	                }}
	              >
	                中文
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
            <img src="/imgs/smalllogo.png" alt="Seoul City Tour Tiger Bus" />
          </a>
        </div>
        <NavButtons />
      </div>

      {/* Navigation bar */}
		      <nav className="main-nav" aria-label="Primary">
	        <ul className="nav-links">
	          <li>
	            <a href="/" className="home-logo" aria-label="Home">
	              <img
	                src="/imgs/smalllogo.png"
	                alt="Seoul City Tour Bus"
	                onError={(e) => {
	                  (e.currentTarget as HTMLImageElement).src = "/imgs/smalllogo.png";
	                }}
	              />
	            </a>
	          </li>
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
        <NavButtons />
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 w-full h-dvh bg-brand-cream z-[2000] p-5 ${
          isMobileMenuOpen ? "block" : "hidden"
        }`}
      >
        <button
          className="absolute top-5 right-5 text-2xl bg-transparent border-none cursor-pointer"
          type="button"
          aria-label="Close menu"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          &times;
        </button>
        <ul className="list-none p-0 m-0 mt-15">
          {[
            { href: "/tours", label: "Tours" },
            { href: "/map", label: "Map" },
            { href: "/notices", label: "Notices" },
            { href: "/blog", label: "Discover" },
            { href: "/discounts", label: "Discounts" },
            { href: "/help", label: "Help" },
          ].map((link) => (
            <li key={link.href} className="py-[5px] text-center">
              <a
                href={link.href}
                className="text-[#A50000] no-underline text-2xl block py-[3px] transition-colors duration-300 font-semibold max-md:text-lg max-md:py-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[150px]">
          <a href="/">
            <img src="/imgs/redlogo-tigerbus.png" alt="Seoul City Tour Tiger Bus" />
          </a>
        </div>
      </div>
    </>
  );
}
