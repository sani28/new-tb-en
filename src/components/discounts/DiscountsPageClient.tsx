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
    <main className="template-content">
      <BodyClass className="template-page" />
      <div className="content-container">
        {/* Banner */}
        <div className="discount-banner">
          <img src="/imgs/banner.png" alt="Discount Banner Background" className="banner-background" />
        </div>

        {/* Tab navigation */}
        <div className="tab-container">
          <div className="tab-navigation">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button${activeTab === tab.id ? " active" : ""}`}
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
        <div className={`tab-content${activeTab === "affiliate" ? " active" : ""}${activeTab !== "affiliate" ? " hidden" : ""}`} id="affiliate-tab">
          <AffiliateGrid affiliates={affiliates} autoOpenSlug={autoOpenSlug} />
        </div>
        <div className={`tab-content${activeTab === "partner" ? " active" : ""}${activeTab !== "partner" ? " hidden" : ""}`} id="partner-tab">
          <PartnerForm />
        </div>
        <div className={`tab-content${activeTab === "recommend" ? " active" : ""}${activeTab !== "recommend" ? " hidden" : ""}`} id="recommend-tab">
          <RecommendForm />
        </div>
      </div>

      {/* Partner / Recommend link boxes */}
      <div className="partner-link-section text-center py-5">
        <div className="partner-link-container mx-auto flex w-full max-w-[1200px] gap-5">
          <div className="partner-link-box flex flex-1 flex-col items-center gap-5 rounded-[10px] bg-[#f9f9f9] px-[50px] py-[30px]">
            <span className="text-center text-xl">If you&apos;d like to partner with us as a business, please visit the partner form below</span>
            <button
              type="button"
              onClick={() => { setActiveTab("partner"); document.getElementById("partner-tab")?.scrollIntoView({ behavior: "smooth" }); }}
              className="cursor-pointer rounded-[5px] border-none bg-[#e4002b] px-[30px] py-[15px] text-xl text-white"
            >
              Partner Form
            </button>
          </div>
          <div className="partner-link-box flex flex-1 flex-col items-center gap-5 rounded-[10px] bg-[#f9f9f9] px-[50px] py-[30px]">
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

