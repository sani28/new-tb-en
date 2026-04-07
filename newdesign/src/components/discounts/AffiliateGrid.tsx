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
  return text.slice(0, limit).trimEnd() + "…";
}

export default function AffiliateGrid({ affiliates, autoOpenSlug }: Props) {
  const [selected, setSelected] = useState<AffiliateDiscount | null>(() => {
    if (!autoOpenSlug) return null;
    return affiliates.find((a) => a.slug === autoOpenSlug) ?? null;
  });

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <div className="pt-10">
      <h2 className="text-[32px] text-text-dark mb-[30px]">Affiliate Discounts</h2>
      <div className="grid grid-cols-4 gap-6 mb-[60px] max-xl:grid-cols-3 max-[992px]:grid-cols-2 max-md:grid-cols-1 max-md:gap-5">
        {affiliates.map((a) => {
          const isExpanded = expanded[a.id] ?? false;
          const needsTruncation = a.description.length > DESC_CHAR_LIMIT;
          return (
            <div
              key={a.id}
              className="relative bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)] cursor-pointer transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
              onClick={() => setSelected(a)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter") setSelected(a); }}
            >
              <div className="absolute top-5 left-5 bg-brand-red text-white py-1.5 px-3 rounded-full text-sm font-semibold z-[1]">
                {a.discount}
              </div>
              <img
                src={a.image}
                alt={a.name}
                className="w-full h-60 object-cover max-md:h-[200px]"
              />
              <div className="p-5 flex justify-between items-start max-md:p-[15px]">
                <div className="flex-1 pr-3 flex flex-col gap-3">
                  <h3 className="block text-xl text-text-dark m-0 text-left max-md:text-lg">
                    {a.name}
                  </h3>
                  <div className="relative block w-full">
                    <p className="block text-sm leading-relaxed text-text-gray m-0 w-full">
                      {isExpanded ? a.description : truncate(a.description, DESC_CHAR_LIMIT)}
                      {" "}
                      {needsTruncation && (
                        <button
                          type="button"
                          className="inline bg-transparent border-none text-brand-red text-[13px] p-0 mt-1.5 cursor-pointer font-semibold text-left hover:underline"
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
