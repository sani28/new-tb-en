/* ── Step 4: Order Summary ── */

type StepStatus = "completed" | "active" | "pending";

function ProgressIndicator({ statuses }: { statuses: StepStatus[] }) {
  return (
    <div className="flex items-center justify-center gap-[10px] py-[18px] px-[18px] border-b border-[#eee] bg-white shrink-0" aria-hidden="true">
      {statuses.map((status, i) => (
        <div key={i} className="flex items-center gap-[10px]">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[14px] border-2 bg-white ${
              status === "completed" ? "border-[#2e7d32] text-[#2e7d32]"
              : status === "active"    ? "border-brand-red text-brand-red"
              :                          "border-[#ddd] text-[#666]"
            }`}
          >
            {i + 1}
          </div>
          {i < statuses.length - 1 && <div className="w-12 h-0.5 bg-[#e5e5e5]" />}
        </div>
      ))}
    </div>
  );
}

export default function PromoOrderSummaryModal() {
  return (
    <div className="promo-modal-overlay" id="promoOrderSummaryModal" aria-hidden="true">
      <div
        className="promo-order-modal bg-white w-[90%] max-w-[600px] max-h-[90vh] rounded-xl overflow-hidden flex flex-col relative shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="promoOrderSummaryTitle"
      >
        <button
          className="absolute top-[10px] right-[10px] w-[42px] h-[42px] rounded-full border-none bg-black/[0.06] text-[#333] text-[28px] leading-none cursor-pointer z-[2] flex items-center justify-center hover:bg-black/[0.10]"
          id="closeOrderSummary"
          type="button"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="flex flex-col h-full min-h-0">
          <ProgressIndicator statuses={["completed", "completed", "completed", "active"]} />

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto min-h-0 p-[18px]">
            {/* Header */}
            <div className="text-center mb-6 pt-[10px]">
              <h2 id="promoOrderSummaryTitle" className="text-[24px] font-bold m-0 mb-2">Order Summary</h2>
              <p className="text-[14px] text-[#666] m-0">Review your order before payment.</p>
            </div>

            {/* Order sections — inner content (.order-item, etc.) is JS-populated via innerHTML */}
            <div className="mb-6">
              {/* Tour tickets */}
              <div
                className="mb-4 bg-[#fafafa] border border-[#eef2f7] rounded-[14px] p-[14px]"
                id="orderTourTicketsSection"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-[12px] font-extrabold tracking-[0.08em] uppercase text-[#475569] m-0">Tour Tickets</h4>
                  <div className="text-[12px] font-bold text-brand-red tabular-nums" id="orderTourDate" />
                </div>
                {/* JS populates order items here */}
                <div className="order-summary-items" id="orderTourTickets" />
              </div>

              {/* Add-ons */}
              <div
                className="mb-4 bg-[#fafafa] border border-[#eef2f7] rounded-[14px] p-[14px]"
                id="orderAddonsSection"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-[12px] font-extrabold tracking-[0.08em] uppercase text-[#475569] m-0">Add-ons</h4>
                </div>
                {/* JS populates order items here */}
                <div className="order-summary-items" id="orderUpsellItemsList" />
              </div>

              {/* Totals */}
              <div className="bg-white border-2 border-[#E20021] rounded-xl p-5 mt-6">
                <div className="flex justify-between items-center py-2">
                  <span>Subtotal</span>
                  <span id="upsellSubtotal">$0.00</span>
                </div>
                <div className="flex justify-between items-center py-3 mt-2 border-t border-dashed border-[#ddd]" id="orderSavingsRow" style={{ display: "none" }}>
                  <span className="text-sm text-[#28a745]">You Save</span>
                  <span className="text-base font-semibold text-[#28a745]" id="orderSavings">$0.00</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-lg font-semibold text-[#333]">Total</span>
                  <span className="text-2xl font-bold text-[#E20021]" id="orderGrandTotal">$0.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky bottom */}
          <div className="sticky bottom-0 bg-white border-t border-[#eee] py-[14px] px-[18px] shrink-0">
            <div className="flex gap-[10px]">
              <button
                className="border-none rounded-xl px-4 py-[14px] text-[15px] font-extrabold cursor-pointer flex-1 bg-[#f2f2f2] text-[#333] hover:bg-[#e8e8e8] transition-colors"
                id="orderBackBtn"
                type="button"
              >
                Back
              </button>
              <button
                className="border-none rounded-xl px-4 py-[14px] text-[15px] font-extrabold cursor-pointer flex-1 bg-brand-red text-white hover:bg-brand-dark-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                id="proceedToPaymentBtn"
                type="button"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
