"use client";

import { useEffect } from "react";

type LegacyUpsellCart = {
  items: unknown[];
  updateCartUI: () => void;
  getItemCount: () => number;
  clear?: () => void;
};

type BookingLegacyWindow = Window & {
  UpsellCart?: LegacyUpsellCart;
  showStep?: (stepId: string) => void;
  populateStep2OrderSummary?: () => void;
  transferOrderSummary?: () => void;
  updatePricing?: () => void;
};

function getCountInputValue(id: string) {
  const el = document.getElementById(id) as HTMLInputElement | null;
  return parseInt(el?.value || "0", 10) || 0;
}

function hasSelectedDateFromUi() {
  const el = document.querySelector<HTMLElement>(".selected-date");
  const text = (el?.textContent || "").trim().toLowerCase();
  return text !== "" && text !== "select a date";
}

export default function BookingBehaviors() {
  useEffect(() => {
    const w = window as BookingLegacyWindow;
    const cleanups: Array<() => void> = [];

    const cartExpanded = document.getElementById("cart-expanded");
    const collapseCartExpanded = () => cartExpanded?.classList.remove("visible");

    const validateStep1 = () => {
      const adultCount = getCountInputValue("adult-count");
      const childCount = getCountInputValue("child-count");
      if (adultCount === 0 && childCount === 0) {
        alert("Please select at least one ticket.");
        return false;
      }
      if (!hasSelectedDateFromUi()) {
        alert("Please select a date.");
        return false;
      }
      return true;
    };

    const goToStep2 = () => {
      if (!validateStep1()) return;
      w.populateStep2OrderSummary?.();
      w.showStep?.("step2");
      collapseCartExpanded();
    };

    const continueToStep2 = document.getElementById("continue-to-step2");
    if (continueToStep2) {
      const onClick = (e: Event) => {
        e.preventDefault();
        goToStep2();
      };
      continueToStep2.addEventListener("click", onClick);
      cleanups.push(() => continueToStep2.removeEventListener("click", onClick));
    }

    const continueBookingBtn = document.getElementById("continue-booking-btn");
    if (continueBookingBtn) {
      const onClick = (e: Event) => {
        e.preventDefault();
        goToStep2();
      };
      continueBookingBtn.addEventListener("click", onClick);
      cleanups.push(() => continueBookingBtn.removeEventListener("click", onClick));
    }

    const backToStep1 = document.getElementById("back-to-step1");
    if (backToStep1) {
      const onClick = (e: Event) => {
        e.preventDefault();
        w.showStep?.("step1");
        collapseCartExpanded();
      };
      backToStep1.addEventListener("click", onClick);
      cleanups.push(() => backToStep1.removeEventListener("click", onClick));
    }

    const continueToStep3 = document.getElementById("continue-to-step3");
    if (continueToStep3) {
      const onClick = (e: Event) => {
        e.preventDefault();

        const fullName = (document.getElementById("full-name") as HTMLInputElement | null)?.value.trim() || "";
        const email = (document.getElementById("email") as HTMLInputElement | null)?.value.trim() || "";
        const phone = (document.getElementById("phone") as HTMLInputElement | null)?.value.trim() || "";
        const termsAgree = (document.getElementById("terms-agree") as HTMLInputElement | null)?.checked || false;

        if (!fullName || !email || !phone) {
          alert("Please fill in all required fields.");
          return;
        }
        if (!termsAgree) {
          alert("Please agree to the Terms and Conditions.");
          return;
        }

        w.transferOrderSummary?.();
        w.showStep?.("step3");
        collapseCartExpanded();
      };
      continueToStep3.addEventListener("click", onClick);
      cleanups.push(() => continueToStep3.removeEventListener("click", onClick));
    }

    const backToStep2 = document.getElementById("back-to-step2");
    if (backToStep2) {
      const onClick = (e: Event) => {
        e.preventDefault();
        w.showStep?.("step2");
        collapseCartExpanded();
      };
      backToStep2.addEventListener("click", onClick);
      cleanups.push(() => backToStep2.removeEventListener("click", onClick));
    }

    const makePayment = document.getElementById("make-payment");
    if (makePayment) {
      const onClick = (e: Event) => {
        e.preventDefault();

	        // Backend handoff note (everyday language):
	        // This is the moment the customer is "checking out".
	        // In the real implementation we will:
	        // 1) read Step 1 tour + ticket counts
	        // 2) read selected date (see BookingCalendarBridge -> window.__tbBookingState.selectedDate)
	        // 3) read add-ons from the React cart store (see bookingCartStore / window.UpsellCart.getOrderPayload())
	        // 4) read contact info from the Step 3 form fields
	        // 5) call `createBooking(payload)` (POST /bookings)
	        // 6) redirect to payment provider or show confirmation
        w.showStep?.("step4");

        // Mirror legacy behavior: clear add-ons after payment completion.
        w.UpsellCart?.clear?.();

        collapseCartExpanded();
      };
      makePayment.addEventListener("click", onClick);
      cleanups.push(() => makePayment.removeEventListener("click", onClick));
    }

    const viewCartBtn = document.getElementById("view-cart-btn");
    if (viewCartBtn && cartExpanded) {
      const onClick = (e: Event) => {
        e.preventDefault();
        cartExpanded.classList.toggle("visible");
      };
      viewCartBtn.addEventListener("click", onClick);
      cleanups.push(() => viewCartBtn.removeEventListener("click", onClick));
    }

    const collapseCartBtn = document.getElementById("collapse-cart");
    if (collapseCartBtn && cartExpanded) {
      const onClick = (e: Event) => {
        e.preventDefault();
        cartExpanded.classList.remove("visible");
      };
      collapseCartBtn.addEventListener("click", onClick);
      cleanups.push(() => collapseCartBtn.removeEventListener("click", onClick));
    }

    // Cart bar UI is driven by React (BookingCartBridge) now.

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
