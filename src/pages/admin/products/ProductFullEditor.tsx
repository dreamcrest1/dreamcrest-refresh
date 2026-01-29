import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { DbProduct } from "@/lib/db/products";
import { productSchema, toFormDefaults, type ProductFormValues } from "./productForm";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export function ProductFullEditor(props: {
  product?: DbProduct | null;
  onBack: () => void;
  onSubmit: (values: ProductFormValues) => void;
  isSaving?: boolean;
}) {
  const defaults = useMemo(() => toFormDefaults(props.product ?? undefined), [props.product]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaults,
    values: defaults,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm text-muted-foreground">Products</div>
          <h2 className="text-xl font-semibold">{props.product ? "Edit product" : "Add product"}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={props.onBack}>
            Back to list
          </Button>
          <Button
            type="button"
            onClick={form.handleSubmit(props.onSubmit)}
            disabled={props.isSaving}
          >
            {props.isSaving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      <form className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="bg-card/50 lg:col-span-2">
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            </div>

            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Short description</Label>
              <Textarea rows={4} {...form.register("description")} />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Long description (optional)</Label>
              <Textarea rows={8} {...form.register("long_description")} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Pricing</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Sale</Label>
                    <Input inputMode="decimal" {...form.register("sale_price")} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Regular</Label>
                    <Input inputMode="decimal" {...form.register("regular_price")} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Flags</Label>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={form.watch("published")}
                      onCheckedChange={(v) => form.setValue("published", Boolean(v))}
                    />
                    Published
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={form.watch("featured")}
                      onCheckedChange={(v) => form.setValue("featured", Boolean(v))}
                    />
                    Featured
                  </label>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Links</Label>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Image URL</Label>
                    <Input {...form.register("image_url")} />
                    {form.formState.errors.image_url && (
                      <p className="text-sm text-destructive">{form.formState.errors.image_url.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Buy link (External URL)</Label>
                    <Input {...form.register("external_url")} />
                    {form.formState.errors.external_url && (
                      <p className="text-sm text-destructive">{form.formState.errors.external_url.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Sort order</Label>
                <Input inputMode="numeric" {...form.register("sort_order")} />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>

      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="outline" onClick={props.onBack}>
          Back
        </Button>
        <Button type="button" onClick={form.handleSubmit(props.onSubmit)} disabled={props.isSaving}>
          {props.isSaving ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}
