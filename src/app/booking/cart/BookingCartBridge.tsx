"use client";

import { useEffect } from "react";
import { useBookingCart } from "./useBookingCart";
import { bookingCartStore, ensureUpsellCartOnWindow } from "./store";
import {
  getBookingCartItemCount,
  getBookingCartOriginalTotal,
  getBookingCartTotal,
  type BookingCartItem,
} from "../lib/cart";

function formatUsd(n: number) {
  return `$${n.toFixed(2)}`;
}

function renderCartItemsList(items: BookingCartItem[]) {
  return items
    .map((item, index) => {
      let itemDesc = item.variant || "";
      if (item.type === "physical") {
        itemDesc = `${item.variant}${item.color ? ` - ${item.color}` : ""} × ${item.quantity}`;
      } else if (item.type === "scheduled") {
        const dateStr = item.selectedDate ? ` • ${item.selectedDate}` : "";
        const timeStr = item.selectedTime ? ` @ ${item.selectedTime}` : "";
        itemDesc = `${item.variant}${dateStr}${timeStr} • Adult: ${item.adultQty || 0}, Child: ${item.childQty || 0}`;
      } else if (item.type === "validityPass") {
        const validStr = item.validUntil ? ` • Valid until ${item.validUntil}` : "";
        itemDesc = `${item.variant}${validStr} • Adult: ${item.adultQty || 0}, Child: ${item.childQty || 0}`;
      }

      const displayPrice =
        typeof item.computedLinePrice === "number" && Number.isFinite(item.computedLinePrice)
          ? item.computedLinePrice
          : item.price * item.quantity;

      const imgHtml = item.image
        ? `<img src="${item.image}" alt="${item.name}" class="cart-item-image">`
        : `<div class="cart-item-image" style="background: #f5f5f5; display: flex; align-items: center; justify-content: center; font-size: 24px;">${item.placeholder || "📦"}</div>`;

      return `
        <div class="cart-item">
          <div class="cart-item-info">
            ${imgHtml}
            <div class="cart-item-details">
              <h5>${item.name}</h5>
              <span>${itemDesc}</span>
            </div>
          </div>
          <div class="cart-item-right">
            <span class="cart-item-price">${formatUsd(displayPrice)}</span>
            <button class="cart-item-delete" data-cart-index="${index}" type="button" aria-label="Remove ${item.name}">&times;</button>
          </div>
        </div>
      `;
    })
    .join("");
}

export default function BookingCartBridge() {
  const cart = useBookingCart();

  // Ensure legacy global exists as early as possible.
  ensureUpsellCartOnWindow();

  useEffect(() => {
    const cartBar = document.getElementById("upsell-cart-bar");
    const cartCount = document.getElementById("cart-count");
    const cartItemsText = document.getElementById("cart-items-text");
    const cartTotal = document.getElementById("cart-total");
    const cartTotalExpanded = document.getElementById("cart-total-expanded");
    const cartItemsList = document.getElementById("cart-items-list");
    const savingsRow = document.getElementById("cart-savings-row");
    const savingsEl = document.getElementById("cart-savings");

    if (!cartBar || !cartCount || !cartItemsText || !cartTotal || !cartTotalExpanded || !cartItemsList) return;

    const itemCount = getBookingCartItemCount(cart.items);
	    // Note: this cart is for *add-ons* (upsells). Step 1 tour tickets are tracked separately
	    // in `bookingStep1Store`.
    const total = getBookingCartTotal(cart.items);
    const originalTotal = getBookingCartOriginalTotal(cart.items);
    const savings = originalTotal - total;

    // Only auto-show the bar while on Step 1.
    const step1Active = document.getElementById("step1")?.classList.contains("active");
    if (itemCount > 0 && step1Active) {
      cartBar.classList.add("visible");
      document.body.classList.add("cart-visible");
    }
    if (itemCount === 0) {
      cartBar.classList.remove("visible");
      document.body.classList.remove("cart-visible");
    }

    cartCount.textContent = String(itemCount);
    cartItemsText.textContent = `${itemCount} item${itemCount === 1 ? "" : "s"} added`;
    cartTotal.textContent = formatUsd(total);
    cartTotalExpanded.textContent = formatUsd(total);
    cartItemsList.innerHTML = renderCartItemsList(cart.items);

    // Attach delete button handlers
    cartItemsList.querySelectorAll<HTMLButtonElement>(".cart-item-delete").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = Number(btn.dataset.cartIndex);
        if (!Number.isNaN(idx)) {
          bookingCartStore.removeIndex(idx);
        }
      });
    });

    if (savingsRow && savingsEl) {
      if (savings > 0) {
        (savingsRow as HTMLElement).style.display = "flex";
        savingsEl.textContent = `-$${savings.toFixed(2)}`;
      } else {
        (savingsRow as HTMLElement).style.display = "none";
      }
    }
  }, [cart.items]);

  return null;
}
