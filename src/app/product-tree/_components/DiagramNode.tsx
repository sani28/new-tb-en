"use client";

import { NODE_COLORS, formatUsd, formatKrw, getTagColor } from "../_lib/colors";
import { t, tName, tTitle, tTag, tLabel, tBadge, type Lang } from "../_lib/i18n";
import type { ProductNode, Currency } from "../_lib/types";

interface Props {
  node: ProductNode;
  x: number;
  y: number;
  width: number;
  height: number;
  highlighted: boolean;
  dimmed: boolean;
  modified: boolean;
  currency: Currency;
  lang: Lang;
  onClick: () => void;
  onHover: (hovering: boolean) => void;
}

function getColors(node: ProductNode) {
  if (node.kind === "tour") return NODE_COLORS.tour;
  if (node.kind === "exclusive") return NODE_COLORS.exclusive;
  if (node.kind === "product") return NODE_COLORS.product;
  return node.type ? NODE_COLORS[node.type] : NODE_COLORS.tour;
}

function priceLine(node: ProductNode, currency: Currency): string {
  const p = node.pricing;
  if (currency === "KRW") {
    if (p.adultPriceKrw != null && p.childPriceKrw != null) return `${formatKrw(p.adultPriceKrw)} / ${formatKrw(p.childPriceKrw)}`;
    if (p.priceKrw != null) return formatKrw(p.priceKrw);
  }
  if (p.adultPrice != null && p.childPrice != null) return `${formatUsd(p.adultPrice)} / ${formatUsd(p.childPrice)}`;
  if (p.price != null) return formatUsd(p.price);
  return "";
}

export default function DiagramNode({ node, x, y, width, height, highlighted, dimmed, modified, currency, lang, onClick, onHover }: Props) {
  const colors = getColors(node);

  return (
    <foreignObject x={x} y={y} width={width} height={height}>
      <div
        onClick={onClick}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        style={{
          background: colors.bg,
          borderColor: highlighted ? colors.border : `${colors.border}88`,
          color: colors.text,
          opacity: dimmed ? 0.35 : !node.active ? 0.45 : 1,
          borderWidth: modified ? 2 : 1.5,
          borderStyle: modified ? "dashed" : "solid",
        }}
        className="w-full h-full rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-center hover:shadow-lg relative select-none"
      >
        {/* Type badge(s) */}
        {node.tags.length > 0 ? (
          <div className="flex flex-wrap gap-0.5 justify-center mb-0.5">
            {node.tags.map((tag) => {
              const tc = getTagColor(tag);
              return (
                <span key={tag} className="text-[7px] font-bold uppercase tracking-wider rounded-full px-1 py-0.5 leading-none" style={{ background: tc.border, color: "#fff" }}>
                  {tTag(tag, lang)}
                </span>
              );
            })}
          </div>
        ) : (
          <span
            className="text-[9px] font-bold uppercase tracking-wider rounded-full px-1.5 py-0.5 mb-1"
            style={{ background: colors.border, color: "#fff" }}
          >
            {node.kind === "tour"
              ? (tLabel(node.id, lang) ?? node.meta.label as string ?? "Tour")
              : node.kind === "exclusive"
                ? (tBadge(node.id, lang) ?? node.meta.badge as string ?? "Exclusive")
                : node.kind === "product"
                  ? t("legend.product", lang)
                  : node.kind}
          </span>
        )}

        {/* Name */}
        <span className="text-[11px] font-semibold leading-tight line-clamp-2">
          {node.kind === "tour"
            ? (tTitle(node.id, lang) ?? node.meta.title as string ?? tName(node.id, lang) ?? node.name)
            : (tName(node.id, lang) ?? node.name)}
        </span>

        {/* Price */}
        {priceLine(node, currency) && (
          <span className="text-[10px] mt-0.5 opacity-80">{priceLine(node, currency)}</span>
        )}

        {/* Universal badge for addons */}
        {node.kind === "addon" && !node.compatibleTours && (
          <span className="text-[8px] mt-0.5 opacity-60">
            <i className="fas fa-globe text-[7px] mr-0.5" /> {t("status.universal", lang)}
          </span>
        )}

        {/* Inactive badge */}
        {!node.active && (
          <span className="text-[7px] mt-0.5 font-bold uppercase tracking-wider text-[#999] bg-[#eee] rounded-full px-1.5 py-0.5">
            {t("status.inactive", lang)}
          </span>
        )}

        {/* Modified indicator */}
        {modified && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border border-white" />
        )}
      </div>
    </foreignObject>
  );
}
