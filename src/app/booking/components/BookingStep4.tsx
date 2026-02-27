"use client";

type Props = {
  referenceCode: string | null;
};

export default function BookingStep4({ referenceCode }: Props) {
  return (
    <>
      <div className="step-title-section">
        <span className="step-number">✓</span>
        <span className="step-title">Booking Confirmed</span>
      </div>
      <div className="booking-inner-container">
        <div className="confirmation-message">
          <h2>🎉 Your ticket is ready!</h2>
          <p>We&apos;ve sent your ticket to your email.</p>
          {referenceCode && (
            <p style={{ marginTop: "12px", fontWeight: 600, color: "#333" }}>
              Reference: <span style={{ color: "#E20021" }}>{referenceCode}</span>
            </p>
          )}
        </div>

        <div className="ticket-instructions">
          <h3>How to get your physical ticket</h3>
          <p>Visit any of our ticket offices with your booking reference:</p>

          <div className="step-icons">
            <div className="step">
              <img src="imgs/1.svg" alt="Claim Ticket" />
              <p>Claim your physical ticket at the ticket office</p>
            </div>
            <span className="step-divider" />
            <div className="step">
              <img src="imgs/2.svg" alt="Print at Kiosk" />
              <p>Print at Kiosk</p>
            </div>
            <span className="step-divider" />
            <div className="step">
              <img src="imgs/3.svg" alt="Visit Counter" />
              <p>Visit Counter</p>
            </div>
          </div>
        </div>

        <button className="continue-btn" onClick={() => { window.location.href = "/"; }}>
          Back to Home
        </button>
      </div>
    </>
  );
}
