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
        <h3 className="text-2xl text-[#333] mb-5">Become a Seoul City Tour Partner</h3>
        <p className="leading-relaxed mb-5 text-[#555]">
          Join our network of trusted partners and reach thousands of tourists visiting Seoul every day. Partner businesses receive prominent placement in our discount program and benefit from increased foot traffic and visibility.
        </p>
        <h4 className="text-lg text-[#E31E24] mt-[30px] mb-[15px]">Benefits of Partnering</h4>
        <ul className="pl-5 mb-5 space-y-2.5 list-disc">
          <li className="leading-relaxed">Exposure to international and local tourists</li>
          <li className="leading-relaxed">Listing on our website and mobile app</li>
          <li className="leading-relaxed">Featured in our printed materials</li>
          <li className="leading-relaxed">Promotional opportunities at our ticket offices</li>
          <li className="leading-relaxed">Cross-marketing opportunities</li>
        </ul>
        <h4 className="text-lg text-[#E31E24] mt-[30px] mb-[15px]">Requirements</h4>
        <ul className="pl-5 mb-5 space-y-2.5 list-disc">
          <li className="leading-relaxed">Business must be located near one of our bus routes or attractions</li>
          <li className="leading-relaxed">Offer a minimum discount of 10% or special promotion for Seoul City Tour passengers</li>
          <li className="leading-relaxed">Maintain consistent business hours</li>
          <li className="leading-relaxed">Display partner logo at your business location</li>
        </ul>
      </div>

      {/* Form column */}
      <div className="bg-[#f9f9f9] p-[30px] rounded-lg max-md:order-first">
        <h3 className="text-xl text-[#333] mb-5 text-center">Apply to Become a Partner</h3>
        {success ? (
          <p className="text-center font-semibold text-[#2e7d32]">
            Thank you for your application! We will contact you soon.
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
            <div className={fieldGroupClass}><label className={labelClass}>Contact Name*</label><input className={fieldClass} name="contactName" required /></div>
            <div className={fieldGroupClass}><label className={labelClass}>Email*</label><input className={fieldClass} name="email" type="email" required /></div>
            <div className={fieldGroupClass}><label className={labelClass}>Phone*</label><input className={fieldClass} name="phone" type="tel" required /></div>
            <div className={fieldGroupClass}><label className={labelClass}>Business Address*</label><textarea className={`${fieldClass} min-h-[100px] resize-y`} name="address" required /></div>
            <div className={fieldGroupClass}><label className={labelClass}>Proposed Discount/Promotion*</label><textarea className={`${fieldClass} min-h-[100px] resize-y`} name="proposedDiscount" placeholder="Describe the discount or special offer you can provide to Seoul City Tour passengers" required /></div>
            <div className={fieldGroupClass}><label className={labelClass}>Business Description*</label><textarea className={`${fieldClass} min-h-[100px] resize-y`} name="description" placeholder="Tell us about your business, services/products, and why you'd be a good partner" required /></div>
            <div className={fieldGroupClass}>
              <button
                type="submit"
                className="bg-[#E31E24] text-white border-none py-3.5 px-5 rounded text-base font-semibold cursor-pointer w-full transition-colors hover:bg-[#cc1a1f] disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                {submitting ? "Submitting…" : "Submit Application"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
