export default function PromoTourMapPopup() {
  return (
    <div className="tour-map-popup-overlay" id="promoTourMapPopup" aria-hidden="true">
      <div className="tour-map-popup">
        <button className="tour-map-popup-close" id="promoTourMapClose" type="button" aria-label="Close">
          &times;
        </button>
        <div
          className="tour-map-content"
          id="promoTourMapContent"
          style={{ justifyContent: "flex-start", padding: 20, gap: 14 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D40004" strokeWidth="1.5" aria-hidden="true">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
            <h3 id="promoTourMapTitle" style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
              Tour Map
            </h3>
          </div>
          <div
            className="tour-map-image-placeholder"
            style={{ width: "100%", height: 320, border: "1px dashed #ccc", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}
          >
            Map image placeholder
          </div>
        </div>
      </div>
    </div>
  );
}

