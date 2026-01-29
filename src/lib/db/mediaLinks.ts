import { supabase } from "@/integrations/supabase/client";

export type MediaLinkRow = {
  id: string;
  label: string;
  url: string;
  tags: string[];
  created_at: string;
};

export async function listMediaLinksAdmin() {
  const { data, error } = await supabase
    .from("media_links")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as MediaLinkRow[];
}

export async function upsertMediaLinkAdmin(input: { id?: string; label: string; url: string; tags: string[] }) {
  const payload = {
    ...(input.id ? { id: input.id } : {}),
    label: input.label,
    url: input.url,
    tags: input.tags,
  };

  const { data, error } = await supabase
    .from("media_links")
    .upsert(payload)
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return data as MediaLinkRow | null;
}

export async function deleteMediaLinkAdmin(id: string) {
  const { error } = await supabase.from("media_links").delete().eq("id", id);
  if (error) throw error;
}
