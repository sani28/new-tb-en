/* eslint-disable @next/next/no-img-element */
"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("Footer");
  const tNotif = useTranslations("NotificationBar");

  return (
    <footer className="bg-brand-cream pt-[60px] max-md:pt-10 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-10 grid grid-cols-[1fr_auto_1fr] gap-[60px] items-start max-md:grid-cols-1 max-md:gap-[30px] max-md:px-5 max-md:text-center">
        {/* Left Footer Section */}
        <div className="max-w-[460px] max-md:text-center max-md:mx-auto">
          <div className="mb-[30px] max-md:flex max-md:justify-center max-md:mb-5">
            <img
              src="/imgs/smalllogo.png"
              alt="Tiger Bus Logo"
              className="h-[50px] w-auto"
            />
          </div>
          <div className="text-[#666] text-sm leading-relaxed text-left max-md:text-center">
            <p>
              {t("address")}
              <br />
              {t("ceo")}
            </p>
            <p>{t("businessReg")}</p>
            <p>{t("telecomReg")}</p>
          </div>
        </div>

        {/* Middle Footer Section */}
        <div className="max-md:text-center">
          <ul className="list-none p-0 m-0 flex flex-col gap-5 max-md:items-center">
            <li>
              <Link
                href="/privacy-policy"
                className="text-brand-maroon text-xl font-sans-medium font-light max-md:text-lg max-md:leading-tight"
              >
                {t("privacyPolicy")}
              </Link>
            </li>
            <li>
              <Link
                href="/contact-us"
                className="text-brand-maroon text-xl font-sans-medium font-light max-md:text-lg max-md:leading-tight"
              >
                {t("contactUs")}
              </Link>
            </li>
            <li>
              <Link
                href="/about-us"
                className="text-brand-maroon text-xl font-sans-medium font-light max-md:text-lg max-md:leading-tight"
              >
                {t("aboutUs")}
              </Link>
            </li>
            <li>
              <Link
                href="/business-inquiry"
                className="text-brand-maroon text-xl font-sans-medium font-light max-md:text-lg max-md:leading-tight"
              >
                {t("businessInquiry")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Footer Section */}
        <div className="text-right ml-auto max-md:text-center max-md:order-3 max-md:mx-auto">
          <div className="flex gap-[15px] justify-end mb-[30px] max-md:justify-center max-md:my-[30px]">
            <a
              href="#"
              className="w-[45px] h-[45px] flex items-center justify-center max-md:w-10 max-md:h-10"
            >
              <img
                src="/imgs/footericon-1.png"
                alt="Instagram"
                className="w-full h-full object-contain"
              />
            </a>
            <a
              href="#"
              className="w-[45px] h-[45px] flex items-center justify-center max-md:w-10 max-md:h-10"
            >
              <img
                src="/imgs/footericon-2.png"
                alt="Visit Seoul"
                className="w-full h-full object-contain"
              />
            </a>
            <a
              href="#"
              className="w-[45px] h-[45px] flex items-center justify-center max-md:w-10 max-md:h-10"
            >
              <img
                src="/imgs/footericon-3.png"
                alt="Blog"
                className="w-full h-full object-contain"
              />
            </a>
          </div>
          <div className="text-right max-md:text-center">
            <p className="text-text-gray text-base mb-[5px] max-md:text-lg">
              {t("customerInquiries")}
            </p>
            <p className="text-[32px] text-text-dark font-semibold max-md:text-[32px]">
              {tNotif("phone")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-end max-w-[1400px] mx-auto mt-[40px] px-10 max-md:text-center max-md:p-5">
        <div className="flex-[0_0_50%] text-right ml-auto max-md:w-full max-md:mt-5 max-md:mx-auto">
          <img
            src="/imgs/footerimg.webp"
            alt="Seoul City Illustration"
            className="w-full max-w-[595px] h-auto block ml-auto max-md:mx-auto max-md:max-w-full"
          />
        </div>
      </div>
    </footer>
  );
}
