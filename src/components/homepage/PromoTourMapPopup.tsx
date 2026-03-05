export default function PromoTourMapPopup() {
  return (
    <div className="tour-map-popup-overlay" id="promoTourMapPopup" aria-hidden="true">
      <div className="tour-map-popup">
        <button className="tour-map-popup-close" id="promoTourMapClose" type="button" aria-label="Close">
          &times;
        </button>
        {/* tour-map-content kept for styles.css rules; Tailwind overrides CSS defaults */}
        <div className="tour-map-content justify-start p-5 gap-3.5" id="promoTourMapContent">
          <div className="flex items-center gap-2.5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D40004" strokeWidth="1.5" aria-hidden="true">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
            <h3 id="promoTourMapTitle" className="m-0 text-lg font-bold">Tour Map</h3>
          </div>
          <div className="tour-map-image-placeholder w-full h-[320px] border border-dashed border-[#ccc] rounded-xl flex items-center justify-center text-[#666]">
            Map image placeholder
          </div>
        </div>
      </div>
    </div>
  );
}

