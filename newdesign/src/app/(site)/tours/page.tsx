import type { Metadata } from "next";
import ToursPageClient from "@/components/tours/ToursPageClient";

export const metadata: Metadata = {
  title: "Tours | Seoul City Tour Bus",
  description:
    "Explore Seoul on our hop-on hop-off and night view bus tours. Choose from the Downtown Namsan Palace Course, Panorama Course, or Night View Course.",
};

export default function ToursPage() {
  return <ToursPageClient />;
}
