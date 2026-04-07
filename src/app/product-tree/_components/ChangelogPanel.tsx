"use client";

import { useEffect } from "react";
import { t, type Lang } from "../_lib/i18n";
import type { ChangeEntry } from "../_lib/types";

interface Props {
  changelog: ChangeEntry[];
  onClose: () => void;
  onExport: () => string;
  onClear: () => void;
  lang: Lang;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return "null";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

export default function ChangelogPanel({ changelog, onClose, onExport, onClear, lang }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleExport = () => {
    const json = onExport();
    navigator.clipboard.writeText(json).then(() => {
      alert("Changelog copied to clipboard!");
    }).catch(() => {
      // Fallback: download as file
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `product-tree-changes-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const handleClear = () => {
    if (confirm(t("changelog.clearConfirm", lang))) {
      onClear();
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-[var(--z-backdrop)]" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-[420px] max-w-[90vw] bg-white shadow-[-4px_0_20px_rgba(0,0,0,0.15)] z-[var(--z-modal)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#eee]">
          <h2 className="text-lg font-bold text-[#111] m-0">
            <i className="fas fa-clock-rotate-left text-amber-500 mr-2" />
            {t("changelog.title", lang)}
          </h2>
          <button
            className="bg-transparent border-none text-xl cursor-pointer text-[#666] hover:text-[#E31E24] leading-none"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Change list */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {changelog.length === 0 ? (
            <p className="text-sm text-[#aaa] text-center mt-10">{t("changelog.noChanges", lang)}</p>
          ) : (
            changelog.map((entry) => (
              <div key={entry.id} className="py-3 border-b border-[#f0f0f0] last:border-b-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-[#333]">{entry.nodeName}</span>
                  <span className="text-[10px] text-[#aaa]">{timeAgo(entry.timestamp)}</span>
                </div>
                <div className="text-xs text-[#666] mb-1">
                  <span className="font-medium text-[#888]">{entry.field}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="line-through text-rose-400 max-w-[45%] truncate">
                    {formatValue(entry.oldValue)}
                  </span>
                  <i className="fas fa-arrow-right text-[8px] text-[#ccc]" />
                  <span className="text-emerald-600 font-medium max-w-[45%] truncate">
                    {formatValue(entry.newValue)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {changelog.length > 0 && (
          <div className="px-5 py-4 border-t border-[#eee] flex gap-3">
            <button
              onClick={handleExport}
              className="flex-1 px-4 py-2.5 bg-[#111] text-white rounded-lg text-sm font-medium cursor-pointer border-none hover:bg-[#333] transition-colors"
            >
              <i className="fas fa-download mr-1.5" /> {t("changelog.exportJson", lang)}
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2.5 bg-white text-rose-600 rounded-lg text-sm font-medium cursor-pointer border border-rose-200 hover:bg-rose-50 transition-colors"
            >
              <i className="fas fa-trash mr-1.5" /> {t("changelog.clearAll", lang)}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
