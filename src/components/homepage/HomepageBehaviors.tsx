"use client";

import { useEffect } from "react";
import type { Cleanup } from "./behaviors/types";
import { initHomepageCourseCarousel } from "./behaviors/courseCarousel";
import { initPromoTabCarousel } from "./behaviors/promoTabCarousel";
import { initCoursesScrollVisibility } from "./behaviors/coursesVisibility";
import { initCardCarousels } from "./behaviors/cardCarousels";
import { initPromoAddonProductModal } from "./behaviors/promoCheckoutFlow";
import { initDiscoveryMobileCarousel } from "./behaviors/discoveryCarousel";

export default function HomepageBehaviors() {
  useEffect(() => {
    const cleanups: Cleanup[] = [
      initHomepageCourseCarousel(),
      initPromoTabCarousel(),
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
