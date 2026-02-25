"use client";

import { useEffect } from "react";

import { bookingCartStore } from "./cart/store";

const BOOKING_OPEN_ADDON_MODAL_EVENT = "tb:openBookingAddonProductModal";

type LegacyBookingWindow = Window & {
  __tbBookingProductData?: Record<string, LegacyProduct>;
  __tbBookingBuildCartPayload?: (product: LegacyProductWithId, selections: LegacySelections) => Record<string, unknown>;
  __tbBookingCanAddToCart?: (product: LegacyProductWithId, selections: LegacySelections) => boolean;
  updateStep2Totals?: () => void;
  showHanbokInfoModal?: () => void;
};

type LegacyProduct = {
  name: string;
  type: "physical" | "scheduled" | "validityPass" | "cruise";
  category: string;
  price: number;
  originalPrice?: number;
  adultPrice?: number;
  childPrice?: number;
  image?: string | null;
  placeholder?: string | null;
  description?: string;
  variants?: Array<{ id: string; name: string; image?: string; description?: string }> | null;
  colors?: Array<{ name: string; image: string }> | null;
  availableTimes?: string[];
  operationHours?: string;
  validUntil?: string;
};

type LegacyProductWithId = LegacyProduct & { id: string };

type LegacySelections = {
  variant: string | null;
  color: string | null;
  quantity: number;
  date: string | null;
  time: string | null;
  adultQty: number;
  childQty: number;
};

function formatUsd(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function BookingUpsellsBridge() {
  useEffect(() => {
    const w = window as LegacyBookingWindow;

    // ----- Category tabs -----
    const onTabClick = (e: MouseEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const tab = t.closest<HTMLElement>(".category-tabs .category-tab");
      if (!tab) return;

      e.preventDefault();
      const category = tab.dataset.category;
      if (!category) return;

      document.querySelectorAll<HTMLElement>(".category-tabs .category-tab").forEach((el) => el.classList.remove("active"));
      tab.classList.add("active");

      document.querySelectorAll<HTMLElement>(".products-grid").forEach((grid) => {
        grid.classList.toggle("active", grid.dataset.category === category);
      });
    };

    document.addEventListener("click", onTabClick);

    // ----- Product details modal -----
    const modal = document.getElementById("product-details-modal") as HTMLElement | null;
    const variantTabs = document.getElementById("product-variant-tabs") as HTMLElement | null;
    const detailsInfo = document.getElementById("product-details-info") as HTMLElement | null;
    const mainImage = document.getElementById("product-main-image") as HTMLElement | null;
    const titleEl = document.getElementById("product-modal-title") as HTMLElement | null;

    const closeBtn = document.getElementById("close-product-modal") as HTMLElement | null;
    const closeBtn2 = document.getElementById("close-product-details") as HTMLElement | null;
    const addToCartBtn = document.getElementById("add-to-cart-btn") as HTMLButtonElement | null;
    const decBtn = document.getElementById("product-decrease") as HTMLButtonElement | null;
    const incBtn = document.getElementById("product-increase") as HTMLButtonElement | null;
    const qtyInput = document.getElementById("product-quantity") as HTMLInputElement | null;
    const qtyWrap = modal?.querySelector<HTMLElement>(".product-sticky-bottom .product-counter");

    if (!modal || !variantTabs || !detailsInfo || !mainImage || !titleEl || !addToCartBtn || !decBtn || !incBtn || !qtyInput) {
      return () => {
        document.removeEventListener("click", onTabClick);
      };
    }

    let current: LegacyProductWithId | null = null;
    let variantIndex = 0;
    let quantity = 1;
    let selectedDate: string | null = null;
    let selectedTime: string | null = null;
    let adultQty = 0;
    let childQty = 0;
    const colorQty = new Map<number, number>();

    const getCatalog = () => w.__tbBookingProductData || {};

    const closeModal = () => {
      modal.style.display = "none";
      current = null;
    };

    const computeTotal = () => {
      if (!current) return { total: 0, items: 0, valid: false };

      if (current.type === "physical" && current.colors?.length) {
        const price = current.price || 0;
        let items = 0;
        let total = 0;
        for (const v of colorQty.values()) {
          items += v;
          total += v * price;
        }
        return { total, items, valid: items > 0 };
      }

      if (current.type === "scheduled" || current.type === "validityPass") {
        const aPrice = current.adultPrice ?? current.price ?? 0;
        const cPrice = current.childPrice ?? current.price ?? 0;
        const items = adultQty + childQty;
        const total = adultQty * aPrice + childQty * cPrice;
        const needsDate = current.type === "scheduled";
        const needsTime = needsDate && Array.isArray(current.availableTimes) && current.availableTimes.length > 0;
        const valid = items > 0 && (!needsDate || Boolean(selectedDate)) && (!needsTime || Boolean(selectedTime));
        return { total, items, valid };
      }

      const total = (current.price || 0) * quantity;
      return { total, items: quantity, valid: quantity >= 1 };
    };

    const updateAddBtn = () => {
      const { total, valid } = computeTotal();
      addToCartBtn.textContent = `Add to Cart - ${formatUsd(total)}`;
      addToCartBtn.disabled = !valid;
    };

    const renderDetails = () => {
      if (!current) return;

      titleEl.textContent = current.name;

      // Quantity UI rules: hide for scheduled/validityPass and for physical-per-color mode.
      const hideQty = current.type === "scheduled" || current.type === "validityPass" || (current.type === "physical" && current.colors?.length);
      if (qtyWrap) qtyWrap.style.display = hideQty ? "none" : "flex";

      // Image
      if (current.image) {
        mainImage.classList.remove("placeholder-image");
        mainImage.innerHTML = `<img src="${current.image}" alt="${current.name}">`;
      } else {
        mainImage.classList.add("placeholder-image");
        mainImage.innerHTML = `<span class="image-placeholder">${current.placeholder || "\ud83d\udce6"}</span>`;
      }

      // Variants
      const variants = current.variants || [];
      if (variants.length > 0) {
        variantTabs.innerHTML = variants
          .map(
            (v, idx) =>
              `<button class="variant-tab ${idx === variantIndex ? "active" : ""}" data-variant-index="${idx}"><span>${v.name}</span></button>`,
          )
          .join("");
      } else {
        variantTabs.innerHTML = "";
      }

      const variant = variants[variantIndex];
      let html = `<div class="variant-content active"><h2>${current.name}</h2><p>${variant?.description || current.description || ""}</p>`;

      if (current.type === "physical" && current.colors?.length) {
        html += `<div class="color-options"><h3>Select Color & Quantity</h3>`;
        html += `<div class="booking-color-qty-list" style="display:flex;flex-direction:column;gap:10px;">`;
        html += current.colors
          .map(
            (c, idx) =>
              `<div class="booking-color-qty-item" data-color-index="${idx}"><div style="display:flex;align-items:center;gap:12px;"><img src="${c.image}" alt="${c.name}" style="width:50px;height:50px;border-radius:6px;object-fit:cover;"><span>${c.name}</span></div><div style="display:flex;align-items:center;gap:8px;"><button type="button" class="booking-color-qty-btn" data-color-index="${idx}" data-action="decrease">-</button><span class="booking-color-qty-value" data-color-index="${idx}">${colorQty.get(idx) || 0}</span><button type="button" class="booking-color-qty-btn" data-color-index="${idx}" data-action="increase">+</button></div></div>`,
          )
          .join("");
        html += `</div></div>`;
      }

      if (current.type === "scheduled") {
        const today = new Date().toISOString().split("T")[0];
        const times = current.availableTimes || [];
        html += `<div class="addon-date-time-section" style="margin-top:16px;"><h3>Select Date${times.length ? " & Time" : ""}</h3><div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">`;
        html += `<input type="date" id="addon-date-picker" min="${today}" value="${selectedDate || ""}" style="flex:1;min-width:150px;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:16px;">`;
        if (times.length) {
          html += `<select id="addon-time-picker" style="flex:1;min-width:120px;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:16px;background:white;"><option value="">Select Time</option>${times
            .map((t) => `<option value="${t}" ${selectedTime === t ? "selected" : ""}>${t}</option>`)
            .join("")}</select>`;
        } else if (current.operationHours) {
          html += `<div style="flex:1;min-width:150px;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:16px;background:#f5f5f5;color:#333;">All day, operation hours "${current.operationHours}"</div>`;
        }
        html += `</div></div>`;
      }

      if (current.type === "validityPass" && current.validUntil) {
        html += `<div class="addon-validity-info" style="margin-top:16px;padding:12px;background:#f0f9ff;border-radius:8px;border-left:4px solid #0ea5e9;"><p style="margin:0;color:#0369a1;font-weight:500;">Valid until ${current.validUntil}</p></div>`;
      }

      if (current.type === "scheduled" || current.type === "validityPass") {
        const aPrice = current.adultPrice ?? current.price ?? 0;
        const cPrice = current.childPrice ?? current.price ?? 0;
        html += `<div class="addon-ticket-section" style="margin-top:16px;"><h3>Select Tickets</h3>`;
        html += `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #eee;"><div><span style="font-weight:500;">Adult</span><span style="color:#666;font-size:14px;margin-left:8px;">${formatUsd(aPrice)}</span></div><div style="display:flex;align-items:center;gap:8px;"><button type="button" class="addon-qty-btn" data-type="adult" data-action="decrease">-</button><span id="addon-adult-qty">${adultQty}</span><button type="button" class="addon-qty-btn" data-type="adult" data-action="increase">+</button></div></div>`;
        html += `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;"><div><span style="font-weight:500;">Child</span><span style="color:#666;font-size:14px;margin-left:8px;">${formatUsd(cPrice)}</span></div><div style="display:flex;align-items:center;gap:8px;"><button type="button" class="addon-qty-btn" data-type="child" data-action="decrease">-</button><span id="addon-child-qty">${childQty}</span><button type="button" class="addon-qty-btn" data-type="child" data-action="increase">+</button></div></div>`;
        html += `</div>`;
      }

      html += `</div>`;
      detailsInfo.innerHTML = html;
      updateAddBtn();
    };

    const openModal = (productId: string) => {
      const product = getCatalog()[productId];
      if (!product) return;

      current = { ...product, id: productId };
      variantIndex = 0;
      quantity = 1;
      selectedDate = null;
      selectedTime = null;
      adultQty = 0;
      childQty = 0;
      colorQty.clear();

      qtyInput.value = "1";
      renderDetails();
      modal.style.display = "flex";
    };

	    // React carousel bridge: allow a React component to open this legacy modal.
	    const onOpenFromReact = (e: Event) => {
	      const ce = e as CustomEvent<{ productId?: string }>;
	      const productId = ce.detail?.productId;
	      if (!productId) return;
	      openModal(productId);
	    };
	    document.addEventListener(BOOKING_OPEN_ADDON_MODAL_EVENT, onOpenFromReact);

    const onDocClick = (e: MouseEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;

      const viewBtn = t.closest<HTMLElement>(".view-btn");
      if (viewBtn) {
        const card = viewBtn.closest<HTMLElement>(".product-card[data-product-id]");
        const productId = card?.dataset.productId;
        if (productId) {
          e.preventDefault();
          openModal(productId);
        }
        return;
      }

      if (t === modal) closeModal();

      const vTab = t.closest<HTMLElement>(".variant-tab");
      if (vTab && vTab.dataset.variantIndex) {
        const idx = parseInt(vTab.dataset.variantIndex, 10);
        if (!Number.isNaN(idx)) {
          variantIndex = idx;
          renderDetails();
        }
        return;
      }

      const colorBtn = t.closest<HTMLElement>(".booking-color-qty-btn");
      if (colorBtn) {
        const idx = parseInt(colorBtn.dataset.colorIndex || "-1", 10);
        const action = colorBtn.dataset.action;
        if (idx >= 0) {
          const prev = colorQty.get(idx) || 0;
          const next = action === "increase" ? prev + 1 : Math.max(0, prev - 1);
          colorQty.set(idx, next);
          renderDetails();
        }
        return;
      }

      const addonQtyBtn = t.closest<HTMLElement>(".addon-qty-btn");
      if (addonQtyBtn) {
        const type = addonQtyBtn.dataset.type;
        const action = addonQtyBtn.dataset.action;
        if (type === "adult") adultQty = action === "increase" ? adultQty + 1 : Math.max(0, adultQty - 1);
        if (type === "child") childQty = action === "increase" ? childQty + 1 : Math.max(0, childQty - 1);
        renderDetails();
        return;
      }

      if (t.closest("#close-product-modal") || t.closest("#close-product-details")) {
        e.preventDefault();
        closeModal();
      }
    };

    const onChange = (e: Event) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      if (t.id === "addon-date-picker" && t instanceof HTMLInputElement) {
        selectedDate = t.value || null;
        updateAddBtn();
      }
      if (t.id === "addon-time-picker" && t instanceof HTMLSelectElement) {
        selectedTime = t.value || null;
        updateAddBtn();
      }
    };

    const onDec = (e: Event) => {
      e.preventDefault();
      if (quantity > 1) {
        quantity -= 1;
        qtyInput.value = String(quantity);
        updateAddBtn();
      }
    };

    const onInc = (e: Event) => {
      e.preventDefault();
      quantity += 1;
      qtyInput.value = String(quantity);
      updateAddBtn();
    };

    const onAdd = (e: Event) => {
      e.preventDefault();
      if (!current) return;

      // Physical per-color: add each non-zero color as separate item.
      if (current.type === "physical" && current.colors?.length) {
        const variantName = current.variants?.[variantIndex]?.name || current.name;
        for (const [idx, qty] of colorQty.entries()) {
          if (qty <= 0) continue;
          const colorName = current.colors[idx]?.name || "";
          const item = {
            productId: `${current.id}-${variantName.toLowerCase().replace(/\s+/g, "-")}-${colorName.toLowerCase().replace(/\s+/g, "-")}`,
            name: `${current.name} - ${variantName} (${colorName})`,
            type: current.type,
            category: current.category,
            price: current.price,
            originalPrice: current.originalPrice ?? current.price,
            quantity: qty,
            image: current.colors[idx]?.image || current.image,
            placeholder: current.placeholder,
            variant: variantName,
            color: colorName,
            computedLinePrice: current.price * qty,
          };
          bookingCartStore.addItem(item);
        }
        w.updateStep2Totals?.();
        closeModal();
        return;
      }

      const variant = current.variants?.[variantIndex]?.name || current.variants?.[variantIndex]?.id || "Standard";
      const selections: LegacySelections = {
        variant,
        color: null,
        quantity,
        date: selectedDate,
        time: selectedTime,
        adultQty,
        childQty,
      };

      const can = w.__tbBookingCanAddToCart;
      const build = w.__tbBookingBuildCartPayload;
      if (can && !can(current, selections)) return;

      const payload = build ? build(current, selections) : { ...current, variant, quantity };
      bookingCartStore.addItem(payload);

      if (current.id === "hanbok-rental") w.showHanbokInfoModal?.();
      w.updateStep2Totals?.();
      closeModal();
    };

    document.addEventListener("click", onDocClick);
    document.addEventListener("change", onChange);
    addToCartBtn.addEventListener("click", onAdd);
    decBtn.addEventListener("click", onDec);
    incBtn.addEventListener("click", onInc);
    closeBtn?.addEventListener("click", closeModal);
    closeBtn2?.addEventListener("click", closeModal);

    updateAddBtn();

    return () => {
	      document.removeEventListener(BOOKING_OPEN_ADDON_MODAL_EVENT, onOpenFromReact);
      document.removeEventListener("click", onTabClick);
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("change", onChange);
      addToCartBtn.removeEventListener("click", onAdd);
      decBtn.removeEventListener("click", onDec);
      incBtn.removeEventListener("click", onInc);
      closeBtn?.removeEventListener("click", closeModal);
      closeBtn2?.removeEventListener("click", closeModal);
    };
  }, []);

  return null;
}

