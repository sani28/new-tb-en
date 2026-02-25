"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import AddonProductDetailsModal, { type AddonCartItemPayload } from "@/components/addons/AddonProductDetailsModal";
import EnhanceSeoulAddonsCarousel from "@/components/addons/EnhanceSeoulAddonsCarousel";

type PromoWindow = Window & {
  __tbPromoAddAddonItemsToCart?: (opts: {
    productId: string;
    items: AddonCartItemPayload[];
    sourceTour?: string | null;
  }) => void;
  __tbPromoOpenAddonModal?: (productId: string, sourceTour?: string | null) => void;
};

function useDomSelectValue(selectId: string, fallback: string) {
  const [value, setValue] = useState<string>(fallback);

  useEffect(() => {
    const el = document.getElementById(selectId) as HTMLSelectElement | null;
    if (!el) return;

    const sync = () => setValue(el.value || fallback);
    sync();

    el.addEventListener("change", sync);
    return () => el.removeEventListener("change", sync);
  }, [selectId, fallback]);

  return value;
}

export default function PromoEnhanceSeoulAddonsCarousel() {
  // Promo tour selection is still managed by legacy behavior code.
  // We read the selected tour id from the DOM so React can drive compatibility UI.
  const selectedTourId = useDomSelectValue("promoTourSelect", "tour01");

  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsProductId, setDetailsProductId] = useState<string | null>(null);
  const [detailsSourceTour, setDetailsSourceTour] = useState<string | null>(null);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  const closeDetails = useCallback(() => setDetailsOpen(false), []);

  const openDetails = useCallback((productId: string, sourceTour?: string | null) => {
    setDetailsProductId(productId);
    setDetailsSourceTour(sourceTour ?? null);
    setDetailsOpen(true);
  }, []);

  // Allow legacy DOM click handlers (and any non-React code) to open the React modal.
  useEffect(() => {
    const w = window as PromoWindow;
    w.__tbPromoOpenAddonModal = (productId, sourceTour) => openDetails(productId, sourceTour);
    return () => {
      delete w.__tbPromoOpenAddonModal;
    };
  }, [openDetails]);

  const onAddItems = useCallback(
    (items: AddonCartItemPayload[]) => {
      if (!detailsProductId) return;

      const w = window as PromoWindow;
      w.__tbPromoAddAddonItemsToCart?.({
        productId: detailsProductId,
        items,
        sourceTour: detailsSourceTour ?? selectedTourId ?? null,
      });

      closeDetails();
    },
    [closeDetails, detailsProductId, detailsSourceTour, selectedTourId],
  );

  const continueToCheckout = useCallback(() => {
    // Best-effort: if we're inside the tour selection modal, advance to the next step.
    const btn = document.getElementById("tourSelectionContinueBtn") as HTMLButtonElement | null;
    if (btn) {
      btn.click();
      return;
    }

    // Fallback: if user is in the add-on-first flow, this opens the tour modal.
    const cartContinue = document.getElementById("promoContinueToBookingBtn") as HTMLButtonElement | null;
    cartContinue?.click();
  }, []);

  return (
    <>
      <EnhanceSeoulAddonsCarousel
        selectedTourId={selectedTourId}
        onViewDetails={(productId) => {
          openDetails(productId, selectedTourId);
        }}
      />

      {/*
        Render details modal at document.body so it works even when the promo tour modal is closed.
        (The promo tour modal container can be display:none when inactive.)
      */}
      {portalRoot &&
        createPortal(
          <AddonProductDetailsModal
            open={detailsOpen}
            productId={detailsProductId}
            onClose={closeDetails}
            onAddItems={onAddItems}
            onContinueToCheckout={continueToCheckout}
            // Promo cart logic expects per-color items to share the same base productId.
            physicalColorProductIdStrategy="base"
          />,
          portalRoot,
        )}
    </>
  );
}
