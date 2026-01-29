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

// Site config schema
const siteConfigSchema = z.object({
  name: z.string().min(1).max(100),
  tagline: z.string().max(200),
  description: z.string().max(500),
  since: z.coerce.number().int().min(1900).max(2100),
  customers: z.string().max(50),
  products: z.string().max(50),
});

// Address schema
const addressSchema = z.object({
  street: z.string().max(200),
  city: z.string().max(100),
  state: z.string().max(100),
  pincode: z.string().max(20),
  country: z.string().max(100),
});

// Contact schema
const contactSchema = z.object({
  phone: z.string().max(50),
  email: z.string().email().max(100),
});

// Social schema
const socialSchema = z.object({
  instagram: z.string().max(200),
  facebook: z.string().max(200),
  youtube: z.string().max(200),
});

// WhatsApp number type
interface WhatsAppNumber {
  number: string;
  label: string;
}

// Sister brand type
interface SisterBrand {
  name: string;
  url: string;
  description: string;
}

type SiteConfigValues = z.infer<typeof siteConfigSchema>;
type AddressValues = z.infer<typeof addressSchema>;
type ContactValues = z.infer<typeof contactSchema>;
type SocialValues = z.infer<typeof socialSchema>;

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

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Site Settings</h2>
        <p className="text-muted-foreground">
          Configure your site's global settings, contact info, and social links.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="brands">Brands</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <GeneralEditor />
        </TabsContent>

        <TabsContent value="address" className="mt-6">
          <AddressEditor />
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          <ContactEditor />
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <SocialEditor />
        </TabsContent>

        <TabsContent value="brands" className="mt-6">
          <BrandsEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// General Settings Editor
function GeneralEditor() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["admin", "site_content", "site.config"],
    queryFn: () => fetchKey<any>("site.config"),
  });

  const defaults: SiteConfigValues = {
    name: "Dreamcrest",
    tagline: "India's Most Trusted & Oldest Multi Platform Service Provider",
    description: "Get premium digital products at discounted prices. OTT subscriptions, AI tools, software, and more with 15,000+ happy customers.",
    since: 2021,
    customers: "15,000+",
    products: "200+",
  };

  const form = useForm<SiteConfigValues>({
    resolver: zodResolver(siteConfigSchema),
    defaultValues: defaults,
  });

  const data = query.data;
  if (data && !form.formState.isDirty) {
    form.reset({
      name: data.name ?? defaults.name,
      tagline: data.tagline ?? defaults.tagline,
      description: data.description ?? defaults.description,
      since: data.since ?? defaults.since,
      customers: data.customers ?? defaults.customers,
      products: data.products ?? defaults.products,
    });
  }

  const mutation = useMutation({
    mutationFn: async (values: SiteConfigValues) => {
      const existing = query.data ?? {};
      const merged = { ...existing, ...values };
      return upsertKey("site.config", merged as unknown as Json);
    },
    onSuccess: () => {
      toast({ title: "Saved", description: "General settings updated." });
      qc.invalidateQueries({ queryKey: ["admin", "site_content", "site.config"] });
      qc.invalidateQueries({ queryKey: ["site_content", "site.config"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err?.message ?? "Failed to save.", variant: "destructive" });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Your site's name, tagline, and key stats.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Site Name</Label>
              <Input {...form.register("name")} placeholder="Dreamcrest" />
            </div>
            <div className="space-y-2">
              <Label>Since (Year)</Label>
              <Input {...form.register("since")} type="number" placeholder="2021" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input {...form.register("tagline")} placeholder="India's Most Trusted..." />
          </div>

          <div className="space-y-2">
            <Label>Description (for SEO)</Label>
            <Textarea {...form.register("description")} rows={3} placeholder="Get premium digital products..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Customer Count Display</Label>
              <Input {...form.register("customers")} placeholder="15,000+" />
            </div>
            <div className="space-y-2">
              <Label>Product Count Display</Label>
              <Input {...form.register("products")} placeholder="200+" />
            </div>
          </div>

          <Button type="submit" disabled={mutation.isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {mutation.isPending ? "Saving…" : "Save General Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Address Editor
function AddressEditor() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["admin", "site_content", "site.config"],
    queryFn: () => fetchKey<any>("site.config"),
  });

  const defaults: AddressValues = {
    street: "320 VGN Tranquil Pother",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "603203",
    country: "India",
  };

  const form = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: defaults,
  });

  const data = query.data?.address;
  if (data && !form.formState.isDirty) {
    form.reset({
      street: data.street ?? defaults.street,
      city: data.city ?? defaults.city,
      state: data.state ?? defaults.state,
      pincode: data.pincode ?? defaults.pincode,
      country: data.country ?? defaults.country,
    });
  }

  const mutation = useMutation({
    mutationFn: async (values: AddressValues) => {
      const existing = query.data ?? {};
      const merged = { ...existing, address: values };
      return upsertKey("site.config", merged as unknown as Json);
    },
    onSuccess: () => {
      toast({ title: "Saved", description: "Address updated." });
      qc.invalidateQueries({ queryKey: ["admin", "site_content", "site.config"] });
      qc.invalidateQueries({ queryKey: ["site_content", "site.config"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err?.message ?? "Failed to save.", variant: "destructive" });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Address</CardTitle>
        <CardDescription>Your business address shown in the footer.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-6">
          <div className="space-y-2">
            <Label>Street Address</Label>
            <Input {...form.register("street")} placeholder="123 Main Street" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>City</Label>
              <Input {...form.register("city")} placeholder="Chennai" />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Input {...form.register("state")} placeholder="Tamil Nadu" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Pincode</Label>
              <Input {...form.register("pincode")} placeholder="603203" />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input {...form.register("country")} placeholder="India" />
            </div>
          </div>

          <Button type="submit" disabled={mutation.isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {mutation.isPending ? "Saving…" : "Save Address"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Contact Editor
function ContactEditor() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["admin", "site_content", "site.config"],
    queryFn: () => fetchKey<any>("site.config"),
  });

  const defaultContact: ContactValues = {
    phone: "+91 6357998730",
    email: "dreamcrestsolutions@gmail.com",
  };

  const defaultWhatsApp: WhatsAppNumber[] = [
    { number: "+91 6357998730", label: "Primary" },
  ];

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: defaultContact,
  });

  const [whatsappNumbers, setWhatsappNumbers] = useState(query.data?.contact?.whatsapp ?? defaultWhatsApp);

  const data = query.data?.contact;
  if (data && !form.formState.isDirty) {
    form.reset({
      phone: data.phone ?? defaultContact.phone,
      email: data.email ?? defaultContact.email,
    });
  }

  if (data?.whatsapp && whatsappNumbers === defaultWhatsApp) {
    setWhatsappNumbers(data.whatsapp);
  }

  const mutation = useMutation({
    mutationFn: async (values: ContactValues) => {
      const existing = query.data ?? {};
      const merged = {
        ...existing,
        contact: {
          ...values,
          whatsapp: whatsappNumbers,
        },
      };
      return upsertKey("site.config", merged as unknown as Json);
    },
    onSuccess: () => {
      toast({ title: "Saved", description: "Contact info updated." });
      qc.invalidateQueries({ queryKey: ["admin", "site_content", "site.config"] });
      qc.invalidateQueries({ queryKey: ["site_content", "site.config"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err?.message ?? "Failed to save.", variant: "destructive" });
    },
  });

  const addWhatsApp = () => {
    setWhatsappNumbers([...whatsappNumbers, { number: "", label: "" }]);
  };

  const removeWhatsApp = (index: number) => {
    setWhatsappNumbers(whatsappNumbers.filter((_: any, i: number) => i !== index));
  };

  const updateWhatsApp = (index: number, field: "number" | "label", val: string) => {
    setWhatsappNumbers(whatsappNumbers.map((w: any, i: number) => (i === index ? { ...w, [field]: val } : w)));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>Phone, email, and WhatsApp numbers.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input {...form.register("phone")} placeholder="+91 6357998730" />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input {...form.register("email")} placeholder="email@example.com" />
            </div>
          </div>

          <div className="space-y-4">
            <Label>WhatsApp Numbers</Label>
            {whatsappNumbers.map((w: WhatsAppNumber, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <Input
                    value={w.number}
                    onChange={(e) => updateWhatsApp(i, "number", e.target.value)}
                    placeholder="+91 6357998730"
                  />
                  <Input
                    value={w.label}
                    onChange={(e) => updateWhatsApp(i, "label", e.target.value)}
                    placeholder="Primary"
                  />
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeWhatsApp(i)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addWhatsApp} className="gap-2">
              <Plus className="h-4 w-4" /> Add WhatsApp
            </Button>
          </div>

          <Button type="submit" disabled={mutation.isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {mutation.isPending ? "Saving…" : "Save Contact Info"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Social Editor
function SocialEditor() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["admin", "site_content", "site.config"],
    queryFn: () => fetchKey<any>("site.config"),
  });

  const defaults: SocialValues = {
    instagram: "https://www.instagram.com/dreamcrest_solutions",
    facebook: "https://www.facebook.com/dreamcrestsolutions/",
    youtube: "https://www.youtube.com/@dreamcrestsolutions5120",
  };

  const form = useForm<SocialValues>({
    resolver: zodResolver(socialSchema),
    defaultValues: defaults,
  });

  const data = query.data?.social;
  if (data && !form.formState.isDirty) {
    form.reset({
      instagram: data.instagram ?? defaults.instagram,
      facebook: data.facebook ?? defaults.facebook,
      youtube: data.youtube ?? defaults.youtube,
    });
  }

  const mutation = useMutation({
    mutationFn: async (values: SocialValues) => {
      const existing = query.data ?? {};
      const merged = { ...existing, social: values };
      return upsertKey("site.config", merged as unknown as Json);
    },
    onSuccess: () => {
      toast({ title: "Saved", description: "Social links updated." });
      qc.invalidateQueries({ queryKey: ["admin", "site_content", "site.config"] });
      qc.invalidateQueries({ queryKey: ["site_content", "site.config"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err?.message ?? "Failed to save.", variant: "destructive" });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Links</CardTitle>
        <CardDescription>Links to your social media profiles.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-6">
          <div className="space-y-2">
            <Label>Instagram URL</Label>
            <Input {...form.register("instagram")} placeholder="https://instagram.com/..." />
          </div>

          <div className="space-y-2">
            <Label>Facebook URL</Label>
            <Input {...form.register("facebook")} placeholder="https://facebook.com/..." />
          </div>

          <div className="space-y-2">
            <Label>YouTube URL</Label>
            <Input {...form.register("youtube")} placeholder="https://youtube.com/..." />
          </div>

          <Button type="submit" disabled={mutation.isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {mutation.isPending ? "Saving…" : "Save Social Links"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Sister Brands Editor
function BrandsEditor() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["admin", "site_content", "site.config"],
    queryFn: () => fetchKey<any>("site.config"),
  });

  const defaultBrands: SisterBrand[] = [
    { name: "Dreamtools", url: "https://dreamtools.in/", description: "Group Buy Tools" },
    { name: "Dreamstar Solutions", url: "#", description: "Digital Services" },
  ];

  const [brands, setBrands] = useState(query.data?.sisterBrands ?? defaultBrands);

  if (query.data?.sisterBrands && brands === defaultBrands) {
    setBrands(query.data.sisterBrands);
  }

  const mutation = useMutation({
    mutationFn: async () => {
      const existing = query.data ?? {};
      const merged = { ...existing, sisterBrands: brands };
      return upsertKey("site.config", merged as unknown as Json);
    },
    onSuccess: () => {
      toast({ title: "Saved", description: "Sister brands updated." });
      qc.invalidateQueries({ queryKey: ["admin", "site_content", "site.config"] });
      qc.invalidateQueries({ queryKey: ["site_content", "site.config"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err?.message ?? "Failed to save.", variant: "destructive" });
    },
  });

  const addBrand = () => {
    setBrands([...brands, { name: "", url: "", description: "" }]);
  };

  const removeBrand = (index: number) => {
    setBrands(brands.filter((_: any, i: number) => i !== index));
  };

  const updateBrand = (index: number, field: keyof SisterBrand, val: string) => {
    setBrands(brands.map((b: SisterBrand, i: number) => (i === index ? { ...b, [field]: val } : b)));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sister Brands</CardTitle>
        <CardDescription>Related brands shown in the footer.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {brands.map((brand: SisterBrand, i: number) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-lg border bg-card">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  value={brand.name}
                  onChange={(e) => updateBrand(i, "name", e.target.value)}
                  placeholder="Brand name"
                />
                <Input
                  value={brand.url}
                  onChange={(e) => updateBrand(i, "url", e.target.value)}
                  placeholder="https://..."
                />
                <Input
                  value={brand.description}
                  onChange={(e) => updateBrand(i, "description", e.target.value)}
                  placeholder="Description"
                />
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeBrand(i)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        <Button type="button" variant="outline" onClick={addBrand} className="gap-2">
          <Plus className="h-4 w-4" /> Add Brand
        </Button>

        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="gap-2 ml-4">
          <Save className="h-4 w-4" />
          {mutation.isPending ? "Saving…" : "Save Brands"}
        </Button>
      </CardContent>
    </Card>
  );
}
