"use client";

import { EDGE_STYLES } from "../_lib/colors";
import { NODE_COLORS } from "../_lib/colors";
import type { ProductNode } from "../_lib/types";

interface Props {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  required: boolean;
  highlighted: boolean;
  dimmed: boolean;
  addonType?: ProductNode["type"];
}

export default function DiagramEdge({ fromX, fromY, toX, toY, required, highlighted, dimmed, addonType }: Props) {
  const style = required ? EDGE_STYLES.required : EDGE_STYLES.optional;
  const color = addonType ? NODE_COLORS[addonType]?.border ?? "#999" : "#999";

  // Bezier curve: straight down with some curve
  const midY = (fromY + toY) / 2;
  const d = `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`;

  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={highlighted ? 2.5 : 1.5}
      strokeDasharray={style.strokeDasharray}
      opacity={dimmed ? 0.12 : highlighted ? 1 : style.opacity}
      markerEnd="url(#arrowhead)"
      className="transition-all duration-200"
    />
  );
}
