/* eslint-disable @next/next/no-img-element */

export default function PromoAddonProductModal() {
  return (
    /* promo-product-modal-overlay kept — JS toggles .active to display:flex */
    <div className="promo-product-modal-overlay" id="promoProductModal" aria-hidden="true">
      <div
        className="bg-white w-[90%] max-w-[600px] h-[90vh] rounded-xl overflow-hidden flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="promoProductModalTitle"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#eee] bg-white shrink-0">
          <button
            className="border-none bg-transparent text-xl leading-none cursor-pointer p-2 text-[#333] hover:text-black transition-colors"
            id="closePromoProductModal"
            type="button"
            aria-label="Close"
          >
            ←
          </button>
          <h3 id="promoProductModalTitle" className="m-0 text-base font-semibold">Product Details</h3>
          <button
            className="border-none bg-transparent text-xl leading-none cursor-pointer p-2 text-[#333] hover:text-black transition-colors"
            id="closePromoProductModal2"
            type="button"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* promo-product-main-image kept — JS adds .placeholder-image class for gradient bg */}
          <div
            className="promo-product-main-image w-full h-[300px] overflow-hidden bg-[#f5f5f5] flex items-center justify-center shrink-0"
            id="promoProductModalImage"
          >
            <img
              src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
              alt="Product"
              id="promoProductModalImg"
              className="w-full h-full object-cover"
              style={{ display: "none" }}
            />
            <span
              className="text-[120px] opacity-70"
              id="promoProductModalPlaceholder"
              style={{ display: "none" }}
            >
              📦
            </span>
          </div>

          {/* promo-product-variant-tabs kept — globals.css @layer components scopes variant UI rules to this parent */}
          <div className="promo-product-variant-tabs" id="promoProductVariantTabs">
            {/* Populated by JS */}
          </div>

          <div className="p-5">
            <h2 id="promoProductModalName" className="m-0 mb-3 text-2xl font-semibold leading-tight text-[#333]">
              Product Name
            </h2>
            <p id="promoProductModalDesc" className="text-sm text-[#666] m-0 mb-4 leading-relaxed">
              Product description goes here.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-[#E20021]" id="promoProductModalPrice">$0.00 USD</span>
              <span className="text-base text-[#999] line-through" id="promoProductModalOrigPrice">$0.00 USD</span>
            </div>
          </div>
        </div>

        {/* Sticky bottom */}
        <div className="flex items-center gap-4 px-5 py-4 border-t border-[#eee] bg-white shrink-0">
          <button
            className="flex-1 border-none rounded-lg px-5 py-[14px] bg-[#E20021] text-white text-base font-semibold cursor-pointer transition-colors hover:bg-[#C4001A] disabled:opacity-50 disabled:cursor-not-allowed"
            id="promoAddToCartBtn"
            type="button"
          >
            Add to Cart - $0.00
          </button>
        </div>
      </div>
    </div>
  );
}

