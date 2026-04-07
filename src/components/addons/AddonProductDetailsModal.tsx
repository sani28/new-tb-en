"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { formatPrice, getAddonPrice } from "@/components/homepage/checkout/PromoCheckoutContext";

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
  const locale = useLocale();
  const t = useTranslations("AddonModal");
  const tc = useTranslations("Common");
  const tt = useTranslations("TicketCard");

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
  const initialCruiseType = product?.cruiseTypes?.[0]?.id ?? null;
  const initialTimeSlot = product?.timeSlots?.[0]?.value ?? null;
  const [cruiseType, setCruiseType] = useState<string | null>(initialCruiseType);
  const [timeSlot, setTimeSlot] = useState<string | null>(initialTimeSlot);
  const [colorQtyByIndex, setColorQtyByIndex] = useState<Record<number, number>>({});

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

  // Helper to get locale-aware price for this product
  const lp = (field: "price" | "originalPrice" | "adultPrice" | "childPrice", usd: number) =>
    product ? getAddonPrice(product.id, field, usd, locale) : usd;

  const { total, valid } = useMemo(() => {
    if (!product) return { total: 0, valid: false };

    const pPrice = lp("price", product.price || 0);

    if (product.type === "physical") {
      if (hasPhysicalColors) {
        const sumQty = Object.values(colorQtyByIndex).reduce((s, v) => s + (v || 0), 0);
        return { total: sumQty * pPrice, valid: sumQty > 0 };
      }
      return { total: pPrice * Math.max(1, quantity), valid: quantity >= 1 };
    }

    if (product.type === "scheduled") {
      const a = adultQty || 0;
      const c = childQty || 0;
      const adultUnit = lp("adultPrice", product.adultPrice ?? product.price ?? 0);
      const childUnit = lp("childPrice", product.childPrice ?? product.price ?? 0);
      const hasTickets = a + c > 0;
      const hasDate = !!selectedDate;
      if (requiresTime) {
        return { total: a * adultUnit + c * childUnit, valid: hasTickets && hasDate && !!selectedTime };
      }
      return { total: a * adultUnit + c * childUnit, valid: hasTickets && hasDate };
    }

    if (product.type === "validityPass") {
      const a = adultQty || 0;
      const c = childQty || 0;
      const adultUnit = lp("adultPrice", product.adultPrice ?? product.price ?? 0);
      const childUnit = lp("childPrice", product.childPrice ?? product.price ?? 0);
      return { total: a * adultUnit + c * childUnit, valid: a + c > 0 };
    }

    if (product.type === "cruise") {
      const a = adultQty || 0;
      const c = childQty || 0;
      const adultUnit = lp("adultPrice", selectedCruise?.adultPrice ?? product.adultPrice ?? 0);
      const childUnit = lp("childPrice", selectedCruise?.childPrice ?? product.childPrice ?? 0);
      const hasCruise = !!cruiseType;
      const hasDate = !!selectedDate;
      const hasSlot = !!timeSlot;
      return { total: a * adultUnit + c * childUnit, valid: (a + c > 0) && hasCruise && hasDate && hasSlot };
    }

    return { total: 0, valid: false };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, hasPhysicalColors, colorQtyByIndex, quantity, adultQty, childQty, selectedDate, selectedTime, requiresTime, cruiseType, timeSlot, selectedCruise, locale]);

  if (!open || !product) return null;

  // Translated product name/description
  const PRODUCT_KEYS = ["kwangjuyo", "sejong-backstage", "museum-pass", "han-river-cruise", "hanbok-rental"];
  const hasProductTranslation = PRODUCT_KEYS.includes(product.id);
  const productName = hasProductTranslation ? tt(`${product.id}.name`) : product.name;
  const productDescription = hasProductTranslation ? tt(`${product.id}.description`) : product.description;

  const isHanbokRental = product.id === "hanbok-rental";
  const showQtyCounter = product.type === "physical" && !hasPhysicalColors;
  const displayImage = product.type === "cruise" ? selectedCruise?.image || product.image : product.image;
  const placeholder = product.placeholder || "📦";

  const onAdd = () => {
    if (!valid) return;

    // Locale-aware price helpers for this product
    const pPrice = lp("price", product.price);
    const pOriginal = lp("originalPrice", product.originalPrice);

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
            name: `${productName} - ${variantName} (${colorName})`,
            price: pPrice,
            originalPrice: pOriginal,
            image: product.colors?.[idx]?.image || product.image,
            variant: variantName,
            color: colorName,
            quantity: qty,
            computedLinePrice: pPrice * qty,
          });
        });

        if (items.length) onAddItems(items);
        return;
      }

      onAddItems([
        {
          ...base,
          productId: product.id,
          name: productName,
          price: pPrice,
          originalPrice: pOriginal,
          image: product.image,
          variant: currentVariantName,
          color: null,
          quantity,
          computedLinePrice: pPrice * quantity,
        },
      ]);
      return;
    }

    if (product.type === "scheduled") {
      const adultUnit = lp("adultPrice", product.adultPrice ?? product.price);
      const childUnit = lp("childPrice", product.childPrice ?? product.price);
      const a = adultQty || 0;
      const c = childQty || 0;
      onAddItems([
        {
          ...base,
          productId: product.id,
          name: productName,
          price: pPrice,
          originalPrice: pOriginal,
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
      const adultUnit = lp("adultPrice", product.adultPrice ?? product.price);
      const childUnit = lp("childPrice", product.childPrice ?? product.price);
      const a = adultQty || 0;
      const c = childQty || 0;
      onAddItems([
        {
          ...base,
          productId: product.id,
          name: productName,
          price: pPrice,
          originalPrice: pOriginal,
          image: product.image,
          variant: currentVariantName,
          validUntil: product.validUntil ?? null,
          adultQty: a,
          childQty: c,
          quantity: a + c,
          computedLinePrice: a * adultUnit + c * childUnit,
        },
      ]);
      return;
    }

    if (product.type === "cruise") {
      const adultUnit = lp("adultPrice", selectedCruise?.adultPrice ?? product.adultPrice ?? 0);
      const childUnit = lp("childPrice", selectedCruise?.childPrice ?? product.childPrice ?? 0);
      const cruisePrice = lp("price", selectedCruise?.price ?? product.price);
      const cruiseOrig = lp("originalPrice", selectedCruise?.originalPrice ?? product.originalPrice);
      const a = adultQty || 0;
      const c = childQty || 0;
      onAddItems([
        {
          ...base,
          productId: product.id,
          name: productName,
          price: cruisePrice,
          originalPrice: cruiseOrig,
          image: selectedCruise?.image ?? product.image,
          adultPrice: adultUnit,
          childPrice: childUnit,
          variant: selectedCruise?.name ?? "Cruise",
          cruiseType: selectedCruise?.id ?? null,
          cruiseTypeName: selectedCruise?.name ?? null,
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
      className="fixed inset-0 bg-black/70 z-[var(--z-modal-over)] flex items-center justify-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-hidden="false"
    >
      <div
        className="bg-white w-[90%] max-w-[600px] h-[90vh] rounded-xl relative flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label={`${productName} details`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-5 py-4 border-b border-[#eee] bg-white shrink-0">
          <button
            className="bg-transparent border-none text-xl cursor-pointer p-2 text-[#333]"
            type="button"
            onClick={() => {
              if (isHanbokRental && showHanbokInfo) {
                setShowHanbokInfo(false);
                return;
              }
              onClose();
            }}
            aria-label={isHanbokRental && showHanbokInfo ? t("back") : "Close"}
          >
            ←
          </button>
          <h3 className="m-0 text-base font-semibold">{isHanbokRental && showHanbokInfo ? t("hanbokRentalInfo") : t("productDetails")}</h3>
          <button className="bg-transparent border-none text-xl cursor-pointer p-2 text-[#333]" type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className={`w-full h-[300px] overflow-hidden${displayImage ? "" : " bg-gradient-to-br from-[#f5f5f5] to-[#e0e0e0] flex items-center justify-center"}`}>
            {displayImage ? (
              <img src={displayImage} alt={productName} className="size-full object-cover" />
            ) : (
              <span className="text-[120px] opacity-70">{placeholder}</span>
            )}
          </div>

          {isHanbokRental && showHanbokInfo ? (
            <div className="p-5">
              <div className="text-center mb-7">
                <h2 className="text-xl font-bold text-[#333] mb-2">{t("hanbokTitle")}</h2>
                <p className="text-sm text-[#666]">{t("hanbokSubtitle")}</p>
              </div>

              <div className="flex gap-4 bg-[#f8f9fa] rounded-xl p-5 mb-4 border border-[#e9ecef]">
                <div className="shrink-0 text-3xl" aria-hidden="true">📍</div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-[#333] mb-3">{t("howToGetThere")}</h3>
                  <p className="text-sm text-[#555] leading-relaxed mb-2"><strong>{t("address")}</strong> {t("addressDetail")}</p>
                  <p className="text-sm text-[#555] leading-relaxed mb-2"><strong>{t("subway")}</strong> {t("subwayDetail")}</p>
                  <p className="text-sm text-[#555] leading-relaxed mb-2"><strong>{t("nearby")}</strong> {t("nearbyDetail")}</p>
                  <p className="bg-[#fff3cd] px-3 py-2.5 rounded-lg text-[13px] text-[#856404] mt-3">{t("lookForSign")}</p>
                </div>
              </div>

              <div className="flex gap-4 bg-[#f8f9fa] rounded-xl p-5 mb-4 border border-[#e9ecef]">
                <div className="shrink-0 text-3xl" aria-hidden="true">✅</div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-[#333] mb-3">{t("howToConfirm")}</h3>
                  <ul className="mt-2 mb-2 pl-4 list-disc text-sm text-[#555] leading-relaxed space-y-1">
                    <li>{t("confirmEmail")}</li>
                    <li>{t("confirmQr")}</li>
                    <li>{t("confirmContact")}</li>
                  </ul>
                  <p className="text-sm text-[#555] leading-relaxed mb-2"><strong>{t("checkInTime")}</strong> {t("checkInDetail")}</p>
                </div>
              </div>

              <div className="flex gap-4 bg-[#f8f9fa] rounded-xl p-5 mb-0 border border-[#e9ecef]">
                <div className="shrink-0 text-3xl" aria-hidden="true">⏱️</div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-[#333] mb-3">{t("howToUse")}</h3>
                  <p className="text-sm text-[#555] leading-relaxed mb-2"><strong>{t("rentalPeriod")}</strong> {t("rentalPeriodDetail")}</p>
                  <p className="text-sm text-[#555] leading-relaxed mb-1"><strong>{t("included")}</strong></p>
                  <ul className="mt-2 mb-2 pl-4 list-disc text-sm text-[#555] leading-relaxed space-y-1">
                    <li>{t("includeHanbok")}</li>
                    <li>{t("includeAccessories")}</li>
                    <li>{t("includeLocker")}</li>
                    <li>{t("includeHairstyling")}</li>
                  </ul>
                  <p className="text-sm text-[#555] leading-relaxed mb-2"><strong>{t("returnPolicy")}</strong> {t("returnPolicyDetail")}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {!!(product.variants && product.variants.length) && (
                <div className="flex gap-3 p-4 overflow-x-auto">
                  {(product.variants || []).map((v, idx) => (
                    <button
                      key={v.id}
                      type="button"
                      className={`flex flex-col items-center gap-2 p-2 border-2 rounded-lg cursor-pointer bg-transparent min-w-[80px] transition-colors ${idx === variantIndex ? "border-brand-red" : "border-transparent"}`}
                      onClick={() => setVariantIndex(idx)}
                    >
                      <span className="text-xs text-[#333]">{v.name}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="p-5">
                <h2 className="text-2xl mb-4">{productName}</h2>
                <p className="text-sm text-[#666] leading-relaxed mb-5">{productDescription}</p>

                {hasPhysicalColors && product.colors && (
                  <div className="mt-4">
                    <h3 className="text-base font-semibold mb-3">{t("selectColorQty")}</h3>
                    <div className="flex flex-col gap-2.5">
                      {product.colors.map((c, idx) => {
                        const qty = colorQtyByIndex[idx] || 0;
                        return (
                          <div key={c.name} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <img src={c.image} alt={c.name} className="size-[50px] rounded-md object-cover" />
                              <span className="text-sm font-medium">{c.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button type="button" className="size-8 border border-[#ddd] bg-white rounded-md cursor-pointer disabled:opacity-40" disabled={qty <= 0}
                                onClick={() => setColorQtyByIndex((prev) => ({ ...prev, [idx]: Math.max(0, (prev[idx] || 0) - 1) }))}>-</button>
                              <span className="w-8 text-center font-medium">{qty}</span>
                              <button type="button" className="size-8 border border-[#ddd] bg-white rounded-md cursor-pointer"
                                onClick={() => setColorQtyByIndex((prev) => ({ ...prev, [idx]: (prev[idx] || 0) + 1 }))}>+</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {product.type === "cruise" && (product.cruiseTypes || []).length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-base font-semibold mb-3">{t("chooseCruiseType")}</h3>
                    <div className="flex gap-2.5 flex-wrap">
                      {(product.cruiseTypes || []).map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setCruiseType(c.id)}
                          className={`p-2.5 rounded-lg flex gap-2.5 items-center bg-white cursor-pointer transition-colors ${c.id === cruiseType ? "border-2 border-brand-red" : "border border-[#ddd]"}`}
                        >
                          <img src={c.image} alt={c.name} className="w-14 h-10 object-cover rounded-md" />
                          <div className="text-left">
                            <div className="font-semibold text-sm">{c.name}</div>
                            <div className="text-[13px] text-[#666]">{formatPrice(lp("price", c.price), locale)}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(product.type === "scheduled" || product.type === "cruise") && (
                  <div className="mt-4">
                    <h3 className="text-base font-semibold mb-3">{product.type === "scheduled" && requiresTime ? t("selectDateAndTime") : t("selectDate")}</h3>
                    <div className="flex gap-3 flex-wrap items-center">
                      <input
                        type="date"
                        min={getTodayIso()}
                        value={selectedDate || ""}
                        onChange={(e) => setSelectedDate(e.target.value || null)}
                        className="flex-1 min-w-[150px] px-3 py-3 border border-[#ddd] rounded-lg text-base"
                      />

                      {product.type === "scheduled" && requiresTime && (
                        <select
                          value={selectedTime || ""}
                          onChange={(e) => setSelectedTime(e.target.value || null)}
                          className="flex-1 min-w-[120px] px-3 py-3 border border-[#ddd] rounded-lg text-base bg-white"
                        >
                          <option value="">{t("selectTime")}</option>
                          {(product.availableTimes || []).map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      )}

                      {product.type === "scheduled" && !requiresTime && product.operationHours && (
                        <div className="flex-1 min-w-[150px] px-3 py-3 border border-[#ddd] rounded-lg text-base bg-[#f5f5f5] text-[#333]">
                          {t("allDay")} &quot;{product.operationHours}&quot;
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {product.type === "cruise" && (product.timeSlots || []).length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-base font-semibold mb-3">{t("selectTimeSlot")}</h3>
                    <div className="flex gap-2.5 flex-wrap">
                      {(product.timeSlots || []).map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setTimeSlot(s.value)}
                          className={`px-3 py-2.5 rounded-lg bg-white cursor-pointer transition-colors ${s.value === timeSlot ? "border-2 border-brand-red" : "border border-[#ddd]"}`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.type === "validityPass" && product.validUntil && (
                  <div className="mt-4 p-3 bg-[#f0f9ff] rounded-lg border-l-4 border-[#0ea5e9]">
                    <p className="m-0 text-[#0369a1] font-medium">{t("validUntil", { date: product.validUntil })}</p>
                  </div>
                )}

                {(product.type === "scheduled" || product.type === "validityPass" || product.type === "cruise") && (
                  <div className="mt-4">
                    <h3 className="text-base font-semibold mb-3">{t("selectTickets")}</h3>
                    {(() => {
                      const adultUnit = lp("adultPrice",
                        product.type === "cruise"
                          ? selectedCruise?.adultPrice ?? product.adultPrice ?? 0
                          : product.adultPrice ?? product.price);
                      const childUnit = lp("childPrice",
                        product.type === "cruise"
                          ? selectedCruise?.childPrice ?? product.childPrice ?? 0
                          : product.childPrice ?? product.price);
                      return (
                        <>
                          <div className="flex justify-between items-center py-3 border-b border-[#eee]">
                            <div>
                              <span className="font-medium">{tc("adult")}</span>
                              <span className="text-[#666] text-sm ml-2">{formatPrice(adultUnit, locale)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button type="button" className="size-8 border border-[#ddd] bg-white rounded-md cursor-pointer disabled:opacity-40" disabled={adultQty <= 0}
                                onClick={() => setAdultQty((v) => Math.max(0, v - 1))}>-</button>
                              <span className="w-8 text-center font-medium">{adultQty}</span>
                              <button type="button" className="size-8 border border-[#ddd] bg-white rounded-md cursor-pointer"
                                onClick={() => setAdultQty((v) => v + 1)}>+</button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center py-3">
                            <div>
                              <span className="font-medium">{tc("child")}</span>
                              <span className="text-[#666] text-sm ml-2">{formatPrice(childUnit, locale)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button type="button" className="size-8 border border-[#ddd] bg-white rounded-md cursor-pointer disabled:opacity-40" disabled={childQty <= 0}
                                onClick={() => setChildQty((v) => Math.max(0, v - 1))}>-</button>
                              <span className="w-8 text-center font-medium">{childQty}</span>
                              <button type="button" className="size-8 border border-[#ddd] bg-white rounded-md cursor-pointer"
                                onClick={() => setChildQty((v) => v + 1)}>+</button>
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

        <div className="bg-white px-5 py-4 border-t border-[#eee] flex items-center gap-4 shrink-0">
          {showQtyCounter && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button className="size-8 border border-[#ddd] bg-white rounded-md cursor-pointer" type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                <input className="w-10 h-8 text-center border border-[#ddd] rounded-md" type="text" value={quantity} readOnly />
                <button className="size-8 border border-[#ddd] bg-white rounded-md cursor-pointer" type="button" onClick={() => setQuantity((q) => q + 1)}>+</button>
              </div>
            </div>
          )}

          {isHanbokRental ? (
            <>
              {!showHanbokInfo ? (
                <button className="flex-1 px-5 py-3.5 bg-brand-red text-white border-none rounded-lg text-base font-semibold cursor-pointer" type="button" onClick={() => setShowHanbokInfo(true)}>
                  {t("continue")} - {formatPrice(total, locale)}
                </button>
              ) : (
                <div className="flex gap-3 w-full">
                  <button className="shrink-0 px-6 py-3.5 bg-[#f5f5f5] text-[#333] border-none rounded-lg text-base font-semibold cursor-pointer hover:bg-[#e0e0e0]" type="button" onClick={() => setShowHanbokInfo(false)}>
                    {t("back")}
                  </button>
                  <button
                    className="flex-1 px-5 py-3.5 bg-brand-red text-white border-none rounded-lg text-base font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                    disabled={!valid}
                    onClick={() => {
                      if (!valid) return;
                      onAdd();
                      window.setTimeout(() => onContinueToCheckout?.(), 0);
                    }}
                  >
                    {t("continue")} - {formatPrice(total, locale)}
                  </button>
                </div>
              )}
            </>
          ) : (
            <button className="flex-1 px-5 py-3.5 bg-brand-red text-white border-none rounded-lg text-base font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" type="button" onClick={onAdd} disabled={!valid}>
              {t("addToCart")} - {formatPrice(total, locale)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
