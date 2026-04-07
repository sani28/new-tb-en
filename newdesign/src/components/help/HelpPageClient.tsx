"use client";

import { useState } from "react";
import BodyClass from "@/components/BodyClass";

type TabId = "faq" | "contact";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const TABS: { id: TabId; label: string }[] = [
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact Us" },
];

// Static data — replace with API call when backend endpoint is ready
const FAQ_ITEMS: FaqItem[] = [
  { id: 1, question: "Where do I take on the bus?", answer: "Answer content goes here" },
  { id: 2, question: "Can I get on again after getting off?", answer: "Answer content goes here" },
  { id: 3, question: "Are bus seats designated?", answer: "Answer content goes here" },
  { id: 4, question: "The Downtown Palace Namsan Course includes the Blue House, if I purchase a ticket for your service, is it available to get in and tour the Blue House?", answer: "Answer content goes here" },
  { id: 5, question: "What type of bus is running?", answer: "Answer content goes here" },
  { id: 6, question: "Do you operate even on rainy days?", answer: "Answer content goes here" },
  { id: 7, question: "What time does a bus for the Downtown Palace Namsan Course depart?", answer: "Answer content goes here" },
  { id: 8, question: "How long does the Downtown Palace Namsan Course?", answer: "Answer content goes here" },
  { id: 9, question: "Is there a minimum number of people to depart?", answer: "Answer content goes here" },
  { id: 10, question: "When does the night view course depart?", answer: "Answer content goes here" },
  { id: 11, question: "Is it possible to make a reservation on the very day?", answer: "Answer content goes here" },
  { id: 12, question: "What are the Cancellation / Refund rules?", answer: "Answer content goes here" },
  { id: 13, question: "Is it possible to board with a pet?", answer: "Answer content goes here" },
];

export default function HelpPageClient() {
  const [activeTab, setActiveTab] = useState<TabId>("faq");
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function toggleFaq(id: number) {
    setOpenFaqId(openFaqId === id ? null : id);
  }

  function handleSave() {
    // TODO: Submit to API when backend endpoint is ready
    console.log("Submitting inquiry:", { title, content });
  }

  function handleCancel() {
    setTitle("");
    setContent("");
  }

  return (
    <main className="px-10 pb-[60px] mb-[60px] max-md:px-5 max-md:pt-[80px] max-md:pb-10 max-md:mb-10">
      <BodyClass className="template-page" />
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-10 mx-auto max-w-[1400px] min-h-[500px] mt-[80px] max-md:p-5 max-md:rounded-lg">
        {/* Banner */}
        <div className="relative rounded-xl px-[30px] py-[30px] mb-10 overflow-hidden h-[150px] max-md:h-[100px] max-md:px-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/imgs/banner-inquire.png"
            alt="Help & Inquiries Banner"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        </div>

        {/* Tab navigation */}
        <div className="w-full mb-[30px]">
          <div className="flex justify-center gap-[30px] border-b border-[#ddd] pb-2.5 max-md:gap-5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`bg-transparent border-none py-2.5 px-5 text-2xl font-medium cursor-pointer relative transition-colors max-md:text-xl ${
                  activeTab === tab.id
                    ? "text-[#E20021]"
                    : "text-[#666] hover:text-[#E20021]"
                }`}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                {tab.label}
                <span
                  className={`absolute bottom-[-11px] left-0 w-full h-[3px] bg-[#E20021] transition-transform origin-left ${
                    activeTab === tab.id ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Content */}
        {activeTab === "faq" && (
          <div className="max-w-[1000px] mx-auto">
            <h2 className="text-2xl font-semibold text-[#333] text-center mb-2 max-md:text-xl">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-[#666] text-center mb-10 leading-relaxed max-md:text-sm">
              We have collected frequently asked questions (FAQs) for our customers.
              <br />
              Please read the FAQ first and then register your inquiry via &apos;Contact Us&apos; if you have any further questions.
            </p>

            <div className="flex flex-col gap-3">
              {FAQ_ITEMS.map((item) => {
                const isOpen = openFaqId === item.id;
                return (
                  <div key={item.id} className="border border-[#eee] rounded-lg overflow-hidden">
                    <button
                      type="button"
                      className="w-full flex items-center gap-4 p-5 bg-white border-none cursor-pointer text-left transition-colors hover:bg-[#FAFAFA] max-md:p-4 max-md:gap-3"
                      onClick={() => toggleFaq(item.id)}
                    >
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E20021] text-white flex items-center justify-center font-bold text-sm max-md:w-7 max-md:h-7 max-md:text-xs">
                        ?
                      </span>
                      <span className="flex-1 text-base font-medium text-[#333] max-md:text-sm">
                        {item.question}
                      </span>
                      <i
                        className={`fas fa-chevron-down text-[#999] text-sm transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? "max-h-[500px]" : "max-h-0"
                      }`}
                    >
                      <div className="px-5 pb-5 pt-0 pl-[68px] text-base text-[#666] leading-relaxed max-md:pl-5 max-md:text-sm">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Contact Us Content */}
        {activeTab === "contact" && (
          <div className="max-w-[800px] mx-auto text-left">
            {/* TODO: Add auth check when auth migration is complete */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-[#333] mb-2 max-md:text-xl">
                Welcome to Seoul City Tour Bus Contact Center
              </h2>
              <p className="text-base text-[#666] leading-relaxed max-md:text-sm">
                We&apos;re here to help with any questions or concerns you may have about our tour services. Please fill out the form below and we&apos;ll get back to you as soon as possible.
              </p>
            </div>

            <div className="bg-[#F8F8F8] rounded-lg p-5 mb-8 text-base text-[#666] max-md:text-sm">
              For business-related inquiries, please visit our{" "}
              <a href="/business-inquiry" className="text-[#E20021] underline hover:no-underline">
                Business Inquiry
              </a>{" "}
              page.
            </div>

            <div className="mt-10">
              <div className="mb-6">
                <label htmlFor="inquiry-title" className="block mb-2.5 font-medium text-[#333]">
                  Title
                </label>
                <input
                  type="text"
                  id="inquiry-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title"
                  className="w-full p-3 border border-[#ddd] rounded-lg text-base transition-colors focus:border-[#E20021] focus:outline-none"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="inquiry-content" className="block mb-2.5 font-medium text-[#333]">
                  Content
                </label>
                <textarea
                  id="inquiry-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`For reservation-related inquiries, please fill in the information below\n\nReservation number:\nName:\nMobile:\n\nInquiry:`}
                  className="w-full p-3 border border-[#ddd] rounded-lg text-base min-h-[200px] resize-y transition-colors focus:border-[#E20021] focus:outline-none"
                />
              </div>

              <div className="flex justify-center gap-5 mt-10">
                <button
                  type="button"
                  onClick={handleSave}
                  className="py-3 px-10 border-none rounded-lg text-base font-medium cursor-pointer bg-[#E20021] text-white transition-opacity hover:opacity-90"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="py-3 px-10 border-none rounded-lg text-base font-medium cursor-pointer bg-[#666] text-white transition-opacity hover:opacity-90"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
