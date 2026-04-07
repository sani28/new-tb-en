import BodyClass from "@/components/BodyClass";
import HomepageBehaviors from "@/components/homepage/HomepageBehaviors";
import { PromoCheckoutProvider } from "@/components/homepage/checkout/PromoCheckoutContext";
import HomepageHero from "@/components/homepage/HomepageHero";
import HomepageCoursesSectionB from "@/components/homepage/HomepageCoursesSectionB";
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

      {/* Our Tours Title */}
      <div className="pt-8 pb-14 max-md:pt-[27px] max-md:pb-12 flex items-center justify-center overflow-visible" style={{ background: "#001e53" }}>
        <div className="relative inline-block mb-[10px]">
          {/* Red offset shadow */}
          <div className="absolute -left-[10px] top-[10px] w-full h-full bg-[#d63031]" />
          {/* White box */}
          <div className="relative bg-white px-12 py-2.5 max-md:px-6 max-md:py-1.5">
            <div className="border-y border-black/30 py-1">
              <h2
                className="text-[clamp(1.2rem,3vw,2.1rem)] font-black tracking-wide text-black whitespace-nowrap"
                style={{ fontFamily: "'SUIT-Heavy', sans-serif" }}
              >
                OUR TOURS
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Course Section */}
      <HomepageCoursesSectionB />

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
