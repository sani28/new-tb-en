import BodyClass from "@/components/BodyClass";
import HomepageBehaviors from "@/components/homepage/HomepageBehaviors";
import { PromoCheckoutProvider } from "@/components/homepage/checkout/PromoCheckoutContext";
import HomepageHero from "@/components/homepage/HomepageHero";
import HomepageCoursesSection from "@/components/homepage/HomepageCoursesSection";
import HomepageDiscoverySection from "@/components/homepage/HomepageDiscoverySection";
import HomepageDiscountsSection from "@/components/homepage/HomepageDiscountsSection";
import PromoHeroPromotionModal from "@/components/homepage/PromoHeroPromotionModal";
import PromoAddonModalPortal from "@/components/homepage/PromoAddonModalPortal";
import PromoTourSelectionModal from "@/components/homepage/PromoTourSelectionModal";
import PromoTourMapPopup from "@/components/homepage/PromoTourMapPopup";
import PromoFloatingCart from "@/components/homepage/PromoFloatingCart";
import PromoBookingInfoModal from "@/components/homepage/PromoBookingInfoModal";
import PromoOrderSummaryModal from "@/components/homepage/PromoOrderSummaryModal";
import PromoPaymentModal from "@/components/homepage/PromoPaymentModal";

export default function Home() {
  return (
    <PromoCheckoutProvider>
      <BodyClass className="index-page" />
      <HomepageBehaviors />

      {/* Home Hero Section */}
      <HomepageHero />

      {/* Course Section */}
      <HomepageCoursesSection />

      {/* Discovery Section */}
      <HomepageDiscoverySection />

      <HomepageDiscountsSection />

      {/* --- Modals & Overlays --- */}
      <PromoHeroPromotionModal />
      <PromoAddonModalPortal />
      <PromoTourSelectionModal />
      <PromoTourMapPopup />
      <PromoFloatingCart />
      <PromoBookingInfoModal />
      <PromoOrderSummaryModal />
      <PromoPaymentModal />
    </PromoCheckoutProvider>
  );
}
