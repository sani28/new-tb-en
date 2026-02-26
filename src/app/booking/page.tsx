import type { Metadata } from "next";
import Script from "next/script";

import BodyClass from "@/components/BodyClass";
import { readLegacyDocumentAssets } from "@/lib/server/legacyHtml";
import BookingBehaviors from "./BookingBehaviors";
import BookingAddonsCarouselBridge from "./BookingAddonsCarouselBridge";
import BookingCalendarBridge from "./BookingCalendarBridge";
import BookingStep1Bridge from "./BookingStep1Bridge";
import BookingCartBridge from "./cart/BookingCartBridge";
import BookingStep2AddonsBridge from "./cart/BookingStep2AddonsBridge";
import LegacyInlineScripts from "./LegacyInlineScripts";

export const metadata: Metadata = {
  title: "Seoul City Tour Tiger Bus - Book Your Tour",
};

export default async function BookingPage() {
  const legacy = await readLegacyDocumentAssets("booking.html");

  return (
    <>
      {legacy.bodyClassNames.map((c) => (
        <BodyClass key={c} className={c} />
      ))}

      {/* Booking page relies on large <style> blocks in booking.html <head>. */}
      {legacy.headStyleBlocks.map((css, idx) => (
        <style
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: css }}
          key={`booking-legacy-style-${idx}`}
        />
      ))}

      <div dangerouslySetInnerHTML={{ __html: legacy.bodyHtmlWithoutScripts }} />

		      {/*
		        Provide a safe stub ASAP so legacy handlers never crash before React bundles load.
		
		        Everyday language:
		        - booking.html legacy JS still calls `window.UpsellCart.*` when the user adds add-ons.
		        - React later replaces this stub with the real implementation (see `ensureUpsellCartOnWindow`).
		        - while we are in-between, we queue actions into `window.__tbUpsellCartQueue`.
		      */}
	      <Script
	        id="booking-upsellcart-stub"
	        strategy="beforeInteractive"
	        dangerouslySetInnerHTML={{
	          __html: `
(function(){
  // Disable legacy add-on modal wiring; React owns the add-on details modal.
  window.__tbBookingReactAddonModal = true;
  window.__tbUpsellCartQueue = window.__tbUpsellCartQueue || [];
  if (!window.UpsellCart) {
    window.UpsellCart = {
      __tbIsStub: true,
      items: [],
      addItem: function(item){ window.__tbUpsellCartQueue.push({ type: 'addItem', item: item }); },
      removeItem: function(index){ window.__tbUpsellCartQueue.push({ type: 'removeItem', index: index }); },
      updateItemQuantity: function(index, qty){ window.__tbUpsellCartQueue.push({ type: 'updateItemQuantity', index: index, qty: qty }); },
      setTicketQuantities: function(index, adultQty, childQty){ window.__tbUpsellCartQueue.push({ type: 'setTicketQuantities', index: index, adultQty: adultQty, childQty: childQty }); },
      clear: function(){ window.__tbUpsellCartQueue.push({ type: 'clear' }); },
      getTotal: function(){ return 0; },
      getOriginalTotal: function(){ return 0; },
      getItemCount: function(){ return 0; },
      getOrderPayload: function(){ return []; },
      updateCartUI: function(){},
      save: function(){},
    };
  }
})();
`,
	        }}
	      />

	      {/* React cart state + cart bar UI bridge */}
	      <BookingCartBridge />
	      <BookingStep2AddonsBridge />
	      <BookingCalendarBridge />
	      <BookingStep1Bridge />
		      <BookingAddonsCarouselBridge />

		      {/*
		        React-based step navigation + cart interactions (incremental conversion).
		
		        Backend handoff note:
		        The actual `POST /bookings` call is not wired yet. The intended hook point is
		        the "Make payment" click handler in `BookingBehaviors.tsx`.
		      */}
	      <BookingBehaviors />


	      {/* Execute legacy inline JS reliably (modals, calendar, etc.) */}
	      <LegacyInlineScripts scripts={legacy.inlineScripts} />
    </>
  );
}
