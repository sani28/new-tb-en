"use client";

import { useEffect, useState } from "react";
import { NODE_COLORS, formatUsd, formatKrw, getTagColor } from "../_lib/colors";
import { t, tName, tTitle, tBadge, tLabel, tTag, tTypeName, tHighlights, type Lang } from "../_lib/i18n";
import { TOUR_NAMES } from "@/components/homepage/checkout/PromoCheckoutContext";
import type { ProductNode, Currency } from "../_lib/types";

interface Props {
  node: ProductNode;
  onClose: () => void;
  onEdit: (nodeId: string, field: string, value: unknown) => void;
  onResetField: (nodeId: string, field: string) => void;
  onDelete?: (nodeId: string) => void;
  hasOverride: (id: string) => boolean;
  currency: Currency;
  lang: Lang;
}

// ── Price editable field (static USD/KRW) ──

function PriceField({
  label,
  usdValue,
  krwValue,
  usdField,
  krwField,
  nodeId,
  currency,
  onEdit,
}: {
  label: string;
  usdValue: number | undefined;
  krwValue: number | undefined;
  usdField: string;
  krwField: string;
  nodeId: string;
  currency: Currency;
  onEdit: (nodeId: string, field: string, value: unknown) => void;
}) {
  const [editing, setEditing] = useState(false);
  const currentValue = currency === "KRW" ? krwValue : usdValue;
  const [draft, setDraft] = useState(String(currentValue ?? ""));

  const commit = () => {
    setEditing(false);
    const num = Number(draft);
    if (isNaN(num)) return;
    const field = currency === "KRW" ? krwField : usdField;
    if (num !== currentValue) onEdit(nodeId, field, num);
  };

  const symbol = currency === "KRW" ? "₩" : "$";
  const formatted = currentValue != null
    ? currency === "KRW" ? formatKrw(currentValue) : formatUsd(currentValue)
    : null;

  return (
    <div className="flex items-center justify-between py-2 border-b border-[#f0f0f0] gap-3">
      <span className="text-xs font-medium text-[#666] uppercase tracking-wider whitespace-nowrap min-w-[100px]">
        {label}
      </span>
      <div className="flex-1 text-right">
        {editing ? (
          <div className="inline-flex items-center gap-1">
            <span className="text-xs text-[#999]">{symbol}</span>
            <input
              autoFocus
              type="number"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") setEditing(false);
              }}
              className="w-[120px] px-2 py-1 border border-[#ddd] rounded text-sm outline-none focus:border-[#E31E24] text-right"
            />
          </div>
        ) : (
          <span
            onClick={() => { setDraft(String(currentValue ?? "")); setEditing(true); }}
            className="text-sm text-[#333] cursor-pointer hover:bg-[#f5f5f5] rounded px-1 py-0.5 inline-flex items-center gap-1 group"
          >
            {formatted ?? <span className="text-[#ccc]">—</span>}
            <i className="fas fa-pen text-[9px] text-[#ccc] group-hover:text-[#E31E24] transition-colors" />
          </span>
        )}
      </div>
    </div>
  );
}

// ── Inline editable field ──

function EditableField({
  label,
  value,
  field,
  nodeId,
  type = "text",
  onEdit,
}: {
  label: string;
  value: unknown;
  field: string;
  nodeId: string;
  type?: "text" | "number" | "textarea" | "boolean";
  onEdit: (nodeId: string, field: string, value: unknown) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value ?? ""));

  const commit = () => {
    setEditing(false);
    const parsed = type === "number" ? Number(draft) : draft;
    if (parsed !== value) onEdit(nodeId, field, parsed);
  };

  if (type === "boolean") {
    return (
      <div className="flex items-center justify-between py-2 border-b border-[#f0f0f0]">
        <span className="text-xs font-medium text-[#666] uppercase tracking-wider">{label}</span>
        <button
          onClick={() => onEdit(nodeId, field, !value)}
          className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer border-none transition-colors ${
            value
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {value ? "Yes" : "No"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between py-2 border-b border-[#f0f0f0] gap-3">
      <span className="text-xs font-medium text-[#666] uppercase tracking-wider whitespace-nowrap pt-1 min-w-[100px]">
        {label}
      </span>
      <div className="flex-1 text-right">
        {editing ? (
          type === "textarea" ? (
            <textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => { if (e.key === "Escape") setEditing(false); }}
              className="w-full px-2 py-1 border border-[#ddd] rounded text-sm outline-none focus:border-[#E31E24] resize-y min-h-[60px]"
            />
          ) : (
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
              className="w-full max-w-[200px] px-2 py-1 border border-[#ddd] rounded text-sm outline-none focus:border-[#E31E24] text-right"
            />
          )
        ) : (
          <span
            onClick={() => { setDraft(String(value ?? "")); setEditing(true); }}
            className="text-sm text-[#333] cursor-pointer hover:bg-[#f5f5f5] rounded px-1 py-0.5 inline-flex items-center gap-1 group"
          >
            {value != null && String(value) !== "" ? String(value) : <span className="text-[#ccc]">—</span>}
            <i className="fas fa-pen text-[9px] text-[#ccc] group-hover:text-[#E31E24] transition-colors" />
          </span>
        )}
      </div>
    </div>
  );
}

// ── Section wrapper ──

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="text-sm font-semibold text-[#333] mb-2 flex items-center gap-2">
        <i className={`fas ${icon} text-brand-red text-xs`} /> {title}
      </h3>
      <div className="bg-[#fafafa] rounded-lg p-4 border border-[#eee]">{children}</div>
    </div>
  );
}

// ── Read-only list display ──

function ListDisplay({ label, items }: { label: string; items: { id?: string; name: string; [k: string]: unknown }[] | null }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="py-2 border-b border-[#f0f0f0]">
      <span className="text-xs font-medium text-[#666] uppercase tracking-wider block mb-1.5">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <span key={item.id ?? i} className="inline-block px-2 py-1 rounded-lg text-xs bg-white border border-[#ddd] text-[#444]">
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main Modal ──

export default function ProductDetailModal({ node, onClose, onEdit, onResetField, onDelete, hasOverride, currency, lang }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const colors = node.kind === "tour"
    ? NODE_COLORS.tour
    : node.kind === "exclusive"
      ? NODE_COLORS.exclusive
      : node.kind === "product"
        ? NODE_COLORS.product
        : node.type ? NODE_COLORS[node.type] : NODE_COLORS.tour;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[var(--z-backdrop)]" onClick={onClose} />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-[30px] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] z-[var(--z-modal)] w-[95%] max-w-[800px] max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Close button */}
        <button
          className="absolute top-5 right-5 bg-transparent border-none text-2xl cursor-pointer text-[#666] leading-none hover:text-[#E31E24]"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 mb-6 pr-8">
          <div className="flex flex-wrap gap-1 mt-1">
            {node.tags.length > 0 ? (
              node.tags.map((tag) => {
                const tc = getTagColor(tag);
                return (
                  <span key={tag} className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ background: tc.bg, color: tc.text, border: `1.5px solid ${tc.border}` }}>
                    {tTag(tag, lang)}
                  </span>
                );
              })
            ) : (
              <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold uppercase" style={{ background: colors.bg, color: colors.text, border: `1.5px solid ${colors.border}` }}>
                {node.kind === "tour"
                  ? (tLabel(node.id, lang) ?? node.meta.label as string ?? "Tour")
                  : node.kind === "exclusive"
                    ? (tBadge(node.id, lang) ?? node.meta.badge as string ?? "Exclusive")
                    : node.kind === "product"
                      ? t("legend.product", lang)
                      : node.kind}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#111] m-0">{tName(node.id, lang) ?? node.name}</h2>
            {node.category && <p className="text-xs text-[#888] mt-0.5 m-0">{node.category}</p>}
            {hasOverride(node.id) && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                Modified — unsaved changes
              </span>
            )}
          </div>
        </div>

        {/* ── Classification ── */}
        <Section title="Classification" icon="fa-layer-group">
          <div className="py-2 border-b border-[#f0f0f0]">
            <span className="text-xs font-medium text-[#666] uppercase tracking-wider block mb-1.5">Product Type</span>
            <div className="flex flex-wrap gap-1.5">
              {(["tour", "exclusive", "addon", "product"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => onEdit(node.id, "kind", k)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
                    node.kind === k
                      ? "bg-[#111] text-white border-[#111]"
                      : "bg-white text-[#666] border-[#ddd] hover:border-[#999]"
                  }`}
                >
                  {k.charAt(0).toUpperCase() + k.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {(node.kind === "addon" || node.kind === "product") && (
            <div className="py-2 border-b border-[#f0f0f0]">
              <span className="text-xs font-medium text-[#666] uppercase tracking-wider block mb-1.5">Addon Type</span>
              <div className="flex flex-wrap gap-1.5">
                {(["physical", "scheduled", "validityPass", "cruise"] as const).map((at) => (
                  <button
                    key={at}
                    type="button"
                    onClick={() => onEdit(node.id, "type", at)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
                      node.type === at
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-[#666] border-[#ddd] hover:border-[#999]"
                    }`}
                  >
                    {tTypeName(at, lang)}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="py-2 border-b border-[#f0f0f0]">
            <span className="text-xs font-medium text-[#666] uppercase tracking-wider block mb-1.5">Compatible Tours</span>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(TOUR_NAMES).map((tourId) => {
                const active = node.compatibleTours?.includes(tourId) ?? false;
                const isUniversal = node.compatibleTours === null;
                return (
                  <button
                    key={tourId}
                    type="button"
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                      active || isUniversal
                        ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                        : "bg-[#f5f5f5] text-[#bbb] border-[#e5e5e5] hover:bg-[#eee] hover:text-[#666]"
                    }`}
                    onClick={() => {
                      if (isUniversal) {
                        // Switch from universal to specific — start with just this tour
                        onEdit(node.id, "compatibleTours", [tourId]);
                      } else if (active) {
                        const next = (node.compatibleTours ?? []).filter((t) => t !== tourId);
                        onEdit(node.id, "compatibleTours", next.length > 0 ? next : null);
                      } else {
                        onEdit(node.id, "compatibleTours", [...(node.compatibleTours ?? []), tourId]);
                      }
                    }}
                  >
                    {tourId} {(active || isUniversal) ? "✓" : ""}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(node.id, "compatibleTours", null)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                  node.compatibleTours === null
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-white text-[#666] border-[#ddd] hover:border-emerald-300"
                }`}
              >
                <i className="fas fa-globe mr-1" /> Universal (all tours)
              </button>
            </div>
          </div>
          <EditableField label="Tour Optional" value={node.tourOptional} field="tourOptional" nodeId={node.id} type="boolean" onEdit={onEdit} />
        </Section>

        {/* ── Delete ── */}
        {onDelete && (
          <div className="mt-4 pt-4 border-t border-[#eee]">
            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 cursor-pointer transition-colors"
              onClick={() => {
                if (confirm(`Delete "${node.name}"? This cannot be undone.`)) {
                  onDelete(node.id);
                  onClose();
                }
              }}
            >
              <i className="fas fa-trash-alt mr-2" /> Delete This Product
            </button>
          </div>
        )}

        {/* ── Tour Content ── */}
        {node.kind === "tour" && (
          <>
            <Section title={`Pricing (${currency})`} icon="fa-tag">
              <PriceField label="Adult Price" usdValue={node.pricing.adultPrice} krwValue={node.pricing.adultPriceKrw} usdField="adultPrice" krwField="adultPriceKrw" nodeId={node.id} currency={currency} onEdit={onEdit} />
              <PriceField label="Child Price" usdValue={node.pricing.childPrice} krwValue={node.pricing.childPriceKrw} usdField="childPrice" krwField="childPriceKrw" nodeId={node.id} currency={currency} onEdit={onEdit} />
              <PriceField label="Adult Original" usdValue={node.pricing.adultOrig} krwValue={node.pricing.adultOrigKrw} usdField="adultOrig" krwField="adultOrigKrw" nodeId={node.id} currency={currency} onEdit={onEdit} />
              <PriceField label="Child Original" usdValue={node.pricing.childOrig} krwValue={node.pricing.childOrigKrw} usdField="childOrig" krwField="childOrigKrw" nodeId={node.id} currency={currency} onEdit={onEdit} />
            </Section>
            <Section title="Display" icon="fa-image">
              <EditableField label="Label" value={node.meta.label} field="label" nodeId={node.id} onEdit={onEdit} />
              <EditableField label="Title" value={node.meta.title} field="title" nodeId={node.id} onEdit={onEdit} />
              <EditableField label="Label Color" value={node.meta.labelColor} field="labelColor" nodeId={node.id} onEdit={onEdit} />
              <EditableField label="Popular" value={node.meta.isPopular} field="isPopular" nodeId={node.id} type="boolean" onEdit={onEdit} />
            </Section>
          </>
        )}

        {/* ── Exclusive Content ── */}
        {node.kind === "exclusive" && (
          <>
            <Section title="Overview" icon="fa-star">
              <EditableField label="Tagline" value={node.meta.tagline} field="tagline" nodeId={node.id} onEdit={onEdit} />
              <EditableField label="Base Route" value={node.meta.baseRoute} field="baseRoute" nodeId={node.id} onEdit={onEdit} />
              <EditableField label="Badge" value={node.meta.badge} field="badge" nodeId={node.id} onEdit={onEdit} />
            </Section>
            <Section title={`Pricing (${currency})`} icon="fa-tag">
              <PriceField label="Adult Price" usdValue={node.pricing.adultPrice} krwValue={node.pricing.adultPriceKrw} usdField="adultPrice" krwField="adultPriceKrw" nodeId={node.id} currency={currency} onEdit={onEdit} />
              <PriceField label="Child Price" usdValue={node.pricing.childPrice} krwValue={node.pricing.childPriceKrw} usdField="childPrice" krwField="childPriceKrw" nodeId={node.id} currency={currency} onEdit={onEdit} />
            </Section>
            {Array.isArray(node.meta.highlights) && (node.meta.highlights as string[]).length > 0 && (
              <Section title={t("detail.highlights", lang)} icon="fa-list-check">
                <div className="flex flex-wrap gap-1.5">
                  {(tHighlights(node.id, lang) ?? node.meta.highlights as string[]).map((h, i) => (
                    <span key={i} className="inline-block px-2.5 py-1 rounded-lg text-xs bg-orange-50 text-orange-700 border border-orange-200">
                      {h}
                    </span>
                  ))}
                </div>
              </Section>
            )}
          </>
        )}

        {/* ── Addon Content ── */}
        {node.kind === "addon" && (
          <>
            <Section title="Description" icon="fa-align-left">
              <EditableField label="Description" value={node.meta.description} field="description" nodeId={node.id} type="textarea" onEdit={onEdit} />
            </Section>

            <Section title={`Pricing (${currency})`} icon="fa-tag">
              <PriceField label="Price" usdValue={node.pricing.price} krwValue={node.pricing.priceKrw} usdField="price" krwField="priceKrw" nodeId={node.id} currency={currency} onEdit={onEdit} />
              <PriceField label="Original Price" usdValue={node.pricing.originalPrice} krwValue={node.pricing.originalPriceKrw} usdField="originalPrice" krwField="originalPriceKrw" nodeId={node.id} currency={currency} onEdit={onEdit} />
              {node.pricing.adultPrice != null && (
                <PriceField label="Adult Price" usdValue={node.pricing.adultPrice} krwValue={node.pricing.adultPriceKrw} usdField="adultPrice" krwField="adultPriceKrw" nodeId={node.id} currency={currency} onEdit={onEdit} />
              )}
              {node.pricing.childPrice != null && (
                <PriceField label="Child Price" usdValue={node.pricing.childPrice} krwValue={node.pricing.childPriceKrw} usdField="childPrice" krwField="childPriceKrw" nodeId={node.id} currency={currency} onEdit={onEdit} />
              )}
            </Section>

            <Section title="Tour Compatibility" icon="fa-route">
              <div className="py-2 border-b border-[#f0f0f0]">
                <span className="text-xs font-medium text-[#666] uppercase tracking-wider block mb-1.5">Compatible Tours</span>
                {node.compatibleTours ? (
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(TOUR_NAMES).map((tourId) => {
                      const active = node.compatibleTours!.includes(tourId);
                      return (
                        <span
                          key={tourId}
                          className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium border ${
                            active
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-[#f5f5f5] text-[#bbb] border-[#e5e5e5] line-through"
                          }`}
                        >
                          {tourId}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <i className="fas fa-globe mr-1" /> Universal — all tours
                  </span>
                )}
              </div>
              <EditableField label="Tour Optional" value={node.tourOptional} field="tourOptional" nodeId={node.id} type="boolean" onEdit={onEdit} />
            </Section>

            {/* Type-specific sections */}
            {node.type === "physical" && (
              <Section title="Product Options" icon="fa-palette">
                <ListDisplay label="Variants" items={node.meta.variants as { id: string; name: string }[] | null} />
                <ListDisplay label="Colors" items={node.meta.colors as { name: string }[] | null} />
              </Section>
            )}

            {node.type === "scheduled" && (node.meta.operationHours != null || node.meta.availableTimes != null) && (
              <Section title="Schedule" icon="fa-clock">
                {node.meta.operationHours != null && (
                  <EditableField label="Operation Hours" value={node.meta.operationHours} field="operationHours" nodeId={node.id} onEdit={onEdit} />
                )}
              </Section>
            )}

            {node.type === "validityPass" && (
              <Section title="Validity" icon="fa-calendar-check">
                <EditableField label="Valid Until" value={node.meta.validUntil} field="validUntil" nodeId={node.id} onEdit={onEdit} />
              </Section>
            )}

            {node.type === "cruise" && (
              <>
                <Section title={`Experience Types (${currency})`} icon="fa-ship">
                  {(node.meta.cruiseTypes as { id: string; name: string; adultPrice: number; childPrice: number }[] | null)?.map((ct) => (
                    <div key={ct.id} className="flex items-center justify-between py-2 border-b border-[#f0f0f0] last:border-b-0">
                      <span className="text-sm font-medium text-[#333]">{ct.name}</span>
                      <span className="text-xs text-[#666]">{formatUsd(ct.adultPrice)} / {formatUsd(ct.childPrice)}</span>
                    </div>
                  ))}
                </Section>
                <Section title="Time Slots" icon="fa-clock">
                  <ListDisplay
                    label="Slots"
                    items={(node.meta.timeSlots as { id: string; label: string }[] | null)?.map((s) => ({ ...s, name: s.label })) ?? null}
                  />
                </Section>
              </>
            )}

          </>
        )}

        {/* ── Product Content ── */}
        {node.kind === "product" && (
          <>
            <Section title="Description" icon="fa-align-left">
              <EditableField label="Description" value={node.meta.description} field="description" nodeId={node.id} type="textarea" onEdit={onEdit} />
            </Section>

            <Section title={`Pricing (${currency})`} icon="fa-tag">
              <PriceField label="Price" usdValue={node.pricing.price} krwValue={node.pricing.priceKrw} usdField="price" krwField="priceKrw" nodeId={node.id} currency={currency} onEdit={onEdit} />
              <PriceField label="Original Price" usdValue={node.pricing.originalPrice} krwValue={node.pricing.originalPriceKrw} usdField="originalPrice" krwField="originalPriceKrw" nodeId={node.id} currency={currency} onEdit={onEdit} />
            </Section>

            <Section title="Custom Fields" icon="fa-sliders">
              {Object.entries(node.meta)
                .filter(([key]) => key !== "description")
                .map(([key, value]) => (
                  <EditableField
                    key={key}
                    label={key}
                    value={value}
                    field={key}
                    nodeId={node.id}
                    onEdit={onEdit}
                  />
                ))}
              {Object.keys(node.meta).filter((k) => k !== "description").length === 0 && (
                <p className="text-xs text-[#bbb] py-2">No custom fields yet. Add fields by editing this product in the table view.</p>
              )}
            </Section>
          </>
        )}

      </div>
    </>
  );
}
