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
      <div className="step-title-section">
        <span className="step-number">1</span>
        <span className="step-title">Select Your Tour</span>
      </div>
      <div className="booking-inner-container">

        {/* Tour Display */}
        <div className="tour-display" id="tour-display">
          <div className="tour-card">
            {tour.isPopular && <div className="popular-badge">Popular</div>}
            <img src={tour.image} alt={tour.title} className="tour-image" />
            <div className="tour-label-badge" style={{ backgroundColor: tour.labelColor }}>{tour.label}</div>
            <div className="tour-title">{tour.title}</div>
          </div>
        </div>

        {/* Tour Selector */}
        <div className="tour-selector">
          <select
            id="tour-select"
            value={step1.tourId}
            onChange={(e) => bookingStep1Store.setTourId(e.target.value as Step1TourId)}
          >
            <option value="tour01">Tour 01 Downtown Palace Namsan Course (Hop On, Hop Off)</option>
            <option value="tour02">Tour 02 Panorama Course</option>
            <option value="tour04">Tour 04 Night View Course (Non Stop)</option>
          </select>
        </div>

        {/* Tour Info Panel */}
        <div className="tour-info-panel">
          <div className={`tour-info-content ${step1.tourId}-info active`}>
            <div className="tour-info-row">
              <ul>{info.map((item, i) => <li key={i}>{item}</li>)}</ul>
              <div className="tour-map-btn-wrapper">
                <button className="tour-map-btn" onClick={() => setMapOpen(true)}>
                  <MapIcon /> Map
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tour Map Popup */}
        {mapOpen && (
          <div
            className="tour-map-popup-overlay"
            id="tourMapPopup"
            onClick={(e) => { if (e.target === e.currentTarget) setMapOpen(false); }}
          >
            <div className="tour-map-popup">
              <button className="tour-map-popup-close" onClick={() => setMapOpen(false)}>&times;</button>
              <div className="tour-map-content" id="tourMapContent">
                <svg className="tour-map-icon" viewBox="0 0 24 24" fill="none" stroke="#D40004" strokeWidth="1.5">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                  <line x1="8" y1="2" x2="8" y2="18" />
                  <line x1="16" y1="6" x2="16" y2="22" />
                </svg>
                <p className="tour-map-label">Tour Map</p>
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
        <div className="ticket-selection">
          <div className="ticket-type" data-type="adult">
            <div className="ticket-info">
              <div className="ticket-label">Adult</div>
              <div className="age-range">Ages 19-64</div>
            </div>
            <div className="price-counter">
              <div className="price">
                <span className="current-price">${pricing.adult.current.toFixed(2)}</span>
                <span className="original-price">${pricing.adult.original.toFixed(2)}</span>
              </div>
              <div className="counter">
                <button className="decrease" onClick={() => bookingStep1Store.dec("adult")}>-</button>
                <input type="text" readOnly className="count" value={step1.adultCount} onChange={() => {}} />
                <button className="increase" onClick={() => bookingStep1Store.inc("adult")}>+</button>
              </div>
            </div>
          </div>
          <div className="ticket-type" data-type="child">
            <div className="ticket-info">
              <div className="ticket-label">Child</div>
              <div className="age-range">Ages 3-18</div>
            </div>
            <div className="price-counter">
              <div className="price">
                <span className="current-price">${pricing.child.current.toFixed(2)}</span>
                <span className="original-price">${pricing.child.original.toFixed(2)}</span>
              </div>
              <div className="counter">
                <button className="decrease" onClick={() => bookingStep1Store.dec("child")}>-</button>
                <input type="text" readOnly className="count" value={step1.childCount} onChange={() => {}} />
                <button className="increase" onClick={() => bookingStep1Store.inc("child")}>+</button>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Total Summary */}
        <div className="total-summary">
          <div className="ticket-total">
            <span className="total-label">Total</span>
            <div className="total-price">
              {totals.originalTotal !== totals.currentTotal && (
                <span className="original-total">${totals.originalTotal.toFixed(2)}</span>
              )}
              <span className="current-total">${totals.currentTotal.toFixed(2)}</span>
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
        <div className="cancellation-info">
          <h3>Cancellation / Refund Information</h3>
          <div className="refund-rates">
            <p>• 100% refund if cancelled 3 days before boarding</p>
            <p>• 90% refund if cancelled 2 days before boarding</p>
            <p>• 80% refund if cancelled 1 day before boarding</p>
            <p>• 70% refund if cancelled on the day of boarding</p>
          </div>
          <p className="night-tour-warning">
            * No refunds are available for cancellations after 12:00 PM on the day of the night tour
          </p>
        </div>

        <button className="continue-btn" onClick={onContinue}>Continue</button>
      </div>

      {/* Add-on details modal */}
      <AddonProductDetailsModal
        open={detailsOpen}
        productId={detailsProductId}
        onClose={closeDetails}
        onAddItems={onAddItems}
        physicalColorProductIdStrategy="composite"
      />
    </>
  );
}
