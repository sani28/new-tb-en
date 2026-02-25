/* eslint-disable @next/next/no-img-element */

export default function PromoHeroPromotionModal() {
  return (
    <div className="promo-hero-modal-overlay" id="promoHeroPromotionModal" aria-hidden="true">
      <div className="promo-hero-modal" role="dialog" aria-modal="true" aria-labelledby="promoHeroPromotionTitle">
        <button className="close-popup" id="closePromoHeroPromotionModal" type="button" aria-label="Close">
          &times;
        </button>
        <div className="promo-hero-modal-media">
          <img id="promoHeroPromotionImg" src="/imgs/promotion-1.png" alt="Promotion" />
        </div>
        <div className="promo-hero-modal-body">
          <h3 id="promoHeroPromotionTitle">Promotion</h3>
          <p id="promoHeroPromotionDesc">View details and continue to booking.</p>
        </div>
        <div className="promo-hero-actions">
          <button className="promo-hero-secondary" id="promoHeroPromotionCloseBtn" type="button">Close</button>
          <button className="promo-hero-cta" id="promoHeroPromotionBookNowBtn" type="button">Book now</button>
        </div>
      </div>
    </div>
  );
}

