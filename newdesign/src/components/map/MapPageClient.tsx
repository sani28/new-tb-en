"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import BodyClass from "@/components/BodyClass";
import TourMap from "./TourMap";
import StopInfoPanel from "./StopInfoPanel";
import { TOURS, NOTIFICATIONS, type TourRoute } from "@/lib/data/tourStops";

export default function MapPageClient() {
  const [activeTourId, setActiveTourId] = useState("01");
  const [landmarksVisible, setLandmarksVisible] = useState(false);
  const [selectedStopIdx, setSelectedStopIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeTour = TOURS.find((t) => t.id === activeTourId) ?? TOURS[0];
  const notification = NOTIFICATIONS[activeTourId];

  // Stops carousel state
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateCarouselNav = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateCarouselNav();
  }, [activeTourId, updateCarouselNav]);

  function scrollCarousel(dir: "left" | "right") {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
    setTimeout(updateCarouselNav, 350);
  }

  // Tour toggle horizontal scroll
  function scrollToggle(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  }

  return (
    <main className="px-10 pb-[60px] mb-[60px] max-md:px-5 max-md:pt-[80px] max-md:pb-10 max-md:mb-10">
      <BodyClass className="template-page" />

      {/* Banner */}
      <div className="relative w-full h-[300px] overflow-hidden rounded-xl mt-[80px] max-md:h-[250px] max-md:mt-[15px]">
        <div className="absolute inset-0 bg-[#6A1E1E]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/imgs/banner.png"
            alt="Map Banner"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="absolute inset-0 bg-black/30 z-[1]" />
        <div className="absolute inset-0 flex items-center justify-center z-[2] px-5">
          <h2 className="text-white text-[32px] font-semibold text-center font-copperplate drop-shadow-lg max-md:text-2xl">
            Visit all of Seoul&apos;s famous landmarks in one day
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-10 mx-auto max-w-[1400px] min-h-[500px] mt-5 max-md:p-5 max-md:rounded-lg">
        {/* Notification Banner */}
        {notification && (
          <div className="flex items-start gap-3 p-4 mb-5 bg-[#FFF3CD] border border-[#FFE69C] rounded-lg text-sm text-[#664D03]">
            <svg
              className="w-5 h-5 mt-0.5 shrink-0 text-[#664D03]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>{notification}</span>
          </div>
        )}

        {/* Tour Toggle */}
        <div className="relative bg-white/95 p-[15px] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] mb-[30px] max-md:p-2.5">
          <div
            ref={scrollRef}
            className="flex justify-center gap-5 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory max-md:justify-start max-md:gap-2.5"
          >
            {TOURS.map((tour) => (
              <TourToggleButton
                key={tour.id}
                tour={tour}
                isActive={tour.id === activeTourId}
                onClick={() => { setActiveTourId(tour.id); setLandmarksVisible(false); setSelectedStopIdx(null); }}
              />
            ))}
          </div>
          {/* Scroll arrows for mobile */}
          <button
            type="button"
            onClick={() => scrollToggle("left")}
            className="hidden max-md:flex absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow items-center justify-center z-10 border-none cursor-pointer"
            aria-label="Scroll left"
          >
            &#8249;
          </button>
          <button
            type="button"
            onClick={() => scrollToggle("right")}
            className="hidden max-md:flex absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow items-center justify-center z-10 border-none cursor-pointer"
            aria-label="Scroll right"
          >
            &#8250;
          </button>
        </div>

        {/* Map Container */}
        <div className="relative rounded-xl overflow-hidden mb-[30px]">
          <TourMap
            tour={activeTour}
            landmarksVisible={landmarksVisible}
            onStopSelect={setSelectedStopIdx}
          />
          {/* Landmarks toggle */}
          {activeTour.landmarks.length > 0 && (
          <div className="absolute top-5 left-5 z-10 max-md:top-[15px] max-md:left-[15px]">
            <button
              type="button"
              onClick={() => setLandmarksVisible((v) => !v)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 text-[13px] font-medium border-none rounded cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,0.1)] whitespace-nowrap transition-all max-md:text-xs max-md:px-2.5 max-md:py-1.5 ${
                landmarksVisible
                  ? "bg-[#E20021] text-white"
                  : "bg-white text-[#333] hover:bg-[#f5f5f5]"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              Popular Landmarks
            </button>
          </div>
          )}

          {/* Stop Info Panel */}
          {selectedStopIdx !== null && activeTour.stops[selectedStopIdx] && (
            <StopInfoPanel
              tour={activeTour}
              stop={activeTour.stops[selectedStopIdx]}
              stopIndex={selectedStopIdx}
              onClose={() => setSelectedStopIdx(null)}
            />
          )}
        </div>

        {/* Stops Carousel */}
        {activeTour.stops.length > 0 && (
        <div className="relative">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => scrollCarousel("left")}
              disabled={!canScrollLeft}
              className="w-10 h-10 border-none bg-[#F8F8F8] rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-[#E5E5E5] disabled:opacity-50 disabled:cursor-not-allowed shrink-0 max-md:w-9 max-md:h-9"
              aria-label="Previous stops"
            >
              &#8249;
            </button>
            <div
              ref={carouselRef}
              onScroll={updateCarouselNav}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide py-2"
            >
              {activeTour.stops.map((stop, idx) => (
                <div
                  key={stop.name}
                  onClick={() => setSelectedStopIdx(idx)}
                  className="snap-start shrink-0 w-[200px] bg-[#F8F8F8] rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={stop.image}
                    alt={stop.name}
                    className="w-full h-[120px] object-cover"
                  />
                  <div className="p-3">
                    <span
                      className="inline-block text-[10px] font-bold text-white px-1.5 py-0.5 rounded mb-1.5"
                      style={{ backgroundColor: activeTour.color }}
                    >
                      Stop {String(idx + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm font-medium text-[#333] m-0 leading-tight">
                      {stop.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => scrollCarousel("right")}
              disabled={!canScrollRight}
              className="w-10 h-10 border-none bg-[#F8F8F8] rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-[#E5E5E5] disabled:opacity-50 disabled:cursor-not-allowed shrink-0 max-md:w-9 max-md:h-9"
              aria-label="Next stops"
            >
              &#8250;
            </button>
          </div>
        </div>
        )}
      </div>
    </main>
  );
}

/* ── Tour Toggle Button ── */

function TourToggleButton({
  tour,
  isActive,
  onClick,
}: {
  tour: TourRoute;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`snap-start shrink-0 min-w-[280px] max-w-[350px] py-5 px-[25px] rounded-xl cursor-pointer transition-all flex flex-col items-center gap-2 relative overflow-hidden border-2 max-md:min-w-[220px] max-md:py-[15px] max-md:px-5 ${
        isActive
          ? "shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
          : "border-[#e5e5e5] bg-white hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
      }`}
      style={
        isActive
          ? { borderColor: tour.color, background: tour.activeColor }
          : undefined
      }
    >
      {/* Top accent bar */}
      <span
        className={`absolute top-0 left-0 w-full h-1 transition-transform origin-left ${
          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
        style={{ backgroundColor: tour.color }}
      />
      <span className="text-xl font-bold text-[#333] font-copperplate max-md:text-lg">
        {tour.code}
      </span>
      <span
        className={`text-base text-center max-md:text-sm ${
          isActive ? "text-[#333]" : "text-[#666]"
        }`}
      >
        {tour.name}
      </span>
    </button>
  );
}
