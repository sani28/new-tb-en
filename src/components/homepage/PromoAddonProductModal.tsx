/* eslint-disable @next/next/no-img-element */

export default function PromoAddonProductModal() {
  return (
    <div className="promo-product-modal-overlay" id="promoProductModal" aria-hidden="true">
      <div className="promo-product-details-content" role="dialog" aria-modal="true" aria-labelledby="promoProductModalTitle">
        <div className="promo-product-modal-header">
          <button className="promo-back-to-modal" id="closePromoProductModal" aria-label="Close">←</button>
          <h3 id="promoProductModalTitle">Product Details</h3>
          <button className="promo-close-product-details" id="closePromoProductModal2" aria-label="Close">×</button>
        </div>
        <div className="promo-product-scrollable-content">
          <div className="promo-product-main-image" id="promoProductModalImage">
            <img
              src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
              alt="Product"
              id="promoProductModalImg"
              style={{ display: "none" }}
            />
            <span className="promo-image-placeholder" id="promoProductModalPlaceholder" style={{ display: "none" }}>
              📦
            </span>
          </div>
          <div className="promo-product-variant-tabs" id="promoProductVariantTabs">
            {/* Variant tabs will be populated by JavaScript */}
          </div>
          <div className="promo-product-details-info">
            <h2 id="promoProductModalName">Product Name</h2>
            <p id="promoProductModalDesc">Product description goes here.</p>
            <div className="promo-product-modal-pricing">
              <span className="promo-modal-current-price" id="promoProductModalPrice">$0.00 USD</span>
              <span className="promo-modal-original-price" id="promoProductModalOrigPrice">$0.00 USD</span>
            </div>
          </div>
        </div>
        <div className="promo-product-sticky-bottom">
          <button className="promo-add-to-cart-btn" id="promoAddToCartBtn">Add to Cart - $0.00</button>
        </div>
      </div>
    </div>
  );
}

