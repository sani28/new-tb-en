"use client";

import EnhanceSeoulAddonsCarousel from "@/components/addons/EnhanceSeoulAddonsCarousel";
import { usePromoCheckout } from "./checkout/PromoCheckoutContext";

export default function PromoEnhanceSeoulAddonsCarousel() {
  const { selectedTourId, openAddonModal } = usePromoCheckout();

  return (
    <EnhanceSeoulAddonsCarousel
      selectedTourId={selectedTourId}
      onViewDetails={(productId) => openAddonModal(productId, selectedTourId)}
    />
  );
}
