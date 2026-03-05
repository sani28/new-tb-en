"use client";

import { useCallback } from "react";
import { createPortal } from "react-dom";

import AddonProductDetailsModal, { type AddonCartItemPayload } from "@/components/addons/AddonProductDetailsModal";
import EnhanceSeoulAddonsCarousel from "@/components/addons/EnhanceSeoulAddonsCarousel";
import { usePromoCheckout, usePromoAddonHandler } from "./checkout/PromoCheckoutContext";

export default function PromoEnhanceSeoulAddonsCarousel() {
  const {
    selectedTourId,
    addonModalOpen, addonProductId,
    openAddonModal, closeAddonModal,
    proceedFromTourSelection, step,
  } = usePromoCheckout();

  const { handleAddItems } = usePromoAddonHandler();

  const portalRoot = typeof document !== "undefined" ? document.body : null;

  const onAddItems = useCallback(
    (items: AddonCartItemPayload[]) => {
      handleAddItems(items);
      closeAddonModal();
    },
    [handleAddItems, closeAddonModal],
  );

  const onContinueToCheckout = useCallback(() => {
    // If already in tour selection modal, proceed to next step
    if (step === "tourSelection") {
      proceedFromTourSelection();
    }
    // Otherwise the "Continue to Booking" button on the cart bar handles it
  }, [step, proceedFromTourSelection]);

  return (
    <>
      <EnhanceSeoulAddonsCarousel
        selectedTourId={selectedTourId}
        onViewDetails={(productId) => openAddonModal(productId, selectedTourId)}
      />

      {portalRoot && createPortal(
        <AddonProductDetailsModal
          key={`${addonProductId ?? "none"}-${addonModalOpen ? "open" : "closed"}`}
          open={addonModalOpen}
          productId={addonProductId}
          onClose={closeAddonModal}
          onAddItems={onAddItems}
          onContinueToCheckout={onContinueToCheckout}
          physicalColorProductIdStrategy="base"
        />,
        portalRoot,
      )}
    </>
  );
}
