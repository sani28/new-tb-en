"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import type { AffiliateDiscount } from "@/lib/schemas/discounts";
import BodyClass from "@/components/BodyClass";
import AffiliateGrid from "./AffiliateGrid";
import PartnerForm from "./PartnerForm";
import RecommendForm from "./RecommendForm";

type TabId = "affiliate" | "partner" | "recommend";

interface Props {
  affiliates: AffiliateDiscount[];
  /** Slug from ?affiliate= query param for deep-linking into a modal. */
  autoOpenSlug?: string | null;
  /** Which tab to start on (default: "affiliate"). */
  initialTab?: TabId;
}

const TABS: { id: TabId; label: string }[] = [
  { id: "affiliate", label: "Affiliate Discounts" },
  { id: "partner", label: "Partner with Us" },
  { id: "recommend", label: "Recommend a Place" },
];

export default function DiscountsPageClient({ affiliates, autoOpenSlug, initialTab }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab ?? "affiliate");

  return (
    <main className="px-10 pb-[60px] mb-[60px] max-md:px-5 max-md:pt-[80px] max-md:pb-10 max-md:mb-10">
      <BodyClass className="template-page" />
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-10 mx-auto max-w-[1400px] min-h-[500px] mt-[80px] max-md:p-5 max-md:rounded-lg">
        {/* Banner */}
        <div className="relative rounded-xl px-[30px] py-[30px] mb-10 overflow-hidden h-[150px] max-md:h-[100px] max-md:px-5">
          <img
            src="/imgs/banner.png"
            alt="Discount Banner Background"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        </div>

        {/* Tab navigation */}
        <div className="w-full mb-[30px]">
          <div className="flex justify-center gap-2.5 mb-[30px] border-b border-[#e5e5e5] pb-2.5 max-md:flex-col max-md:items-center max-md:gap-[5px]">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`bg-transparent border-none py-3 px-6 text-xl font-semibold cursor-pointer relative transition-colors max-md:w-full max-md:text-center ${
                  activeTab === tab.id
                    ? "text-[#E31E24] -mb-[3px] border-b-[3px] border-[#E31E24]"
                    : "text-[#666] hover:text-[#E31E24]"
                }`}
                onClick={() => setActiveTab(tab.id)}
                data-tab={tab.id}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className={activeTab === "affiliate" ? "block" : "hidden"} id="affiliate-tab">
          <AffiliateGrid affiliates={affiliates} autoOpenSlug={autoOpenSlug} />
        </div>
        <div className={activeTab === "partner" ? "block" : "hidden"} id="partner-tab">
          <PartnerForm />
        </div>
        <div className={activeTab === "recommend" ? "block" : "hidden"} id="recommend-tab">
          <RecommendForm />
        </div>
      </div>

      {/* Partner / Recommend link boxes */}
      <div className="text-center py-5">
        <div className="mx-auto flex w-full max-w-[1200px] gap-5 max-md:flex-col">
          <div className="flex flex-1 flex-col items-center gap-5 rounded-[10px] bg-[#f9f9f9] px-[50px] py-[30px]">
            <span className="text-center text-xl">If you&apos;d like to partner with us as a business, please visit the partner form below</span>
            <button
              type="button"
              onClick={() => { setActiveTab("partner"); document.getElementById("partner-tab")?.scrollIntoView({ behavior: "smooth" }); }}
              className="cursor-pointer rounded-[5px] border-none bg-[#e4002b] px-[30px] py-[15px] text-xl text-white"
            >
              Partner Form
            </button>
          </div>
          <div className="flex flex-1 flex-col items-center gap-5 rounded-[10px] bg-[#f9f9f9] px-[50px] py-[30px]">
            <span className="text-center text-xl">If you&apos;d like to recommend a place, please fill out the recommend a place form below</span>
            <button
              type="button"
              onClick={() => { setActiveTab("recommend"); document.getElementById("recommend-tab")?.scrollIntoView({ behavior: "smooth" }); }}
              className="cursor-pointer rounded-[5px] border-none bg-[#e4002b] px-[30px] py-[15px] text-xl text-white"
            >
              Recommend A Place
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
