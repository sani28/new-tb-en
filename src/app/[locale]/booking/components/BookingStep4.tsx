"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

type Props = {
  referenceCode: string | null;
};

export default function BookingStep4({ referenceCode }: Props) {
  const t = useTranslations("BookingStep5");
  const router = useRouter();

  return (
    <>
      <div className="flex items-center gap-3 border-b border-[#eee] px-6 py-5">
        <span className="flex size-8 items-center justify-center rounded-full bg-brand-red text-base font-semibold text-white">✓</span>
        <span className="text-lg font-semibold text-text-dark">{t("stepTitle")}</span>
      </div>
      <div className="p-6 max-md:p-4">
        <div className="px-5 py-10 text-center">
          <h2 className="mb-3 text-[28px] text-[#4CAF50]">{t("ticketReady")}</h2>
          <p className="text-base text-text-gray">{t("emailSent")}</p>
          {referenceCode && (
            <p className="mt-3 font-semibold text-text-dark">
              {t("reference")} <span className="text-brand-red">{referenceCode}</span>
            </p>
          )}
        </div>

        <div className="rounded-xl bg-[#f8f9fa] p-6">
          <h3 className="mb-3 text-lg font-semibold">{t("howToGetTicket")}</h3>
          <p>{t("visitTicketOffice")}</p>

          <div className="mt-6 flex justify-around">
            <div className="flex-1 text-center">
              <img src="imgs/1.svg" alt="" className="mx-auto mb-3 size-[60px]" />
              <p className="text-sm text-text-gray">{t("claimTicket")}</p>
            </div>
            <span className="h-0.5 w-10 self-center bg-[#ddd]" />
            <div className="flex-1 text-center">
              <img src="imgs/2.svg" alt="" className="mx-auto mb-3 size-[60px]" />
              <p className="text-sm text-text-gray">{t("printAtKiosk")}</p>
            </div>
            <span className="h-0.5 w-10 self-center bg-[#ddd]" />
            <div className="flex-1 text-center">
              <img src="imgs/3.svg" alt="" className="mx-auto mb-3 size-[60px]" />
              <p className="text-sm text-text-gray">{t("visitCounter")}</p>
            </div>
          </div>
        </div>

        <button className="mt-5 w-full rounded-lg bg-brand-red p-4 text-base font-semibold text-white transition-colors hover:bg-brand-dark-red" onClick={() => router.push("/")}>
          {t("backToHome")}
        </button>
      </div>
    </>
  );
}
