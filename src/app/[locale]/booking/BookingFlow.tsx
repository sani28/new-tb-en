"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { bookingStep1Store, useBookingStep1 } from "./step1/store";
import { bookingCartStore } from "./cart/store";
import { createBooking } from "@/lib/api/bookings";
import BookingStep1 from "./components/BookingStep1";
import BookingPackageStep, { type SelectedTour } from "./components/BookingPackageStep";
import BookingStep2, { type ContactInfo } from "./components/BookingStep2";
import BookingStep3 from "./components/BookingStep3";
import BookingStep4 from "./components/BookingStep4";
import BodyClass from "@/components/BodyClass";

export default function BookingFlow() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [packageVariant, setPackageVariant] = useState<"A" | "C">("C");
  const [selectedTour, setSelectedTour] = useState<SelectedTour | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [contact, setContact] = useState<ContactInfo>({
    fullName: "",
    email: "",
    phone: "",
    termsAgreed: false,
    marketingAgreed: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  const locale = useLocale();
  const localeTag = locale === "ko" ? "ko-KR" : "en-US";
  const t = useTranslations("BookingFlow");
  const tc = useTranslations("Common");

  const s1 = useBookingStep1();
  const scrollTop = () => window.scrollTo(0, 0);

  function formatDate(d: Date) {
    return d.toLocaleDateString(localeTag, { weekday: "short", month: "short", day: "numeric" });
  }

  const goToStep2 = () => {
    const snap = bookingStep1Store.getSnapshot();
    if (snap.adultCount === 0 && snap.childCount === 0) {
      alert(t("alertSelectTicket"));
      return;
    }
    if (!snap.selectedDate) {
      alert(t("alertSelectDate"));
      return;
    }
    setSummaryOpen(false);
    setStep(2);
    scrollTop();
  };

  const goToStep3 = (tour: SelectedTour) => {
    setSelectedTour(tour);
    setStep(3);
    scrollTop();
  };

  const goToStep4 = () => {
    if (!contact.fullName.trim() || !contact.email.trim() || !contact.phone.trim()) {
      alert(t("alertFillFields"));
      return;
    }
    if (!contact.termsAgreed) {
      alert(t("alertAgreeTerms"));
      return;
    }
    setStep(4);
    scrollTop();
  };

  const handleMakePayment = async () => {
    if (!selectedTour) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const snap = bookingStep1Store.getSnapshot();
    const cart = bookingCartStore.getSnapshot();

    const tickets = [
      ...(snap.adultCount > 0
        ? [{ kind: "adult" as const, quantity: snap.adultCount, unitPrice: selectedTour.adultPrice }]
        : []),
      ...(snap.childCount > 0
        ? [{ kind: "child" as const, quantity: snap.childCount, unitPrice: selectedTour.childPrice }]
        : []),
    ];

    const addons = cart.items.map((item) => ({
      addonId: item.productId,
      quantity: item.quantity,
      variant: item.variant ?? null,
      color: item.color ?? null,
      selectedDate: item.selectedDate ?? null,
      selectedTime: item.selectedTime ?? null,
      selectedTimeSlot: item.selectedTimeSlot ?? null,
      validUntil: item.validUntil ?? null,
      adultQty: item.adultQty ?? null,
      childQty: item.childQty ?? null,
    }));

    const dateStr = snap.selectedDate
      ? `${snap.selectedDate.getFullYear()}-${String(snap.selectedDate.getMonth() + 1).padStart(2, "0")}-${String(snap.selectedDate.getDate()).padStart(2, "0")}`
      : null;

    try {
      const response = await createBooking({
        tourId: selectedTour.tourId,
        date: dateStr,
        tickets,
        addons,
        contact: {
          fullName: contact.fullName,
          email: contact.email,
          phoneNumber: contact.phone,
        },
      });
      setBookingRef(response.referenceCode);
      bookingCartStore.clear();
      setStep(5);
      scrollTop();
    } catch {
      setSubmitError("Payment failed. Please try again or contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ticketParts: string[] = [];
  if (s1.adultCount > 0) ticketParts.push(`${s1.adultCount} ${s1.adultCount > 1 ? tc("adults") : tc("adult")}`);
  if (s1.childCount > 0) ticketParts.push(`${s1.childCount} ${s1.childCount > 1 ? tc("children") : tc("child")}`);
  const ticketSummary = ticketParts.join(", ");
  const hasSummary = step === 1 && s1.selectedDate !== null;

  return (
    <>
      <main className={`relative mx-auto p-5 pt-[120px] max-md:p-2.5 max-md:pt-20 max-lg:px-8 ${step === 2 ? (packageVariant === "C" ? "max-w-[1200px]" : "max-w-[900px]") : "max-w-[640px]"}`}>
        <BodyClass className="template-page booking-page" />
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)]">

          {/* Header */}
          <div className="flex items-center justify-between bg-brand-red px-6 py-5">
            <h1 className="m-0 text-2xl font-semibold text-white">{t("bookYourTour")}</h1>
            {hasSummary && (
              <button
                onClick={() => setSummaryOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/30"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {formatDate(s1.selectedDate!)}
              </button>
            )}
          </div>

          {step === 1 && <div id="step1"><BookingStep1 onContinue={goToStep2} /></div>}
          {step === 2 && s1.selectedDate && (
            <div id="step2">
              <BookingPackageStep
                adultCount={s1.adultCount} childCount={s1.childCount} selectedDate={s1.selectedDate}
                variant={packageVariant} onVariantChange={setPackageVariant}
                onSelectTour={goToStep3} onBack={() => { setStep(1); scrollTop(); }}
              />
            </div>
          )}
          {step === 3 && (
            <div id="step3">
              <BookingStep2
                contact={contact} onContactChange={setContact} selectedTour={selectedTour}
                onBack={() => { setStep(2); scrollTop(); }} onContinue={goToStep4}
              />
            </div>
          )}
          {step === 4 && (
            <div id="step4">
              <BookingStep3
                isSubmitting={isSubmitting} error={submitError} selectedTour={selectedTour}
                onBack={() => { setStep(3); scrollTop(); }} onMakePayment={handleMakePayment}
              />
            </div>
          )}
          {step === 5 && <div id="step5"><BookingStep4 referenceCode={bookingRef} /></div>}
        </div>
      </main>

      {/* Summary sidebar panel */}
      {hasSummary && (
        <>
          {summaryOpen && (
            <div className="fixed inset-0 z-[var(--z-modal)] bg-black/30" onClick={() => setSummaryOpen(false)} />
          )}
          <div
            className="fixed right-0 top-0 z-[var(--z-modal-over)] flex h-full w-[300px] flex-col bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.15)] transition-transform duration-300 max-sm:w-[85vw]"
            style={{ transform: summaryOpen ? "translateX(0)" : "translateX(100%)" }}
          >
            <div className="flex items-center justify-between bg-brand-red px-5 py-4">
              <span className="font-semibold text-white">{t("yourSelection")}</span>
              <button onClick={() => setSummaryOpen(false)} className="flex size-7 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30" aria-label="Close">×</button>
            </div>
            <div className="flex flex-1 flex-col gap-4 p-5">
              <div className="rounded-xl bg-[#f8f9fa] p-4">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-gray">{tc("date")}</div>
                <div className="text-base font-semibold text-text-dark">
                  {s1.selectedDate ? s1.selectedDate.toLocaleDateString(localeTag, { weekday: "long", month: "long", day: "numeric" }) : "—"}
                </div>
              </div>
              <div className="rounded-xl bg-[#f8f9fa] p-4">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-gray">{tc("tickets")}</div>
                <div className="text-base font-semibold text-text-dark">{ticketSummary || tc("noneSelected")}</div>
              </div>
            </div>
            <div className="p-5">
              <button className="w-full rounded-lg bg-brand-red py-3 text-base font-semibold text-white transition-colors hover:bg-brand-dark-red" onClick={goToStep2}>
                {t("findAvailableTours")}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
