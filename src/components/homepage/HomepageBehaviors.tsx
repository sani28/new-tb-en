"use client";

import { useEffect } from "react";
import type { Cleanup } from "./behaviors/types";
import { initHomepageCourseCarousel } from "./behaviors/courseCarousel";
import { initPromoTabCarousel } from "./behaviors/promoTabCarousel";
import { initCoursesScrollVisibility } from "./behaviors/coursesVisibility";
import { initCardCarousels } from "./behaviors/cardCarousels";
import { initPromoAddonProductModal } from "./behaviors/promoCheckoutFlow";
import { initDiscoveryMobileCarousel } from "./behaviors/discoveryCarousel";

// Removed (now pure React components):
// - initHeroSlider → HomepageHero manages slider state via useState
// - initPromoHeroPromotionModal → PromoHeroPromotionModal manages open/close + promo data via useState
// - initHomepageBookingModal → HomepageBookingModal manages calendar, counters, modal state via useState
// - initBookingWidgetCountersAndCalendar → HomepageHero manages booking widget state via useState

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
