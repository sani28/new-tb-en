"use client";

import { useEffect } from "react";
import type { Cleanup } from "./behaviors/types";
import { initHomepageCourseCarousel } from "./behaviors/courseCarousel";
import { initHeroSlider } from "./behaviors/heroSlider";
import { initPromoTabCarousel } from "./behaviors/promoTabCarousel";
import { initPromoHeroPromotionModal } from "./behaviors/promoHeroModal";
import { initCoursesScrollVisibility } from "./behaviors/coursesVisibility";
import { initCardCarousels } from "./behaviors/cardCarousels";
import { initPromoAddonProductModal } from "./behaviors/promoCheckoutFlow";
import { initHomepageBookingModal } from "./behaviors/bookingModal";
import { initBookingWidgetCountersAndCalendar } from "./behaviors/bookingCounters";
import { initDiscoveryMobileCarousel } from "./behaviors/discoveryCarousel";

export default function HomepageBehaviors() {
  useEffect(() => {
    const cleanups: Cleanup[] = [
      initHomepageCourseCarousel(),
      initHeroSlider(),
      initPromoTabCarousel(),
      initPromoHeroPromotionModal(),
      initCoursesScrollVisibility(),
      initCardCarousels(),
      initPromoAddonProductModal(),
      initHomepageBookingModal(),
      initBookingWidgetCountersAndCalendar(),
      initDiscoveryMobileCarousel(),
    ];

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
