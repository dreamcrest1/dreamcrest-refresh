import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

// Hero section schema
const heroSchema = z.object({
  headline: z.string().max(100),
  highlightWord: z.string().max(50),
  subheadline: z.string().max(100),
  badgeText: z.string().max(100),
  primaryCtaText: z.string().max(50),
  primaryCtaLink: z.string().max(200),
  secondaryCtaText: z.string().max(50),
  secondaryCtaLink: z.string().max(200),
});

// About section schema
const aboutSchema = z.object({
  subtitle: z.string().max(50),
  title: z.string().max(100),
  tagline: z.string().max(150),
  description: z.string().max(1000),
  bulletPointsText: z.string(), // Newline-separated
  primaryCtaText: z.string().max(50),
  primaryCtaLink: z.string().max(200),
  secondaryCtaText: z.string().max(50),
  secondaryCtaLink: z.string().max(200),
  highlightNumber: z.string().max(50),
  highlightLabel: z.string().max(100),
  highlightSubLabel: z.string().max(100),
  floatingBadge1: z.string().max(50),
  floatingBadge2: z.string().max(50),
});

// Stats schema
const statsSchema = z.object({
  stats: z.array(z.object({
    value: z.string().max(50),
    label: z.string().max(50),
  })),
});

// Category icons schema
const categoryIconSchema = z.object({
  name: z.string().min(1),
  icon: z.string().min(1).max(10),
});

type HeroValues = z.infer<typeof heroSchema>;
type AboutValues = z.infer<typeof aboutSchema>;
type StatsValues = z.infer<typeof statsSchema>;
type CategoryIcon = z.infer<typeof categoryIconSchema>;

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

export default function AdminHomepage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState("hero");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Homepage</h2>
        <p className="text-muted-foreground">
          Customize your homepage sections – hero, stats, about, and category icons.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="about">About Section</TabsTrigger>
          <TabsTrigger value="categories">Category Icons</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="mt-6">
          <HeroEditor />
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <StatsEditor />
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <AboutEditor />
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <CategoryIconsEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Hero Editor
function HeroEditor() {
  const qc = useQueryClient();
  
  const query = useQuery({
    queryKey: ["admin", "site_content", "home.hero"],
    queryFn: () => fetchKey<any>("home.hero"),
  });

  const defaults: HeroValues = {
    headline: "India's Most",
    highlightWord: "Trusted",
    subheadline: "Digital Product Store",
    badgeText: "Up to 80% OFF on All Products",
    primaryCtaText: "Explore Products",
    primaryCtaLink: "/products",
    secondaryCtaText: "Contact Us",
    secondaryCtaLink: "/contact",
  };

  const form = useForm<HeroValues>({
    resolver: zodResolver(heroSchema),
    defaultValues: query.data ? {
      headline: query.data.headline ?? defaults.headline,
      highlightWord: query.data.highlightWord ?? defaults.highlightWord,
      subheadline: query.data.subheadline ?? defaults.subheadline,
      badgeText: query.data.badgeText ?? defaults.badgeText,
      primaryCtaText: query.data.primaryCtaText ?? defaults.primaryCtaText,
      primaryCtaLink: query.data.primaryCtaLink ?? defaults.primaryCtaLink,
      secondaryCtaText: query.data.secondaryCtaText ?? defaults.secondaryCtaText,
      secondaryCtaLink: query.data.secondaryCtaLink ?? defaults.secondaryCtaLink,
    } : defaults,
  });

  // Sync form when data loads
  const data = query.data;
  if (data && !form.formState.isDirty) {
    form.reset({
      headline: data.headline ?? defaults.headline,
      highlightWord: data.highlightWord ?? defaults.highlightWord,
      subheadline: data.subheadline ?? defaults.subheadline,
      badgeText: data.badgeText ?? defaults.badgeText,
      primaryCtaText: data.primaryCtaText ?? defaults.primaryCtaText,
      primaryCtaLink: data.primaryCtaLink ?? defaults.primaryCtaLink,
      secondaryCtaText: data.secondaryCtaText ?? defaults.secondaryCtaText,
      secondaryCtaLink: data.secondaryCtaLink ?? defaults.secondaryCtaLink,
    });
  }

  const mutation = useMutation({
    mutationFn: async (values: HeroValues) => {
      // Merge with existing data to preserve stats/trustBadges
      const existing = query.data ?? {};
      const merged = { ...existing, ...values };
      return upsertKey("home.hero", merged as unknown as Json);
    },
    onSuccess: () => {
      toast({ title: "Saved", description: "Hero section updated." });
      qc.invalidateQueries({ queryKey: ["admin", "site_content", "home.hero"] });
      qc.invalidateQueries({ queryKey: ["site_content", "home.hero"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err?.message ?? "Failed to save.", variant: "destructive" });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Section</CardTitle>
        <CardDescription>The main banner at the top of your homepage.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-6">
          <div className="space-y-2">
            <Label>Badge Text (above headline)</Label>
            <Input {...form.register("badgeText")} placeholder="Up to 80% OFF on All Products" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Headline Start</Label>
              <Input {...form.register("headline")} placeholder="India's Most" />
            </div>
            <div className="space-y-2">
              <Label>Highlighted Word</Label>
              <Input {...form.register("highlightWord")} placeholder="Trusted" />
              <p className="text-xs text-muted-foreground">This word gets the gradient effect.</p>
            </div>
            <div className="space-y-2">
              <Label>Headline End</Label>
              <Input {...form.register("subheadline")} placeholder="Digital Product Store" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary Button Text</Label>
              <Input {...form.register("primaryCtaText")} placeholder="Explore Products" />
            </div>
            <div className="space-y-2">
              <Label>Primary Button Link</Label>
              <Input {...form.register("primaryCtaLink")} placeholder="/products" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Secondary Button Text</Label>
              <Input {...form.register("secondaryCtaText")} placeholder="Contact Us" />
            </div>
            <div className="space-y-2">
              <Label>Secondary Button Link</Label>
              <Input {...form.register("secondaryCtaLink")} placeholder="/contact" />
            </div>
          </div>

          <Button type="submit" disabled={mutation.isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {mutation.isPending ? "Saving…" : "Save Hero Section"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Stats Editor
function StatsEditor() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["admin", "site_content", "home.hero"],
    queryFn: () => fetchKey<any>("home.hero"),
  });

  const defaultStats = [
    { value: "15,000+", label: "Happy Customers" },
    { value: "200+", label: "Products" },
    { value: "Since 2021", label: "Trusted" },
    { value: "24/7", label: "Support" },
  ];

  const [stats, setStats] = useState(query.data?.stats ?? defaultStats);

  // Sync when data loads
  if (query.data?.stats && stats === defaultStats) {
    setStats(query.data.stats);
  }

  const mutation = useMutation({
    mutationFn: async () => {
      const existing = query.data ?? {};
      const merged = { ...existing, stats };
      return upsertKey("home.hero", merged as unknown as Json);
    },
    onSuccess: () => {
      toast({ title: "Saved", description: "Stats updated." });
      qc.invalidateQueries({ queryKey: ["admin", "site_content", "home.hero"] });
      qc.invalidateQueries({ queryKey: ["site_content", "home.hero"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err?.message ?? "Failed to save.", variant: "destructive" });
    },
  });

  const updateStat = (index: number, field: "value" | "label", val: string) => {
    setStats(stats.map((s: any, i: number) => (i === index ? { ...s, [field]: val } : s)));
  };

  const addStat = () => {
    if (stats.length >= 6) return;
    setStats([...stats, { value: "", label: "" }]);
  };

  const removeStat = (index: number) => {
    setStats(stats.filter((_: any, i: number) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Stats</CardTitle>
        <CardDescription>The stat boxes displayed on the right side of the hero.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {stats.map((stat: any, i: number) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <Input
                  value={stat.value}
                  onChange={(e) => updateStat(i, "value", e.target.value)}
                  placeholder="15,000+"
                />
                <Input
                  value={stat.label}
                  onChange={(e) => updateStat(i, "label", e.target.value)}
                  placeholder="Happy Customers"
                />
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeStat(i)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        {stats.length < 6 && (
          <Button type="button" variant="outline" onClick={addStat} className="gap-2">
            <Plus className="h-4 w-4" /> Add Stat
          </Button>
        )}

        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="gap-2">
          <Save className="h-4 w-4" />
          {mutation.isPending ? "Saving…" : "Save Stats"}
        </Button>
      </CardContent>
    </Card>
  );
}

// About Editor
function AboutEditor() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["admin", "site_content", "home.about"],
    queryFn: () => fetchKey<any>("home.about"),
  });

  const defaults = {
    subtitle: "About Us",
    title: "Dreamcrest Solutions",
    tagline: "Oldest Multiplatform Service Provider",
    description: "Dreamcrest Group is a leading provider of OTT services and group buy tools at discounted prices. Founded in 2021, Dreamcrest has gained over 15,000+ customers and has expanded its reach internationally.",
    bulletPointsText: "Most Trusted Service Provider\nOver 200+ Products Available\nMost Responsive Customer Support\nInstant Digital Delivery",
    primaryCtaText: "Contact Us",
    primaryCtaLink: "/contact",
    secondaryCtaText: "View Proofs",
    secondaryCtaLink: "https://www.instagram.com/dreamcrest_solutions",
    highlightNumber: "15,000+",
    highlightLabel: "Happy Customers",
    highlightSubLabel: "& Growing Every Day",
    floatingBadge1: "⭐ 4.9 Rating",
    floatingBadge2: "🚀 Since 2021",
  };

  const form = useForm<AboutValues>({
    resolver: zodResolver(aboutSchema),
    defaultValues: defaults,
  });

  // Sync when data loads
  const data = query.data;
  if (data && !form.formState.isDirty) {
    form.reset({
      subtitle: data.subtitle ?? defaults.subtitle,
      title: data.title ?? defaults.title,
      tagline: data.tagline ?? defaults.tagline,
      description: data.description ?? defaults.description,
      bulletPointsText: (data.bulletPoints ?? []).join("\n") || defaults.bulletPointsText,
      primaryCtaText: data.primaryCtaText ?? defaults.primaryCtaText,
      primaryCtaLink: data.primaryCtaLink ?? defaults.primaryCtaLink,
      secondaryCtaText: data.secondaryCtaText ?? defaults.secondaryCtaText,
      secondaryCtaLink: data.secondaryCtaLink ?? defaults.secondaryCtaLink,
      highlightNumber: data.highlightNumber ?? defaults.highlightNumber,
      highlightLabel: data.highlightLabel ?? defaults.highlightLabel,
      highlightSubLabel: data.highlightSubLabel ?? defaults.highlightSubLabel,
      floatingBadge1: data.floatingBadge1 ?? defaults.floatingBadge1,
      floatingBadge2: data.floatingBadge2 ?? defaults.floatingBadge2,
    });
  }

  const mutation = useMutation({
    mutationFn: async (values: AboutValues) => {
      const toSave = {
        ...values,
        bulletPoints: values.bulletPointsText.split("\n").filter((s) => s.trim()),
      };
      return upsertKey("home.about", toSave as unknown as Json);
    },
    onSuccess: () => {
      toast({ title: "Saved", description: "About section updated." });
      qc.invalidateQueries({ queryKey: ["admin", "site_content", "home.about"] });
      qc.invalidateQueries({ queryKey: ["site_content", "home.about"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err?.message ?? "Failed to save.", variant: "destructive" });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>About Section</CardTitle>
        <CardDescription>The "About Us" section on your homepage.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input {...form.register("subtitle")} placeholder="About Us" />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input {...form.register("title")} placeholder="Dreamcrest Solutions" />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input {...form.register("tagline")} placeholder="Oldest Multiplatform..." />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea {...form.register("description")} rows={4} placeholder="About your company..." />
          </div>

          <div className="space-y-2">
            <Label>Bullet Points (one per line)</Label>
            <Textarea {...form.register("bulletPointsText")} rows={4} placeholder="Most Trusted Service Provider..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary CTA Text</Label>
              <Input {...form.register("primaryCtaText")} />
            </div>
            <div className="space-y-2">
              <Label>Primary CTA Link</Label>
              <Input {...form.register("primaryCtaLink")} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Secondary CTA Text</Label>
              <Input {...form.register("secondaryCtaText")} />
            </div>
            <div className="space-y-2">
              <Label>Secondary CTA Link</Label>
              <Input {...form.register("secondaryCtaLink")} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Highlight Number</Label>
              <Input {...form.register("highlightNumber")} placeholder="15,000+" />
            </div>
            <div className="space-y-2">
              <Label>Highlight Label</Label>
              <Input {...form.register("highlightLabel")} placeholder="Happy Customers" />
            </div>
            <div className="space-y-2">
              <Label>Highlight Sub-Label</Label>
              <Input {...form.register("highlightSubLabel")} placeholder="& Growing Every Day" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Floating Badge 1</Label>
              <Input {...form.register("floatingBadge1")} placeholder="⭐ 4.9 Rating" />
            </div>
            <div className="space-y-2">
              <Label>Floating Badge 2</Label>
              <Input {...form.register("floatingBadge2")} placeholder="🚀 Since 2021" />
            </div>
          </div>

          <Button type="submit" disabled={mutation.isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {mutation.isPending ? "Saving…" : "Save About Section"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Category Icons Editor
function CategoryIconsEditor() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["admin", "site_content", "home.categoryIcons"],
    queryFn: () => fetchKey<CategoryIcon[]>("home.categoryIcons"),
  });

  const defaultIcons: CategoryIcon[] = [
    { name: "AI Tools", icon: "🤖" },
    { name: "Video Editing", icon: "🎬" },
    { name: "Indian OTT", icon: "📺" },
    { name: "International OTT", icon: "🌍" },
    { name: "Writing Tools", icon: "✍️" },
    { name: "Cloud Services", icon: "☁️" },
    { name: "Lead Generation", icon: "👥" },
    { name: "Software", icon: "💻" },
  ];

  const [icons, setIcons] = useState(query.data ?? defaultIcons);

  // Sync when data loads
  if (query.data && icons === defaultIcons) {
    setIcons(query.data);
  }

  const mutation = useMutation({
    mutationFn: () => upsertKey("home.categoryIcons", icons as unknown as Json),
    onSuccess: () => {
      toast({ title: "Saved", description: "Category icons updated." });
      qc.invalidateQueries({ queryKey: ["admin", "site_content", "home.categoryIcons"] });
      qc.invalidateQueries({ queryKey: ["site_content", "home.categoryIcons"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err?.message ?? "Failed to save.", variant: "destructive" });
    },
  });

  const updateIcon = (index: number, field: "name" | "icon", val: string) => {
    setIcons(icons.map((s, i) => (i === index ? { ...s, [field]: val } : s)));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Icons</CardTitle>
        <CardDescription>Customize the emoji icons shown for each category on the homepage.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {icons.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
              <Input
                value={item.icon}
                onChange={(e) => updateIcon(i, "icon", e.target.value)}
                className="w-16 text-center text-2xl"
                maxLength={4}
              />
              <Input
                value={item.name}
                onChange={(e) => updateIcon(i, "name", e.target.value)}
                placeholder="Category name"
                className="flex-1"
              />
            </div>
          ))}
        </div>

        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="gap-2">
          <Save className="h-4 w-4" />
          {mutation.isPending ? "Saving…" : "Save Category Icons"}
        </Button>
      </CardContent>
    </Card>
  );
}
