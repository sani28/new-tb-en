"use client";

import { useEffect } from "react";
import type { Cleanup } from "./behaviors/types";
import { initHomepageCourseCarousel } from "./behaviors/courseCarousel";
import { initCoursesScrollVisibility } from "./behaviors/coursesVisibility";
import { initCardCarousels } from "./behaviors/cardCarousels";
import { initDiscoveryMobileCarousel } from "./behaviors/discoveryCarousel";

/*
  Note: initPromoTabCarousel was removed — the promo tab carousel is now a
  fully React-managed component (hero/PromoTabCarousel.tsx) and no longer
  needs imperative DOM wiring.
*/

export default function HomepageBehaviors() {
  useEffect(() => {
    // Prevent the browser from restoring a previous scroll position on refresh.
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const cleanups: Cleanup[] = [
      initHomepageCourseCarousel(),
      initCoursesScrollVisibility(),
      initCardCarousels(),
      initDiscoveryMobileCarousel(),
    ];

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
