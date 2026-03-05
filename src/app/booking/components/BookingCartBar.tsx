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
    <div className="flex items-center justify-between border-b border-[#eee] py-3">
      <div className="flex items-center gap-3">
        {item.image ? (
          <img src={item.image} alt={item.name} className="size-[50px] rounded-lg object-cover" />
        ) : (
          <div className="flex size-[50px] items-center justify-center rounded-lg bg-[#f5f5f5] text-2xl">
            {item.placeholder || "📦"}
          </div>
        )}
        <div>
          <h5 className="mb-1 text-sm font-semibold">{item.name}</h5>
          <span className="text-xs text-text-gray">{itemDesc}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="font-semibold text-brand-red">{formatUsd(displayPrice)}</span>
        <button
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#ddd] bg-white p-0 text-lg leading-none text-[#999] transition-all hover:border-brand-red hover:bg-brand-red hover:text-white"
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

  const itemCount = getBookingCartItemCount(cart.items);
  const total = getBookingCartTotal(cart.items);
  const originalTotal = getBookingCartOriginalTotal(cart.items);
  const savings = originalTotal - total;

  // Add padding to page body when cart bar is visible
  useEffect(() => {
    document.body.classList.toggle("cart-visible", itemCount > 0);
    return () => {
      document.body.classList.remove("cart-visible");
    };
  }, [itemCount]);

  const isVisible = itemCount > 0;

  return (
    <BookingCartBarInner
      key={isVisible ? "visible" : "hidden"}
      onContinue={onContinue}
      items={cart.items}
      itemCount={itemCount}
      total={total}
      savings={savings}
      isVisible={isVisible}
    />
  );
}

function BookingCartBarInner({
  onContinue,
  items,
  itemCount,
  total,
  savings,
  isVisible,
}: {
  onContinue: () => void;
  items: BookingCartItem[];
  itemCount: number;
  total: number;
  savings: number;
  isVisible: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[9999] w-full bg-brand-red px-10 py-4 text-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] transition-transform duration-300 ${isVisible ? "translate-y-0" : "translate-y-full"}`}
      id="upsell-cart-bar"
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="relative">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="absolute -right-2 -top-2 flex size-[22px] items-center justify-center rounded-full bg-white text-xs font-bold text-brand-red">{itemCount}</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[15px] opacity-90">{itemCount} item{itemCount === 1 ? "" : "s"} added</span>
            <span className="text-xl font-bold">{formatUsd(total)}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 rounded-[25px] border-none bg-white px-6 py-3 text-[15px] font-semibold text-brand-red transition-all hover:scale-[1.02] hover:bg-[#f5f5f5]" onClick={() => setExpanded((v) => !v)}>
            View Cart
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <button className="flex items-center gap-2 rounded-[25px] border-none bg-white px-6 py-3 text-[15px] font-semibold text-brand-red transition-all hover:scale-[1.02] hover:bg-[#f5f5f5]" onClick={onContinue}>
            Continue Booking
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
      <div className={`-mx-10 -mb-4 mt-4 max-h-[400px] overflow-y-auto rounded-t-2xl bg-white px-10 py-6 text-text-dark ${expanded ? "block" : "hidden"}`}>
        <div className="mx-auto mb-5 flex max-w-[1200px] items-center justify-between">
          <h4 className="text-xl font-semibold">Your Add-ons</h4>
          <button className="rounded-full border-none bg-transparent p-2 transition-colors hover:bg-[#f5f5f5]" onClick={() => setExpanded(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
        </div>
        <div className="mx-auto max-h-[200px] max-w-[1200px] overflow-y-auto">
          {items.map((item, idx) => (
            <CartItemRow key={`${item.productId}-${idx}`} item={item} index={idx} />
          ))}
        </div>
        <div className="mx-auto mt-4 max-w-[1200px] border-t border-[#eee] pt-4">
          {savings > 0 && (
            <div className="mb-2 flex justify-between text-[#4CAF50]">
              <span>You Save</span>
              <span>-{formatUsd(savings)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-semibold">
            <span>Add-ons Total</span>
            <span>{formatUsd(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
