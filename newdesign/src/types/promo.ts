export type PromoProductType = "physical" | "scheduled" | "validityPass" | "cruise";

export type PromoProductVariant = { id: string; name: string };
export type PromoProductColor = { name: string; image: string };

export type PromoCruiseType = {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  adultPrice: number;
  childPrice: number;
};

export type PromoTimeSlot = { id: string; label: string; value: string };

export type PromoProduct = {
  name: string;
  type: PromoProductType;
  category: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string | null;
  placeholder: string | null;
  variants: PromoProductVariant[] | null;
  colors?: PromoProductColor[];
  cruiseTypes?: PromoCruiseType[];
  timeSlots?: PromoTimeSlot[];
  adultPrice?: number;
  childPrice?: number;
  validUntil?: string;
  operationHours?: string;
  availableTimes?: string[];
  compatibleTours?: string[] | null;
  tourOptional?: boolean;
};

// Convenience shape for backend-returned promo products that include their ID
export type PromoProductWithId = PromoProduct & { id: string };

