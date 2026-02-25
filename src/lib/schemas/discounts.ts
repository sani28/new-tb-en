/**
 * Discount page types & constants.
 *
 * A Python backend should expose endpoints that return / accept these shapes:
 *   GET  /api/discounts/affiliates          → AffiliateDiscount[]
 *   POST /api/discounts/partner-apply       → PartnerApplicationPayload
 *   POST /api/discounts/recommend           → RecommendationPayload
 */

/* ------------------------------------------------------------------ */
/*  Affiliate discount (read)                                         */
/* ------------------------------------------------------------------ */

export interface AffiliateDiscount {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  discount: string;
  address: string;
  benefit: string;
  retrieveInstructions: string;
  website: string;
  contact?: string;
  category?: string;
}

/* ------------------------------------------------------------------ */
/*  Partner application form (write)                                  */
/* ------------------------------------------------------------------ */

export interface PartnerApplicationPayload {
  businessName: string;
  businessType: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  proposedDiscount: string;
  description: string;
}

/* ------------------------------------------------------------------ */
/*  Recommendation form (write)                                       */
/* ------------------------------------------------------------------ */

export interface RecommendationPayload {
  businessName: string;
  businessType: string;
  location: string;
  reason: string;
  yourName: string;
  yourEmail: string;
}

/* ------------------------------------------------------------------ */
/*  Shared constants                                                  */
/* ------------------------------------------------------------------ */

export const BUSINESS_TYPES = [
  { value: "restaurant", label: "Restaurant" },
  { value: "cafe", label: "Café" },
  { value: "museum", label: "Museum/Gallery" },
  { value: "shopping", label: "Shopping" },
  { value: "entertainment", label: "Entertainment" },
  { value: "other", label: "Other" },
] as const;

export type BusinessTypeValue = (typeof BUSINESS_TYPES)[number]["value"];

