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
        <div className={`tab-content${activeTab === "affiliate" ? " active" : ""}`} id="affiliate-tab" style={{ display: activeTab === "affiliate" ? "block" : "none" }}>
          <AffiliateGrid affiliates={affiliates} autoOpenSlug={autoOpenSlug} />
        </div>
        <div className={`tab-content${activeTab === "partner" ? " active" : ""}`} id="partner-tab" style={{ display: activeTab === "partner" ? "block" : "none" }}>
          <PartnerForm />
        </div>
        <div className={`tab-content${activeTab === "recommend" ? " active" : ""}`} id="recommend-tab" style={{ display: activeTab === "recommend" ? "block" : "none" }}>
          <RecommendForm />
        </div>
      </div>

      {/* Partner / Recommend link boxes */}
      <div className="partner-link-section" style={{ textAlign: "center", padding: "20px 0" }}>
        <div className="partner-link-container" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 20, width: "100%" }}>
          <div className="partner-link-box" style={{ flex: 1, backgroundColor: "#f9f9f9", padding: "30px 50px", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <span style={{ fontSize: 20, textAlign: "center" }}>If you&apos;d like to partner with us as a business, please visit the partner form below</span>
            <button
              type="button"
              onClick={() => { setActiveTab("partner"); document.getElementById("partner-tab")?.scrollIntoView({ behavior: "smooth" }); }}
              style={{ padding: "15px 30px", backgroundColor: "#e4002b", color: "white", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 20 }}
            >
              Partner Form
            </button>
          </div>
          <div className="partner-link-box" style={{ flex: 1, backgroundColor: "#f9f9f9", padding: "30px 50px", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <span style={{ fontSize: 20, textAlign: "center" }}>If you&apos;d like to recommend a place, please fill out the recommend a place form below</span>
            <button
              type="button"
              onClick={() => { setActiveTab("recommend"); document.getElementById("recommend-tab")?.scrollIntoView({ behavior: "smooth" }); }}
              style={{ padding: "15px 30px", backgroundColor: "#e4002b", color: "white", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 20 }}
            >
              Recommend A Place
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

