"use client";

import { useEffect } from "react";
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

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[1000] block" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-[30px] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] z-[1001] w-[95%] max-w-[700px] max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-5 right-5 bg-transparent border-none text-2xl cursor-pointer text-[#666] leading-none"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="mt-2.5">
          <div className="flex gap-5 mb-[22px] max-md:flex-col">
            {/* Left column */}
            <div className="flex-1">
              <div className="mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-[260px] rounded-2xl object-cover border border-[#eee] bg-[#fafafa] block max-md:h-[200px] max-md:rounded-xl"
                  src={affiliate.image}
                  alt={affiliate.name}
                  style={{ display: "block" }}
                />
              </div>

              <div className="mb-[18px]">
                <h3 className="text-base text-[#333] mb-2 flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-brand-red" /> Location
                </h3>
                <div className="flex items-start gap-2.5 mb-[15px]">
                  <i className="fas fa-location-dot text-brand-red mt-1" />
                  <div>
                    <p className="text-sm text-[#444] leading-relaxed">{affiliate.address}</p>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(affiliate.address)}`}
                      className="text-brand-red text-sm underline hover:no-underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>

              <div className="mb-[18px]">
                <h3 className="text-base text-[#333] mb-2 flex items-center gap-2">
                  <i className="fas fa-gift text-brand-red" /> Benefit
                </h3>
                <div className="bg-[#f8f8f8] rounded-lg py-3.5 px-4 border border-[#eee]">
                  <p className="m-0 text-sm text-[#444] leading-relaxed">{affiliate.benefit}</p>
                </div>
              </div>

              <div className="mb-[18px]">
                <h3 className="text-base text-[#333] mb-2 flex items-center gap-2">
                  <i className="fas fa-globe text-brand-red" /> Website
                </h3>
                <a
                  href={affiliate.website}
                  className="text-brand-red no-underline inline-flex items-center gap-1 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fas fa-external-link-alt" />
                  <span>{hostname}</span>
                </a>
              </div>
            </div>

            {/* Right column */}
            <div className="flex-1">
              <div className="pr-10 mb-[18px]">
                <h2 className="m-0 text-[26px] leading-[1.15] tracking-[-0.2px] text-[#111] max-md:text-[22px]">
                  {affiliate.name}
                </h2>
                {affiliate.description && (
                  <p className="mt-2.5 text-[#555] text-sm leading-relaxed line-clamp-5" style={{ display: "block" }}>
                    {affiliate.description}
                  </p>
                )}
              </div>

              <div className="mb-[18px]">
                <h3 className="text-base text-[#333] mb-2 flex items-center gap-2">
                  <i className="fas fa-ticket-alt text-brand-red" /> How to Retrieve
                </h3>
                <div className="bg-[#f8f8f8] rounded-lg py-3.5 px-4 border border-[#eee]">
                  <p className="m-0 text-sm text-[#444] leading-relaxed">{affiliate.retrieveInstructions}</p>
                </div>
              </div>

              <div className="mb-[18px]">
                <h3 className="text-base text-[#333] mb-2 flex items-center gap-2">
                  <i className="fas fa-circle-info text-brand-red" /> Contact Info
                </h3>
                <div className="bg-[#f8f8f8] rounded-lg py-3.5 px-4 border border-[#eee]">
                  <p className="m-0 text-sm text-[#444] leading-relaxed">
                    {affiliate.contact || "Contact details coming soon."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
