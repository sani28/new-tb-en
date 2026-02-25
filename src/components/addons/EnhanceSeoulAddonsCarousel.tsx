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
    <div className={`promo-addons-carousel promo-cross-sell-section${className ? ` ${className}` : ""}`}>
      <h3>Enhance your experience</h3>
      <p className="cross-sell-subtitle">{subtitle}</p>

      <div className="promo-category-tabs">
        {CATEGORY_ORDER.map((c) => (
          <button
            className={`promo-category-tab${activeCategory === c ? " active" : ""}`}
            data-category={c}
            key={c}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setActiveCategory(c);
              // Keep prototype expectation: default to first slide when switching categories.
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
            className={`promo-products-grid${activeCategory === category ? " active" : ""}`}
            data-category={category}
            key={category}
          >
            <div className="promo-cross-sell-carousel">
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
                  <div className={`promo-cross-sell-slide${i === activeIdx ? " active" : ""}`} key={p.id}>
                    <div
                      className={`promo-product-card${isCompatible ? "" : " incompatible"}`}
                      data-product-id={p.id}
                      data-type={p.type}
                      data-price={String(p.price)}
                      data-original-price={String(p.originalPrice)}
                      {...(p.adultPrice != null ? { "data-adult-price": String(p.adultPrice) } : {})}
                      {...(p.childPrice != null ? { "data-child-price": String(p.childPrice) } : {})}
                      {...(p.validUntil ? { "data-valid-until": p.validUntil } : {})}
                    >
                      {ui.badge && <div className="promo-product-badge">{ui.badge}</div>}
                      <div className="promo-product-image">
                        <img src={ui.imgSrc} alt={ui.imgAlt} />
                      </div>
                      <div className="promo-product-info">
                        <h4>{p.name}</h4>
                        <p>{p.description}</p>
                        <div className="promo-upsell-pricing">
                          <span className="promo-upsell-price">{priceLabel}</span>
                          {originalLabel && <span className="promo-upsell-original-price">{originalLabel}</span>}
                          {discountLabel && <span className="promo-discount-badge">{discountLabel}</span>}
                        </div>

                        {ui.typeIndicator && ui.typeClass && (
                          <div className={`promo-type-indicator ${ui.typeClass}`}>{ui.typeIndicator}</div>
                        )}

                        <button
                          className="promo-view-btn"
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
                        <div className="promo-incompatible-label">{ui.incompatibleLabel}</div>
                      )}
                    </div>
                  </div>
                );
              })}

              {hasMultiple && (
                <>
                  <button className="promo-cross-sell-nav prev" type="button" onClick={() => showSlide(category, activeIdx - 1)}>
                    ←
                  </button>
                  <button className="promo-cross-sell-nav next" type="button" onClick={() => showSlide(category, activeIdx + 1)}>
                    →
                  </button>
                </>
              )}
            </div>

            <div className="promo-cross-sell-dots">
              {slides.map((p, i) => (
                <span
                  className={`dot${i === activeIdx ? " active" : ""}`}
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
