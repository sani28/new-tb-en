import { readFile } from "fs/promises";
import path from "path";

/**
 * Serve the legacy discounts page (static HTML + inline JS) at `/discounts`
 * while keeping the URL as `/discounts` (no redirect).
 */
export async function GET() {
  const filePath = path.join(process.cwd(), "public", "discounts.html");
  const html = await readFile(filePath, "utf8");

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}
