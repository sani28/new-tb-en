"use client";

import { useState, useMemo } from "react";
import { NODE_COLORS, formatUsd, formatKrw, getTagColor, typeDisplayName } from "../_lib/colors";
import { t, tName, tTag, tTypeName, type Lang } from "../_lib/i18n";
import { TOUR_NAMES } from "@/components/homepage/checkout/PromoCheckoutContext";
import type { ProductNode, ProductTreeData, Currency } from "../_lib/types";

interface Props {
  data: ProductTreeData;
  getNode: (id: string) => ProductNode | undefined;
  onSelectNode: (id: string) => void;
  onEdit: (nodeId: string, field: string, value: unknown) => void;
  onAddNode: (kind: ProductNode["kind"], name: string, fields?: Record<string, unknown>) => string;
  onRemoveNode: (nodeId: string) => void;
  hasOverride: (id: string) => boolean;
  currency: Currency;
  lang: Lang;
}

type SortField = "name" | "type" | "pricing" | "tours";
type SortDir = "asc" | "desc";

function pricingLabel(node: ProductNode, currency: Currency): string {
  const p = node.pricing;
  if (currency === "KRW") {
    if (p.adultPriceKrw != null && p.childPriceKrw != null) return `${formatKrw(p.adultPriceKrw)} / ${formatKrw(p.childPriceKrw)}`;
    if (p.priceKrw != null) return formatKrw(p.priceKrw);
  }
  if (p.adultPrice != null && p.childPrice != null) return `${formatUsd(p.adultPrice)} / ${formatUsd(p.childPrice)}`;
  if (p.price != null) return formatUsd(p.price);
  return "—";
}

function getTypeColor(node: ProductNode) {
  if (node.kind === "tour") return NODE_COLORS.tour;
  if (node.kind === "exclusive") return NODE_COLORS.exclusive;
  if (node.kind === "product") return NODE_COLORS.product;
  return node.type ? NODE_COLORS[node.type] : NODE_COLORS.tour;
}

// ── Inline editable cell ──

function InlineEdit({
  value,
  onCommit,
  type = "text",
  className = "",
}: {
  value: string;
  onCommit: (v: string) => void;
  type?: "text" | "number" | "textarea";
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = () => {
    setEditing(false);
    if (draft !== value) onCommit(draft);
  };

  if (editing) {
    if (type === "textarea") {
      return (
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === "Escape") setEditing(false); }}
          className={`w-full px-2 py-1 border border-[#ddd] rounded text-sm outline-none focus:border-[#E31E24] resize-y min-h-[60px] ${className}`}
        />
      );
    }
    return (
      <input
        autoFocus
        type={type}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") setEditing(false);
        }}
        className={`px-2 py-1 border border-[#ddd] rounded text-sm outline-none focus:border-[#E31E24] ${className}`}
      />
    );
  }

  return (
    <span
      onClick={(e) => { e.stopPropagation(); setDraft(value); setEditing(true); }}
      className="cursor-pointer hover:bg-[#f0f0f0] rounded px-1 py-0.5 inline-flex items-center gap-1 group transition-colors"
    >
      {value || <span className="text-[#ccc]">—</span>}
      <i className="fas fa-pen text-[8px] text-[#ccc] group-hover:text-[#E31E24] transition-colors" />
    </span>
  );
}

// ── Expanded row editor ──

function ExpandedRow({
  node,
  currency,
  colSpan,
  onEdit,
}: {
  node: ProductNode;
  currency: Currency;
  colSpan: number;
  onEdit: (nodeId: string, field: string, value: unknown) => void;
}) {
  const editField = (field: string, type: "string" | "number" = "string") => (v: string) => {
    onEdit(node.id, field, type === "number" ? Number(v) : v);
  };

  const p = node.pricing;

  return (
    <tr className="bg-[#fafafa]">
      <td colSpan={colSpan} className="px-4 py-4">
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 max-md:grid-cols-1">
          {/* Left: Core fields */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-[#888] uppercase tracking-wider m-0 mb-1">
              <i className="fas fa-sliders text-[10px] mr-1" /> Product Settings
            </h4>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#888] w-[90px] shrink-0">Name</span>
              <InlineEdit value={node.name} onCommit={editField("name")} className="flex-1" />
            </div>

            {node.meta.tagline != null && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#888] w-[90px] shrink-0">Tagline</span>
                <InlineEdit value={String(node.meta.tagline ?? "")} onCommit={editField("tagline")} className="flex-1" />
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#888] w-[90px] shrink-0">Status</span>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(node.id, "active", !node.active); }}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium cursor-pointer border-none transition-colors ${
                  node.active ? "bg-emerald-100 text-emerald-700" : "bg-[#eee] text-[#999]"
                }`}
              >
                {node.active ? "Active" : "Inactive"}
              </button>
            </div>

            {node.meta.isPopular != null && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#888] w-[90px] shrink-0">Popular</span>
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(node.id, "isPopular", !node.meta.isPopular); }}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium cursor-pointer border-none transition-colors ${
                    node.meta.isPopular ? "bg-amber-100 text-amber-700" : "bg-[#eee] text-[#999]"
                  }`}
                >
                  {node.meta.isPopular ? "Yes" : "No"}
                </button>
              </div>
            )}

            {node.meta.baseRoute != null && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#888] w-[90px] shrink-0">Base Route</span>
                <InlineEdit value={String(node.meta.baseRoute ?? "")} onCommit={editField("baseRoute")} className="flex-1" />
              </div>
            )}

          </div>

          {/* Right: Pricing */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-[#888] uppercase tracking-wider m-0 mb-1">
              <i className="fas fa-tag text-[10px] mr-1" /> Pricing ({currency})
            </h4>

            {p.adultPrice != null && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#888] w-[90px] shrink-0">Adult</span>
                {currency === "KRW" ? (
                  <InlineEdit value={String(p.adultPriceKrw ?? "")} onCommit={editField("adultPriceKrw", "number")} type="number" className="w-[100px]" />
                ) : (
                  <InlineEdit value={String(p.adultPrice)} onCommit={editField("adultPrice", "number")} type="number" className="w-[100px]" />
                )}
              </div>
            )}
            {p.childPrice != null && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#888] w-[90px] shrink-0">Child</span>
                {currency === "KRW" ? (
                  <InlineEdit value={String(p.childPriceKrw ?? "")} onCommit={editField("childPriceKrw", "number")} type="number" className="w-[100px]" />
                ) : (
                  <InlineEdit value={String(p.childPrice)} onCommit={editField("childPrice", "number")} type="number" className="w-[100px]" />
                )}
              </div>
            )}
            {p.price != null && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#888] w-[90px] shrink-0">Price</span>
                {currency === "KRW" ? (
                  <InlineEdit value={String(p.priceKrw ?? "")} onCommit={editField("priceKrw", "number")} type="number" className="w-[100px]" />
                ) : (
                  <InlineEdit value={String(p.price)} onCommit={editField("price", "number")} type="number" className="w-[100px]" />
                )}
              </div>
            )}
            {p.originalPrice != null && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#888] w-[90px] shrink-0">Original</span>
                {currency === "KRW" ? (
                  <InlineEdit value={String(p.originalPriceKrw ?? "")} onCommit={editField("originalPriceKrw", "number")} type="number" className="w-[100px]" />
                ) : (
                  <InlineEdit value={String(p.originalPrice)} onCommit={editField("originalPrice", "number")} type="number" className="w-[100px]" />
                )}
              </div>
            )}

            {node.meta.operationHours != null && (
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-[#888] w-[90px] shrink-0">Hours</span>
                <InlineEdit value={String(node.meta.operationHours)} onCommit={editField("operationHours")} className="flex-1" />
              </div>
            )}

            {node.meta.validUntil != null && (
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-[#888] w-[90px] shrink-0">Valid Until</span>
                <InlineEdit value={String(node.meta.validUntil)} onCommit={editField("validUntil")} className="flex-1" />
              </div>
            )}
          </div>
        </div>

        {/* Description — full width below */}
        <div className="mt-4 pt-3 border-t border-[#e5e5e5]">
          <h4 className="text-xs font-semibold text-[#888] uppercase tracking-wider m-0 mb-2">
            <i className="fas fa-align-left text-[10px] mr-1" /> Description
          </h4>
          <InlineEdit
            value={String(node.meta.description ?? "")}
            onCommit={editField("description")}
            type="textarea"
            className="w-full text-sm text-[#444]"
          />
        </div>

        {/* Highlights (exclusives) */}
        {Array.isArray(node.meta.highlights) && (node.meta.highlights as string[]).length > 0 && (
          <div className="mt-3 pt-3 border-t border-[#e5e5e5]">
            <h4 className="text-xs font-semibold text-[#888] uppercase tracking-wider m-0 mb-2">
              <i className="fas fa-list-check text-[10px] mr-1" /> Highlights
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(node.meta.highlights as string[]).map((h, i) => (
                <span key={i} className="inline-block px-2.5 py-1 rounded-lg text-xs bg-orange-50 text-orange-700 border border-orange-200">
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}

// ── Section Table ──

function SectionTable({
  title,
  icon,
  color,
  nodes,
  currency,
  filter,
  showToursCol,
  showTourReqCol,
  onEdit,
  hasOverride,
  lang,
}: {
  title: string;
  icon: string;
  color: { bg: string; border: string; text: string };
  nodes: ProductNode[];
  currency: Currency;
  filter: string;
  showToursCol: boolean;
  showTourReqCol: boolean;
  onEdit: (nodeId: string, field: string, value: unknown) => void;
  hasOverride: (id: string) => boolean;
  lang: Lang;
}) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = nodes;
    if (filter.trim()) {
      const q = filter.toLowerCase();
      result = result.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          (n.type ?? "").toLowerCase().includes(q) ||
          (n.category ?? "").toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "name": cmp = a.name.localeCompare(b.name); break;
        case "type": cmp = (a.type ?? "").localeCompare(b.type ?? ""); break;
        case "pricing": cmp = (a.pricing.price ?? a.pricing.adultPrice ?? 0) - (b.pricing.price ?? b.pricing.adultPrice ?? 0); break;
        case "tours": break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [nodes, filter, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const sortIcon = (field: SortField) => {
    if (sortField !== field) return <i className="fas fa-sort text-[#ccc] ml-1 text-[10px]" />;
    return sortDir === "asc"
      ? <i className="fas fa-sort-up text-[#E31E24] ml-1 text-[10px]" />
      : <i className="fas fa-sort-down text-[#E31E24] ml-1 text-[10px]" />;
  };

  const colCount = 4 + (showToursCol ? 1 : 0) + (showTourReqCol ? 1 : 0);

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-2.5 mb-3">
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: color.bg, border: `1.5px solid ${color.border}` }}
        >
          <i className={`fas ${icon} text-xs`} style={{ color: color.text }} />
        </span>
        <div>
          <h3 className="text-sm font-bold text-[#222] m-0">{title}</h3>
          <p className="text-[11px] text-[#999] m-0">{nodes.length} {nodes.length === 1 ? "product" : "products"}</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-[#e5e5e5]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#fafafa]">
              <th onClick={() => toggleSort("name")} className="text-left px-4 py-2.5 text-xs font-semibold text-[#666] uppercase tracking-wider cursor-pointer select-none hover:text-[#333] whitespace-nowrap">
                {t("col.name", lang)} {sortIcon("name")}
              </th>
              <th onClick={() => toggleSort("type")} className="text-left px-4 py-2.5 text-xs font-semibold text-[#666] uppercase tracking-wider cursor-pointer select-none hover:text-[#333] whitespace-nowrap">
                {t("col.type", lang)} {sortIcon("type")}
              </th>
              <th className="text-left px-4 py-2.5 whitespace-nowrap">
                <span onClick={() => toggleSort("pricing")} className="text-xs font-semibold text-[#666] uppercase tracking-wider cursor-pointer select-none hover:text-[#333]">
                  {t("col.pricing", lang)} ({currency}) {sortIcon("pricing")}
                </span>
              </th>
              {showToursCol && (
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#666] uppercase tracking-wider whitespace-nowrap">
                  {t("col.compatibleTours", lang)}
                </th>
              )}
              {showTourReqCol && (
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#666] uppercase tracking-wider">{t("col.tourReq", lang)}</th>
              )}
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#666] uppercase tracking-wider">{t("col.status", lang)}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((node) => {
              const colors = getTypeColor(node);
              const modified = hasOverride(node.id);
              const isExpanded = expandedId === node.id;
              return (
                <SectionRow
                  key={node.id}
                  node={node}
                  colors={colors}
                  modified={modified}
                  isExpanded={isExpanded}
                  currency={currency}
                  colSpan={colCount}
                  showToursCol={showToursCol}
                  showTourReqCol={showTourReqCol}
                  lang={lang}
                  onToggle={() => setExpandedId(isExpanded ? null : node.id)}
                  onEdit={onEdit}
                />
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={colCount} className="px-4 py-8 text-center text-[#bbb] text-sm">
                  {t("table.noResults", lang)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Table Row + Expand ──

function SectionRow({
  node,
  colors,
  modified,
  isExpanded,
  currency,
  colSpan,
  showToursCol,
  showTourReqCol,
  lang,
  onToggle,
  onEdit,
}: {
  node: ProductNode;
  colors: { bg: string; border: string; text: string };
  modified: boolean;
  isExpanded: boolean;
  currency: Currency;
  colSpan: number;
  showToursCol: boolean;
  showTourReqCol: boolean;
  lang: Lang;
  onToggle: () => void;
  onEdit: (nodeId: string, field: string, value: unknown) => void;
}) {
  return (
    <>
      <tr
        onClick={onToggle}
        className={`border-t border-[#eee] cursor-pointer transition-colors hover:bg-[#f8f8f8] ${modified ? "border-l-[3px] border-l-amber-400" : ""} ${!node.active ? "opacity-50" : ""} ${isExpanded ? "bg-[#f8f8f8]" : ""}`}
      >
        <td className="px-4 py-3 font-medium text-[#222]">
          <i className={`fas fa-chevron-${isExpanded ? "down" : "right"} text-[9px] text-[#bbb] mr-2`} />
          {tName(node.id, lang) ?? node.name}
          {modified && <i className="fas fa-pen text-amber-500 ml-2 text-[10px]" />}
        </td>
        <td className="px-4 py-3">
          {node.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {node.tags.map((tag) => {
                const tc = getTagColor(tag);
                return (
                  <span key={tag} className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}>
                    {tTag(tag, lang)}
                  </span>
                );
              })}
            </div>
          ) : node.type ? (
            <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ background: colors.bg, color: colors.text }}>
              {tTypeName(typeDisplayName(node.type), lang)}
            </span>
          ) : (
            <span className="text-[#ccc]">—</span>
          )}
        </td>
        <td className="px-4 py-3 text-[#444] whitespace-nowrap">{pricingLabel(node, currency)}</td>
        {showToursCol && (
          <td className="px-4 py-3 text-[#444] max-w-[250px]">
            {!node.compatibleTours ? (
              <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                {t("status.universal", lang)}
              </span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {node.compatibleTours.map((t) => (
                  <span key={t} className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-[#f0f0f0] text-[#555]">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </td>
        )}
        {showTourReqCol && (
          <td className="px-4 py-3 text-[#444]">
            {node.tourOptional ? (
              <span className="text-emerald-600 text-xs">{t("status.optional", lang)}</span>
            ) : (
              <span className="text-rose-600 text-xs">{t("status.required", lang)}</span>
            )}
          </td>
        )}
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1">
            {!node.active && (
              <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#f5f5f5] text-[#999] border border-[#ddd]">
                {t("status.inactive", lang)}
              </span>
            )}
            {node.active && !modified && (
              <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                {t("status.active", lang)}
              </span>
            )}
            {modified && (
              <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                {t("status.modified", lang)}
              </span>
            )}
          </div>
        </td>
      </tr>
      {isExpanded && (
        <ExpandedRow node={node} currency={currency} colSpan={colSpan} onEdit={onEdit} />
      )}
    </>
  );
}

// ── Add Item Button ──

function AddItemButton({
  kind,
  onAdd,
  lang,
}: {
  kind: ProductNode["kind"];
  onAdd: (kind: ProductNode["kind"], name: string) => void;
  lang: Lang;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(kind, trimmed);
    setName("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#666] border border-dashed border-[#ccc] rounded-lg hover:border-[#E31E24] hover:text-[#E31E24] transition-colors cursor-pointer bg-transparent"
      >
        <i className="fas fa-plus text-[10px]" /> {t("addItem.button", lang)}
      </button>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      <input
        autoFocus
        type="text"
        placeholder={t("addItem.placeholder", lang)}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") { setOpen(false); setName(""); }
        }}
        className="px-3 py-1.5 border border-[#ddd] rounded-lg text-sm outline-none focus:border-[#E31E24] flex-1 max-w-[300px]"
      />
      <button
        onClick={submit}
        disabled={!name.trim()}
        className="px-3 py-1.5 bg-[#E31E24] text-white text-xs font-medium rounded-lg border-none cursor-pointer hover:bg-[#c01] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {t("addItem.add", lang)}
      </button>
      <button
        onClick={() => { setOpen(false); setName(""); }}
        className="px-2 py-1.5 text-xs text-[#999] hover:text-[#333] cursor-pointer bg-transparent border-none"
      >
        {t("addItem.cancel", lang)}
      </button>
    </div>
  );
}

// ── Main View ──

export default function TableView({ data, getNode, onSelectNode, onEdit, onAddNode, onRemoveNode, hasOverride, currency, lang }: Props) {
  const [filter, setFilter] = useState("");

  const tourNodes = useMemo(() => data.tours.map((t) => getNode(t.id) ?? t), [data, getNode]);
  const exclusiveNodes = useMemo(() => data.exclusives.map((e) => getNode(e.id) ?? e), [data, getNode]);
  const addonNodes = useMemo(() => data.addons.map((a) => getNode(a.id) ?? a), [data, getNode]);
  const productNodes = useMemo(() => data.products.map((p) => getNode(p.id) ?? p), [data, getNode]);

  const total = tourNodes.length + exclusiveNodes.length + addonNodes.length + productNodes.length;

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-[400px]">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa] text-sm" />
          <input
            type="text"
            placeholder={t("table.searchPlaceholder", lang)}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-[#ddd] rounded-lg text-sm outline-none focus:border-[#E31E24] transition-colors"
          />
        </div>
      </div>

      {/* Tours */}
      <SectionTable
        title={t("table.classicTours", lang)}
        icon="fa-bus"
        color={NODE_COLORS.tour}
        nodes={tourNodes}
        currency={currency}
        filter={filter}
        showToursCol={false}
        showTourReqCol={false}
        onEdit={onEdit}
        hasOverride={hasOverride}
        lang={lang}
      />
      <AddItemButton kind="tour" onAdd={onAddNode} lang={lang} />

      <div className="my-8 border-t border-[#eee]" />

      {/* Exclusive Tours */}
      <SectionTable
        title={t("table.exclusiveTours", lang)}
        icon="fa-star"
        color={NODE_COLORS.exclusive}
        nodes={exclusiveNodes}
        currency={currency}
        filter={filter}
        showToursCol={false}
        showTourReqCol={false}
        onEdit={onEdit}
        hasOverride={hasOverride}
        lang={lang}
      />
      <AddItemButton kind="exclusive" onAdd={onAddNode} lang={lang} />

      <div className="my-8 border-t border-[#eee]" />

      {/* Add-ons */}
      <SectionTable
        title={t("table.addons", lang)}
        icon="fa-puzzle-piece"
        color={{ bg: "#DBEAFE", border: "#3B82F6", text: "#1E40AF" }}
        nodes={addonNodes}
        currency={currency}
        filter={filter}
        showToursCol={true}
        showTourReqCol={true}
        onEdit={onEdit}
        hasOverride={hasOverride}
        lang={lang}
      />
      <AddItemButton kind="addon" onAdd={onAddNode} lang={lang} />

      <div className="my-8 border-t border-[#eee]" />

      {/* Products */}
      <SectionTable
        title={t("table.products", lang)}
        icon="fa-box"
        color={NODE_COLORS.product}
        nodes={productNodes}
        currency={currency}
        filter={filter}
        showToursCol={false}
        showTourReqCol={false}
        onEdit={onEdit}
        hasOverride={hasOverride}
        lang={lang}
      />
      <AddItemButton kind="product" onAdd={onAddNode} lang={lang} />

      <p className="text-xs text-[#aaa] mt-5">{total} {t("table.totalProducts", lang)}</p>
    </div>
  );
}
