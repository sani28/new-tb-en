export type NoticeCategory = "notice" | "event";

export type Notice = {
  id: string;
  category: NoticeCategory;
  title: string;
  description: string;
  date: string;               // ISO date string e.g. "2026-01-23"
  /** When true, this notice appears in the header marquee bar */
  showInMarquee: boolean;
  /** Short text for the marquee (falls back to title if omitted) */
  marqueeText?: string;
  /** Optional link for "read more" — defaults to /notices */
  link?: string;
};
