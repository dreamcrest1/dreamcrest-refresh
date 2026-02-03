import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Globe, FileText, BarChart3, AlertTriangle, CheckCircle, Info, RefreshCw, ExternalLink, Copy, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  listAllSEOMetadata,
  upsertSEOMetadata,
  updateProductSEO,
  updateBlogPostSEO,
  analyzeSEO,
  type SEOMetadata,
  type SEOIssue,
} from "@/lib/db/seoMetadata";

const STATIC_PAGES = [
  { path: "/", label: "Home" },
  { path: "/products", label: "Products" },
  { path: "/blog", label: "Blog" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
  { path: "/faq", label: "FAQ" },
  { path: "/refunds", label: "Refunds" },
  { path: "/all-tools", label: "All Tools" },
];

const SITE_URL = "https://dreamcrest.net";

export default function AdminSEO() {
  return (
    <Tabs defaultValue="pages" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="pages" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">Pages</span>
        </TabsTrigger>
        <TabsTrigger value="products" className="gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Products</span>
        </TabsTrigger>
        <TabsTrigger value="sitemap" className="gap-2">
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Sitemap</span>
        </TabsTrigger>
        <TabsTrigger value="analyzer" className="gap-2">
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">Analyzer</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pages">
        <PageMetaEditor />
      </TabsContent>

      <TabsContent value="products">
        <ProductsSEOEditor />
      </TabsContent>

      <TabsContent value="sitemap">
        <SitemapManager />
      </TabsContent>

      <TabsContent value="analyzer">
        <SEOAnalyzer />
      </TabsContent>
    </Tabs>
  );
}

// Page Meta Editor Component
function PageMetaEditor() {
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState(STATIC_PAGES[0].path);
  const [formData, setFormData] = useState({
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    og_title: "",
    og_description: "",
    og_image_url: "",
    canonical_url: "",
    robots: "index, follow",
  });

  const seoQuery = useQuery({
    queryKey: ["admin", "seo_metadata"],
    queryFn: listAllSEOMetadata,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      return upsertSEOMetadata(selectedPage, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "seo_metadata"] });
      toast.success("SEO metadata saved successfully");
    },
    onError: (error) => {
      toast.error("Failed to save: " + (error as Error).message);
    },
  });

  // Load data when page changes
  const loadPageData = (path: string) => {
    const pageData = seoQuery.data?.find((p) => p.page_path === path);
    if (pageData) {
      setFormData({
        meta_title: pageData.meta_title || "",
        meta_description: pageData.meta_description || "",
        meta_keywords: pageData.meta_keywords || "",
        og_title: pageData.og_title || "",
        og_description: pageData.og_description || "",
        og_image_url: pageData.og_image_url || "",
        canonical_url: pageData.canonical_url || "",
        robots: pageData.robots || "index, follow",
      });
    } else {
      setFormData({
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        og_title: "",
        og_description: "",
        og_image_url: "",
        canonical_url: "",
        robots: "index, follow",
      });
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Page Meta Editor</CardTitle>
          <CardDescription>
            Edit SEO metadata for static pages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select Page</Label>
            <Select
              value={selectedPage}
              onValueChange={(value) => {
                setSelectedPage(value);
                loadPageData(value);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATIC_PAGES.map((page) => (
                  <SelectItem key={page.path} value={page.path}>
                    {page.label} ({page.path})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              Meta Title
              <span className="text-muted-foreground ml-2 text-xs">
                ({formData.meta_title.length}/60)
              </span>
            </Label>
            <Input
              value={formData.meta_title}
              onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
              placeholder="Page title for search engines"
              maxLength={70}
            />
            {formData.meta_title.length > 60 && (
              <p className="text-xs text-destructive">Title is too long. Keep it under 60 characters.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              Meta Description
              <span className="text-muted-foreground ml-2 text-xs">
                ({formData.meta_description.length}/160)
              </span>
            </Label>
            <Textarea
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              placeholder="Brief description for search results"
              rows={3}
              maxLength={170}
            />
            {formData.meta_description.length > 160 && (
              <p className="text-xs text-destructive">Description is too long. Keep it under 160 characters.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Meta Keywords</Label>
            <Input
              value={formData.meta_keywords}
              onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>

          <div className="space-y-2">
            <Label>OG Image URL</Label>
            <Input
              value={formData.og_image_url}
              onChange={(e) => setFormData({ ...formData, og_image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label>Robots</Label>
            <Select
              value={formData.robots}
              onValueChange={(value) => setFormData({ ...formData, robots: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="index, follow">index, follow (Default)</SelectItem>
                <SelectItem value="noindex, follow">noindex, follow</SelectItem>
                <SelectItem value="index, nofollow">index, nofollow</SelectItem>
                <SelectItem value="noindex, nofollow">noindex, nofollow</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="w-full"
          >
            {saveMutation.isPending ? "Saving..." : "Save SEO Metadata"}
          </Button>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Search Preview</CardTitle>
          <CardDescription>How this page might appear in Google</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <div className="text-blue-600 text-lg hover:underline cursor-pointer truncate">
              {formData.meta_title || "Page Title | Dreamcrest Solutions"}
            </div>
            <div className="text-green-700 text-sm">
              {SITE_URL}{selectedPage}
            </div>
            <div className="text-sm text-muted-foreground line-clamp-2">
              {formData.meta_description || "Add a meta description to see how it appears in search results."}
            </div>
          </div>

          {formData.og_image_url && (
            <div className="mt-4">
              <Label className="mb-2 block">OG Image Preview</Label>
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={formData.og_image_url}
                  alt="OG Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Products SEO Editor
function ProductsSEOEditor() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const productsQuery = useQuery({
    queryKey: ["admin", "products_seo"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, legacy_id, meta_title, meta_description, og_image_url")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ meta_title: "", meta_description: "" });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { meta_title?: string; meta_description?: string } }) => {
      return updateProductSEO(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products_seo"] });
      setEditingId(null);
      toast.success("Product SEO updated");
    },
    onError: (error) => {
      toast.error("Failed: " + (error as Error).message);
    },
  });

  const copyTitleMutation = useMutation({
    mutationFn: async () => {
      const products = productsQuery.data?.filter(p => !p.meta_title) || [];
      for (const product of products) {
        await updateProductSEO(product.id, { meta_title: product.name });
      }
      return products.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products_seo"] });
      toast.success(`Updated ${count} products`);
    },
  });

  const filtered = (productsQuery.data || []).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const missingCount = (productsQuery.data || []).filter(
    (p) => !p.meta_title || !p.meta_description
  ).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <CardTitle>Product SEO</CardTitle>
            <CardDescription>
              Manage meta titles and descriptions for products
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyTitleMutation.mutate()}
              disabled={copyTitleMutation.isPending}
            >
              <Copy className="h-4 w-4 mr-2" />
              Auto-fill Titles
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          {missingCount > 0 && (
            <Badge variant="destructive">{missingCount} missing SEO</Badge>
          )}
        </div>

        <div className="rounded-md border max-h-[500px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Meta Title</TableHead>
                <TableHead>Meta Description</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {product.name}
                  </TableCell>
                  <TableCell>
                    {editingId === product.id ? (
                      <Input
                        value={editForm.meta_title}
                        onChange={(e) => setEditForm({ ...editForm, meta_title: e.target.value })}
                        placeholder="Meta title"
                      />
                    ) : (
                      <span className={!product.meta_title ? "text-muted-foreground italic" : ""}>
                        {product.meta_title || "Not set"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    {editingId === product.id ? (
                      <Input
                        value={editForm.meta_description}
                        onChange={(e) => setEditForm({ ...editForm, meta_description: e.target.value })}
                        placeholder="Meta description"
                      />
                    ) : (
                      <span className={`truncate block ${!product.meta_description ? "text-muted-foreground italic" : ""}`}>
                        {product.meta_description || "Not set"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === product.id ? (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={() => updateMutation.mutate({ id: product.id, data: editForm })}
                          disabled={updateMutation.isPending}
                        >
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingId(product.id);
                          setEditForm({
                            meta_title: product.meta_title || "",
                            meta_description: product.meta_description || "",
                          });
                        }}
                      >
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// Sitemap Manager
function SitemapManager() {
  const SITEMAP_URL = `https://pvpfxyxxzyqvisolnqzt.supabase.co/functions/v1/sitemap`;
  const [urlCount, setUrlCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const checkSitemap = async () => {
    setLoading(true);
    try {
      const response = await fetch(SITEMAP_URL);
      const text = await response.text();
      const matches = text.match(/<url>/g);
      setUrlCount(matches?.length || 0);
      toast.success("Sitemap checked successfully");
    } catch (error) {
      toast.error("Failed to check sitemap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Dynamic Sitemap</CardTitle>
          <CardDescription>
            Your sitemap is automatically generated from the database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Sitemap URL:</span>
              <a
                href={SITEMAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1 text-sm"
              >
                View Sitemap <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            {urlCount !== null && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total URLs:</span>
                <Badge variant="secondary">{urlCount}</Badge>
              </div>
            )}
          </div>

          <Button onClick={checkSitemap} disabled={loading} className="w-full gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Check Sitemap
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Robots.txt</CardTitle>
          <CardDescription>
            Your robots.txt file configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50 font-mono text-sm whitespace-pre-wrap">
{`User-agent: *
Allow: /

Sitemap: ${SITEMAP_URL}`}
          </div>
          <p className="text-xs text-muted-foreground">
            Update <code>public/robots.txt</code> to point to the dynamic sitemap
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// SEO Analyzer
function SEOAnalyzer() {
  const [analysis, setAnalysis] = useState<{ score: number; issues: SEOIssue[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      // Fetch all data
      const [pagesRes, productsRes, blogRes] = await Promise.all([
        listAllSEOMetadata(),
        supabase.from("products").select("id, name, meta_title, meta_description"),
        supabase.from("blog_posts").select("id, title, meta_title, meta_description"),
      ]);

      const result = analyzeSEO({
        pages: pagesRes,
        products: productsRes.data || [],
        blogPosts: blogRes.data || [],
      });

      setAnalysis(result);
      toast.success("Analysis complete");
    } catch (error) {
      toast.error("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>SEO Analyzer</CardTitle>
              <CardDescription>
                Scan your site for SEO issues and get recommendations
              </CardDescription>
            </div>
            <Button onClick={runAnalysis} disabled={loading} className="gap-2">
              <Wand2 className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Run Analysis
            </Button>
          </div>
        </CardHeader>
        {analysis && (
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <div className={`text-4xl font-bold ${analysis.score >= 80 ? "text-green-500" : analysis.score >= 50 ? "text-yellow-500" : "text-red-500"}`}>
                  {analysis.score}%
                </div>
                <div className="text-sm text-muted-foreground">SEO Score</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <div className="text-4xl font-bold text-red-500">
                  {analysis.issues.filter((i) => i.type === "error").length}
                </div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <div className="text-4xl font-bold text-yellow-500">
                  {analysis.issues.filter((i) => i.type === "warning").length}
                </div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
            </div>

            {analysis.issues.length > 0 ? (
              <div className="space-y-3">
                <h3 className="font-semibold">Issues Found</h3>
                {analysis.issues.map((issue, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg border flex items-start gap-3 ${
                      issue.type === "error"
                        ? "border-red-500/50 bg-red-500/10"
                        : issue.type === "warning"
                        ? "border-yellow-500/50 bg-yellow-500/10"
                        : "border-blue-500/50 bg-blue-500/10"
                    }`}
                  >
                    {issue.type === "error" ? (
                      <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                    ) : issue.type === "warning" ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
                    ) : (
                      <Info className="h-5 w-5 text-blue-500 shrink-0" />
                    )}
                    <div>
                      <p className="font-medium">{issue.message}</p>
                      {issue.page && (
                        <p className="text-sm text-muted-foreground">Page: {issue.page}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold">All Good!</h3>
                <p className="text-muted-foreground">No SEO issues found.</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
