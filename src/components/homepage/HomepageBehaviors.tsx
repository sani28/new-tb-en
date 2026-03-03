"use client";

import { useEffect } from "react";
import type { Cleanup } from "./behaviors/types";
import { initHomepageCourseCarousel } from "./behaviors/courseCarousel";
import { initCoursesScrollVisibility } from "./behaviors/coursesVisibility";
import { initCardCarousels } from "./behaviors/cardCarousels";
import { initPromoAddonProductModal } from "./behaviors/promoCheckoutFlow";
import { initDiscoveryMobileCarousel } from "./behaviors/discoveryCarousel";

/*
  Note: initPromoTabCarousel was removed — the promo tab carousel is now a
  fully React-managed component (hero/PromoTabCarousel.tsx) and no longer
  needs imperative DOM wiring.
*/

export default function HomepageBehaviors() {
  useEffect(() => {
    const cleanups: Cleanup[] = [
      initHomepageCourseCarousel(),
      initCoursesScrollVisibility(),
      initCardCarousels(),
      initPromoAddonProductModal(),
      initDiscoveryMobileCarousel(),
    ];

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
