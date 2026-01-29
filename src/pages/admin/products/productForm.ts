import { z } from "zod";

import type { DbProduct } from "@/lib/db/products";

export const productSchema = z.object({
  id: z.string().optional(),
  legacy_id: z.coerce.number().int().positive("Legacy ID must be a positive number"),
  name: z.string().trim().min(2).max(200),
  description: z.string().trim().min(10).max(500),
  long_description: z.string().trim().max(5000).optional().or(z.literal("")),
  category: z.string().trim().min(2).max(100),
  sale_price: z.coerce.number().nonnegative(),
  regular_price: z.coerce.number().nonnegative(),
  image_url: z.string().trim().url("Image URL must be a valid URL"),
  external_url: z.string().trim().url("Buy link must be a valid URL"),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sort_order: z.coerce.number().int().nonnegative().default(0),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export function toFormDefaults(p?: DbProduct): ProductFormValues {
  return {
    id: p?.id,
    legacy_id: p?.legacy_id ?? 0,
    name: p?.name ?? "",
    description: p?.description ?? "",
    long_description: p?.long_description ?? "",
    category: p?.category ?? "Software",
    sale_price: Number(p?.sale_price ?? 0),
    regular_price: Number(p?.regular_price ?? 0),
    image_url: p?.image_url ?? "",
    external_url: p?.external_url ?? "",
    featured: p?.featured ?? false,
    published: p?.published ?? true,
    sort_order: p?.sort_order ?? 0,
  };
}
