import { readLegacyDocumentAssets } from "@/lib/server/legacyHtml";

export default async function Head() {
  const legacy = await readLegacyDocumentAssets("booking.html");

  return (
    <>
      <base href="/" />
      {legacy.headStyleBlocks.map((cssText, idx) => (
        <style key={idx} dangerouslySetInnerHTML={{ __html: cssText }} />
      ))}
    </>
  );
}
