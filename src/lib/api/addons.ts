import { jsonFetch } from "@/lib/api/http";
import type { PromoProductWithId } from "@/types/promo";

// Promo/add-on related API helpers.
// The backend can choose to fully own this data later; for now the
// homepage still uses a local prototype copy in lib/data/promoProducts.

export async function fetchPromoProducts(): Promise<PromoProductWithId[]> {
  return jsonFetch<PromoProductWithId[]>("/addons", { method: "GET", cache: "no-store" });
}

