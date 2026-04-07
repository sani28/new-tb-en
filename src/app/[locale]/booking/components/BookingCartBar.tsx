"use client";

import { useEffect } from "react";
import { useBookingStep1 } from "../step1/store";

type Props = {
  onContinue: () => void;
};

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default function BookingCartBar({ onContinue }: Props) {
  const step1 = useBookingStep1();
  const isVisible = step1.selectedDate !== null;

  useEffect(() => {
    document.body.classList.toggle("cart-visible", isVisible);
    return () => {
      document.body.classList.remove("cart-visible");
    };
  }, [isVisible]);

  const ticketParts: string[] = [];
  if (step1.adultCount > 0) ticketParts.push(`${step1.adultCount} Adult${step1.adultCount > 1 ? "s" : ""}`);
  if (step1.childCount > 0) ticketParts.push(`${step1.childCount} Child${step1.childCount > 1 ? "ren" : ""}`);
  const ticketSummary = ticketParts.length > 0 ? ticketParts.join(", ") : "No tickets yet";

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[var(--z-cart-bar)] w-full bg-brand-red px-10 py-4 text-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] transition-transform duration-300 max-md:px-4"
      style={{ transform: isVisible ? "translateY(0)" : "translateY(100%)" }}
      id="booking-summary-bar"
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[15px] font-bold">
              {step1.selectedDate ? formatDate(step1.selectedDate) : ""}
            </span>
            <span className="text-sm opacity-80">{ticketSummary}</span>
          </div>
        </div>
        <button
          className="flex shrink-0 items-center gap-2 rounded-[25px] border-none bg-white px-6 py-3 text-[15px] font-semibold text-brand-red transition-all hover:scale-[1.02] hover:bg-[#f5f5f5]"
          onClick={onContinue}
        >
          Find Available Tours
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
