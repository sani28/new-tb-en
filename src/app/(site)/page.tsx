import BodyClass from "@/components/BodyClass";
import HomepageBehaviors from "@/components/homepage/HomepageBehaviors";
import HomepageHero from "@/components/homepage/HomepageHero";
import HomepageCoursesSection from "@/components/homepage/HomepageCoursesSection";
import HomepageDiscoverySection from "@/components/homepage/HomepageDiscoverySection";
import HomepageDiscountsSection from "@/components/homepage/HomepageDiscountsSection";
import PromoHeroPromotionModal from "@/components/homepage/PromoHeroPromotionModal";
import PromoAddonProductModal from "@/components/homepage/PromoAddonProductModal";
import PromoTourSelectionModal from "@/components/homepage/PromoTourSelectionModal";
import PromoTourMapPopup from "@/components/homepage/PromoTourMapPopup";
import PromoFloatingCart from "@/components/homepage/PromoFloatingCart";
import PromoBookingInfoModal from "@/components/homepage/PromoBookingInfoModal";
import PromoOrderSummaryModal from "@/components/homepage/PromoOrderSummaryModal";
import PromoPaymentModal from "@/components/homepage/PromoPaymentModal";
import HomepageBookingModal from "@/components/homepage/HomepageBookingModal";

export default function Home() {
  return (
    <>
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
      <PromoAddonProductModal />
      <PromoTourSelectionModal />
      <PromoTourMapPopup />
      <PromoFloatingCart />
      <PromoBookingInfoModal />
      <PromoOrderSummaryModal />
      <PromoPaymentModal />
      <HomepageBookingModal />
    </>
  );
}
