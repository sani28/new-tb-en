import type { Metadata } from "next";
import Script from "next/script";

import BodyClass from "@/components/BodyClass";
import { readLegacyDocumentAssets } from "@/lib/server/legacyHtml";

export const metadata: Metadata = {
  title: "Discounts - Seoul City Tour Tiger Bus",
};

export default async function DiscountsPage() {
  const legacy = await readLegacyDocumentAssets("discounts.html");

  return (
    <>
      {legacy.bodyClassNames.map((c) => (
        <BodyClass key={c} className={c} />
      ))}

      <div dangerouslySetInnerHTML={{ __html: legacy.bodyHtmlWithoutScripts }} />

      {/* Legacy JS (kept for pixel-perfect behavior during conversion) */}
      <Script src="/discounts.js" strategy="beforeInteractive" />
      {legacy.inlineScripts.map((code, idx) => (
        <Script
          dangerouslySetInnerHTML={{ __html: code }}
          id={`discounts-inline-${idx}`}
          key={idx}
          strategy="beforeInteractive"
        />
      ))}
    </>
  );
}
