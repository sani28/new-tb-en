"use client";

import { useLayoutEffect } from "react";

/**
 * Next/React won't execute <script> tags inside dangerouslySetInnerHTML.
 * We also observed that next/script inline scripts may not reliably run on
 * client-side navigations. This component ensures the legacy booking inline
 * JS executes exactly once per page load.
 */
export default function LegacyInlineScripts({
  scripts,
  debugLabel = "booking",
}: {
  scripts: string[];
  debugLabel?: string;
}) {
  useLayoutEffect(() => {
    const w = window as Window & { __tbLegacyInlineScriptsLoaded?: Record<string, boolean> };
    w.__tbLegacyInlineScriptsLoaded = w.__tbLegacyInlineScriptsLoaded || {};

    // Do not re-run in dev StrictMode re-mounts or client navigations.
    if (w.__tbLegacyInlineScriptsLoaded[debugLabel]) return;
    w.__tbLegacyInlineScriptsLoaded[debugLabel] = true;

    scripts.forEach((code, idx) => {
      const js = (code || "").trim();
      if (!js) return;

      const el = document.createElement("script");
      el.type = "text/javascript";
      el.dataset.tbLegacy = debugLabel;
      el.dataset.tbLegacyIdx = String(idx);
      el.text = js;
      document.body.appendChild(el);
    });
  }, [scripts, debugLabel]);

  return null;
}

