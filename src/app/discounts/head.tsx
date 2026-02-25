/* eslint-disable @next/next/no-css-tags */
import { readLegacyDocumentAssets } from "@/lib/server/legacyHtml";

export default async function Head() {
  const legacy = await readLegacyDocumentAssets("discounts.html");

  return (
    <>
      <base href="/" />
      <link rel="stylesheet" href="/discounts.css" />
      {legacy.headStyleBlocks.map((cssText, idx) => (
        <style key={idx} dangerouslySetInnerHTML={{ __html: cssText }} />
      ))}
    </>
  );
}
