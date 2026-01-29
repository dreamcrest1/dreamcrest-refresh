import { supabase } from "@/integrations/supabase/client";

export type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function listBlogPostsAdmin() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as BlogPostRow[];
}

export async function upsertBlogPostAdmin(input: {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image_url?: string | null;
  published: boolean;
  published_at?: string | null;
}) {
  const payload = {
    ...(input.id ? { id: input.id } : {}),
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    content: input.content,
    category: input.category,
    image_url: input.image_url ?? null,
    published: input.published,
    published_at: input.published_at ?? null,
  };

  const { data, error } = await supabase
    .from("blog_posts")
    .upsert(payload)
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return data as BlogPostRow | null;
}

export async function deleteBlogPostAdmin(id: string) {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw error;
}
