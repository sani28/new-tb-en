import type { Metadata } from "next";
import "./booking.css";
import BookingFlow from "./BookingFlow";

export const metadata: Metadata = {
  title: "Seoul City Tour Tiger Bus - Book Your Tour",
};

export default function BookingPage() {
  return <BookingFlow />;
}
