import { supabase } from "@/integrations/supabase/client";

export type PopupType = "modal" | "slide_in" | "bar";

export type Popup = {
  id: string;
  title: string;
  content: string;
  popup_type: PopupType;
  target_pages: string[];
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  button_text: string | null;
  button_link: string | null;
  background_color: string | null;
  text_color: string | null;
  show_close_button: boolean;
  delay_seconds: number;
  created_at: string;
  updated_at: string;
};

export type PopupInsert = Omit<Popup, "id" | "created_at" | "updated_at">;
export type PopupUpdate = Partial<PopupInsert>;

export async function listPopupsAdmin(): Promise<Popup[]> {
  const { data, error } = await supabase
    .from("popups")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Popup[];
}

export async function createPopup(popup: PopupInsert): Promise<Popup> {
  const { data, error } = await supabase
    .from("popups")
    .insert(popup)
    .select()
    .single();
  if (error) throw error;
  return data as Popup;
}

export async function updatePopup(id: string, updates: PopupUpdate): Promise<Popup> {
  const { data, error } = await supabase
    .from("popups")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Popup;
}

export async function deletePopup(id: string): Promise<void> {
  const { error } = await supabase.from("popups").delete().eq("id", id);
  if (error) throw error;
}

// Public function to get active popups for a specific page
export async function getActivePopupsForPage(pagePath: string): Promise<Popup[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("popups")
    .select("*")
    .eq("is_active", true)
    .or(`start_date.is.null,start_date.lte.${now}`)
    .or(`end_date.is.null,end_date.gte.${now}`);
  
  if (error) throw error;
  
  // Filter by target pages (if empty array, show on all pages)
  return ((data ?? []) as Popup[]).filter(popup => {
    if (!popup.target_pages || popup.target_pages.length === 0) return true;
    return popup.target_pages.some(target => 
      pagePath === target || pagePath.startsWith(target + "/")
    );
  });
}
