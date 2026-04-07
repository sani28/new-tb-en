"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function MyBookingPage() {
  const router = useRouter();
  const t = useTranslations("MyBooking");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingPassword, setBookingPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    router.push("/user-account");
  }

  function handleCheckBooking(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <main className="mx-auto max-w-[1200px] px-5 py-10 min-h-[calc(100vh-600px)]">
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
        {/* Login Section */}
        <div className="rounded-xl bg-white p-6 shadow-md md:p-10">
          <h2 className="mb-6 text-xl font-semibold text-gray-800 md:mb-8 md:text-2xl">
            {t("login")}
          </h2>
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label htmlFor="email" className="mb-2 block font-medium text-gray-800">
                {t("email")}
              </label>
              <input
                type="email"
                id="email"
                placeholder={t("emailPlaceholder")}
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-3 text-base transition-colors focus:border-[#E20021] focus:outline-none"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="mb-2 block font-medium text-gray-800">
                {t("password")}
              </label>
              <input
                type="password"
                id="password"
                placeholder={t("passwordPlaceholder")}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-3 text-base transition-colors focus:border-[#E20021] focus:outline-none"
              />
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <a href="#" className="text-gray-500 transition-colors hover:text-[#E20021]">
                {t("forgotId")}
              </a>
              <a href="#" className="text-gray-500 transition-colors hover:text-[#E20021]">
                {t("forgotPassword")}
              </a>
            </div>
            <button
              type="submit"
              className="mt-6 w-full cursor-pointer rounded-full bg-[#E20021] py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#cc0000]"
            >
              {t("loginButton")}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-8 text-center">
            <div className="relative mb-5 text-sm text-gray-500 before:absolute before:left-0 before:top-1/2 before:h-px before:w-[40%] before:bg-gray-300 after:absolute after:right-0 after:top-1/2 after:h-px after:w-[40%] after:bg-gray-300">
              {t("orLoginWith")}
            </div>
            <div className="flex justify-center gap-4">
              <button className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-gray-300 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <Image src="/imgs/navericon.png" alt="Naver" width={24} height={24} className="object-contain" />
              </button>
              <button className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-gray-300 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <Image src="/imgs/googleicon.png" alt="Google" width={24} height={24} className="object-contain" />
              </button>
            </div>
          </div>
        </div>

        {/* Check Booking Section */}
        <div className="rounded-xl bg-[#E20021] p-6 text-white md:p-10">
          <h2 className="mb-6 text-xl font-semibold text-white md:mb-8 md:text-2xl">
            {t("checkBooking")}
          </h2>
          <form onSubmit={handleCheckBooking}>
            <div className="mb-5">
              <label className="mb-2 block font-medium text-white">{t("name")}</label>
              <input
                type="text"
                placeholder={t("namePlaceholder")}
                value={bookingName}
                onChange={(e) => setBookingName(e.target.value)}
                className="w-full rounded-md border-none bg-white px-3 py-3 text-base text-gray-800"
              />
            </div>
            <div className="mb-5">
              <label className="mb-2 block font-medium text-white">{t("phone")}</label>
              <input
                type="tel"
                placeholder={t("phonePlaceholder")}
                value={bookingPhone}
                onChange={(e) => setBookingPhone(e.target.value)}
                className="w-full rounded-md border-none bg-white px-3 py-3 text-base text-gray-800"
              />
            </div>
            <div className="mb-5">
              <label className="mb-2 block font-medium text-white">{t("password")}</label>
              <input
                type="password"
                placeholder={t("enterPassword")}
                value={bookingPassword}
                onChange={(e) => setBookingPassword(e.target.value)}
                className="w-full rounded-md border-none bg-white px-3 py-3 text-base text-gray-800"
              />
            </div>
            <button
              type="submit"
              className="mt-6 w-full cursor-pointer rounded-full bg-[#8B0000] py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#6B0000]"
            >
              {t("confirm")}
            </button>
            <div className="mt-4 text-xs leading-relaxed text-white">
              {t("loginNote")}
              <br />
              {t("contactNote")}{" "}
              <Link href="/contact-us" className="text-white underline">
                {t("contactUs")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
