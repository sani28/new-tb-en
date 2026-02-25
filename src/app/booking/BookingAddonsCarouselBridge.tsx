"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import AddonProductDetailsModal, { type AddonCartItemPayload } from "@/components/addons/AddonProductDetailsModal";
import EnhanceSeoulAddonsCarousel from "@/components/addons/EnhanceSeoulAddonsCarousel";
import { bookingCartStore } from "./cart/store";
import { useBookingStep1 } from "./step1/store";

type LegacyBookingWindow = Window & {
  updateStep2Totals?: () => void;
};

export default function BookingAddonsCarouselBridge() {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsProductId, setDetailsProductId] = useState<string | null>(null);

  const step1 = useBookingStep1();

  const closeDetails = useCallback(() => setDetailsOpen(false), []);

  const onAddItems = useCallback(
    (items: AddonCartItemPayload[]) => {
      const w = window as LegacyBookingWindow;
      items.forEach((i) => bookingCartStore.addItem(i));
      w.updateStep2Totals?.();

      closeDetails();
    },
    [closeDetails, detailsProductId],
  );

  useEffect(() => {
    setRoot(document.getElementById("booking-addons-carousel-root") as HTMLElement | null);
  }, []);

  if (!root) return null;

  return (
    <>
      {createPortal(
        <EnhanceSeoulAddonsCarousel
          selectedTourId={step1.tourId}
          subtitle="Add these exclusive add-ons to make your tour even more memorable!"
          onViewDetails={(productId) => {
            setDetailsProductId(productId);
            setDetailsOpen(true);
          }}
        />,
        root,
      )}

      <AddonProductDetailsModal
        open={detailsOpen}
        productId={detailsProductId}
        onClose={closeDetails}
        onAddItems={onAddItems}
        // Preserve booking.html legacy behavior for physical-per-color items.
        physicalColorProductIdStrategy="composite"
      />
    </>
  );
}
