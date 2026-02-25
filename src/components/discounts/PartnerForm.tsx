"use client";

import { useState } from "react";
import { BUSINESS_TYPES, type PartnerApplicationPayload } from "@/lib/schemas/discounts";

/**
 * Partner application form.
 *
 * Submits to: POST /api/discounts/partner-apply
 * Python backend should accept PartnerApplicationPayload JSON body.
 */
export default function PartnerForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload: PartnerApplicationPayload = {
      businessName: fd.get("businessName") as string,
      businessType: fd.get("businessType") as string,
      contactName: fd.get("contactName") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      address: fd.get("address") as string,
      proposedDiscount: fd.get("proposedDiscount") as string,
      description: fd.get("description") as string,
    };

    try {
      // TODO (backend): POST to Python API
      // await fetch("/api/discounts/partner-apply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      console.log("[PartnerForm] payload ready for backend:", payload);
      setSuccess(true);
      e.currentTarget.reset();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="partner-section">
      <h2>Partner with Us</h2>
      <div className="partner-content">
        <div className="partner-info">
          <h3>Become a Seoul City Tour Partner</h3>
          <p>Join our network of trusted partners and reach thousands of tourists visiting Seoul every day. Partner businesses receive prominent placement in our discount program and benefit from increased foot traffic and visibility.</p>
          <h4>Benefits of Partnering</h4>
          <ul>
            <li>Exposure to international and local tourists</li>
            <li>Listing on our website and mobile app</li>
            <li>Featured in our printed materials</li>
            <li>Promotional opportunities at our ticket offices</li>
            <li>Cross-marketing opportunities</li>
          </ul>
          <h4>Requirements</h4>
          <ul>
            <li>Business must be located near one of our bus routes or attractions</li>
            <li>Offer a minimum discount of 10% or special promotion for Seoul City Tour passengers</li>
            <li>Maintain consistent business hours</li>
            <li>Display partner logo at your business location</li>
          </ul>
        </div>

        <div className="partner-form">
          <h3>Apply to Become a Partner</h3>
          {success ? (
            <p style={{ textAlign: "center", color: "#2e7d32", fontWeight: 600 }}>
              Thank you for your application! We will contact you soon.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Business Name*</label><input name="businessName" required /></div>
              <div className="form-group">
                <label>Business Type*</label>
                <select name="businessType" required defaultValue="">
                  <option value="" disabled>Select business type</option>
                  {BUSINESS_TYPES.map((bt) => <option key={bt.value} value={bt.value}>{bt.label}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Contact Name*</label><input name="contactName" required /></div>
              <div className="form-group"><label>Email*</label><input name="email" type="email" required /></div>
              <div className="form-group"><label>Phone*</label><input name="phone" type="tel" required /></div>
              <div className="form-group"><label>Business Address*</label><textarea name="address" required /></div>
              <div className="form-group"><label>Proposed Discount/Promotion*</label><textarea name="proposedDiscount" placeholder="Describe the discount or special offer you can provide to Seoul City Tour passengers" required /></div>
              <div className="form-group"><label>Business Description*</label><textarea name="description" placeholder="Tell us about your business, services/products, and why you'd be a good partner" required /></div>
              <div className="form-group"><button type="submit" className="submit-btn" disabled={submitting}>{submitting ? "Submitting…" : "Submit Application"}</button></div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

