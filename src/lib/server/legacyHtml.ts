import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

export type LegacyDocumentAssets = {
  bodyClassNames: string[];
  bodyHtmlWithoutScripts: string;
  inlineScripts: string[];
  headStyleBlocks: string[];
};

function extractInnerHtmlBetween(html: string, openTag: string, closeTag: string) {
  const start = html.indexOf(openTag);
  if (start === -1) return null;
  const startContent = html.indexOf(">", start);
  if (startContent === -1) return null;
  const end = html.indexOf(closeTag, startContent + 1);
  if (end === -1) return null;
  return html.slice(startContent + 1, end);
}

function extractClassListFromTag(html: string, tagName: string): string[] {
  const re = new RegExp(`<${tagName}[^>]*\\sclass=["']([^"']*)["'][^>]*>`, "i");
  const match = html.match(re);
  if (!match) return [];
  return match[1]
    .split(/\\s+/)
    .map((c) => c.trim())
    .filter(Boolean);
}

function extractTagBlocks(innerHtml: string, tagName: string): string[] {
  const blocks: string[] = [];
  const re = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`, "gi");
  let m: RegExpExecArray | null;
  while ((m = re.exec(innerHtml))) {
    blocks.push(m[1] ?? "");
  }
  return blocks;
}

function stripTagBlocks(innerHtml: string, tagName: string) {
  const re = new RegExp(`<${tagName}[^>]*>[\\s\\S]*?</${tagName}>`, "gi");
  return innerHtml.replace(re, "");
}

export async function readLegacyDocumentAssets(
  publicHtmlFileName: string,
): Promise<LegacyDocumentAssets> {
  const filePath = path.join(process.cwd(), "public", publicHtmlFileName);
  const html = await readFile(filePath, "utf8");

  const headInner = extractInnerHtmlBetween(html, "<head", "</head>") ?? "";
  const headStyleBlocks = extractTagBlocks(headInner, "style");

  const bodyClassNames = extractClassListFromTag(html, "body");
  const bodyInner = extractInnerHtmlBetween(html, "<body", "</body>");
  if (bodyInner == null) {
    throw new Error(`Could not extract <body> from ${publicHtmlFileName}`);
  }

  const inlineScripts = extractTagBlocks(bodyInner, "script");
  const bodyHtmlWithoutScripts = stripTagBlocks(bodyInner, "script");

  return {
    bodyClassNames,
    bodyHtmlWithoutScripts,
    inlineScripts,
    headStyleBlocks,
  };
}
