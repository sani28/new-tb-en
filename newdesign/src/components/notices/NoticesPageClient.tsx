"use client";

import { useState, useMemo } from "react";
import BodyClass from "@/components/BodyClass";

type TabId = "notices" | "events";

interface NoticeItem {
  id: number;
  title: string;
  description: string;
  date: string;
}

const ITEMS_PER_PAGE = 4;

// Static data — replace with API call when backend endpoint is ready
const NOTICES: NoticeItem[] = [
  {
    id: 1,
    title: "Seoul City Tour Bus Schedule Change Notice",
    description:
      "Due to the upcoming Lunar New Year holiday, there will be changes to our regular bus schedule. Please check the updated timetable for your convenience.",
    date: "2025-01-23",
  },
  {
    id: 2,
    title: "New Night View Course Launch Event",
    description:
      "We are excited to announce the launch of our new Night View Course starting from February. Experience Seoul's stunning nightscape like never before.",
    date: "2025-01-15",
  },
  {
    id: 3,
    title: "Winter Season Special Discount Announcement",
    description:
      "Enjoy special winter discounts on all our courses from January 15th to February 28th. Book now to secure your spot!",
    date: "2025-01-10",
  },
  {
    id: 4,
    title: "Mobile App Update Notice",
    description:
      "A new version of our mobile app is now available with improved booking features and real-time bus tracking.",
    date: "2025-01-05",
  },
];

const EVENTS: NoticeItem[] = [
  {
    id: 5,
    title: "Seoul Spring Festival Opening Ceremony",
    description:
      "Join us for a spectacular celebration of spring in Seoul! Special performances, traditional music, and cherry blossom viewing tours. Early bird tickets available with 20% discount.",
    date: "2025-02-15",
  },
  {
    id: 6,
    title: "Night Photography Tour Special",
    description:
      "Experience Seoul's stunning nightscape with our professional photography guide. Visit iconic locations, learn night photography techniques, and capture the city's vibrant lights.",
    date: "2025-02-20",
  },
  {
    id: 7,
    title: "Korean Street Food Festival Tour",
    description:
      "Explore the best street food spots in Seoul with our guided tour. Sample local delicacies, meet food artisans, and learn about Korean food culture. Special tasting menu included!",
    date: "2025-02-25",
  },
  {
    id: 8,
    title: "Historical Palace Evening Concert",
    description:
      "An enchanting evening of traditional Korean music at Gyeongbokgung Palace. Featuring renowned musicians and a special night tour of the palace grounds. Limited seats available.",
    date: "2025-03-01",
  },
  {
    id: 9,
    title: "Cherry Blossom Photography Competition",
    description:
      "Capture the beauty of Seoul's cherry blossoms! Join our photo contest during the special cherry blossom tour. Winners will receive premium tour packages and their photos featured in our 2024 calendar.",
    date: "2025-03-05",
  },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getUTCDate().toString().padStart(2, "0");
  const month = d
    .toLocaleString("en", { month: "short", timeZone: "UTC" })
    .toUpperCase();
  return { day, month };
}

const TABS: { id: TabId; label: string }[] = [
  { id: "notices", label: "Notices" },
  { id: "events", label: "Events" },
];

export default function NoticesPageClient() {
  const [activeTab, setActiveTab] = useState<TabId>("notices");
  const [currentPage, setCurrentPage] = useState(1);

  const items = activeTab === "notices" ? NOTICES : EVENTS;
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  const paginatedItems = useMemo(
    () =>
      items.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [items, currentPage]
  );

  function switchTab(tab: TabId) {
    setActiveTab(tab);
    setCurrentPage(1);
  }

  return (
    <main className="px-10 pb-[60px] mb-[60px] max-md:px-5 max-md:pt-[80px] max-md:pb-10 max-md:mb-10">
      <BodyClass className="template-page" />
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-10 mx-auto max-w-[1400px] min-h-[500px] mt-[80px] max-md:p-5 max-md:rounded-lg">
        {/* Banner */}
        <div className="relative rounded-xl px-[30px] py-[30px] mb-10 overflow-hidden h-[150px] max-md:h-[100px] max-md:px-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/imgs/banner.png"
            alt="Notices Banner Background"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        </div>

        {/* Tab navigation */}
        <div className="w-full mb-[30px]">
          <div className="flex justify-center gap-[30px] border-b border-[#ddd] pb-2.5 max-md:gap-5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`bg-transparent border-none py-2.5 px-5 text-2xl font-medium cursor-pointer relative transition-colors max-md:text-xl ${
                  activeTab === tab.id
                    ? "text-[#E20021]"
                    : "text-[#666] hover:text-[#E20021]"
                }`}
                onClick={() => switchTab(tab.id)}
                type="button"
              >
                {tab.label}
                <span
                  className={`absolute bottom-[-11px] left-0 w-full h-[3px] bg-[#E20021] transition-transform origin-left ${
                    activeTab === tab.id ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Notice list */}
        <div className="max-w-[1000px] mx-auto">
          <div className="flex flex-col gap-5 text-left mt-[30px]">
            {paginatedItems.map((item) => {
              const { day, month } = formatDate(item.date);
              return (
                <a
                  key={item.id}
                  href="#"
                  className="flex items-center gap-[30px] p-[30px] bg-[#F8F8F8] rounded-xl no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] max-md:p-5 max-md:gap-4"
                >
                  {/* Date badge */}
                  <div className="flex flex-col items-center min-w-[80px] max-md:min-w-[60px]">
                    <span className="text-[32px] font-semibold text-[#E20021] leading-none max-md:text-2xl">
                      {day}
                    </span>
                    <span className="text-base text-[#666] mt-1 max-md:text-sm">
                      {month}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-[#333] mb-2 max-md:text-base">
                      {item.title}
                    </h3>
                    <p className="text-base text-[#666] leading-relaxed max-md:text-sm">
                      {item.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <span className="text-[#E20021] text-2xl p-2.5 transition-transform hover:translate-x-1 max-md:text-xl">
                    &rarr;
                  </span>
                </a>
              );
            })}

            {paginatedItems.length === 0 && (
              <p className="text-center text-[#666] py-10">No items found.</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-5 mt-[60px] max-md:mt-10">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 border-none bg-[#F8F8F8] rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-[#E5E5E5] disabled:opacity-50 disabled:cursor-not-allowed max-md:w-9 max-md:h-9"
              >
                &#8249;
              </button>

              <div className="flex gap-2.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-base border-none cursor-pointer transition-all max-md:w-9 max-md:h-9 max-md:text-sm ${
                        currentPage === page
                          ? "bg-[#E20021] text-white"
                          : "text-[#666] hover:bg-[#F8F8F8]"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="w-10 h-10 border-none bg-[#F8F8F8] rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-[#E5E5E5] disabled:opacity-50 disabled:cursor-not-allowed max-md:w-9 max-md:h-9"
              >
                &#8250;
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
