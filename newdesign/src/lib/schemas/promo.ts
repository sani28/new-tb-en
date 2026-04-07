import { z } from "zod";

export const promoProductTypeSchema = z.enum(["physical", "scheduled", "validityPass", "cruise"]);

export const promoProductVariantSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const promoProductColorSchema = z.object({
  name: z.string(),
  image: z.string(),
});

export const promoCruiseTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
  price: z.number().finite(),
  originalPrice: z.number().finite(),
  adultPrice: z.number().finite(),
  childPrice: z.number().finite(),
});

export const promoTimeSlotSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string(),
});

export const promoProductSchema = z.object({
  name: z.string(),
  type: promoProductTypeSchema,
  category: z.string(),
  description: z.string(),
  price: z.number().finite(),
  originalPrice: z.number().finite(),
  image: z.string().nullable(),
  placeholder: z.string().nullable(),
  variants: z.array(promoProductVariantSchema).nullable(),

  colors: z.array(promoProductColorSchema).optional(),
  cruiseTypes: z.array(promoCruiseTypeSchema).optional(),
  timeSlots: z.array(promoTimeSlotSchema).optional(),

  adultPrice: z.number().finite().optional(),
  childPrice: z.number().finite().optional(),
  validUntil: z.string().optional(),
  operationHours: z.string().optional(),
  availableTimes: z.array(z.string()).optional(),

  compatibleTours: z.array(z.string()).nullable().optional(),
  tourOptional: z.boolean().optional(),
});

export const promoProductWithIdSchema = promoProductSchema.extend({
  id: z.string(),
});

export const promoProductsResponseSchema = z.array(promoProductWithIdSchema);

// Used to validate local prototype data (Record keyed by product id).
export const promoProductCatalogSchema = z.record(z.string(), promoProductSchema);
