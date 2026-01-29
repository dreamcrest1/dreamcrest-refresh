import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Plus, Trash2, GripVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

// Schema for header settings
const headerSchema = z.object({
  announcementBar: z.string().max(200),
  logoUrl: z.string().optional(),
  showAdminButton: z.boolean(),
  showShopButton: z.boolean(),
  shopButtonText: z.string().max(50),
});

// Schema for nav links
const navLinkSchema = z.object({
  name: z.string().min(1).max(50),
  href: z.string().min(1).max(200),
});

// Schema for footer settings
const footerSchema = z.object({
  showBranding: z.boolean(),
  copyrightText: z.string().max(200),
  subCopyrightText: z.string().max(300),
  quickLinksTitle: z.string().max(50),
  brandsTitle: z.string().max(50),
  contactTitle: z.string().max(50),
});

type HeaderValues = z.infer<typeof headerSchema>;
type NavLinkValues = z.infer<typeof navLinkSchema>;
type FooterValues = z.infer<typeof footerSchema>;

async function fetchKey<T>(key: string): Promise<T | null> {
  const { data, error } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) throw error;
  return data?.value as T | null;
}

async function upsertKey(key: string, value: Json) {
  const { error } = await supabase
    .from("site_content")
    .upsert({ key, value } as any);
  if (error) throw error;
}

export default function AdminAppearance() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState("header");

  // Queries
  const headerQuery = useQuery({
    queryKey: ["admin", "site_content", "site.header"],
    queryFn: () => fetchKey<HeaderValues>("site.header"),
  });

  const navQuery = useQuery({
    queryKey: ["admin", "site_content", "site.nav"],
    queryFn: () => fetchKey<NavLinkValues[]>("site.nav"),
  });

  const footerQuery = useQuery({
    queryKey: ["admin", "site_content", "site.footer"],
    queryFn: () => fetchKey<FooterValues>("site.footer"),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Appearance</h2>
        <p className="text-muted-foreground">
          Customize your site's header, navigation, and footer.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        <TabsContent value="header" className="mt-6">
          <HeaderEditor data={headerQuery.data} onSave={() => qc.invalidateQueries({ queryKey: ["admin", "site_content", "site.header"] })} />
        </TabsContent>

        <TabsContent value="navigation" className="mt-6">
          <NavigationEditor data={navQuery.data} onSave={() => qc.invalidateQueries({ queryKey: ["admin", "site_content", "site.nav"] })} />
        </TabsContent>

        <TabsContent value="footer" className="mt-6">
          <FooterEditor data={footerQuery.data} onSave={() => qc.invalidateQueries({ queryKey: ["admin", "site_content", "site.footer"] })} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Header Editor Component
function HeaderEditor({ data, onSave }: { data: HeaderValues | null | undefined; onSave: () => void }) {
  const form = useForm<HeaderValues>({
    resolver: zodResolver(headerSchema),
    defaultValues: data ?? {
      announcementBar: "INSTANT DELIVERY OF ALL DIGITAL PRODUCTS",
      logoUrl: "",
      showAdminButton: true,
      showShopButton: true,
      shopButtonText: "Shop Now",
    },
  });

  // Reset form when data loads
  if (data && !form.formState.isDirty) {
    form.reset(data);
  }

  const mutation = useMutation({
    mutationFn: (values: HeaderValues) => upsertKey("site.header", values as unknown as Json),
    onSuccess: () => {
      toast({ title: "Saved", description: "Header settings updated." });
      onSave();
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err?.message ?? "Failed to save.", variant: "destructive" });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Header Settings</CardTitle>
        <CardDescription>Configure the top announcement bar and header buttons.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-6">
          <div className="space-y-2">
            <Label>Announcement Bar Text</Label>
            <Input {...form.register("announcementBar")} placeholder="INSTANT DELIVERY OF ALL DIGITAL PRODUCTS" />
            <p className="text-xs text-muted-foreground">Appears at the very top of your site.</p>
          </div>

          <div className="space-y-2">
            <Label>Logo URL (optional)</Label>
            <Input {...form.register("logoUrl")} placeholder="Leave empty to use default logo" />
            <p className="text-xs text-muted-foreground">Custom logo image URL. Leave empty for default.</p>
          </div>

          <div className="space-y-2">
            <Label>Shop Button Text</Label>
            <Input {...form.register("shopButtonText")} placeholder="Shop Now" />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                checked={form.watch("showAdminButton")}
                onCheckedChange={(v) => form.setValue("showAdminButton", v)}
              />
              <Label>Show Admin Button</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.watch("showShopButton")}
                onCheckedChange={(v) => form.setValue("showShopButton", v)}
              />
              <Label>Show Shop Button</Label>
            </div>
          </div>

          <Button type="submit" disabled={mutation.isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {mutation.isPending ? "Saving…" : "Save Header"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Navigation Editor Component
function NavigationEditor({ data, onSave }: { data: NavLinkValues[] | null | undefined; onSave: () => void }) {
  const defaultLinks: NavLinkValues[] = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "All Tools", href: "/alltools" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
    { name: "Return & Refunds", href: "/refunds" },
  ];

  const [links, setLinks] = useState<NavLinkValues[]>(data ?? defaultLinks);
  const [newLink, setNewLink] = useState<NavLinkValues>({ name: "", href: "" });

  // Sync when data loads
  if (data && links === defaultLinks) {
    setLinks(data);
  }

  const mutation = useMutation({
    mutationFn: () => upsertKey("site.nav", links as unknown as Json),
    onSuccess: () => {
      toast({ title: "Saved", description: "Navigation updated." });
      onSave();
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err?.message ?? "Failed to save.", variant: "destructive" });
    },
  });

  const addLink = () => {
    if (!newLink.name.trim() || !newLink.href.trim()) return;
    setLinks([...links, { name: newLink.name.trim(), href: newLink.href.trim() }]);
    setNewLink({ name: "", href: "" });
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: "name" | "href", value: string) => {
    setLinks(links.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  };

  const moveLink = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= links.length) return;
    const updated = [...links];
    const [item] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, item);
    setLinks(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Navigation Menu</CardTitle>
        <CardDescription>Manage the links in your main navigation. Drag to reorder.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {links.map((link, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
              <div className="flex flex-col gap-1">
                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveLink(i, i - 1)} disabled={i === 0}>
                  ↑
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveLink(i, i + 1)} disabled={i === links.length - 1}>
                  ↓
                </Button>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-3">
                <Input
                  value={link.name}
                  onChange={(e) => updateLink(i, "name", e.target.value)}
                  placeholder="Link name"
                />
                <Input
                  value={link.href}
                  onChange={(e) => updateLink(i, "href", e.target.value)}
                  placeholder="/path or https://..."
                />
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeLink(i)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex items-end gap-3 p-4 rounded-lg border border-dashed">
          <div className="flex-1 space-y-2">
            <Label>Add New Link</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                value={newLink.name}
                onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                placeholder="Link name"
              />
              <Input
                value={newLink.href}
                onChange={(e) => setNewLink({ ...newLink, href: e.target.value })}
                placeholder="/path"
              />
            </div>
          </div>
          <Button type="button" variant="outline" onClick={addLink} className="gap-2">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>

        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="gap-2">
          <Save className="h-4 w-4" />
          {mutation.isPending ? "Saving…" : "Save Navigation"}
        </Button>
      </CardContent>
    </Card>
  );
}

// Footer Editor Component
function FooterEditor({ data, onSave }: { data: FooterValues | null | undefined; onSave: () => void }) {
  const form = useForm<FooterValues>({
    resolver: zodResolver(footerSchema),
    defaultValues: data ?? {
      showBranding: true,
      copyrightText: "© {year} Dreamcrest Solutions. All rights reserved.",
      subCopyrightText: "India's Most Trusted Digital Product Store | Serving 15,000+ Happy Customers Since 2021",
      quickLinksTitle: "Quick Links",
      brandsTitle: "Our Brands",
      contactTitle: "Contact Us",
    },
  });

  if (data && !form.formState.isDirty) {
    form.reset(data);
  }

  const mutation = useMutation({
    mutationFn: (values: FooterValues) => upsertKey("site.footer", values as unknown as Json),
    onSuccess: () => {
      toast({ title: "Saved", description: "Footer settings updated." });
      onSave();
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err?.message ?? "Failed to save.", variant: "destructive" });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Footer Settings</CardTitle>
        <CardDescription>Customize your site's footer section titles and copyright.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-6">
          <div className="flex items-center gap-2">
            <Switch
              checked={form.watch("showBranding")}
              onCheckedChange={(v) => form.setValue("showBranding", v)}
            />
            <Label>Show Logo & Tagline in Footer</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Quick Links Title</Label>
              <Input {...form.register("quickLinksTitle")} placeholder="Quick Links" />
            </div>
            <div className="space-y-2">
              <Label>Brands Section Title</Label>
              <Input {...form.register("brandsTitle")} placeholder="Our Brands" />
            </div>
            <div className="space-y-2">
              <Label>Contact Section Title</Label>
              <Input {...form.register("contactTitle")} placeholder="Contact Us" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Copyright Text</Label>
            <Input {...form.register("copyrightText")} placeholder="© {year} Your Company" />
            <p className="text-xs text-muted-foreground">Use {"{year}"} to auto-insert current year.</p>
          </div>

          <div className="space-y-2">
            <Label>Sub-Copyright Text</Label>
            <Input {...form.register("subCopyrightText")} placeholder="Additional tagline..." />
          </div>

          <Button type="submit" disabled={mutation.isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {mutation.isPending ? "Saving…" : "Save Footer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
