"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { AffiliateDiscount } from "@/lib/schemas/discounts";

interface Props {
  affiliate: AffiliateDiscount | null;
  onClose: () => void;
}

export default function AffiliateDetailModal({ affiliate, onClose }: Props) {
  useEffect(() => {
    if (!affiliate) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [affiliate, onClose]);

  if (!affiliate) return null;

  const hostname = (() => {
    try { return new URL(affiliate.website).hostname; } catch { return affiliate.website; }
  })();

  const modal = (
    <>
      <div className="modal-backdrop active" onClick={onClose} />
      <div className="location-modal active">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="modal-content">
          <div className="location-details">
            {/* Left column */}
            <div className="details-left">
              <div className="affiliate-hero">
                <img className="location-hero-img" src={affiliate.image} alt={affiliate.name} style={{ display: "block" }} />
              </div>
              <div className="detail-section">
                <h3><i className="fas fa-map-marker-alt" /> Location</h3>
                <div className="address-info">
                  <i className="fas fa-location-dot" />
                  <div>
                    <p className="location-address">{affiliate.address}</p>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(affiliate.address)}`} className="location-button" target="_blank" rel="noreferrer">Get Directions</a>
                  </div>
                </div>
              </div>
              <div className="detail-section">
                <h3><i className="fas fa-gift" /> Benefit</h3>
                <div className="benefit-box"><p className="benefit-text">{affiliate.benefit}</p></div>
              </div>
              <div className="detail-section">
                <h3><i className="fas fa-globe" /> Website</h3>
                <a href={affiliate.website} className="website-link" target="_blank" rel="noreferrer">
                  <i className="fas fa-external-link-alt" />
                  <span className="website-url">{hostname}</span>
                </a>
              </div>
            </div>

            {/* Right column */}
            <div className="details-right">
              <div className="partner-header">
                <h2 className="location-name">{affiliate.name}</h2>
                {affiliate.description && <p className="location-desc" style={{ display: "block" }}>{affiliate.description}</p>}
              </div>
              <div className="detail-section">
                <h3><i className="fas fa-ticket-alt" /> How to Retrieve</h3>
                <div className="retrieve-box"><p className="retrieve-text">{affiliate.retrieveInstructions}</p></div>
              </div>
              <div className="detail-section">
                <h3><i className="fas fa-circle-info" /> Contact Info</h3>
                <div className="contact-box"><p className="contact-text">{affiliate.contact || "Contact details coming soon."}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modal, document.body);
}

