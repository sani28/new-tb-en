import type { Metadata } from "next";
import ProductTreeClient from "./ProductTreeClient";

export const metadata: Metadata = {
  title: "Product Tree - Seoul City Tour Tiger Bus (Internal)",
  description: "Internal team tool for product relationship management.",
};

export default function ProductTreePage() {
  return <ProductTreeClient />;
}
