"use client";

import { useEffect } from "react";

export default function RefundModal({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 md:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Mobile: bottom-sheet (full width, rounded top, max 92vh).
          Desktop: centered card (90% width, max 500px, max 85vh). */}
      <div className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_-4px_40px_rgba(0,0,0,0.25)] md:max-h-[85vh] md:w-[90%] md:max-w-[500px] md:rounded-xl md:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        {/* Drag indicator — mobile only */}
        <div className="flex justify-center pt-2 md:hidden">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/[0.06] text-gray-600 transition-colors hover:bg-black/10 md:h-8 md:w-8 md:top-3"
          aria-label="Close"
        >
          <i className="fas fa-times text-sm" />
        </button>

        {/* Title */}
        <div className="border-b border-gray-200 px-5 py-3 md:px-6 md:py-4">
          <h3 className="pr-10 text-base font-semibold text-gray-800 md:text-lg">
            {title}
          </h3>
        </div>

        {/* Scrollable body — smooth scroll on iOS */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 md:p-6 [-webkit-overflow-scrolling:touch]">
          {children}
        </div>

        {/* Footer with action buttons — safe-area padding for notch phones */}
        <div className="flex gap-3 border-t border-gray-200 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 md:justify-end md:px-6 md:pb-4 md:pt-4">
          {footer}
        </div>
      </div>
    </div>
  );
}
