import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { DbProduct } from "@/lib/db/products";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const quickEditSchema = z.object({
  name: z.string().trim().min(2).max(200),
  category: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(500),
  sale_price: z.coerce.number().nonnegative(),
  regular_price: z.coerce.number().nonnegative(),
  published: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export type QuickEditValues = z.infer<typeof quickEditSchema>;

export function ProductQuickEditDrawer(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: DbProduct | null;
  onSubmit: (values: QuickEditValues) => void;
  isSaving?: boolean;
}) {
  const form = useForm<QuickEditValues>({
    resolver: zodResolver(quickEditSchema),
    defaultValues: {
      name: "",
      category: "Software",
      description: "",
      sale_price: 0,
      regular_price: 0,
      published: true,
      featured: false,
    },
  });

  useEffect(() => {
    if (!props.product) return;
    form.reset({
      name: props.product.name,
      category: props.product.category,
      description: props.product.description,
      sale_price: Number(props.product.sale_price ?? 0),
      regular_price: Number(props.product.regular_price ?? 0),
      published: props.product.published,
      featured: props.product.featured,
    });
  }, [props.product, form]);

  return (
    <Drawer open={props.open} onOpenChange={props.onOpenChange}>
      <DrawerContent className="z-50">
        <div className="mx-auto w-full max-w-3xl">
          <DrawerHeader className="text-left">
            <DrawerTitle>Quick Edit</DrawerTitle>
            <DrawerDescription>
              Update the common fields fast (like WordPress Quick Edit).
            </DrawerDescription>
          </DrawerHeader>

          <form
            onSubmit={form.handleSubmit(props.onSubmit)}
            className="grid grid-cols-1 gap-5 px-4 pb-2 md:grid-cols-2"
          >
            <div className="space-y-2 md:col-span-2">
              <Label>Name</Label>
              <Input {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Input {...form.register("category")} />
              {form.formState.errors.category && (
                <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
              )}
            </div>

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

            <div className="space-y-2 md:col-span-2">
              <Label>Short description</Label>
              <Textarea rows={4} {...form.register("description")} />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 md:col-span-2">
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

            <DrawerFooter className="px-0 md:col-span-2">
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={() => props.onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={props.isSaving}>
                  {props.isSaving ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
