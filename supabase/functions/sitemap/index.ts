import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://dreamcrest.net";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch published products
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("legacy_id, updated_at")
      .eq("published", true);

    if (productsError) {
      console.error("Error fetching products:", productsError);
    }

    // Fetch published blog posts
    const { data: posts, error: postsError } = await supabase
      .from("blog_posts")
      .select("slug, updated_at")
      .eq("published", true);

    if (postsError) {
      console.error("Error fetching posts:", postsError);
    }

    // Static pages with priorities
    const staticPages = [
      { loc: "/", priority: "1.0", changefreq: "daily" },
      { loc: "/products", priority: "0.9", changefreq: "daily" },
      { loc: "/blog", priority: "0.8", changefreq: "weekly" },
      { loc: "/about", priority: "0.7", changefreq: "monthly" },
      { loc: "/contact", priority: "0.7", changefreq: "monthly" },
      { loc: "/faq", priority: "0.6", changefreq: "monthly" },
      { loc: "/refunds", priority: "0.5", changefreq: "monthly" },
      { loc: "/all-tools", priority: "0.8", changefreq: "weekly" },
    ];

    // Build URL entries
    const urls: Array<{
      loc: string;
      lastmod?: string;
      changefreq?: string;
      priority?: string;
    }> = [];

    // Add static pages
    for (const page of staticPages) {
      urls.push({
        loc: `${SITE_URL}${page.loc}`,
        changefreq: page.changefreq,
        priority: page.priority,
      });
    }

    // Add products
    for (const product of products || []) {
      if (product.legacy_id) {
        urls.push({
          loc: `${SITE_URL}/product/${product.legacy_id}`,
          lastmod: product.updated_at?.split("T")[0],
          changefreq: "weekly",
          priority: "0.8",
        });
      }
    }

    // Add blog posts
    for (const post of posts || []) {
      urls.push({
        loc: `${SITE_URL}/blog/${post.slug}`,
        lastmod: post.updated_at?.split("T")[0],
        changefreq: "weekly",
        priority: "0.7",
      });
    }

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}${u.changefreq ? `\n    <changefreq>${u.changefreq}</changefreq>` : ""}${u.priority ? `\n    <priority>${u.priority}</priority>` : ""}
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response("Error generating sitemap", {
      status: 500,
      headers: corsHeaders,
    });
  }
});

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
