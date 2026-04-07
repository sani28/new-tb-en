import type { Metadata } from "next";
import MapPageClient from "@/components/map/MapPageClient";

export const metadata: Metadata = {
  title: "Tour Map - Seoul City Tour Tiger Bus",
  description:
    "Explore Seoul City Tour Bus routes and stops on an interactive map. View all tour courses and plan your journey.",
};

export default function MapPage() {
  return <MapPageClient />;
}
