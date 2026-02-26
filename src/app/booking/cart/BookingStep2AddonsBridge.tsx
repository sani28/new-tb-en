"use client";

import { useEffect } from "react";

import type { BookingCartItem } from "../lib/cart";
import { bookingCartStore } from "./store";
import { useBookingCart } from "./useBookingCart";

type LegacyBookingWindow = Window & {
  updateStep2Totals?: () => void;
};

function formatUsd(n: number) {
  return `$${n.toFixed(2)}`;
}

function buildMetaDesc(item: BookingCartItem) {
  if (item.type === "scheduled") {
    const dateStr = item.selectedDate ? item.selectedDate : "";
    const timeStr = item.selectedTime ? ` @ ${item.selectedTime}` : "";
    let meta = `${dateStr}${timeStr}`.trim();
    if (item.adultQty || item.childQty) {
      meta += `${meta ? " " : ""}• Adult: ${item.adultQty || 0}, Child: ${item.childQty || 0}`;
    }
    return meta;
  }
  if (item.type === "physical") {
    return `${item.variant}${item.color ? ` - ${item.color}` : ""}`;
  }
  if (item.type === "validityPass") {
    return `Adult: ${item.adultQty || 0}, Child: ${item.childQty || 0}`;
  }
  return item.variant || "";
}

function renderAddonsHtml(items: BookingCartItem[]) {
  return items
    .map((item, index) => {
      const itemTotal = item.computedLinePrice ?? item.price * item.quantity;
      const metaDesc = buildMetaDesc(item);

      const imageHtml = item.image
        ? `<img src="${item.image}" alt="${item.name}" class="order-item-image">`
        : `<div class="order-item-image" style="background: #f5f5f5; display: flex; align-items: center; justify-content: center; font-size: 24px; border-radius: 8px;">${item.placeholder || "📦"}</div>`;

      return `
        <div class="order-item addon-item" data-addon-index="${index}">
          <div class="order-item-info">
            ${imageHtml}
            <div class="order-item-details">
              <h5>${item.name}</h5>
              <span class="order-item-meta">${metaDesc}</span>
            </div>
          </div>
          <div class="order-item-controls">
            <div class="order-item-qty">
              <button class="step2-addon-decrease" data-index="${index}">-</button>
              <span>${item.quantity}</span>
              <button class="step2-addon-increase" data-index="${index}">+</button>
            </div>
            <div class="order-item-price">
              <span class="order-item-current">${formatUsd(itemTotal)}</span>
            </div>
            <button class="step2-remove-addon-btn" data-index="${index}" title="Remove add-on">×</button>
          </div>
        </div>
      `;
    })
    .join("");
}

export default function BookingStep2AddonsBridge() {
  const cart = useBookingCart();

  useEffect(() => {
    const section = document.getElementById("step2-addons-section") as HTMLElement | null;
    const container = document.getElementById("step2-order-addons") as HTMLElement | null;
    if (!section || !container) return;

	    // Everyday language:
	    // Step 2's add-ons list is still legacy HTML. We re-render the list from the React cart store
	    // so the user always sees the same add-ons that will eventually be sent to the backend.

    if (cart.items.length === 0) {
      section.style.display = "none";
      container.innerHTML = "";
      return;
    }

    section.style.display = "block";
    container.innerHTML = renderAddonsHtml(cart.items);
  }, [cart.items]);

  useEffect(() => {
    const container = document.getElementById("step2-order-addons");
    if (!container) return;

    const onClick = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const removeBtn = target.closest<HTMLElement>(".step2-remove-addon-btn");
      const incBtn = target.closest<HTMLElement>(".step2-addon-increase");
      const decBtn = target.closest<HTMLElement>(".step2-addon-decrease");
      const btn = removeBtn || incBtn || decBtn;
      if (!btn) return;

      e.preventDefault();
      e.stopPropagation();

	      // Legacy DOM uses array indexes. For backend payloads we use stable IDs (`addonId`).
	      const index = parseInt(btn.dataset.index || "-1", 10);
      if (Number.isNaN(index) || index < 0) return;

      const snapshot = bookingCartStore.getSnapshot();
      const item = snapshot.items[index];
      if (!item) return;

      if (removeBtn) {
        bookingCartStore.removeIndex(index);
      } else if (incBtn) {
        bookingCartStore.updateItemQuantity(index, item.quantity + 1);
      } else if (decBtn) {
        bookingCartStore.updateItemQuantity(index, Math.max(1, item.quantity - 1));
      }

      (window as LegacyBookingWindow).updateStep2Totals?.();
    };

    container.addEventListener("click", onClick);
    return () => container.removeEventListener("click", onClick);
  }, []);

  return null;
}
