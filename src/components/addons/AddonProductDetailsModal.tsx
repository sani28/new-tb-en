"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";

import { promoProductData } from "@/lib/data/promoProducts";
import type { PromoCruiseType, PromoProductType, PromoProductWithId } from "@/types/promo";

export type AddonCartItemPayload = {
  productId: string;
  name: string;
  type: PromoProductType;
  category: string;
  price: number;
  originalPrice: number;
  image: string | null;
  placeholder: string | null;

  adultPrice?: number;
  childPrice?: number;

  variant: string;
  color?: string | null;

  selectedDate?: string | null;
  selectedTime?: string | null;
  selectedTimeSlot?: string | null;
  validUntil?: string | null;

  cruiseType?: string | null;
  cruiseTypeName?: string | null;

  adultQty?: number;
  childQty?: number;

  quantity: number;
  computedLinePrice: number;
};

function formatUsd(n: number) {
  return `$${n.toFixed(2)}`;
}

function slugify(s: string) {
  return (s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function getTodayIso() {
  return new Date().toISOString().split("T")[0] || "";
}

export default function AddonProductDetailsModal({
  open,
  productId,
  onClose,
  onAddItems,
  onContinueToCheckout,
  physicalColorProductIdStrategy = "base",
}: {
  open: boolean;
  productId: string | null;
  onClose: () => void;
  onAddItems: (items: AddonCartItemPayload[]) => void;
  onContinueToCheckout?: () => void;
  physicalColorProductIdStrategy?: "base" | "composite";
}) {
  const product: PromoProductWithId | null = useMemo(() => {
    if (!productId) return null;
    const p = (promoProductData as Record<string, unknown>)[productId];
    if (!p || typeof p !== "object") return null;
    return { id: productId, ...(p as Omit<PromoProductWithId, "id">) };
  }, [productId]);

  const [variantIndex, setVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [adultQty, setAdultQty] = useState(0);
  const [childQty, setChildQty] = useState(0);
	const [showHanbokInfo, setShowHanbokInfo] = useState(false);
  const [cruiseType, setCruiseType] = useState<string | null>(null);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [colorQtyByIndex, setColorQtyByIndex] = useState<Record<number, number>>({});

  // Reset state when the modal opens or the product changes.
  useEffect(() => {
    if (!open) return;
    setVariantIndex(0);
    setQuantity(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setAdultQty(0);
    setChildQty(0);
	    setShowHanbokInfo(false);
    setColorQtyByIndex({});

    const firstCruise = product?.cruiseTypes?.[0];
    setCruiseType(firstCruise?.id || null);
    const firstSlot = product?.timeSlots?.[0];
    setTimeSlot(firstSlot?.value || null);
  }, [open, product?.id]);

  // Scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const currentVariantName = product?.variants?.[variantIndex]?.name || "Standard";
  const hasPhysicalColors = !!(product?.type === "physical" && product.colors && product.colors.length > 0);
  const requiresTime = !!(product?.type === "scheduled" && product.availableTimes && product.availableTimes.length > 0);

  const selectedCruise: PromoCruiseType | null = useMemo(() => {
    if (!product || product.type !== "cruise") return null;
    const list = product.cruiseTypes || [];
    return list.find((c) => c.id === cruiseType) || list[0] || null;
  }, [product, cruiseType]);

  const { total, valid } = useMemo(() => {
    if (!product) return { total: 0, valid: false };

    if (product.type === "physical") {
      if (hasPhysicalColors) {
        const sumQty = Object.values(colorQtyByIndex).reduce((s, v) => s + (v || 0), 0);
        return { total: sumQty * (product.price || 0), valid: sumQty > 0 };
      }
      return { total: (product.price || 0) * Math.max(1, quantity), valid: quantity >= 1 };
    }

    if (product.type === "scheduled") {
      const a = adultQty || 0;
      const c = childQty || 0;
      const adultUnit = product.adultPrice ?? product.price ?? 0;
      const childUnit = product.childPrice ?? product.price ?? 0;
      const hasTickets = a + c > 0;
      const hasDate = !!selectedDate;
      const hasTime = !requiresTime || !!selectedTime;
      return { total: a * adultUnit + c * childUnit, valid: hasTickets && hasDate && hasTime };
    }

    if (product.type === "validityPass") {
      const a = adultQty || 0;
      const c = childQty || 0;
      const adultUnit = product.adultPrice ?? product.price ?? 0;
      const childUnit = product.childPrice ?? product.price ?? 0;
      const hasTickets = a + c > 0;
      return { total: a * adultUnit + c * childUnit, valid: hasTickets };
    }

    if (product.type === "cruise") {
      const a = adultQty || 0;
      const c = childQty || 0;
      const adultUnit = selectedCruise?.adultPrice ?? product.adultPrice ?? 0;
      const childUnit = selectedCruise?.childPrice ?? product.childPrice ?? 0;
      const hasTickets = a + c > 0;
      const hasCruise = !!cruiseType;
      const hasDate = !!selectedDate;
      const hasSlot = !!timeSlot;
      return { total: a * adultUnit + c * childUnit, valid: hasTickets && hasCruise && hasDate && hasSlot };
    }

    return { total: 0, valid: false };
  }, [product, hasPhysicalColors, colorQtyByIndex, quantity, adultQty, childQty, selectedDate, selectedTime, requiresTime, cruiseType, timeSlot, selectedCruise]);

  if (!open || !product) return null;

	  const isHanbokRental = product.id === "hanbok-rental";

  const showQtyCounter = product.type === "physical" && !hasPhysicalColors;
  const displayImage = product.type === "cruise" ? selectedCruise?.image || product.image : product.image;
  const placeholder = product.placeholder || "📦";

  const onAdd = () => {
    if (!valid) return;

    const base = {
      type: product.type,
      category: product.category,
      placeholder: product.placeholder,
    } satisfies Partial<AddonCartItemPayload>;

    if (product.type === "physical") {
      if (hasPhysicalColors && product.colors) {
        const variantName = currentVariantName || product.name;
        const items: AddonCartItemPayload[] = [];

        Object.entries(colorQtyByIndex).forEach(([k, v]) => {
          const idx = parseInt(k, 10);
          const qty = v || 0;
          if (!Number.isFinite(idx) || qty <= 0) return;
          const colorName = product.colors?.[idx]?.name || "";
          const productIdOut =
            physicalColorProductIdStrategy === "composite"
              ? `${product.id}-${slugify(variantName)}-${slugify(colorName)}`
              : product.id;

          items.push({
            ...base,
            productId: productIdOut,
            name: `${product.name} - ${variantName} (${colorName})`,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.colors?.[idx]?.image || product.image,
            variant: variantName,
            color: colorName,
            quantity: qty,
            computedLinePrice: product.price * qty,
          });
        });

        if (items.length) onAddItems(items);
        return;
      }

      onAddItems([
        {
          ...base,
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          variant: currentVariantName,
          color: null,
          quantity,
          computedLinePrice: product.price * quantity,
        },
      ]);
      return;
    }

    if (product.type === "scheduled") {
      const adultUnit = product.adultPrice ?? product.price;
      const childUnit = product.childPrice ?? product.price;
      const a = adultQty || 0;
      const c = childQty || 0;
      onAddItems([
        {
          ...base,
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          adultPrice: adultUnit,
          childPrice: childUnit,
          variant: currentVariantName,
          selectedDate,
          selectedTime,
          adultQty: a,
          childQty: c,
          quantity: a + c,
          computedLinePrice: a * adultUnit + c * childUnit,
        },
      ]);
      return;
    }

    if (product.type === "validityPass") {
      const adultUnit = product.adultPrice ?? product.price;
      const childUnit = product.childPrice ?? product.price;
      const a = adultQty || 0;
      const c = childQty || 0;
      onAddItems([
        {
          ...base,
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          adultPrice: adultUnit,
          childPrice: childUnit,
          variant: currentVariantName,
          validUntil: product.validUntil || null,
          adultQty: a,
          childQty: c,
          quantity: a + c,
          computedLinePrice: a * adultUnit + c * childUnit,
        },
      ]);
      return;
    }

    if (product.type === "cruise") {
      const cruise = selectedCruise;
      const adultUnit = cruise?.adultPrice ?? product.adultPrice ?? 0;
      const childUnit = cruise?.childPrice ?? product.childPrice ?? 0;
      const a = adultQty || 0;
      const c = childQty || 0;

      onAddItems([
        {
          ...base,
          productId: product.id,
          name: `${product.name} - ${cruise?.name || "Cruise"}`,
          price: cruise?.price ?? product.price,
          originalPrice: cruise?.originalPrice ?? product.originalPrice,
          image: cruise?.image || product.image,
          adultPrice: adultUnit,
          childPrice: childUnit,
          variant: cruise?.name || currentVariantName,
          cruiseType: cruiseType || null,
          cruiseTypeName: cruise?.name || null,
          selectedDate,
          selectedTimeSlot: timeSlot,
          adultQty: a,
          childQty: c,
          quantity: a + c,
          computedLinePrice: a * adultUnit + c * childUnit,
        },
      ]);
    }
  };

  return (
    <div
      className="product-details-modal"
      style={{ display: "flex" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-hidden="false"
    >
      <div
        className="product-details-content"
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} details`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
	          <button
	            className="back-to-modal"
	            type="button"
	            onClick={() => {
	              if (isHanbokRental && showHanbokInfo) {
	                setShowHanbokInfo(false);
	                return;
	              }
	              onClose();
	            }}
	            aria-label={isHanbokRental && showHanbokInfo ? "Back" : "Close"}
	          >
            ←
          </button>
	          <h3>{isHanbokRental && showHanbokInfo ? "Hanbok Rental Info" : "Product Details"}</h3>
          <button className="close-product-details" type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="product-scrollable-content">
	          <div className={`product-main-image${displayImage ? "" : " placeholder-image"}`}>
	            {displayImage ? <img src={displayImage} alt={product.name} /> : <span className="image-placeholder">{placeholder}</span>}
	          </div>

	          {isHanbokRental && showHanbokInfo ? (
	            <div className="hanbok-info">
	              <div className="hanbok-info-header">
	                <h2>Hanbok Rental - Important Information</h2>
	                <p>Please review the following information to make the most of your Hanbok experience.</p>
	              </div>

	              <div className="hanbok-info-box">
	                <div className="hanbok-info-box-icon" aria-hidden="true">
	                  📍
	                </div>
	                <div className="hanbok-info-box-content">
	                  <h3>How to Get There</h3>
	                  <p>
	                    <strong>Address:</strong> 23 Bukchon-ro 11-gil, Jongno-gu, Seoul
	                  </p>
	                  <p>
	                    <strong>Subway:</strong> Anguk Station (Line 3), Exit 2 - 5 min walk
	                  </p>
	                  <p>
	                    <strong>Nearby:</strong> Bukchon Hanok Village, Gyeongbokgung Palace
	                  </p>
	                  <p className="hanbok-info-tip">Look for the traditional hanok building with the pink sign.</p>
	                </div>
	              </div>

	              <div className="hanbok-info-box">
	                <div className="hanbok-info-box-icon" aria-hidden="true">
	                  ✅
	                </div>
	                <div className="hanbok-info-box-content">
	                  <h3>How to Confirm Your Reservation</h3>
	                  <ul>
	                    <li>A confirmation email with your reservation details</li>
	                    <li>A QR code to present at the rental shop</li>
	                    <li>Contact details for the rental shop</li>
	                  </ul>
	                  <p>
	                    <strong>Check-in time:</strong> Please arrive 15 minutes before your selected date.
	                  </p>
	                </div>
	              </div>

	              <div className="hanbok-info-box">
	                <div className="hanbok-info-box-icon" aria-hidden="true">
	                  ⏱️
	                </div>
	                <div className="hanbok-info-box-content">
	                  <h3>How to Use the Rental Service & Returns</h3>
	                  <p>
	                    <strong>Rental period:</strong> 4 hours from check-in
	                  </p>
	                  <p>
	                    <strong>Included:</strong>
	                  </p>
	                  <ul>
	                    <li>Traditional Hanbok outfit (top + skirt/pants)</li>
	                    <li>Hair accessories and traditional bag</li>
	                    <li>Secure locker for your belongings</li>
	                    <li>Basic hairstyling assistance</li>
	                  </ul>
	                  <p>
	                    <strong>Return policy:</strong> Please return by the scheduled time to avoid late fees ($10/hour)
	                  </p>
	                </div>
	              </div>

	            </div>
	          ) : (
	            <>
	          {!!(product.variants && product.variants.length) && (
            <div className="product-variant-tabs">
              {(product.variants || []).map((v, idx) => (
                <button
                  key={v.id}
                  type="button"
                  className={`variant-tab${idx === variantIndex ? " active" : ""}`}
                  onClick={() => setVariantIndex(idx)}
                >
                  <span>{v.name}</span>
                </button>
              ))}
            </div>
          )}

          <div className="product-details-info">
            <h2>{product.name}</h2>
            <p>{product.description}</p>

            {hasPhysicalColors && product.colors && (
			  <div className="color-options" style={{ marginTop: 16 }}>
                <h3>Select Color & Quantity</h3>
			    <div className="addon-color-qty-list" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {product.colors.map((c, idx) => {
                    const qty = colorQtyByIndex[idx] || 0;
                    return (
                      <div
                        key={c.name}
			            className="addon-color-qty-item"
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                      >
			            <div className="addon-color-label" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <img
                            src={c.image}
                            alt={c.name}
                            style={{ width: 50, height: 50, borderRadius: 6, objectFit: "cover" }}
                          />
			              <span className="addon-color-name">{c.name}</span>
                        </div>
			            <div className="addon-qty-controls" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button
                            type="button"
			                className="addon-qty-btn"
			                aria-label={`Decrease ${c.name} quantity`}
			                disabled={qty <= 0}
                            onClick={() =>
                              setColorQtyByIndex((prev) => ({ ...prev, [idx]: Math.max(0, (prev[idx] || 0) - 1) }))
                            }
                          >
                            -
                          </button>
			              <span className="addon-qty-value" aria-label={`${c.name} quantity`}>
			                {qty}
			              </span>
                          <button
                            type="button"
			                className="addon-qty-btn"
			                aria-label={`Increase ${c.name} quantity`}
                            onClick={() => setColorQtyByIndex((prev) => ({ ...prev, [idx]: (prev[idx] || 0) + 1 }))}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {product.type === "cruise" && (product.cruiseTypes || []).length > 0 && (
              <div style={{ marginTop: 16 }}>
                <h3>Choose Cruise Type</h3>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {(product.cruiseTypes || []).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCruiseType(c.id)}
                      style={{
                        padding: 10,
                        borderRadius: 8,
                        border: c.id === cruiseType ? "2px solid #E20021" : "1px solid #ddd",
                        background: "white",
                        display: "flex",
                        gap: 10,
                        alignItems: "center",
                      }}
                    >
                      <img src={c.image} alt={c.name} style={{ width: 56, height: 40, objectFit: "cover", borderRadius: 6 }} />
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                        <div style={{ fontSize: 13, color: "#666" }}>{formatUsd(c.price)}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(product.type === "scheduled" || product.type === "cruise") && (
              <div style={{ marginTop: 16 }}>
                <h3>Select Date{product.type === "scheduled" && requiresTime ? " & Time" : product.type === "cruise" ? "" : ""}</h3>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  <input
                    type="date"
                    min={getTodayIso()}
                    value={selectedDate || ""}
                    onChange={(e) => setSelectedDate(e.target.value || null)}
                    style={{ flex: 1, minWidth: 150, padding: 12, border: "1px solid #ddd", borderRadius: 8, fontSize: 16 }}
                  />

                  {product.type === "scheduled" && requiresTime && (
                    <select
                      value={selectedTime || ""}
                      onChange={(e) => setSelectedTime(e.target.value || null)}
                      style={{
                        flex: 1,
                        minWidth: 120,
                        padding: 12,
                        border: "1px solid #ddd",
                        borderRadius: 8,
                        fontSize: 16,
                        background: "white",
                      }}
                    >
                      <option value="">Select Time</option>
                      {(product.availableTimes || []).map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  )}

                  {product.type === "scheduled" && !requiresTime && product.operationHours && (
                    <div
                      style={{
                        flex: 1,
                        minWidth: 150,
                        padding: 12,
                        border: "1px solid #ddd",
                        borderRadius: 8,
                        fontSize: 16,
                        background: "#f5f5f5",
                        color: "#333",
                      }}
                    >
                      All day, operation hours &quot;{product.operationHours}&quot;
                    </div>
                  )}
                </div>
              </div>
            )}

            {product.type === "cruise" && (product.timeSlots || []).length > 0 && (
              <div style={{ marginTop: 16 }}>
                <h3>Select Time Slot</h3>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {(product.timeSlots || []).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setTimeSlot(s.value)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: s.value === timeSlot ? "2px solid #E20021" : "1px solid #ddd",
                        background: "white",
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.type === "validityPass" && product.validUntil && (
              <div
                className="addon-validity-info"
                style={{ marginTop: 16, padding: 12, background: "#f0f9ff", borderRadius: 8, borderLeft: "4px solid #0ea5e9" }}
              >
                <p style={{ margin: 0, color: "#0369a1", fontWeight: 500 }}>Valid until {product.validUntil}</p>
              </div>
            )}

            {(product.type === "scheduled" || product.type === "validityPass" || product.type === "cruise") && (
			  <div className="addon-ticket-section" style={{ marginTop: 16 }}>
                <h3>Select Tickets</h3>
                {(() => {
                  const adultUnit =
                    product.type === "cruise"
                      ? selectedCruise?.adultPrice ?? product.adultPrice ?? 0
                      : product.adultPrice ?? product.price;
                  const childUnit =
                    product.type === "cruise"
                      ? selectedCruise?.childPrice ?? product.childPrice ?? 0
                      : product.childPrice ?? product.price;
                  return (
                    <>
                      <div
			            className="addon-ticket-row"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 0",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: 500 }}>Adult</span>
                          <span style={{ color: "#666", fontSize: 14, marginLeft: 8 }}>{formatUsd(adultUnit)}</span>
                        </div>
			            <div className="addon-qty-controls" style={{ display: "flex", alignItems: "center", gap: 8 }}>
			              <button
			                type="button"
			                className="addon-qty-btn"
			                aria-label="Decrease adult tickets"
			                disabled={adultQty <= 0}
			                onClick={() => setAdultQty((v) => Math.max(0, v - 1))}
			              >
                            -
                          </button>
			              <span className="addon-qty-value" aria-label="Adult ticket quantity">
			                {adultQty}
			              </span>
			              <button
			                type="button"
			                className="addon-qty-btn"
			                aria-label="Increase adult tickets"
			                onClick={() => setAdultQty((v) => v + 1)}
			              >
                            +
                          </button>
                        </div>
                      </div>
			          <div
			            className="addon-ticket-row"
			            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}
			          >
                        <div>
                          <span style={{ fontWeight: 500 }}>Child</span>
                          <span style={{ color: "#666", fontSize: 14, marginLeft: 8 }}>{formatUsd(childUnit)}</span>
                        </div>
			            <div className="addon-qty-controls" style={{ display: "flex", alignItems: "center", gap: 8 }}>
			              <button
			                type="button"
			                className="addon-qty-btn"
			                aria-label="Decrease child tickets"
			                disabled={childQty <= 0}
			                onClick={() => setChildQty((v) => Math.max(0, v - 1))}
			              >
                            -
                          </button>
			              <span className="addon-qty-value" aria-label="Child ticket quantity">
			                {childQty}
			              </span>
			              <button
			                type="button"
			                className="addon-qty-btn"
			                aria-label="Increase child tickets"
			                onClick={() => setChildQty((v) => v + 1)}
			              >
                            +
                          </button>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
	            </>
	        )}
	        </div>

        <div className="product-sticky-bottom">
          {showQtyCounter && (
            <div className="product-counter">
              <div className="counter">
                <button className="decrease" type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                  -
                </button>
                <input type="text" value={quantity} readOnly />
                <button className="increase" type="button" onClick={() => setQuantity((q) => q + 1)}>
                  +
                </button>
              </div>
            </div>
          )}

	          {isHanbokRental ? (
	            <>
	              {!showHanbokInfo ? (
	                <button className="add-to-cart-btn" type="button" onClick={() => setShowHanbokInfo(true)}>
	                  Continue - {formatUsd(total)}
	                </button>
	              ) : (
	                <div className="hanbok-sticky-actions">
	                  <button className="hanbok-back-btn" type="button" onClick={() => setShowHanbokInfo(false)}>
	                    Back
	                  </button>
		                  <button
		                    className="add-to-cart-btn"
		                    type="button"
		                    disabled={!valid}
		                    onClick={() => {
		                      if (!valid) return;
		                      onAdd();
		                      // Defer so the add-on modal can close before we advance the checkout UI.
		                      window.setTimeout(() => onContinueToCheckout?.(), 0);
		                    }}
		                  >
		                    Continue - {formatUsd(total)}
		                  </button>
	                </div>
	              )}
	            </>
	          ) : (
	            <button className="add-to-cart-btn" type="button" onClick={onAdd} disabled={!valid}>
	              Add to Cart - {formatUsd(total)}
	            </button>
	          )}
        </div>
      </div>
    </div>
  );
}
