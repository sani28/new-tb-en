import type { Metadata } from "next";
import { fetchAffiliates, findAffiliateBySlug } from "@/lib/data/discounts";
import DiscountsPageClient from "@/components/discounts/DiscountsPageClient";

export const metadata: Metadata = {
  title: "Discounts - Seoul City Tour Tiger Bus",
  description:
    "Exclusive discounts for Seoul City Tour Tiger Bus ticket holders at partner restaurants, cafés, museums, and more.",
};

/**
 * /discounts — server component.
 *
 * Fetches affiliate data on the server and passes it to the client component.
 * When the Python backend is ready, `fetchAffiliates()` will call the real API.
 *
 * Supports deep-linking: /discounts?affiliate=bangtae-makguksu
 */
export default async function DiscountsPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;
  const affiliates = await fetchAffiliates();

  // Deep-link support: ?affiliate=slug
  const affiliateParam =
    typeof searchParams.affiliate === "string" ? searchParams.affiliate : null;
  const autoOpenSlug = affiliateParam
    ? findAffiliateBySlug(affiliateParam)?.slug ?? null
    : null;

  // If deep-linking to an affiliate, force the affiliate tab
  const initialTab = autoOpenSlug ? "affiliate" : undefined;

  return (
    <DiscountsPageClient
      affiliates={affiliates}
      autoOpenSlug={autoOpenSlug}
      initialTab={initialTab}
    />
  );
}

