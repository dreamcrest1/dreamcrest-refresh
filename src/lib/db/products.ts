import { supabase } from "@/integrations/supabase/client";

export type DbProduct = {
  id: string;
  legacy_id: number | null;
  name: string;
  description: string;
  long_description: string | null;
  category: string;
  sale_price: number;
  regular_price: number;
  image_url: string;
  external_url: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export async function listProductsAdmin() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DbProduct[];
}

export async function upsertProductAdmin(input: {
  id?: string;
  legacy_id: number;
  name: string;
  description: string;
  long_description?: string;
  category: string;
  sale_price: number;
  regular_price: number;
  image_url: string;
  external_url: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
}) {
  const payload = {
    ...(input.id ? { id: input.id } : {}),
    legacy_id: input.legacy_id,
    name: input.name,
    description: input.description,
    long_description: input.long_description ?? null,
    category: input.category,
    sale_price: input.sale_price,
    regular_price: input.regular_price,
    image_url: input.image_url,
    external_url: input.external_url,
    featured: input.featured,
    published: input.published,
    sort_order: input.sort_order,
  };

  const { data, error } = await supabase
    .from("products")
    .upsert(payload)
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return data as DbProduct | null;
}

export async function deleteProductAdmin(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function updateProductAdmin(
  id: string,
  patch: Partial<Pick<DbProduct, "name" | "category" | "description" | "sale_price" | "regular_price" | "published" | "featured">>
) {
  const { data, error } = await supabase.from("products").update(patch).eq("id", id).select("*").maybeSingle();
  if (error) throw error;
  return data as DbProduct | null;
}

