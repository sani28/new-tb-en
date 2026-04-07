"use client";

import { useCallback } from "react";
import { createPortal } from "react-dom";
import AddonProductDetailsModal from "@/components/addons/AddonProductDetailsModal";
import { usePromoCheckout, usePromoAddonHandler } from "./checkout/PromoCheckoutContext";

/**
 * Renders the React addon product details modal as a body portal.
 * Must be always mounted on the page so it can open regardless of which
 * checkout step is active (or from homepage card buttons).
 */
export default function PromoAddonModalPortal() {
  const {
    addonModalOpen,
    addonProductId,
    closeAddonModal,
    step,
    selectedTourId,
    proceedFromTourSelection,
    openTourSelection,
  } = usePromoCheckout();

  const { handleAddItems } = usePromoAddonHandler();

  const onAddItems = useCallback(
    (items: Parameters<typeof handleAddItems>[0]) => {
      handleAddItems(items);
      closeAddonModal();
    },
    [handleAddItems, closeAddonModal],
  );

  const onContinueToCheckout = useCallback(() => {
    if (step === "tourSelection") {
      proceedFromTourSelection();
    } else {
      // If opened from homepage (idle state), launch the new promo booking modal
      openTourSelection({ preferredTour: selectedTourId, tourOptional: true });
    }
  }, [step, proceedFromTourSelection, openTourSelection, selectedTourId]);

  const portalRoot = typeof document !== "undefined" ? document.body : null;
  if (!portalRoot) return null;

  return createPortal(
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
  );
}
