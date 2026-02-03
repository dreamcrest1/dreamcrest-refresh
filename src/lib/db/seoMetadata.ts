import { supabase } from "@/integrations/supabase/client";

export interface SEOMetadata {
  id: string;
  page_path: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  robots: string | null;
  created_at: string;
  updated_at: string;
}

export async function getSEOMetadataByPath(pagePath: string): Promise<SEOMetadata | null> {
  const { data, error } = await supabase
    .from("seo_metadata")
    .select("*")
    .eq("page_path", pagePath)
    .maybeSingle();
    
  if (error) {
    console.error("Error fetching SEO metadata:", error);
    return null;
  }
  
  return data;
}

export async function listAllSEOMetadata(): Promise<SEOMetadata[]> {
  const { data, error } = await supabase
    .from("seo_metadata")
    .select("*")
    .order("page_path");
    
  if (error) {
    console.error("Error listing SEO metadata:", error);
    return [];
  }
  
  return data ?? [];
}

export async function upsertSEOMetadata(
  pagePath: string,
  metadata: Partial<Omit<SEOMetadata, "id" | "page_path" | "created_at" | "updated_at">>
): Promise<SEOMetadata | null> {
  const { data, error } = await supabase
    .from("seo_metadata")
    .upsert(
      { page_path: pagePath, ...metadata },
      { onConflict: "page_path" }
    )
    .select()
    .single();
    
  if (error) {
    console.error("Error upserting SEO metadata:", error);
    throw error;
  }
  
  return data;
}

export async function deleteSEOMetadata(id: string): Promise<void> {
  const { error } = await supabase
    .from("seo_metadata")
    .delete()
    .eq("id", id);
    
  if (error) {
    console.error("Error deleting SEO metadata:", error);
    throw error;
  }
}

// Product SEO helpers
export async function updateProductSEO(
  productId: string,
  seo: { meta_title?: string; meta_description?: string; og_image_url?: string }
): Promise<void> {
  const { error } = await supabase
    .from("products")
    .update(seo)
    .eq("id", productId);
    
  if (error) {
    console.error("Error updating product SEO:", error);
    throw error;
  }
}

// Blog post SEO helpers
export async function updateBlogPostSEO(
  postId: string,
  seo: { meta_title?: string; meta_description?: string; og_image_url?: string }
): Promise<void> {
  const { error } = await supabase
    .from("blog_posts")
    .update(seo)
    .eq("id", postId);
    
  if (error) {
    console.error("Error updating blog post SEO:", error);
    throw error;
  }
}

// SEO Analysis helpers
export interface SEOIssue {
  type: "error" | "warning" | "info";
  message: string;
  page?: string;
  field?: string;
}

export function analyzeSEO(data: {
  pages: SEOMetadata[];
  products: Array<{ id: string; name: string; meta_title: string | null; meta_description: string | null }>;
  blogPosts: Array<{ id: string; title: string; meta_title: string | null; meta_description: string | null }>;
}): { score: number; issues: SEOIssue[] } {
  const issues: SEOIssue[] = [];
  let totalChecks = 0;
  let passedChecks = 0;
  
  // Check products
  for (const product of data.products) {
    totalChecks += 2;
    if (!product.meta_title) {
      issues.push({
        type: "warning",
        message: `Product "${product.name}" is missing a meta title`,
        page: `/product/${product.id}`,
        field: "meta_title",
      });
    } else {
      passedChecks++;
    }
    
    if (!product.meta_description) {
      issues.push({
        type: "warning",
        message: `Product "${product.name}" is missing a meta description`,
        page: `/product/${product.id}`,
        field: "meta_description",
      });
    } else {
      passedChecks++;
    }
  }
  
  // Check blog posts
  for (const post of data.blogPosts) {
    totalChecks += 2;
    if (!post.meta_title) {
      issues.push({
        type: "warning",
        message: `Blog post "${post.title}" is missing a meta title`,
        page: `/blog/${post.id}`,
        field: "meta_title",
      });
    } else {
      passedChecks++;
    }
    
    if (!post.meta_description) {
      issues.push({
        type: "warning",
        message: `Blog post "${post.title}" is missing a meta description`,
        page: `/blog/${post.id}`,
        field: "meta_description",
      });
    } else {
      passedChecks++;
    }
  }
  
  // Check static pages
  const requiredPages = ["/", "/products", "/blog", "/about", "/contact", "/faq"];
  for (const pagePath of requiredPages) {
    const page = data.pages.find(p => p.page_path === pagePath);
    totalChecks += 2;
    
    if (!page || !page.meta_title) {
      issues.push({
        type: "warning",
        message: `Page "${pagePath}" is missing a meta title`,
        page: pagePath,
        field: "meta_title",
      });
    } else {
      passedChecks++;
    }
    
    if (!page || !page.meta_description) {
      issues.push({
        type: "warning",
        message: `Page "${pagePath}" is missing a meta description`,
        page: pagePath,
        field: "meta_description",
      });
    } else {
      passedChecks++;
    }
  }
  
  // Check for duplicate titles
  const titles = new Map<string, string[]>();
  for (const page of data.pages) {
    if (page.meta_title) {
      const existing = titles.get(page.meta_title) || [];
      existing.push(page.page_path);
      titles.set(page.meta_title, existing);
    }
  }
  
  for (const [title, pages] of titles) {
    if (pages.length > 1) {
      issues.push({
        type: "error",
        message: `Duplicate meta title "${title}" found on pages: ${pages.join(", ")}`,
      });
    }
  }
  
  // Calculate score
  const score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100;
  
  return { score, issues };
}
