"use client";

import { useState } from "react";
import { BUSINESS_TYPES, type RecommendationPayload } from "@/lib/schemas/discounts";

/**
 * Recommend-a-place form.
 *
 * Submits to: POST /api/discounts/recommend
 * Python backend should accept RecommendationPayload JSON body.
 */
export default function RecommendForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload: RecommendationPayload = {
      businessName: fd.get("businessName") as string,
      businessType: fd.get("businessType") as string,
      location: fd.get("location") as string,
      reason: fd.get("reason") as string,
      yourName: fd.get("yourName") as string,
      yourEmail: fd.get("yourEmail") as string,
    };

    try {
      // TODO (backend): POST to Python API
      // await fetch("/api/discounts/recommend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      console.log("[RecommendForm] payload ready for backend:", payload);
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
    <div className="recommend-section">
      <h2>Recommend a Place</h2>
      <div className="recommend-content">
        <div className="recommend-info">
          <h3>Help Us Discover Seoul&apos;s Best Spots</h3>
          <p>Do you know an amazing restaurant, café, museum, or attraction that should be part of our discount program? Let us know! We&apos;re always looking to expand our partner network and provide the best experiences for our passengers.</p>
          <p>Your recommendations help us create a more authentic and enjoyable experience for visitors to Seoul. If your recommendation becomes one of our partners, we&apos;ll send you a special discount code for your next Seoul City Tour journey!</p>
        </div>

        <div className="recommend-form">
          <h3>Recommend a Business</h3>
          {success ? (
            <p style={{ textAlign: "center", color: "#2e7d32", fontWeight: 600 }}>
              Thank you for your recommendation! If we partner with this business, we will notify you with a special discount.
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
              <div className="form-group"><label>Location/Address (if known)</label><textarea name="location" /></div>
              <div className="form-group"><label>Why do you recommend this place?*</label><textarea name="reason" placeholder="Tell us what makes this place special and why it would be good for Seoul City Tour passengers" required /></div>
              <div className="form-group"><label>Your Name*</label><input name="yourName" required /></div>
              <div className="form-group"><label>Your Email*</label><input name="yourEmail" type="email" required /></div>
              <div className="form-group"><button type="submit" className="submit-btn" disabled={submitting}>{submitting ? "Submitting…" : "Submit Recommendation"}</button></div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

