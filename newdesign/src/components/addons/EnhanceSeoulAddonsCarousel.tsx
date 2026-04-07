"use client";

/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";

import { promoProductData } from "@/lib/data/promoProducts";
import type { PromoProductWithId } from "@/types/promo";

type Category = "products" | "experiences" | "services";
const CATEGORY_ORDER: Category[] = ["products", "experiences", "services"];

export type EnhanceSeoulAddonsCarouselProps = {
  selectedTourId: string;
  onViewDetails: (productId: string) => void;
  subtitle?: string;
  className?: string;
};

type CardPresentation = {
  badge?: string;
  imgSrc: string;
  imgAlt: string;
  showDiscount?: boolean;
  showOriginal?: boolean;
  pricePrefix?: "from";
  typeIndicator?: string;
  typeClass?: string;
  incompatibleLabel?: string;
};

// UI-only metadata (kept separate from domain product data so backend models stay clean).
const cardPresentationById: Record<string, CardPresentation> = {
  "kwangjuyo": {
    badge: "Best Seller",
    imgSrc: "/imgs/kwangjuyo.webp",
    imgAlt: "Kwangjuyo",
    showDiscount: true,
    showOriginal: true,
  },
  "sejong-backstage": {
    badge: "Exclusive",
    imgSrc: "/imgs/sejong-addon.png",
    imgAlt: "Backstage Pass Sejong Centre",
    // Prototype slide hides discount/original for this one.
    showDiscount: false,
    showOriginal: false,
    typeIndicator: "Scheduled Experience",
    typeClass: "scheduled",
  },
  "museum-pass": {
    badge: "Popular",
    imgSrc: "/imgs/monet-addon.png",
    imgAlt: "Museum Pass",
    showDiscount: true,
    showOriginal: true,
    typeIndicator: "Valid until Jun 30, 2025",
    typeClass: "validity",
  },
  "han-river-cruise": {
    badge: "Popular",
    imgSrc: "/imgs/daycruise.png",
    imgAlt: "Han River Cruise",
    showDiscount: true,
    showOriginal: true,
    pricePrefix: "from",
    typeIndicator: "Choose Cruise Type",
    typeClass: "scheduled",
    incompatibleLabel: "To book this, please create another booking with Tour 02",
  },
  "hanbok-rental": {
    badge: "Popular",
    imgSrc: "/imgs/hanbok-addon.png",
    imgAlt: "Hanbok Rental",
    showDiscount: true,
    showOriginal: true,
  },
};

function formatUsd(n: number) {
  return `$${n.toFixed(2)} USD`;
}

function computeDiscountPercent(price: number, original: number) {
  if (!original || original <= 0) return null;
  if (price >= original) return null;
  return Math.round(((original - price) / original) * 100);
}

export default function EnhanceSeoulAddonsCarousel({
  selectedTourId,
  onViewDetails,
  subtitle = "Add these exclusive add-ons to make your tour even more memorable!",
  className,
}: EnhanceSeoulAddonsCarouselProps) {

  const products = useMemo(() => {
    const list: PromoProductWithId[] = Object.entries(promoProductData).map(([id, p]) => ({ id, ...p }));
    // Stable ordering by category, then by a curated order matching the prototype.
    const order: Record<string, number> = {
      "kwangjuyo": 10,
      "sejong-backstage": 20,
      "museum-pass": 30,
      "han-river-cruise": 40,
      "hanbok-rental": 50,
    };
    return list.sort((a, b) => (order[a.id] ?? 999) - (order[b.id] ?? 999));
  }, []);

  const productsByCategory = useMemo(() => {
    const map: Record<Category, PromoProductWithId[]> = {
      products: [],
      experiences: [],
      services: [],
    };
    products.forEach((p) => {
      const c = p.category as Category;
      if (c in map) map[c].push(p);
    });
    return map;
  }, [products]);

  const [activeCategory, setActiveCategory] = useState<Category>("products");
  const [slideIndexByCategory, setSlideIndexByCategory] = useState<Record<Category, number>>({
    products: 0,
    experiences: 0,
    services: 0,
  });

  const setIndex = (category: Category, idx: number) => {
    setSlideIndexByCategory((prev) => ({ ...prev, [category]: idx }));
  };

  const showSlide = (category: Category, idx: number) => {
    const slides = productsByCategory[category];
    if (slides.length === 0) return;
    let i = idx;
    if (i < 0) i = slides.length - 1;
    if (i >= slides.length) i = 0;
    setIndex(category, i);
  };

  const openDetails = (productId: string) => onViewDetails(productId);

  return (
    <div className={`mt-[18px] border-t border-[#eee] pt-4 w-3/4 max-[520px]:w-[92%] mx-auto${className ? ` ${className}` : ""}`}>
      <h3 className="mb-1.5 text-lg font-black text-[#111] text-center">Enhance your experience</h3>
      <p className="mb-3 text-[13px] text-[#666] leading-[1.4] text-center">{subtitle}</p>

      <div className="flex gap-2 mb-3 justify-center flex-wrap">
        {CATEGORY_ORDER.map((c) => (
          <button
            className={`border rounded-full px-3 py-2 text-[13px] font-extrabold cursor-pointer transition-colors ${
              activeCategory === c
                ? "border-[#E20021] bg-brand-red/[0.08] text-[#E20021]"
                : "border-[#e1e1e1] bg-white text-[#222]"
            }`}
            data-category={c}
            key={c}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setActiveCategory(c);
              setIndex(c, 0);
            }}
          >
            {c === "products" ? "Products" : c === "experiences" ? "Experiences" : "Services"}
          </button>
        ))}
      </div>

      {CATEGORY_ORDER.map((category) => {
        const slides = productsByCategory[category];
        const idx = slideIndexByCategory[category] ?? 0;
        const activeIdx = Math.max(0, Math.min(slides.length - 1, idx));
        const hasMultiple = slides.length > 1;

        return (
          <div
            className={activeCategory === category ? "block" : "hidden"}
            data-category={category}
            key={category}
          >
            <div className="relative">
              {slides.map((p, i) => {
                const ui = cardPresentationById[p.id] || {
                  imgSrc: p.image || "/imgs/kwangjuyo.webp",
                  imgAlt: p.name,
                };

                const compatibleTours = p.compatibleTours ?? null;
                const isCompatible = !compatibleTours || compatibleTours.includes(selectedTourId);

                const showOriginal = ui.showOriginal !== false && p.originalPrice && p.originalPrice > p.price;
                const discount = ui.showDiscount !== false ? computeDiscountPercent(p.price, p.originalPrice) : null;
                const discountLabel = discount != null ? `${discount}% OFF` : null;

                const priceLabel = ui.pricePrefix === "from" ? `From ${formatUsd(p.price)}` : formatUsd(p.price);
                const originalLabel = showOriginal ? formatUsd(p.originalPrice) : null;

                return (
                  <div className={i === activeIdx ? "block" : "hidden"} key={p.id}>
                    <div
                      className={`relative flex flex-col border border-[#eee] rounded-2xl bg-white overflow-hidden${isCompatible ? "" : " opacity-[0.45]"}`}
                      data-product-id={p.id}
                      data-type={p.type}
                      data-price={String(p.price)}
                      data-original-price={String(p.originalPrice)}
                      {...(p.adultPrice != null ? { "data-adult-price": String(p.adultPrice) } : {})}
                      {...(p.childPrice != null ? { "data-child-price": String(p.childPrice) } : {})}
                      {...(p.validUntil ? { "data-valid-until": p.validUntil } : {})}
                    >
                      {ui.badge && (
                        <div className="absolute top-2.5 left-2.5 bg-[#111] text-white text-[11px] font-black px-2 py-1.5 rounded-full">
                          {ui.badge}
                        </div>
                      )}
                      <div className="bg-[#f6f6f6] h-[196px] overflow-hidden">
                        <img src={ui.imgSrc} alt={ui.imgAlt} className="size-full object-cover block" />
                      </div>
                      <div className="px-3 pt-3 pb-3.5">
                        <h4 className="mb-1 text-sm font-black text-[#111]">{p.name}</h4>
                        <p className="mb-2.5 text-xs text-[#666] leading-[1.4]">{p.description}</p>
                        <div className="flex items-center flex-wrap gap-2 mb-2.5">
                          <span className="font-black text-brand-red text-xl leading-[1.15]">{priceLabel}</span>
                          {originalLabel && <span className="text-[#888] line-through font-bold">{originalLabel}</span>}
                          {discountLabel && (
                            <span className="bg-brand-red/10 text-brand-red font-black text-[11px] px-2 py-1 rounded-full">
                              {discountLabel}
                            </span>
                          )}
                        </div>

                        {ui.typeIndicator && ui.typeClass && (
                          <div className="text-[11px] font-extrabold text-[#333] mb-2.5">{ui.typeIndicator}</div>
                        )}

                        <button
                          className="w-full border-none rounded-[10px] bg-brand-red text-white font-black px-3 py-2.5 cursor-pointer hover:brightness-95 transition-[filter]"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            openDetails(p.id);
                          }}
                        >
                          View Details
                        </button>
                      </div>

                      {!isCompatible && ui.incompatibleLabel && (
                        <div className="absolute top-2.5 right-2.5 bg-black/75 text-white text-[11px] font-extrabold px-2 py-1.5 rounded-full">
                          {ui.incompatibleLabel}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {hasMultiple && (
                <>
                  <button
                    className="absolute top-1/2 -translate-y-1/2 -left-1.5 size-[34px] rounded-full border border-[#e1e1e1] bg-white cursor-pointer font-black"
                    type="button"
                    onClick={() => showSlide(category, activeIdx - 1)}
                  >
                    ←
                  </button>
                  <button
                    className="absolute top-1/2 -translate-y-1/2 -right-1.5 size-[34px] rounded-full border border-[#e1e1e1] bg-white cursor-pointer font-black"
                    type="button"
                    onClick={() => showSlide(category, activeIdx + 1)}
                  >
                    →
                  </button>
                </>
              )}
            </div>

            <div className="flex justify-center gap-1.5 mt-2.5">
              {slides.map((p, i) => (
                <span
                  className={`size-2 rounded-full cursor-pointer ${i === activeIdx ? "bg-[#111]" : "bg-[#d7d7d7]"}`}
                  key={`${category}-${p.id}-dot`}
                  onClick={(e) => {
                    e.preventDefault();
                    showSlide(category, i);
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
