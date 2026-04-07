import { promoProductCatalogSchema } from "@/lib/schemas/promo";
import type { PromoProduct } from "@/types/promo";

// Prototype-faithful add-on data used by the homepage promo modal.
// Centralized here so it can also be served by a backend later if needed.
const promoProductDataRaw = {
  "kwangjuyo": {
    name: "Kwangjuyo",
    type: "physical",
    category: "products",
    description:
      "Experience the elegance of traditional Korean ceramics with Kwangjuyo's exquisite collection. Each piece is handcrafted by master artisans.",
    price: 25,
    originalPrice: 35,
    image: "/imgs/kwangjuyo.webp",
    placeholder: null,
    variants: [
      { id: "sound-cup", name: "Sound Cup" },
      { id: "marble-cup", name: "Marble Cup" },
    ],
    colors: [
      { name: "Soft Blush", image: "/imgs/kwangjuyo.webp" },
      { name: "Gentle Pine", image: "/imgs/kwangjuyo.webp" },
      { name: "Autumn Haze", image: "/imgs/kwangjuyo.webp" },
      { name: "Pure White", image: "/imgs/kwangjuyo.webp" },
    ],
    compatibleTours: ["tour01", "tour02", "tour04"],
    tourOptional: false,
  },
  "sejong-backstage": {
    name: "Backstage Pass Sejong Centre",
    type: "scheduled",
    category: "experiences",
    description:
      "Go behind the scenes at Korea's premier performing arts venue with exclusive backstage access to the Sejong Center for the Performing Arts.",
    price: 8,
    originalPrice: 12,
    adultPrice: 8,
    childPrice: 5,
    image: "/imgs/sejong-addon.png",
    placeholder: null,
    variants: null,
    compatibleTours: ["tour01"],
  },
  "museum-pass": {
    name: "Museum Pass",
    type: "validityPass",
    category: "experiences",
    description:
      "Access to major museums in Seoul. Valid for multiple entries during the validity period.",
    price: 25,
    originalPrice: 35,
    adultPrice: 25,
    childPrice: 15,
    validUntil: "2025-06-30",
    image: "/imgs/monet-addon.png",
    placeholder: null,
    variants: null,
    compatibleTours: ["tour01"],
  },
  "han-river-cruise": {
    name: "Han River Cruise",
    type: "cruise",
    category: "experiences",
    description:
      "Scenic cruise along the Han River with stunning views of Seoul's skyline. Choose from Day, Sunset, or Night cruises.",
    price: 25,
    originalPrice: 35,
    adultPrice: 25,
    childPrice: 18,
    image: "/imgs/daycruise.png",
    placeholder: "🚢",
    variants: null,
    cruiseTypes: [
      {
        id: "day",
        name: "Day Cruise",
        image: "/imgs/daycruise.png",
        price: 25,
        originalPrice: 35,
        adultPrice: 25,
        childPrice: 18,
      },
      {
        id: "sunset",
        name: "Sunset Cruise",
        image: "/imgs/sunsetcruise.png",
        price: 30,
        originalPrice: 40,
        adultPrice: 30,
        childPrice: 20,
      },
      {
        id: "night",
        name: "Night Cruise",
        image: "/imgs/moonlightcruise.png",
        price: 35,
        originalPrice: 45,
        adultPrice: 35,
        childPrice: 22,
      },
    ],
    timeSlots: [
      { id: "morning", label: "10:00 AM - 5:00 PM", value: "10:00-17:00" },
      { id: "evening", label: "5:00 PM - 10:00 PM", value: "17:00-22:00" },
    ],
    compatibleTours: ["tour02"],
  },
  "hanbok-rental": {
    name: "Hanbok Rental",
    type: "scheduled",
    category: "services",
    description:
      "Traditional Korean dress rental. Includes accessories and photo opportunities at scenic locations.",
    price: 20,
    originalPrice: 30,
    adultPrice: 20,
    childPrice: 12,
    image: "/imgs/hanbok-addon.png",
    placeholder: "👘",
    variants: null,
    operationHours: "10:00-18:00",
    compatibleTours: null,
    tourOptional: true,
  },
} satisfies Record<string, PromoProduct>;

export const promoProductData = promoProductCatalogSchema.parse(promoProductDataRaw);

