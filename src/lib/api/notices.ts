import { jsonFetch } from "@/lib/api/http";
import type { Notice } from "@/types/notices";

/**
 * Fetch all notices from the backend.
 * Not yet wired — the frontend currently reads from `@/lib/data/notices`.
 * When the Python service is ready, swap the data imports to call this.
 *
 * Expected backend contract:
 *   GET /notices → Notice[]
 */
export async function fetchNotices(): Promise<Notice[]> {
  return jsonFetch<Notice[]>("/notices", { method: "GET", cache: "no-store" });
}
