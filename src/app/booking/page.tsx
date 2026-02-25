import type { Metadata } from "next";
import Script from "next/script";

import BodyClass from "@/components/BodyClass";
import { readLegacyDocumentAssets } from "@/lib/server/legacyHtml";

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

      <div dangerouslySetInnerHTML={{ __html: legacy.bodyHtmlWithoutScripts }} />

      {/* Legacy inline JS (kept for pixel-perfect behavior during conversion) */}
      {legacy.inlineScripts.map((code, idx) => (
        <Script
          dangerouslySetInnerHTML={{ __html: code }}
          id={`booking-inline-${idx}`}
          key={idx}
          strategy="afterInteractive"
        />
      ))}
    </>
  );
}
