import type { Notice } from "@/types/notices";

/**
 * Single source of truth for notices & events.
 * Both the notices page and the header marquee read from here.
 *
 * To swap to a real backend later, replace this file's export with
 * a call to `fetchNotices()` from `@/lib/api/notices`.
 */
export const noticesData: Notice[] = [
  // ── Notices ────────────────────────────────────────────────────────────────
  {
    id: "n-20260123",
    category: "notice",
    title: "Seoul City Tour Bus Schedule Change Notice",
    description:
      "Due to the upcoming Lunar New Year holiday, there will be changes to our regular bus schedule. Please check the updated timetable for your convenience.",
    date: "2026-01-23",
    showInMarquee: true,
  },
  {
    id: "n-20260115",
    category: "notice",
    title: "New Night View Course Launch Event",
    description:
      "We are excited to announce the launch of our new Night View Course starting from February. Experience Seoul's stunning nightscape like never before.",
    date: "2026-01-15",
    showInMarquee: false,
  },
  {
    id: "n-20260110",
    category: "notice",
    title: "Winter Season Special Discount Announcement",
    description:
      "Enjoy special winter discounts on all our courses from January 15th to February 28th. Book now to secure your spot!",
    date: "2026-01-10",
    showInMarquee: false,
  },
  {
    id: "n-20260105",
    category: "notice",
    title: "Mobile App Update Notice",
    description:
      "A new version of our mobile app is now available with improved booking features and real-time bus tracking.",
    date: "2026-01-05",
    showInMarquee: false,
  },

  // ── Events ─────────────────────────────────────────────────────────────────
  {
    id: "e-20260215",
    category: "event",
    title: "Seoul Spring Festival Opening Ceremony",
    description:
      "Join us for a spectacular celebration of spring in Seoul! Special performances, traditional music, and cherry blossom viewing tours. Early bird tickets available with 20% discount.",
    date: "2026-02-15",
    showInMarquee: false,
  },
  {
    id: "e-20260220",
    category: "event",
    title: "Night Photography Tour Special",
    description:
      "Experience Seoul's stunning nightscape with our professional photography guide. Visit iconic locations, learn night photography techniques, and capture the city's vibrant lights. Includes camera rental and hot beverages.",
    date: "2026-02-20",
    showInMarquee: false,
  },
  {
    id: "e-20260225",
    category: "event",
    title: "Korean Street Food Festival Tour",
    description:
      "Explore the best street food spots in Seoul with our guided tour. Sample local delicacies, meet food artisans, and learn about Korean food culture. Special tasting menu included!",
    date: "2026-02-25",
    showInMarquee: false,
  },
  {
    id: "e-20260301",
    category: "event",
    title: "Historical Palace Evening Concert",
    description:
      "An enchanting evening of traditional Korean music at Gyeongbokgung Palace. Featuring renowned musicians and a special night tour of the palace grounds. Limited seats available.",
    date: "2026-03-01",
    showInMarquee: false,
  },
  {
    id: "e-20260305",
    category: "event",
    title: "Cherry Blossom Photography Competition",
    description:
      "Capture the beauty of Seoul's cherry blossoms! Join our photo contest during the special cherry blossom tour. Winners will receive premium tour packages and their photos featured in our 2024 calendar.",
    date: "2026-03-05",
    showInMarquee: false,
  },
];

/** The single most recent notice flagged for the header marquee bar, or null. */
export function getMarqueeNotice(): Notice | null {
  return noticesData
    .filter((n) => n.showInMarquee)
    .sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;
}

/** All notices of a given category, sorted newest-first. */
export function getNoticesByCategory(category: "notice" | "event"): Notice[] {
  return noticesData
    .filter((n) => n.category === category)
    .sort((a, b) => b.date.localeCompare(a.date));
}
