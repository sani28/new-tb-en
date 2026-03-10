/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */

"use client";

import { useEffect, useRef, useState } from "react";
import { getMarqueeNotice } from "@/lib/data/notices";

/* ── Desktop nav buttons (booking + my-booking) ── */
function DesktopNavButtons() {
  return (
    <div className="flex gap-[clamp(8px,1.2vw,15px)] pr-[clamp(16px,2.5vw,40px)] max-lg:gap-[clamp(6px,0.8vw,12px)]">
      <a
        href="/booking"
        className="flex items-center gap-2 no-underline py-[0.55em] px-[1.1em] rounded-[10px] font-copperplate font-bold text-[clamp(14px,1.4vw,20px)] whitespace-nowrap bg-brand-red text-white max-lg:text-[clamp(11px,1.1vw,14px)] max-lg:py-[0.4em] max-lg:px-[0.7em] max-lg:gap-[5px] max-lg:rounded-lg"
      >
        <img
          src="/imgs/bookingicon.png"
          alt="Booking"
          className="w-5 h-5 object-contain max-lg:w-[15px] max-lg:h-[15px]"
        />
        BOOKING
      </a>
      <a
        href="/my-booking"
        className="flex items-center gap-2 no-underline py-[0.55em] px-[1.1em] rounded-[10px] font-copperplate font-bold text-[clamp(14px,1.4vw,20px)] whitespace-nowrap text-text-dark max-lg:text-[clamp(11px,1.1vw,14px)] max-lg:py-[0.4em] max-lg:px-[0.7em] max-lg:gap-[5px] max-lg:rounded-lg"
      >
        <img
          src="/imgs/myaccounticon.png"
          alt="My Account"
          className="w-5 h-5 object-contain max-lg:w-[15px] max-lg:h-[15px]"
        />
        MY BOOKING
      </a>
    </div>
  );
}

/* ── Mobile nav buttons (compact) ── */
function MobileNavButtons() {
  return (
    <div className="flex gap-2">
      <a
        href="/booking"
        className="flex items-center gap-1 no-underline py-1.5 px-2 rounded-[5px] font-copperplate font-bold text-xs whitespace-nowrap bg-brand-red text-white"
      >
        <img
          src="/imgs/bookingicon.png"
          alt="Booking"
          className="w-3.5 h-3.5 object-contain"
        />
        BOOKING
      </a>
      <a
        href="/my-booking"
        className="flex items-center gap-1 no-underline py-1.5 px-2 rounded-[5px] font-copperplate font-bold text-xs whitespace-nowrap bg-[#FFF6D6] text-text-dark"
      >
        <img
          src="/imgs/myaccounticon.png"
          alt="My Account"
          className="w-3.5 h-3.5 object-contain"
        />
        MY BOOKING
      </a>
    </div>
  );
}

export default function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement | null>(null);
  const marqueeNotice = getMarqueeNotice();

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
      {/* ── Promo notification bar (marquee) — driven by notices data ── */}
      {marqueeNotice && (
        <div
          data-header="promo-bar"
          className="w-full bg-[#ff0000] text-white p-0 text-center font-bold text-base flex justify-center items-center h-[45px] overflow-hidden max-md:text-sm"
        >
          <div className="w-full overflow-hidden">
            <div className="inline-block whitespace-nowrap animate-marquee pl-[100%] max-md:animate-marquee-mobile">
              <span className="inline-block pr-[50px]">
                🚨 IMPORTANT NOTICE: {marqueeNotice.marqueeText ?? marqueeNotice.title}{" "}
                <a href={marqueeNotice.link ?? "/notices"} className="text-white underline hover:text-[#cccccc]">
                  Please see full announcement details
                </a>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Top notification bar (red bar with directions + phone) ── */}
      <div
        data-header="notification-bar"
        className="bg-brand-red text-white py-2.5 px-10 flex justify-between items-center w-full h-[45px] max-lg:px-5 max-md:px-[15px] max-md:h-[45px] max-[375px]:px-2.5 max-[375px]:h-[45px]"
      >
        {/* Hamburger — visible on mobile only */}
        <button
          className="hidden max-md:flex items-center justify-center bg-transparent border-none p-2 cursor-pointer text-white"
          type="button"
          aria-label="Open menu"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <i className="fas fa-bars text-xl" />
        </button>

        {/* Directions link — left column */}
        <a
          href="#"
          className="flex-[0_1_33.333%] text-left font-bold text-white text-sm whitespace-nowrap pl-10 pr-2.5 flex items-center no-underline max-md:flex-none max-md:font-medium"
        >
          Directions to Gwanghwamun ticket office{" "}
          <img
            src="/imgs/googleicon.png"
            alt="Google"
            className="w-[25px] h-5 ml-1"
          />
          <img
            src="/imgs/navericon.png"
            alt="Naver"
            className="w-[22px] h-5 ml-1"
          />
        </a>

        {/* Right section — phone + language */}
        <div className="flex-[0_1_33.333%] flex items-center gap-2 justify-end max-lg:gap-1.5 max-md:flex-none max-md:gap-[15px] max-[375px]:gap-2.5">
          {/* Customer service — hidden on mobile */}
          <div className="text-white font-sans-semibold text-lg flex items-center gap-2 whitespace-nowrap tracking-tight max-lg:text-sm max-md:hidden">
            <p>T:</p>
            <span className="font-sans-semibold text-[22px] text-white font-semibold">
              02 777 6090
            </span>
          </div>

          {/* Language selector */}
          <div className="relative flex items-center z-[var(--z-dropdown)]" ref={languageRef}>
            <button
              className="bg-transparent border-none p-2 cursor-pointer flex items-center text-white max-md:p-1.5"
              type="button"
              aria-label="Language"
              onClick={(e) => {
                e.stopPropagation();
                setIsLanguageOpen((v) => !v);
              }}
            >
              <img
                src="/imgs/globe.svg"
                alt="Language"
                className="w-6 h-6 max-md:w-5 max-md:h-5 max-[375px]:w-[18px] max-[375px]:h-[18px]"
              />
            </button>

            <div
              className={`absolute top-full right-0 bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden z-[var(--z-dropdown)] ${
                isLanguageOpen ? "block" : "hidden"
              }`}
            >
              <a
                href="https://tb-en.netlify.app/"
                data-lang="en"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsLanguageOpen(false)}
                className="block py-3 px-5 text-text-dark no-underline whitespace-nowrap hover:bg-[#f5f5f5]"
              >
                English
              </a>
              <a
                href="https://tb-kr.netlify.app/"
                data-lang="kr"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsLanguageOpen(false)}
                className="block py-3 px-5 text-text-dark no-underline whitespace-nowrap hover:bg-[#f5f5f5]"
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
                className="block py-3 px-5 text-text-dark no-underline whitespace-nowrap hover:bg-[#f5f5f5]"
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
                className="block py-3 px-5 text-text-dark no-underline whitespace-nowrap hover:bg-[#f5f5f5]"
              >
                中文
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile header (logo + compact nav buttons) ── */}
      <div
        data-header="mobile-header"
        className="bg-brand-cream items-center justify-between py-3 px-[15px]"
      >
        <div className="w-[200px] p-0">
          <a href="/">
            <img
              src="/imgs/smalllogo.png"
              alt="Seoul City Tour Tiger Bus"
              className="h-auto w-[200px]"
            />
          </a>
        </div>
        <MobileNavButtons />
      </div>

      {/* ── Desktop navigation bar ── */}
      <nav
        data-header="main-nav"
        className="bg-brand-cream py-[15px] px-0 flex justify-between items-center h-auto max-lg:py-[15px] max-lg:px-5"
        aria-label="Primary"
      >
        <ul className="flex list-none gap-[clamp(12px,2.2vw,30px)] pl-[clamp(20px,5vw,80px)] items-center">
          <li>
            <a
              href="/"
              className="inline-flex items-center leading-none hover:bg-transparent focus-visible:outline-2 focus-visible:outline-[rgba(165,0,0,0.55)] focus-visible:outline-offset-2"
              aria-label="Home"
            >
              <img
                src="/imgs/smalllogo.png"
                alt="Seoul City Tour Bus"
                className="h-[clamp(32px,3.5vw,46px)] w-auto object-contain block"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/imgs/smalllogo.png";
                }}
              />
            </a>
          </li>
          <li>
            <a href="/tours" className="text-[#A50000] no-underline font-semibold text-[clamp(14px,1.4vw,20px)] whitespace-nowrap">
              Tours
            </a>
          </li>
          <li>
            <a href="/map" className="text-[#A50000] no-underline font-semibold text-[clamp(14px,1.4vw,20px)] whitespace-nowrap">
              Map
            </a>
          </li>
          <li>
            <a href="/notices" className="text-[#A50000] no-underline font-semibold text-[clamp(14px,1.4vw,20px)] whitespace-nowrap">
              Notices
            </a>
          </li>
          <li>
            <a href="/blog" className="text-[#A50000] no-underline font-semibold text-[clamp(14px,1.4vw,20px)] whitespace-nowrap">
              Discover
            </a>
          </li>
          <li>
            <a href="/discounts" className="text-[#A50000] no-underline font-semibold text-[clamp(14px,1.4vw,20px)] whitespace-nowrap">
              Discounts
            </a>
          </li>
          <li>
            <a href="/help" className="text-[#A50000] no-underline font-semibold text-[clamp(14px,1.4vw,20px)] whitespace-nowrap">
              Help
            </a>
          </li>
        </ul>
        <DesktopNavButtons />
      </nav>

      {/* ── Mobile fullscreen menu ── */}
      <div
        className={`fixed inset-0 w-full h-dvh bg-brand-cream z-[var(--z-nav-overlay)] p-5 ${
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
