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
      void payload;
      setSuccess(true);
      e.currentTarget.reset();
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const fieldClass = "w-full py-3 px-3 border border-[#ddd] rounded text-[15px]";
  const fieldGroupClass = "mb-5";
  const labelClass = "block mb-2 font-medium text-[#333]";

  return (
    <div className="grid grid-cols-2 gap-10 mt-[30px] max-md:grid-cols-1">
      {/* Info column */}
      <div>
        <h3 className="text-2xl text-[#333] mb-5">Help Us Discover Seoul&apos;s Best Spots</h3>
        <p className="leading-relaxed mb-5 text-[#555]">
          Do you know an amazing restaurant, café, museum, or attraction that should be part of our discount program? Let us know! We&apos;re always looking to expand our partner network and provide the best experiences for our passengers.
        </p>
        <p className="leading-relaxed mb-5 text-[#555]">
          Your recommendations help us create a more authentic and enjoyable experience for visitors to Seoul. If your recommendation becomes one of our partners, we&apos;ll send you a special discount code for your next Seoul City Tour journey!
        </p>
      </div>

      {/* Form column */}
      <div className="bg-[#f9f9f9] p-[30px] rounded-lg max-md:order-first">
        <h3 className="text-xl text-[#333] mb-5 text-center">Recommend a Business</h3>
        {success ? (
          <p className="text-center font-semibold text-[#2e7d32]">
            Thank you for your recommendation! If we partner with this business, we will notify you with a special discount.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={fieldGroupClass}><label className={labelClass}>Business Name*</label><input className={fieldClass} name="businessName" required /></div>
            <div className={fieldGroupClass}>
              <label className={labelClass}>Business Type*</label>
              <select className={fieldClass} name="businessType" required defaultValue="">
                <option value="" disabled>Select business type</option>
                {BUSINESS_TYPES.map((bt) => <option key={bt.value} value={bt.value}>{bt.label}</option>)}
              </select>
            </div>
            <div className={fieldGroupClass}><label className={labelClass}>Location/Address (if known)</label><textarea className={`${fieldClass} min-h-[100px] resize-y`} name="location" /></div>
            <div className={fieldGroupClass}><label className={labelClass}>Why do you recommend this place?*</label><textarea className={`${fieldClass} min-h-[100px] resize-y`} name="reason" placeholder="Tell us what makes this place special and why it would be good for Seoul City Tour passengers" required /></div>
            <div className={fieldGroupClass}><label className={labelClass}>Your Name*</label><input className={fieldClass} name="yourName" required /></div>
            <div className={fieldGroupClass}><label className={labelClass}>Your Email*</label><input className={fieldClass} name="yourEmail" type="email" required /></div>
            <div className={fieldGroupClass}>
              <button
                type="submit"
                className="bg-[#E31E24] text-white border-none py-3.5 px-5 rounded text-base font-semibold cursor-pointer w-full transition-colors hover:bg-[#cc1a1f] disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                {submitting ? "Submitting…" : "Submit Recommendation"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
