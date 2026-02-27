"use client";

import { useEffect, useState } from "react";
import { useBookingCart } from "../cart/useBookingCart";
import { bookingCartStore } from "../cart/store";
import {
  getBookingCartItemCount,
  getBookingCartOriginalTotal,
  getBookingCartTotal,
  type BookingCartItem,
} from "../lib/cart";

type Props = {
  onContinue: () => void;
};

function formatUsd(n: number) {
  return `$${n.toFixed(2)}`;
}

function CartItemRow({ item, index }: { item: BookingCartItem; index: number }) {
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

  return (
    <div className="cart-item">
      <div className="cart-item-info">
        {item.image ? (
          <img src={item.image} alt={item.name} className="cart-item-image" />
        ) : (
          <div
            className="cart-item-image"
            style={{ background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}
          >
            {item.placeholder || "📦"}
          </div>
        )}
        <div className="cart-item-details">
          <h5>{item.name}</h5>
          <span>{itemDesc}</span>
        </div>
      </div>
      <div className="cart-item-right">
        <span className="cart-item-price">{formatUsd(displayPrice)}</span>
        <button
          className="cart-item-delete"
          type="button"
          aria-label={`Remove ${item.name}`}
          onClick={(e) => {
            e.stopPropagation();
            bookingCartStore.removeIndex(index);
          }}
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export default function BookingCartBar({ onContinue }: Props) {
  const cart = useBookingCart();
  const [expanded, setExpanded] = useState(false);

  const itemCount = getBookingCartItemCount(cart.items);
  const total = getBookingCartTotal(cart.items);
  const originalTotal = getBookingCartOriginalTotal(cart.items);
  const savings = originalTotal - total;

  // Add padding to page body when cart bar is visible
  useEffect(() => {
    document.body.classList.toggle("cart-visible", itemCount > 0);
    if (itemCount === 0) setExpanded(false);
    return () => {
      document.body.classList.remove("cart-visible");
    };
  }, [itemCount]);

  const isVisible = itemCount > 0;

  return (
    <div className={`upsell-cart-bar${isVisible ? " visible" : ""}`} id="upsell-cart-bar">
      <div className="cart-bar-content">
        <div className="cart-bar-left">
          <div className="cart-bar-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="cart-badge">{itemCount}</span>
          </div>
          <div className="cart-bar-info">
            <span className="cart-bar-items">{itemCount} item{itemCount === 1 ? "" : "s"} added</span>
            <span className="cart-bar-total">{formatUsd(total)}</span>
          </div>
        </div>
        <div className="cart-bar-right">
          <button className="view-cart-btn" onClick={() => setExpanded((v) => !v)}>
            View Cart
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <button className="view-cart-btn" onClick={onContinue} style={{ marginLeft: 8 }}>
            Continue Booking
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
      <div className={`cart-bar-expanded${expanded ? " visible" : ""}`}>
        <div className="cart-expanded-header">
          <h4>Your Add-ons</h4>
          <button className="collapse-cart-btn" onClick={() => setExpanded(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
        </div>
        <div className="cart-items-list">
          {cart.items.map((item, idx) => (
            <CartItemRow key={`${item.productId}-${idx}`} item={item} index={idx} />
          ))}
        </div>
        <div className="cart-expanded-footer">
          <div className="cart-savings" style={{ display: savings > 0 ? "flex" : "none" }}>
            <span>You Save</span>
            <span>-{formatUsd(savings)}</span>
          </div>
          <div className="cart-total-row">
            <span>Add-ons Total</span>
            <span>{formatUsd(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
