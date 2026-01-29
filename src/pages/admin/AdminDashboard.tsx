import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listBlogPostsAdmin } from "@/lib/db/blogPosts";
import { listMediaLinksAdmin } from "@/lib/db/mediaLinks";
import { listProductsAdmin } from "@/lib/db/products";
import { listSiteContentAdmin } from "@/lib/db/siteContent";

function tsOrNull(value?: string | null) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isFinite(d.getTime()) ? d : null;
}

export default function AdminDashboard() {
  const productsQuery = useQuery({ queryKey: ["admin", "products"], queryFn: listProductsAdmin });
  const blogQuery = useQuery({ queryKey: ["admin", "blog_posts"], queryFn: listBlogPostsAdmin });
  const siteQuery = useQuery({ queryKey: ["admin", "site_content"], queryFn: listSiteContentAdmin });
  const mediaQuery = useQuery({ queryKey: ["admin", "media_links"], queryFn: listMediaLinksAdmin });

  const products = productsQuery.data ?? [];
  const posts = blogQuery.data ?? [];
  const site = siteQuery.data ?? [];
  const media = mediaQuery.data ?? [];

  const stats = useMemo(() => {
    const publishedProducts = products.filter((p) => p.published).length;
    const hiddenProducts = products.filter((p) => !p.published).length;

    const publishedPosts = posts.filter((p) => p.published).length;
    const draftPosts = posts.filter((p) => !p.published).length;

    const recentCandidates: { label: string; at: Date }[] = [];
    for (const p of products) {
      const t = tsOrNull(p.updated_at) ?? tsOrNull(p.created_at);
      if (t) recentCandidates.push({ label: `Product: ${p.name}`, at: t });
    }
    for (const p of posts) {
      const t = tsOrNull(p.updated_at) ?? tsOrNull(p.created_at);
      if (t) recentCandidates.push({ label: `Blog: ${p.title}`, at: t });
    }
    for (const r of site) {
      const t = tsOrNull(r.updated_at);
      if (t) recentCandidates.push({ label: `Site: ${r.key}`, at: t });
    }
    for (const r of media) {
      const t = tsOrNull(r.created_at);
      if (t) recentCandidates.push({ label: `Media: ${r.label}`, at: t });
    }

    recentCandidates.sort((a, b) => b.at.getTime() - a.at.getTime());
    const recent = recentCandidates.slice(0, 6);

    return {
      publishedProducts,
      hiddenProducts,
      publishedPosts,
      draftPosts,
      siteKeys: site.length,
      mediaLinks: media.length,
      recent,
    };
  }, [media, posts, products, site]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-2xl font-semibold">{products.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="flex gap-2">
              <Badge>{stats.publishedProducts} Published</Badge>
              <Badge variant="secondary">{stats.hiddenProducts} Hidden</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle>Blog</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-2xl font-semibold">{posts.length}</div>
              <div className="text-sm text-muted-foreground">Total posts</div>
            </div>
            <div className="flex gap-2">
              <Badge>{stats.publishedPosts} Published</Badge>
              <Badge variant="secondary">{stats.draftPosts} Draft</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-2xl font-semibold">{stats.siteKeys}</div>
              <div className="text-sm text-muted-foreground">Site keys</div>
            </div>
            <div className="flex gap-2">
              <Badge>{stats.mediaLinks} Media links</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle>Recent edits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent edits yet.</p>
            ) : (
              stats.recent.map((r) => (
                <div key={`${r.label}-${r.at.toISOString()}`} className="flex items-center justify-between gap-3">
                  <div className="text-sm">{r.label}</div>
                  <Badge variant="secondary">{r.at.toLocaleString()}</Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
