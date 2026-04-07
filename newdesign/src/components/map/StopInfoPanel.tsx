/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect } from "react";
import type { TourStop, TourRoute } from "@/lib/data/tourStops";
import { getStopDetail } from "@/lib/data/stopDetails";

interface Props {
  tour: TourRoute;
  stop: TourStop;
  stopIndex: number;
  onClose: () => void;
}

export default function StopInfoPanel({ tour, stop, stopIndex, onClose }: Props) {
  const detail = getStopDetail(tour.id, stopIndex);
  const stopNum = String(stopIndex + 1).padStart(2, "0");

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop — visible on both desktop and mobile */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
        onClick={onClose}
      />

      {/* Desktop: right-side panel */}
      <div className="hidden md:flex absolute top-5 right-5 bottom-5 z-20 w-[400px] flex-col bg-white/95 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] overflow-hidden animate-slide-in-right">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white shadow-md border-none flex items-center justify-center cursor-pointer text-[#666] hover:bg-[#f5f5f5] transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Stop badge */}
          <span
            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mb-3"
            style={{ backgroundColor: tour.color, color: tour.color === "#FFCC00" ? "#000" : "#fff" }}
          >
            {stopIndex + 1}
          </span>

          {/* Title */}
          <h2 className="text-xl font-semibold text-[#333] mb-1">{stop.name}</h2>
          <p className="text-xs text-[#999] mb-4">Stop {stopNum} · {tour.code}</p>

          {/* Stop image */}
          <img
            src={stop.image}
            alt={stop.name}
            className="w-full aspect-video object-cover rounded-lg mb-4"
          />

          {detail && (
            <>
              {/* Address */}
              <div className="mb-4">
                <p className="text-sm text-[#666] leading-relaxed">{detail.address}</p>
                <p className="text-sm text-[#333] leading-relaxed mt-1">{detail.locationDesc}</p>
              </div>

              {/* Directions */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[#333] mb-2">Directions</h3>
                <ul className="space-y-1.5">
                  {detail.directions.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm text-[#666]">
                      <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#999]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h3.372c.26 0 .51.1.695.272l2.477 2.334c.185.172.434.269.694.269h2.774" />
                      </svg>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nearby attractions */}
              <div>
                <h3 className="text-sm font-semibold text-[#333] mb-2">Nearby Attractions</h3>
                <div className="flex flex-wrap gap-2">
                  {detail.nearbyAttractions.map((a) => (
                    <span key={a} className="text-xs bg-[#F5F5F5] text-[#555] px-2.5 py-1 rounded-full">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile: bottom sheet */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-50 max-h-[80vh] bg-white rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)] overflow-hidden animate-slide-in-up">
        {/* Drag handle */}
        <div className="flex justify-center py-2">
          <div className="w-10 h-1 rounded-full bg-[#DDD]" />
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-4 z-10 w-8 h-8 rounded-full bg-[#F5F5F5] border-none flex items-center justify-center cursor-pointer text-[#666]"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[calc(80vh-40px)] px-5 pb-6">
          {/* Header row */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold shrink-0"
              style={{ backgroundColor: tour.color, color: tour.color === "#FFCC00" ? "#000" : "#fff" }}
            >
              {stopIndex + 1}
            </span>
            <div>
              <h2 className="text-lg font-semibold text-[#333] leading-tight">{stop.name}</h2>
              <p className="text-xs text-[#999]">Stop {stopNum} · {tour.code}</p>
            </div>
          </div>

          {/* Image */}
          <img
            src={stop.image}
            alt={stop.name}
            className="w-full aspect-video object-cover rounded-xl mb-4"
          />

          {detail && (
            <>
              <p className="text-sm text-[#666] mb-1">{detail.address}</p>
              <p className="text-sm text-[#333] mb-4">{detail.locationDesc}</p>

              <h3 className="text-sm font-semibold text-[#333] mb-2">Directions</h3>
              <ul className="space-y-1.5 mb-4">
                {detail.directions.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-[#666]">
                    <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#999]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h3.372c.26 0 .51.1.695.272l2.477 2.334c.185.172.434.269.694.269h2.774" />
                    </svg>
                    {d}
                  </li>
                ))}
              </ul>

              <h3 className="text-sm font-semibold text-[#333] mb-2">Nearby Attractions</h3>
              <div className="flex flex-wrap gap-2">
                {detail.nearbyAttractions.map((a) => (
                  <span key={a} className="text-xs bg-[#F5F5F5] text-[#555] px-2.5 py-1 rounded-full">
                    {a}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
