"use client";

import { useState } from "react";
import { getNoticesByCategory } from "@/lib/data/notices";
import type { Notice } from "@/types/notices";

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function formatDay(dateStr: string): string {
  return new Date(dateStr).getUTCDate().toString().padStart(2, "0");
}

function formatMonth(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }).toUpperCase();
}

const TOTAL_PAGES = 5;

/* ── Component ────────────────────────────────────────────────────────────── */

export default function NoticesContent() {
  const [activeTab, setActiveTab] = useState<"notice" | "event">("notice");
  const [page, setPage] = useState(1);

  const items: Notice[] = getNoticesByCategory(activeTab);

  const switchTab = (tab: "notice" | "event") => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <>
      {/* Tab navigation */}
      <div className="flex flex-col items-center mb-10 gap-[30px] max-md:mb-[30px] max-md:gap-5">
        <div className="flex justify-center gap-[30px] items-center w-full pb-[10px] border-b border-[#ddd] max-md:gap-5">
          <TabButton
            label="Notices"
            active={activeTab === "notice"}
            onClick={() => switchTab("notice")}
          />
          <TabButton
            label="Events"
            active={activeTab === "event"}
            onClick={() => switchTab("event")}
          />
        </div>
      </div>

      {/* Notice list */}
      <div className="max-w-[1000px] mx-auto">
        <div className="flex flex-col gap-5 text-left mt-[30px]">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex items-center gap-[30px] p-[30px] bg-[#f8f8f8] rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] max-md:p-5 max-md:gap-[15px]"
            >
              {/* Date badge */}
              <div className="flex flex-col items-center min-w-[80px] max-md:min-w-[60px]">
                <span className="text-[32px] font-semibold text-[#E20021] leading-none max-md:text-[24px]">
                  {formatDay(item.date)}
                </span>
                <span className="text-[16px] text-[#666] mt-1 max-md:text-[14px]">
                  {formatMonth(item.date)}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-[20px] text-[#333] mb-2 font-semibold max-md:text-[16px]">
                  {item.title}
                </h3>
                <p className="text-[#666] text-[16px] leading-[1.5] m-0 max-md:text-[14px]">
                  {item.description}
                </p>
              </div>

              {/* Arrow */}
              <a
                href={item.link ?? "#"}
                className="text-[#E20021] text-[24px] p-[10px] transition-transform duration-300 hover:translate-x-[5px] shrink-0 max-md:text-[20px]"
                aria-label={`Read more about ${item.title}`}
              >
                <i className="fas fa-arrow-right" />
              </a>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-5 mt-[60px] max-md:mt-10">
          <button
            className="w-10 h-10 border-none bg-[#f8f8f8] rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-[#e5e5e5] disabled:opacity-40 disabled:cursor-not-allowed max-md:w-9 max-md:h-9"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <i className="fas fa-chevron-left" />
          </button>

          <div className="flex gap-[10px]">
            {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={
                  "w-10 h-10 flex items-center justify-center rounded-full text-[16px] border-none cursor-pointer transition-all max-md:w-9 max-md:h-9 max-md:text-[14px] " +
                  (n === page
                    ? "bg-[#E20021] text-white"
                    : "bg-transparent text-[#666] hover:bg-[#f8f8f8]")
                }
                onClick={() => setPage(n)}
                aria-label={`Page ${n}`}
                aria-current={n === page ? "page" : undefined}
              >
                {n}
              </button>
            ))}
          </div>

          <button
            className="w-10 h-10 border-none bg-[#f8f8f8] rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-[#e5e5e5] disabled:opacity-40 disabled:cursor-not-allowed max-md:w-9 max-md:h-9"
            onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
            disabled={page === TOTAL_PAGES}
            aria-label="Next page"
          >
            <i className="fas fa-chevron-right" />
          </button>
        </div>
      </div>
    </>
  );
}

/* ── Tab button sub-component ─────────────────────────────────────────────── */

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={
        "relative bg-none border-none text-[24px] font-medium px-5 py-[10px] cursor-pointer transition-all " +
        (active ? "text-[#e4002b]" : "text-[#666]")
      }
      onClick={onClick}
    >
      {label}
      <span
        className={
          "absolute bottom-[-11px] left-0 w-full h-[3px] bg-[#e4002b] transition-transform duration-300 origin-left " +
          (active ? "scale-x-100" : "scale-x-0")
        }
      />
    </button>
  );
}
