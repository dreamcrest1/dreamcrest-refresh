import { supabase } from "@/integrations/supabase/client";

export type PublicProduct = {
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
};

export async function listPublishedProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id,legacy_id,name,description,long_description,category,sale_price,regular_price,image_url,external_url,featured,published,sort_order"
    )
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PublicProduct[];
}

export async function getPublishedProductByLegacyId(legacyId: number) {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id,legacy_id,name,description,long_description,category,sale_price,regular_price,image_url,external_url,featured,published,sort_order"
    )
    .eq("published", true)
    .eq("legacy_id", legacyId)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as PublicProduct | null;
}
