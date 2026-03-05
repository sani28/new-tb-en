"use client";

import { useCallback, useState } from "react";
import { bookingStep1Store, useBookingStep1, type Step1TourId } from "@/app/booking/step1/store";
import { bookingCartStore } from "@/app/booking/cart/store";
import AddonProductDetailsModal, { type AddonCartItemPayload } from "@/components/addons/AddonProductDetailsModal";
import EnhanceSeoulAddonsCarousel from "@/components/addons/EnhanceSeoulAddonsCarousel";
import BookingCalendar from "./BookingCalendar";

type Props = {
  onContinue: () => void;
};

const TOUR_DATA: Record<Step1TourId, { label: string; labelColor: string; image: string; title: string; isPopular: boolean }> = {
  tour01: { label: "TOUR 01", labelColor: "#000080", image: "imgs/tour01__.png", title: "DOWNTOWN PALACE NAMSAN COURSE", isPopular: false },
  tour02: { label: "TOUR 02", labelColor: "#C41E3A", image: "imgs/panorama.png", title: "PANORAMA COURSE", isPopular: false },
  tour04: { label: "TOUR 04", labelColor: "#FFD700", image: "imgs/tour02__.png", title: "NIGHT VIEW COURSE", isPopular: true },
};

const TOUR_INFO: Record<Step1TourId, string[]> = {
  tour01: [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    "Sed do eiusmod tempor incididunt ut labore et dolore",
    "Ut enim ad minim veniam, quis nostrud exercitation",
    "Duis aute irure dolor in reprehenderit in voluptate",
  ],
  tour02: [
    "Panorama Course - scenic views of Seoul",
    "First Bus: 10:00AM, Last Bus: 5:00PM",
    "Interval: Every 45 minutes",
    "Total Course Time: 2 hours",
  ],
  tour04: [
    "Excepteur sint occaecat cupidatat non proident sunt",
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur",
    "Neque porro quisquam est qui dolorem ipsum quia dolor",
    "Quis autem vel eum iure reprehenderit qui in ea voluptate",
  ],
};

const MapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </svg>
);

export default function BookingStep1({ onContinue }: Props) {
  const step1 = useBookingStep1();
  const [mapOpen, setMapOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsProductId, setDetailsProductId] = useState<string | null>(null);

  const pricing = bookingStep1Store.getPricing(step1.tourId);
  const totals = bookingStep1Store.getTotals(step1);
  const tour = TOUR_DATA[step1.tourId];
  const info = TOUR_INFO[step1.tourId];

  const closeDetails = useCallback(() => setDetailsOpen(false), []);

  const onAddItems = useCallback((items: AddonCartItemPayload[]) => {
    items.forEach((i) => bookingCartStore.addItem(i));
    closeDetails();
  }, [closeDetails]);

  return (
    <>
      {/* Step Title */}
      <div className="flex items-center gap-3 border-b border-[#eee] px-6 py-5">
        <span className="flex size-8 items-center justify-center rounded-full bg-brand-red text-base font-semibold text-white">1</span>
        <span className="text-lg font-semibold text-text-dark">Select Your Tour</span>
      </div>
      <div className="p-6 max-md:p-4">

        {/* Tour Display */}
        <div className="relative mb-5 h-[200px] overflow-hidden rounded-xl bg-[#f5f5f5]" id="tour-display">
          <div className="relative h-full">
            {tour.isPopular && <div className="absolute right-4 top-4 z-10 rounded bg-[#E31E24] px-3 py-1 text-sm font-semibold text-white">Popular</div>}
            <img src={tour.image} alt={tour.title} className="size-full object-cover object-center" />
            <div className="absolute bottom-4 left-4 z-10 rounded px-3 py-1 text-sm font-semibold text-white" style={{ backgroundColor: tour.labelColor }}>{tour.label}</div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-b from-transparent to-black/80 p-4 font-semibold text-white">{tour.title}</div>
          </div>
        </div>

        {/* Tour Selector */}
        <div className="mb-5">
          <select
            id="tour-select"
            value={step1.tourId}
            onChange={(e) => bookingStep1Store.setTourId(e.target.value as Step1TourId)}
            className="w-full cursor-pointer appearance-none rounded-lg border border-[#ddd] bg-white bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%2712%27%20viewBox=%270%200%2012%2012%27%3E%3Cpath%20fill=%27%23333%27%20d=%27M6%208L1%203h10z%27/%3E%3C/svg%3E')] bg-[position:right_16px_center] bg-no-repeat px-4 py-3.5 text-[15px]"
          >
            <option value="tour01">Tour 01 Downtown Palace Namsan Course (Hop On, Hop Off)</option>
            <option value="tour02">Tour 02 Panorama Course</option>
            <option value="tour04">Tour 04 Night View Course (Non Stop)</option>
          </select>
        </div>

        {/* Tour Info Panel */}
        <div className="mb-4 w-full overflow-hidden">
          <div className="max-h-[200px] py-2.5 opacity-100">
            <div className="flex items-center justify-between gap-4">
              <ul className="m-0 flex-1 list-none p-0">
                {info.map((item, i) => (
                  <li key={i} className="relative mb-2 pl-5 text-sm leading-relaxed text-text-dark last:mb-0 before:absolute before:left-[5px] before:font-bold before:text-[#D40004] before:content-['•']">{item}</li>
                ))}
              </ul>
              <div className="shrink-0">
                <button className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-[#D40004] to-[#A50000] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(164,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(164,0,0,0.4)]" onClick={() => setMapOpen(true)}>
                  <MapIcon /> Map
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tour Map Popup */}
        {mapOpen && (
          <div
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80"
            id="tourMapPopup"
            onClick={(e) => { if (e.target === e.currentTarget) setMapOpen(false); }}
          >
            <div className="relative max-h-[90%] max-w-[90%] overflow-hidden rounded-xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.4)] animate-in fade-in zoom-in-95">
              <button className="absolute right-2.5 top-2.5 z-1 flex size-9 items-center justify-center rounded-full border-none bg-black/70 text-2xl leading-none text-white transition-all hover:scale-110 hover:bg-[#D40004]" onClick={() => setMapOpen(false)}>&times;</button>
              <div className="flex h-[800px] max-h-[80vh] w-[600px] max-w-[90vw] flex-col items-center justify-center gap-5 bg-white">
                <svg className="size-[120px]" viewBox="0 0 24 24" fill="none" stroke="#D40004" strokeWidth="1.5">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                  <line x1="8" y1="2" x2="8" y2="18" />
                  <line x1="16" y1="6" x2="16" y2="22" />
                </svg>
                <p className="m-0 text-2xl font-semibold text-text-dark">Tour Map</p>
              </div>
            </div>
          </div>
        )}

        {/* Date Selector */}
        <BookingCalendar
          selectedDate={step1.selectedDate}
          onDateSelect={(d) => bookingStep1Store.setSelectedDate(d)}
        />

        {/* Ticket Selection */}
        <div className="mb-5">
          {/* Adult ticket */}
          <div className="mb-3 rounded-xl border border-[#eee] bg-[#f8f9fa] p-5 max-md:p-4" data-type="adult">
            <div className="mb-3">
              <div className="mb-1 text-lg font-semibold text-text-dark">Adult</div>
              <div className="text-sm text-text-gray">Ages 19-64</div>
            </div>
            <div className="flex items-center justify-between border-t border-[#eee] pt-3">
              <div className="flex flex-col gap-1">
                <span className="text-xl font-semibold text-brand-red max-md:text-lg">${pricing.adult.current.toFixed(2)}</span>
                <span className="text-sm text-text-light-gray line-through">${pricing.adult.original.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-[#eee] bg-white px-3 py-2">
                <button className="flex size-8 cursor-pointer items-center justify-center rounded-md border border-[#ddd] bg-white text-base hover:bg-[#f5f5f5]" onClick={() => bookingStep1Store.dec("adult")}>-</button>
                <input type="text" readOnly className="size-8 rounded-md border border-[#ddd] text-center text-base" value={step1.adultCount} />
                <button className="flex size-8 cursor-pointer items-center justify-center rounded-md border border-[#ddd] bg-white text-base hover:bg-[#f5f5f5]" onClick={() => bookingStep1Store.inc("adult")}>+</button>
              </div>
            </div>
          </div>
          {/* Child ticket */}
          <div className="mb-3 rounded-xl border border-[#eee] bg-[#f8f9fa] p-5 max-md:p-4" data-type="child">
            <div className="mb-3">
              <div className="mb-1 text-lg font-semibold text-text-dark">Child</div>
              <div className="text-sm text-text-gray">Ages 3-18</div>
            </div>
            <div className="flex items-center justify-between border-t border-[#eee] pt-3">
              <div className="flex flex-col gap-1">
                <span className="text-xl font-semibold text-brand-red max-md:text-lg">${pricing.child.current.toFixed(2)}</span>
                <span className="text-sm text-text-light-gray line-through">${pricing.child.original.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-[#eee] bg-white px-3 py-2">
                <button className="flex size-8 cursor-pointer items-center justify-center rounded-md border border-[#ddd] bg-white text-base hover:bg-[#f5f5f5]" onClick={() => bookingStep1Store.dec("child")}>-</button>
                <input type="text" readOnly className="size-8 rounded-md border border-[#ddd] text-center text-base" value={step1.childCount} />
                <button className="flex size-8 cursor-pointer items-center justify-center rounded-md border border-[#ddd] bg-white text-base hover:bg-[#f5f5f5]" onClick={() => bookingStep1Store.inc("child")}>+</button>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Total Summary */}
        <div className="mb-5 rounded-xl border border-[#eee] bg-[#f8f9fa] p-5">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-text-dark">Total</span>
            <div className="flex items-center gap-3">
              {totals.originalTotal !== totals.currentTotal && (
                <span className="text-base text-text-light-gray line-through">${totals.originalTotal.toFixed(2)}</span>
              )}
              <span className="text-2xl font-extrabold text-brand-red max-md:text-xl">${totals.currentTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Add-ons Carousel */}
        <EnhanceSeoulAddonsCarousel
          selectedTourId={step1.tourId}
          subtitle="Add these exclusive add-ons to make your tour even more memorable!"
          onViewDetails={(productId) => {
            setDetailsProductId(productId);
            setDetailsOpen(true);
          }}
        />

        {/* Cancellation / Refund policy */}
        <div className="mt-5 rounded-xl bg-[#fff9e6] p-5">
          <h3 className="mb-3 text-base font-semibold text-text-dark">Cancellation / Refund Information</h3>
          <div>
            <p className="mb-1.5 text-sm text-text-gray">• 100% refund if cancelled 3 days before boarding</p>
            <p className="mb-1.5 text-sm text-text-gray">• 90% refund if cancelled 2 days before boarding</p>
            <p className="mb-1.5 text-sm text-text-gray">• 80% refund if cancelled 1 day before boarding</p>
            <p className="mb-1.5 text-sm text-text-gray">• 70% refund if cancelled on the day of boarding</p>
          </div>
          <p className="mt-3 text-xs text-brand-red">
            * No refunds are available for cancellations after 12:00 PM on the day of the night tour
          </p>
        </div>

        <button className="mt-5 w-full rounded-lg bg-brand-red p-4 text-base font-semibold text-white transition-colors hover:bg-brand-dark-red" onClick={onContinue}>Continue</button>
      </div>

      {/* Add-on details modal */}
      <AddonProductDetailsModal
        key={`${detailsProductId ?? "none"}-${detailsOpen ? "open" : "closed"}`}
        open={detailsOpen}
        productId={detailsProductId}
        onClose={closeDetails}
        onAddItems={onAddItems}
        physicalColorProductIdStrategy="composite"
      />
    </>
  );
}
