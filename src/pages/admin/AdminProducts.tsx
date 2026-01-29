import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

import type { DbProduct } from "@/lib/db/products";
import { deleteProductAdmin, listProductsAdmin, upsertProductAdmin } from "@/lib/db/products";

const productSchema = z.object({
  id: z.string().optional(),
  legacy_id: z.coerce.number().int().positive("Legacy ID must be a positive number"),
  name: z.string().trim().min(2).max(200),
  description: z.string().trim().min(10).max(500),
  long_description: z.string().trim().max(5000).optional().or(z.literal("")),
  category: z.string().trim().min(2).max(100),
  sale_price: z.coerce.number().nonnegative(),
  regular_price: z.coerce.number().nonnegative(),
  image_url: z.string().trim().url("Image URL must be a valid URL"),
  external_url: z.string().trim().url("Buy link must be a valid URL"),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sort_order: z.coerce.number().int().nonnegative().default(0),
});

type ProductFormValues = z.infer<typeof productSchema>;

function toFormDefaults(p?: DbProduct): ProductFormValues {
  return {
    id: p?.id,
    legacy_id: p?.legacy_id ?? 0,
    name: p?.name ?? "",
    description: p?.description ?? "",
    long_description: p?.long_description ?? "",
    category: p?.category ?? "Software",
    sale_price: Number(p?.sale_price ?? 0),
    regular_price: Number(p?.regular_price ?? 0),
    image_url: p?.image_url ?? "",
    external_url: p?.external_url ?? "",
    featured: p?.featured ?? false,
    published: p?.published ?? true,
    sort_order: p?.sort_order ?? 0,
  };
}

export default function AdminProducts() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DbProduct | null>(null);

  const productsQuery = useQuery({
    queryKey: ["admin", "products"],
    queryFn: listProductsAdmin,
  });

  const sorted = useMemo(() => productsQuery.data ?? [], [productsQuery.data]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: toFormDefaults(undefined),
  });

  const upsertMutation = useMutation({
    mutationFn: async (values: ProductFormValues) =>
      upsertProductAdmin({
        id: values.id,
        legacy_id: values.legacy_id ?? 0,
        name: values.name ?? "",
        description: values.description ?? "",
        long_description: values.long_description || undefined,
        category: values.category ?? "Software",
        sale_price: values.sale_price ?? 0,
        regular_price: values.regular_price ?? 0,
        image_url: values.image_url ?? "",
        external_url: values.external_url ?? "",
        featured: values.featured ?? false,
        published: values.published ?? true,
        sort_order: values.sort_order ?? 0,
      }),
    onSuccess: async () => {
      toast({ title: "Saved", description: "Product updated." });
      setOpen(false);
      setEditing(null);
      await qc.invalidateQueries({ queryKey: ["admin", "products"] });
    },
    onError: (err: any) => {
      toast({ title: "Save failed", description: err?.message ?? "Please try again.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductAdmin,
    onSuccess: async () => {
      toast({ title: "Deleted", description: "Product removed." });
      await qc.invalidateQueries({ queryKey: ["admin", "products"] });
    },
    onError: (err: any) => {
      toast({ title: "Delete failed", description: err?.message ?? "Please try again.", variant: "destructive" });
    },
  });

  const startCreate = () => {
    setEditing(null);
    form.reset(toFormDefaults(undefined));
    setOpen(true);
  };

  const startEdit = (p: DbProduct) => {
    setEditing(p);
    form.reset(toFormDefaults(p));
    setOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          Manage products shown on your public Products pages.
        </div>
        <Button onClick={startCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="rounded-lg border bg-card/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[90px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs">{p.legacy_id ?? "—"}</TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span className="line-clamp-1">{p.name}</span>
                    {p.featured && <Badge variant="secondary">Featured</Badge>}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{p.category}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge className={cn(!p.published && "opacity-60")} variant={p.published ? "default" : "secondary"}>
                    {p.published ? "Published" : "Hidden"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => startEdit(p)} aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const ok = window.confirm(`Delete "${p.name}"?`);
                        if (!ok) return;
                        deleteMutation.mutate(p.id);
                      }}
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!productsQuery.isLoading && (sorted?.length ?? 0) === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">
                  No products yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <span className="hidden" />
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit product" : "Add product"}</DialogTitle>
            <DialogDescription>
              Legacy ID keeps your existing /product/1234 links working.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit((values) => upsertMutation.mutate(values))}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="space-y-2">
              <Label>Legacy ID</Label>
              <Input inputMode="numeric" {...form.register("legacy_id")} />
              {form.formState.errors.legacy_id && (
                <p className="text-sm text-destructive">{form.formState.errors.legacy_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Input {...form.register("category")} />
              {form.formState.errors.category && (
                <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Name</Label>
              <Input {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Short description</Label>
              <Input {...form.register("description")} />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Long description (optional)</Label>
              <Input {...form.register("long_description")} />
            </div>

            <div className="space-y-2">
              <Label>Sale price</Label>
              <Input inputMode="decimal" {...form.register("sale_price")} />
            </div>

            <div className="space-y-2">
              <Label>Regular price</Label>
              <Input inputMode="decimal" {...form.register("regular_price")} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Image URL</Label>
              <Input {...form.register("image_url")} />
              {form.formState.errors.image_url && (
                <p className="text-sm text-destructive">{form.formState.errors.image_url.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Buy link (External URL)</Label>
              <Input {...form.register("external_url")} />
              {form.formState.errors.external_url && (
                <p className="text-sm text-destructive">{form.formState.errors.external_url.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Sort order</Label>
              <Input inputMode="numeric" {...form.register("sort_order")} />
            </div>

            <div className="space-y-2">
              <Label>Flags</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={form.watch("published") ? "default" : "outline"}
                  onClick={() => form.setValue("published", !form.getValues("published"))}
                >
                  {form.watch("published") ? "Published" : "Hidden"}
                </Button>
                <Button
                  type="button"
                  variant={form.watch("featured") ? "default" : "outline"}
                  onClick={() => form.setValue("featured", !form.getValues("featured"))}
                >
                  {form.watch("featured") ? "Featured" : "Not featured"}
                </Button>
              </div>
            </div>

            <DialogFooter className="md:col-span-2">
              <Button type="submit" disabled={upsertMutation.isPending}>
                {upsertMutation.isPending ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
