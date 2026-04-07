"use client";

import { useState, useMemo } from "react";
import { NODE_COLORS, TAG_COLORS } from "../_lib/colors";
import { t, type Lang } from "../_lib/i18n";
import type { ProductTreeData, Currency } from "../_lib/types";
import DiagramNode from "./DiagramNode";
import DiagramEdge from "./DiagramEdge";

interface Props {
  data: ProductTreeData;
  onSelectNode: (id: string) => void;
  hasOverride: (id: string) => boolean;
  currency: Currency;
  lang: Lang;
}

// Layout constants
const SVG_W = 1200;
const NODE_W = 180;
const NODE_H = 90;
const TOUR_Y = 40;
const EXCLUSIVE_Y = 200;
const ADDON_Y = 400;
const PRODUCT_Y = 560;

function distributeX(count: number, containerW: number, nodeW: number): number[] {
  if (count === 0) return [];
  const totalW = count * nodeW;
  const gap = count > 1 ? (containerW - totalW) / (count + 1) : (containerW - nodeW) / 2;
  return Array.from({ length: count }, (_, i) => gap + i * (nodeW + gap));
}

export default function DiagramView({ data, onSelectNode, hasOverride, currency, lang }: Props) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const hasExclusives = data.exclusives.length > 0;
  const hasProducts = data.products.length > 0;
  const addonY = hasExclusives ? ADDON_Y : EXCLUSIVE_Y; // collapse if no exclusives
  const productY = hasProducts ? addonY + 160 : addonY;
  const svgH = (hasProducts ? productY : addonY) + NODE_H + 60;

  // Positions
  const tourXs = useMemo(() => distributeX(data.tours.length, SVG_W, NODE_W), [data.tours.length]);
  const exclusiveXs = useMemo(() => distributeX(data.exclusives.length, SVG_W, NODE_W), [data.exclusives.length]);
  const addonXs = useMemo(() => distributeX(data.addons.length, SVG_W, NODE_W), [data.addons.length]);
  const productXs = useMemo(() => distributeX(data.products.length, SVG_W, NODE_W), [data.products.length]);

  const tourPositions = useMemo(
    () => Object.fromEntries(data.tours.map((t, i) => [t.id, { x: tourXs[i], y: TOUR_Y }])),
    [data.tours, tourXs],
  );
  const exclusivePositions = useMemo(
    () => Object.fromEntries(data.exclusives.map((e, i) => [e.id, { x: exclusiveXs[i], y: EXCLUSIVE_Y }])),
    [data.exclusives, exclusiveXs],
  );
  const addonPositions = useMemo(
    () => Object.fromEntries(data.addons.map((a, i) => [a.id, { x: addonXs[i], y: addonY }])),
    [data.addons, addonXs, addonY],
  );
  const productPositions = useMemo(
    () => Object.fromEntries(data.products.map((p, i) => [p.id, { x: productXs[i], y: productY }])),
    [data.products, productXs, productY],
  );

  // Combine all node positions for edge lookups
  const allPositions = useMemo(
    () => ({ ...tourPositions, ...exclusivePositions, ...addonPositions, ...productPositions }),
    [tourPositions, exclusivePositions, addonPositions, productPositions],
  );

  // Connected node IDs for hover highlight
  const connectedToHovered = useMemo(() => {
    if (!hoveredNodeId) return new Set<string>();
    const ids = new Set<string>();
    ids.add(hoveredNodeId);
    for (const edge of data.edges) {
      if (edge.from === hoveredNodeId || edge.to === hoveredNodeId) {
        ids.add(edge.from);
        ids.add(edge.to);
      }
    }
    return ids;
  }, [hoveredNodeId, data.edges]);

  const connectedEdges = useMemo(() => {
    if (!hoveredNodeId) return new Set<number>();
    const idxs = new Set<number>();
    data.edges.forEach((edge, i) => {
      if (edge.from === hoveredNodeId || edge.to === hoveredNodeId) idxs.add(i);
    });
    return idxs;
  }, [hoveredNodeId, data.edges]);

  // Figure out addon type for edge coloring
  const getEdgeAddonType = (toId: string) => {
    const addon = data.addons.find((a) => a.id === toId);
    if (addon?.type) return addon.type;
    const excl = data.exclusives.find((e) => e.id === toId);
    if (excl) return undefined; // will use "exclusive" color via edge component
    return undefined;
  };

  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 text-[11px] text-[#666]">
        {/* Node kinds */}
        {(["tour", "exclusive", "product"] as const).map((key) => (
          <span key={key} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: NODE_COLORS[key].bg, border: `1.5px solid ${NODE_COLORS[key].border}` }} />
            {t(`legend.${key}` as const, lang)}
          </span>
        ))}
        {/* Tag types */}
        {Object.entries(TAG_COLORS).map(([tag, c]) => (
          <span key={tag} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: c.bg, border: `1.5px solid ${c.border}` }} />
            {tag}
          </span>
        ))}
        <span className="flex items-center gap-1.5 ml-3">
          <span className="inline-block w-6 border-t-[2px] border-[#666]" /> {t("legend.required", lang)}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-6 border-t-[2px] border-dashed border-[#666]" /> {t("legend.optional", lang)}
        </span>
      </div>

      {/* SVG Diagram */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${SVG_W} ${svgH}`}
          className="w-full max-w-full"
          style={{ minWidth: 700 }}
        >
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#999" />
            </marker>
          </defs>

          {/* Tier labels */}
          <text x="16" y={TOUR_Y + NODE_H / 2} fontSize="11" fill="#bbb" fontWeight="600" dominantBaseline="middle">
            {t("tier.tours", lang)}
          </text>
          {hasExclusives && (
            <text x="16" y={EXCLUSIVE_Y + NODE_H / 2} fontSize="11" fill="#bbb" fontWeight="600" dominantBaseline="middle">
              {t("tier.exclusive", lang)}
            </text>
          )}
          <text x="16" y={addonY + NODE_H / 2} fontSize="11" fill="#bbb" fontWeight="600" dominantBaseline="middle">
            {t("tier.addons", lang)}
          </text>
          {hasProducts && (
            <text x="16" y={productY + NODE_H / 2} fontSize="11" fill="#bbb" fontWeight="600" dominantBaseline="middle">
              {t("tier.products", lang)}
            </text>
          )}

          {/* Edges */}
          {data.edges.map((edge, i) => {
            const fromPos = allPositions[edge.from];
            const toPos = allPositions[edge.to];
            if (!fromPos || !toPos) return null;
            return (
              <DiagramEdge
                key={`${edge.from}-${edge.to}`}
                fromX={fromPos.x + NODE_W / 2}
                fromY={fromPos.y + NODE_H}
                toX={toPos.x + NODE_W / 2}
                toY={toPos.y}
                required={edge.required}
                highlighted={connectedEdges.has(i)}
                dimmed={hoveredNodeId !== null && !connectedEdges.has(i)}
                addonType={getEdgeAddonType(edge.to)}
              />
            );
          })}

          {/* Tour nodes */}
          {data.tours.map((tour) => {
            const pos = tourPositions[tour.id];
            return (
              <DiagramNode
                key={tour.id}
                node={tour}
                x={pos.x}
                y={pos.y}
                width={NODE_W}
                height={NODE_H}
                highlighted={connectedToHovered.has(tour.id)}
                dimmed={hoveredNodeId !== null && !connectedToHovered.has(tour.id)}
                modified={hasOverride(tour.id)}
                currency={currency}
                lang={lang}
                onClick={() => onSelectNode(tour.id)}
                onHover={(h) => setHoveredNodeId(h ? tour.id : null)}
              />
            );
          })}

          {/* Exclusive nodes */}
          {data.exclusives.map((excl) => {
            const pos = exclusivePositions[excl.id];
            return (
              <DiagramNode
                key={excl.id}
                node={excl}
                x={pos.x}
                y={pos.y}
                width={NODE_W}
                height={NODE_H}
                highlighted={connectedToHovered.has(excl.id)}
                dimmed={hoveredNodeId !== null && !connectedToHovered.has(excl.id)}
                modified={hasOverride(excl.id)}
                currency={currency}
                lang={lang}
                onClick={() => onSelectNode(excl.id)}
                onHover={(h) => setHoveredNodeId(h ? excl.id : null)}
              />
            );
          })}

          {/* Addon nodes */}
          {data.addons.map((addon) => {
            const pos = addonPositions[addon.id];
            return (
              <DiagramNode
                key={addon.id}
                node={addon}
                x={pos.x}
                y={pos.y}
                width={NODE_W}
                height={NODE_H}
                highlighted={connectedToHovered.has(addon.id)}
                dimmed={hoveredNodeId !== null && !connectedToHovered.has(addon.id)}
                modified={hasOverride(addon.id)}
                currency={currency}
                lang={lang}
                onClick={() => onSelectNode(addon.id)}
                onHover={(h) => setHoveredNodeId(h ? addon.id : null)}
              />
            );
          })}

          {/* Product nodes */}
          {data.products.map((product) => {
            const pos = productPositions[product.id];
            if (!pos) return null;
            return (
              <DiagramNode
                key={product.id}
                node={product}
                x={pos.x}
                y={pos.y}
                width={NODE_W}
                height={NODE_H}
                highlighted={connectedToHovered.has(product.id)}
                dimmed={hoveredNodeId !== null && !connectedToHovered.has(product.id)}
                modified={hasOverride(product.id)}
                currency={currency}
                lang={lang}
                onClick={() => onSelectNode(product.id)}
                onHover={(h) => setHoveredNodeId(h ? product.id : null)}
              />
            );
          })}

        </svg>
      </div>
    </div>
  );
}
