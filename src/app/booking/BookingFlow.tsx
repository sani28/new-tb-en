"use client";

import { useState } from "react";
import { bookingStep1Store } from "./step1/store";
import { bookingCartStore } from "./cart/store";
import { createBooking } from "@/lib/api/bookings";
import BookingStep1 from "./components/BookingStep1";
import BookingStep2, { type ContactInfo } from "./components/BookingStep2";
import BookingStep3 from "./components/BookingStep3";
import BookingStep4 from "./components/BookingStep4";
import BookingCartBar from "./components/BookingCartBar";
import BodyClass from "@/components/BodyClass";

export default function BookingFlow() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
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

  const scrollTop = () => window.scrollTo(0, 0);

  const goToStep2 = () => {
    const { adultCount, childCount, selectedDate } = bookingStep1Store.getSnapshot();
    if (adultCount === 0 && childCount === 0) {
      alert("Please select at least one ticket.");
      return;
    }
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }
    setStep(2);
    scrollTop();
  };

  const goToStep3 = () => {
    if (!contact.fullName.trim() || !contact.email.trim() || !contact.phone.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
    if (!contact.termsAgreed) {
      alert("Please agree to the Terms and Conditions.");
      return;
    }
    setStep(3);
    scrollTop();
  };

  const handleMakePayment = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const s1 = bookingStep1Store.getSnapshot();
    const pricing = bookingStep1Store.getPricing(s1.tourId);
    const cart = bookingCartStore.getSnapshot();

    const tickets = [
      ...(s1.adultCount > 0
        ? [{ kind: "adult" as const, quantity: s1.adultCount, unitPrice: pricing.adult.current }]
        : []),
      ...(s1.childCount > 0
        ? [{ kind: "child" as const, quantity: s1.childCount, unitPrice: pricing.child.current }]
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

    const dateStr = s1.selectedDate
      ? `${s1.selectedDate.getFullYear()}-${String(s1.selectedDate.getMonth() + 1).padStart(2, "0")}-${String(s1.selectedDate.getDate()).padStart(2, "0")}`
      : null;

    try {
      const response = await createBooking({
        tourId: s1.tourId,
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
      setStep(4);
      scrollTop();
    } catch {
      setSubmitError("Payment failed. Please try again or contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="booking-page-content">
      <BodyClass className="template-page booking-page" />
      <div className="booking-page-container">
        <div className="booking-page-header">
          <h1>Book Your Tour</h1>
        </div>

        {step === 1 && (
          <div className="booking-step-page active" id="step1">
            <BookingStep1 onContinue={goToStep2} />
          </div>
        )}

        {step === 2 && (
          <div className="booking-step-page active" id="step2">
            <BookingStep2
              contact={contact}
              onContactChange={setContact}
              onBack={() => { setStep(1); scrollTop(); }}
              onContinue={goToStep3}
            />
          </div>
        )}

        {step === 3 && (
          <div className="booking-step-page active" id="step3">
            <BookingStep3
              isSubmitting={isSubmitting}
              error={submitError}
              onBack={() => { setStep(2); scrollTop(); }}
              onMakePayment={handleMakePayment}
            />
          </div>
        )}

        {step === 4 && (
          <div className="booking-step-page active" id="step4">
            <BookingStep4 referenceCode={bookingRef} />
          </div>
        )}
      </div>

      {/* Cart bar floats at bottom on step 1 only */}
      {step === 1 && <BookingCartBar onContinue={goToStep2} />}
    </main>
  );
}
