"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import type { AffiliateDiscount } from "@/lib/schemas/discounts";
import AffiliateDetailModal from "./AffiliateDetailModal";

interface Props {
  affiliates: AffiliateDiscount[];
  /** If set, auto-open this affiliate's modal on mount. */
  autoOpenSlug?: string | null;
}

const DESC_CHAR_LIMIT = 150;

function truncate(text: string, limit: number) {
  if (text.length <= limit) return text;
  // Cut at limit, trim trailing whitespace, add ellipsis
  return text.slice(0, limit).trimEnd() + "…";
}

export default function AffiliateGrid({ affiliates, autoOpenSlug }: Props) {
  const [selected, setSelected] = useState<AffiliateDiscount | null>(() => {
    if (!autoOpenSlug) return null;
    return affiliates.find((a) => a.slug === autoOpenSlug) ?? null;
  });

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <div className="affiliate-section">
      <h2>Affiliate Discounts</h2>
      <div className="affiliate-grid">
        {affiliates.map((a) => {
          const isExpanded = expanded[a.id] ?? false;
          const needsTruncation = a.description.length > DESC_CHAR_LIMIT;
          return (
            <div
              key={a.id}
              className="affiliate-card"
              onClick={() => setSelected(a)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter") setSelected(a); }}
            >
              <div className="discount-tag">{a.discount}</div>
              <img src={a.image} alt={a.name} />
              <div className="card-info">
                <div className="info-text">
                  <h3>{a.name}</h3>
                  <div className="description">
                    <p className="description-text">
                      {isExpanded ? a.description : truncate(a.description, DESC_CHAR_LIMIT)}
                      {" "}
                      {needsTruncation && (
                        <button
                          type="button"
                          className="view-all-btn visible"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpanded((prev) => ({ ...prev, [a.id]: !prev[a.id] }));
                          }}
                        >
                          {isExpanded ? "Read less" : "Read more"}
                        </button>
                      )}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      <AffiliateDetailModal affiliate={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

