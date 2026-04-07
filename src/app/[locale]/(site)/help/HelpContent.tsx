"use client";

import { useState } from "react";

/* ── FAQ Data ─────────────────────────────────────────────────────────────── */

const faqItems = [
  {
    id: 1,
    question: "Where do I take on the bus?",
    answer: "You can board the bus at our main departure point at Gwanghwamun (Donghwa Duty Free Building in front). Please arrive at least 10 minutes before your scheduled departure time.",
  },
  {
    id: 2,
    question: "Can I get on again after getting off?",
    answer: "Yes! With a valid hop-on hop-off ticket, you can get off at any designated stop to explore the area and board the next available bus to continue your tour.",
  },
  {
    id: 3,
    question: "Are bus seats designated?",
    answer: "No, seats are not designated. Seating is available on a first-come, first-served basis. We recommend arriving early to secure your preferred seat.",
  },
  {
    id: 4,
    question:
      "The Downtown Palace Namsan Course includes the Blue House, if I purchase a ticket for your service, is it available to get in and tour the Blue House?",
    answer: "The bus passes by the Blue House area as part of the route, but entry to the Blue House requires a separate reservation through the official Blue House website. Our tour ticket does not include admission.",
  },
  {
    id: 5,
    question: "What type of bus is running?",
    answer: "We operate open-top double-decker buses that provide panoramic views of Seoul's landmarks. The upper deck is open-air while the lower deck is enclosed and air-conditioned.",
  },
  {
    id: 6,
    question: "Do you operate even on rainy days?",
    answer: "Yes, we operate rain or shine. On rainy days, rain ponchos are available on the bus. In case of severe weather conditions (typhoons, heavy snow), services may be temporarily suspended for passenger safety.",
  },
  {
    id: 7,
    question:
      "What time does a bus for the Downtown Palace Namsan Course depart?",
    answer: "The Downtown Palace Namsan Course departs regularly throughout the day starting from 9:00 AM. Please check the Tours page for the detailed timetable and schedule.",
  },
  {
    id: 8,
    question: "How long does the Downtown Palace Namsan Course?",
    answer: "The full Downtown Palace Namsan Course loop takes approximately 2 hours without getting off. If you choose to hop on and off at various stops, you can enjoy the tour at your own pace throughout the day.",
  },
  {
    id: 9,
    question: "Is there a minimum number of people to depart?",
    answer: "No, there is no minimum number of passengers required for departure. Buses depart according to the published schedule regardless of passenger count.",
  },
  {
    id: 10,
    question: "When does the night view course depart?",
    answer: "The Night View Course departs in the evening. Departure times vary by season. Please check the Tours page for current schedules and seasonal hours.",
  },
  {
    id: 11,
    question: "Is it possible to make a reservation on the very day?",
    answer: "Yes, same-day reservations are available subject to seat availability. You can book online or purchase tickets directly at our Gwanghwamun ticket office. We recommend booking in advance during peak seasons.",
  },
  {
    id: 12,
    question: "What are the Cancellation / Refund rules?",
    answer: "Cancellations made at least 24 hours before departure are eligible for a full refund. Cancellations within 24 hours may be subject to a cancellation fee. No-shows are not eligible for refunds. Please visit My Booking to manage your reservation.",
  },
  {
    id: 13,
    question: "Is it possible to board with a pet?",
    answer: "Small pets in carriers are allowed on the lower deck of the bus. For the comfort and safety of all passengers, pets must remain in their carrier at all times during the tour. Service animals are welcome without a carrier.",
  },
];

/* ── Component ────────────────────────────────────────────────────────────── */

export default function HelpContent() {
  const [activeTab, setActiveTab] = useState<"faq" | "contact">("faq");
  const [openId, setOpenId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: "", content: "" });

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate with backend API
    alert("Your inquiry has been submitted. We will get back to you soon.");
    setFormData({ title: "", content: "" });
  };

  return (
    <>
      {/* Tab navigation */}
      <div className="flex justify-center gap-5 mb-10 border-b border-[#ddd] max-md:mb-6">
        <TabButton
          label="FAQ"
          active={activeTab === "faq"}
          onClick={() => setActiveTab("faq")}
        />
        <TabButton
          label="Contact Us"
          active={activeTab === "contact"}
          onClick={() => setActiveTab("contact")}
        />
      </div>

      {/* ── FAQ Tab ─────────────────────────────────────────────────────── */}
      {activeTab === "faq" && (
        <div>
          <div className="text-center mb-8 max-md:mb-6">
            <h1 className="text-[32px] font-bold text-[#333] mb-3 max-md:text-[24px]">
              Frequently Asked Questions
            </h1>
            <p className="text-[16px] text-[#666] leading-[1.6] max-w-[700px] mx-auto max-md:text-[14px]">
              We have collected frequently asked questions (FAQs) for our
              customers.
              <br />
              Please read the FAQ first and then register your inquiry via
              &lsquo;Contact Us&rsquo; if you have any further questions.
            </p>
          </div>

          <div className="max-w-[800px] mx-auto flex flex-col gap-3">
            {faqItems.map((item) => (
              <FaqAccordion
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onToggle={() => toggleFaq(item.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Contact Us Tab ──────────────────────────────────────────────── */}
      {activeTab === "contact" && (
        <div>
          <div className="text-center mb-8 max-md:mb-6">
            <h2 className="text-[28px] font-bold text-[#333] mb-3 max-md:text-[22px]">
              Welcome to Seoul City Tour Bus Contact Center
            </h2>
            <p className="text-[16px] text-[#666] leading-[1.6] max-w-[700px] mx-auto max-md:text-[14px]">
              We&rsquo;re here to help with any questions or concerns you may
              have about our tour services. Please fill out the form below and
              we&rsquo;ll get back to you as soon as possible.
            </p>
          </div>

          <div className="max-w-[800px] mx-auto bg-[#f8f8f8] rounded-xl p-6 mb-8 text-center text-[15px] text-[#666] max-md:text-[13px] max-md:p-4">
            For business-related inquiries, please visit our{" "}
            <a
              href="/business-inquiry"
              className="text-[#E20021] font-medium no-underline hover:underline"
            >
              Business Inquiry
            </a>{" "}
            page.
          </div>

          <form
            className="max-w-[800px] mx-auto text-left"
            onSubmit={handleSubmit}
          >
            <div className="mb-6">
              <label
                htmlFor="inquiry-title"
                className="block mb-2 font-medium text-[#333] text-[16px] max-md:text-[14px]"
              >
                Title
              </label>
              <input
                type="text"
                id="inquiry-title"
                placeholder="Enter a title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full p-3 border border-[#ddd] rounded-lg text-[16px] transition-colors focus:border-[#E20021] focus:outline-none max-md:text-[14px]"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="inquiry-content"
                className="block mb-2 font-medium text-[#333] text-[16px] max-md:text-[14px]"
              >
                Content
              </label>
              <textarea
                id="inquiry-content"
                placeholder={`For reservation-related inquiries, please fill in the information below\n\nReservation number:\nName:\nMobile:\n\nInquiry:`}
                required
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                className="w-full p-3 border border-[#ddd] rounded-lg text-[16px] min-h-[200px] resize-y transition-colors focus:border-[#E20021] focus:outline-none max-md:text-[14px]"
              />
            </div>

            <div className="flex justify-center gap-5 mt-10 max-md:mt-6">
              <button
                type="submit"
                className="px-10 py-3 bg-[#e4002b] text-white border-none rounded-lg text-[16px] font-medium cursor-pointer transition-colors hover:bg-[#cc0000] max-md:text-[14px] max-md:px-8"
              >
                Save
              </button>
              <button
                type="button"
                className="px-10 py-3 bg-[#666] text-white border-none rounded-lg text-[16px] font-medium cursor-pointer transition-colors hover:bg-[#555] max-md:text-[14px] max-md:px-8"
                onClick={() => setFormData({ title: "", content: "" })}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

/* ── Sub-components ───────────────────────────────────────────────────────── */

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={
        "px-5 py-[10px] text-[18px] font-medium cursor-pointer border-none bg-transparent border-b-[3px] transition-all max-md:text-[15px] max-md:px-3 " +
        (active
          ? "text-[#e4002b] border-b-[3px] border-b-[#e4002b]"
          : "text-[#666] border-b-[3px] border-b-transparent")
      }
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function FaqAccordion({
  item,
  isOpen,
  onToggle,
}: {
  item: { id: number; question: string; answer: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={
        "rounded-xl overflow-hidden transition-all duration-300 " +
        (isOpen
          ? "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
          : "bg-[#f8f8f8]")
      }
    >
      <button
        type="button"
        className="w-full flex items-center gap-4 p-5 bg-transparent border-none cursor-pointer text-left max-md:p-4 max-md:gap-3"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        {/* Question mark icon */}
        <span className="w-8 h-8 rounded-full bg-[#E20021] text-white flex items-center justify-center text-[14px] font-bold shrink-0 max-md:w-7 max-md:h-7 max-md:text-[12px]">
          ?
        </span>

        <span className="flex-1 text-[16px] font-medium text-[#333] max-md:text-[14px]">
          {item.question}
        </span>

        <i
          className={
            "fas fa-chevron-down text-[#999] text-[14px] shrink-0 transition-transform duration-300 " +
            (isOpen ? "rotate-180" : "")
          }
        />
      </button>

      <div
        className={
          "grid transition-all duration-300 " +
          (isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")
        }
      >
        <div className="overflow-hidden">
          <p className="text-[15px] text-[#666] leading-[1.7] px-5 pb-5 pt-0 m-0 ml-12 max-md:text-[13px] max-md:px-4 max-md:pb-4 max-md:ml-10">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}
