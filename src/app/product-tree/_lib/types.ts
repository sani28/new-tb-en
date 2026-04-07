export type Currency = "USD" | "KRW";
export type { Lang } from "./i18n";
export type ProductNodeKind = "tour" | "addon" | "exclusive" | "product";
export type AddonType = "physical" | "scheduled" | "validityPass" | "cruise";

export interface PricingInfo {
  price?: number;
  originalPrice?: number;
  adultPrice?: number;
  childPrice?: number;
  adultOrig?: number;
  childOrig?: number;
  // Static KRW prices (manual, not converted)
  priceKrw?: number;
  originalPriceKrw?: number;
  adultPriceKrw?: number;
  childPriceKrw?: number;
  adultOrigKrw?: number;
  childOrigKrw?: number;
}

export interface ProductNode {
  id: string;
  kind: ProductNodeKind;
  name: string;
  type?: AddonType;
  tags: string[];
  active: boolean;
  category?: string;
  pricing: PricingInfo;
  meta: Record<string, unknown>;
  compatibleTours: string[] | null;
  tourOptional: boolean;
}

export interface ProductEdge {
  from: string; // tour id
  to: string; // addon id
  required: boolean; // !tourOptional
}

export interface ProductTreeData {
  tours: ProductNode[];
  exclusives: ProductNode[];
  addons: ProductNode[];
  products: ProductNode[];
  edges: ProductEdge[];
}

export interface ChangeEntry {
  id: string;
  kind: "edit";
  nodeId: string;
  nodeName: string;
  field: string;
  oldValue: unknown;
  newValue: unknown;
  timestamp: string; // ISO
  author?: string;
}

export type Priority = "none" | "low" | "medium" | "high";

export interface Comment {
  id: string;
  kind: "comment";
  nodeId: string;
  nodeName: string;
  text: string;
  author: string;
  timestamp: string; // ISO
  priority: Priority;
}

export type ActivityEntry = ChangeEntry | Comment;
