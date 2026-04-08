/* eslint-disable @next/next/no-img-element */
"use client";

import { useTranslations, useLocale } from "next-intl";
import { getAddonPrice, formatPrice } from "@/components/homepage/checkout/PromoCheckoutContext";

export type TicketCardProduct = {
  name: string;
  category: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string | null;
};

export type TicketCardProps = {
  id: string;
  product: TicketCardProduct;
  onBook: (id: string) => void;
  bgColor: string;
  compact?: boolean;
  children?: React.ReactNode;
};

export default function TicketCard({ id, product, onBook, bgColor, compact = false, children }: TicketCardProps) {
  const t = useTranslations("TicketCard");
  const locale = useLocale();
  const isKo = locale === "ko";

  // Use translated name/description/category
  // Keys are defined in messages/{locale}.json under TicketCard namespace
  const PRODUCT_KEYS = ["kwangjuyo", "sejong-backstage", "museum-pass", "han-river-cruise", "hanbok-rental"];
  const hasTranslation = PRODUCT_KEYS.includes(id);
  const productName = hasTranslation ? t(`${id}.name`) : product.name;
  const productDescription = hasTranslation ? t(`${id}.description`) : product.description;
  const CATEGORY_KEYS = ["products", "experiences", "services"];
  const productCategory = CATEGORY_KEYS.includes(product.category) ? t(product.category as "products" | "experiences" | "services") : product.category;

  const stubW = compact ? "w-[140px]" : "w-[200px]";
  const notchRight = compact ? "right-[140px]" : "right-[200px]";

  return (
    <div className="relative" style={{ fontFamily: "'SUIT-Bold', sans-serif" }}>
      {/* Notch cutouts */}
      <div className={`absolute -top-3 ${notchRight} max-md:hidden w-6 h-3 ${bgColor} rounded-b-full z-10`} />
      <div className={`absolute -bottom-3 ${notchRight} max-md:hidden w-6 h-3 ${bgColor} rounded-t-full z-10`} />

      <div className="flex bg-white overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.08)] max-md:flex-col" style={{ borderRadius: "4px" }}>
        {/* Left — image */}
        <div className={`${compact ? "w-[160px] self-stretch" : "w-[280px] h-[280px]"} max-md:w-full ${compact ? "max-md:h-[150px]" : "max-md:h-[200px]"} shrink-0 overflow-hidden relative`}>
          <img src={product.image ?? ""} alt={productName} className="size-full object-cover" />
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
            {productCategory}
          </div>
        </div>

        {/* Middle — details */}
        <div className={`flex-1 ${compact ? "p-4" : "p-6"} max-md:p-4 flex flex-col relative`}>
          <div className="absolute top-4 bottom-4 right-0 border-r-2 border-dashed border-black/10 max-md:hidden" />
          <div className={`${compact ? "text-[9px]" : "text-[10px]"} uppercase tracking-[0.15em] text-[#FF0000] font-bold mb-1`}>Seoul Tiger Bus</div>
          <h4 className={`${compact ? (isKo ? "text-[15px]" : "text-[13px]") : (isKo ? "text-[20px] ko-scale-ipad-lg" : "text-[18px]")} font-bold text-black mb-1`}>{productName}</h4>
          <div className="w-8 h-0.5 bg-[#FF0000] mb-2" />
          <p className={`${compact ? (isKo ? "text-[12px]" : "text-[10px]") : (isKo ? "text-[13px]" : "text-[11px]")} font-bold uppercase tracking-wide text-black/40 mb-1`}>{t("includes")}</p>
          <p className={`${compact ? (isKo ? "text-[13px] mb-2" : "text-[11px] mb-2") : (isKo ? "text-[14px] mb-4" : "text-[12px] mb-4")} text-black/60 leading-[1.6] flex-1`}>{productDescription}</p>
          {children}
        </div>

        {/* Right — pricing stub */}
        <div className={`${stubW} max-md:w-full shrink-0 ${compact ? "p-3" : "p-5"} max-md:p-4 flex flex-col items-center justify-center text-center bg-[#FAFAFA]`}>
          <div className={`${compact ? "text-[9px]" : "text-[10px]"} uppercase tracking-[0.15em] text-black/40 font-bold mb-2`}>{t("ticketPrice")}</div>
          <div className={`${compact ? "text-[16px]" : "text-[24px]"} font-bold text-black leading-none mb-0.5 ko-scale-ipad-2xl`}>{formatPrice(getAddonPrice(id, "price", product.price, locale), locale)}</div>
          {product.originalPrice > product.price && (
            <div className="text-[13px] text-black/30 line-through mb-1">{formatPrice(getAddonPrice(id, "originalPrice", product.originalPrice, locale), locale)}</div>
          )}
          {product.originalPrice > product.price && (
            <div className="text-[11px] font-bold text-[#FF0000] mb-4">
              {t("save", { percent: Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) })}
            </div>
          )}
          <button
            type="button"
            className={`w-full flex items-center justify-center gap-2 bg-[#FF0000] py-3 ${isKo ? "text-[13px] ko-scale-ipad-btn" : "text-[12px]"} font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#E00000]`}
            style={{ borderRadius: "2px" }}
            onClick={() => onBook(id)}
          >
            {t("bookNow")}
          </button>
          <div className="flex justify-center items-stretch mt-auto pt-4 opacity-15 h-[30px]">
            {"110101110100110111010011101001110110100111010110010111011010011101011001".split("").map((bit, i) => (
              <div key={i} className={bit === "1" ? "bg-black" : "bg-transparent"} style={{ width: bit === "1" ? (i % 7 === 0 ? "3px" : i % 3 === 0 ? "2px" : "1.5px") : (i % 5 === 0 ? "3px" : "1.5px"), height: "100%" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
