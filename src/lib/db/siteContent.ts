import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export type SiteContentRow = {
  key: string;
  value: Json;
  updated_at: string;
};

export async function listSiteContentAdmin() {
  const { data, error } = await supabase
    .from("site_content")
    .select("key,value,updated_at")
    .order("key", { ascending: true });
  if (error) throw error;
  return (data ?? []) as SiteContentRow[];
}

export async function upsertSiteContentAdmin(input: { key: string; value: Json }) {
  const { data, error } = await supabase
    .from("site_content")
    .upsert({ key: input.key, value: input.value } as any)
    .select("key,value,updated_at")
    .maybeSingle();
  if (error) throw error;
  return data as SiteContentRow | null;
}

export async function deleteSiteContentAdmin(key: string) {
  const { error } = await supabase.from("site_content").delete().eq("key", key);
  if (error) throw error;
}
