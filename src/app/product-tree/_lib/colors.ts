export const NODE_COLORS = {
  tour: { bg: "#FEE2E2", border: "#E20021", text: "#991B1B" },
  exclusive: { bg: "#FFF7ED", border: "#EA580C", text: "#9A3412" },
  physical: { bg: "#DBEAFE", border: "#3B82F6", text: "#1E40AF" },
  scheduled: { bg: "#D1FAE5", border: "#10B981", text: "#065F46" },
  validityPass: { bg: "#FEF3C7", border: "#F59E0B", text: "#92400E" },
  cruise: { bg: "#EDE9FE", border: "#8B5CF6", text: "#5B21B6" },
  product: { bg: "#F0FDF4", border: "#22C55E", text: "#166534" },
} as const;

export function formatUsd(n: number): string {
  return `$${n}`;
}

export function formatKrw(n: number): string {
  return `₩${n.toLocaleString()}`;
}

/** Colors for display tags */
export const TAG_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  product: { bg: "#DBEAFE", border: "#3B82F6", text: "#1E40AF" },
  scheduled: { bg: "#D1FAE5", border: "#10B981", text: "#065F46" },
  "validity pass": { bg: "#FEF3C7", border: "#F59E0B", text: "#92400E" },
  experiences: { bg: "#EDE9FE", border: "#8B5CF6", text: "#5B21B6" },
  "e-mail ticket": { bg: "#FCE7F3", border: "#EC4899", text: "#9D174D" },
  "physical ticket": { bg: "#E0E7FF", border: "#6366F1", text: "#3730A3" },
  ticket: { bg: "#F3E8FF", border: "#A855F7", text: "#6B21A8" },
};

export function getTagColor(tag: string) {
  return TAG_COLORS[tag] ?? { bg: "#F3F4F6", border: "#9CA3AF", text: "#374151" };
}

/** Display-friendly label for addon types (legacy single-type) */
export const TYPE_DISPLAY_NAMES: Record<string, string> = {
  physical: "product",
  scheduled: "scheduled",
  validityPass: "validity pass",
  cruise: "experiences",
};

export function typeDisplayName(type: string): string {
  return TYPE_DISPLAY_NAMES[type] ?? type;
}

export const EDGE_STYLES = {
  required: { strokeDasharray: "none", opacity: 0.8 },
  optional: { strokeDasharray: "6 4", opacity: 0.5 },
} as const;
