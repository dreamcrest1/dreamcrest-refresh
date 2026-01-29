import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

import type { DbProduct } from "@/lib/db/products";
import { deleteProductAdmin, listProductsAdmin, updateProductAdmin, upsertProductAdmin } from "@/lib/db/products";
import { parseWooProductsCsv } from "@/lib/import/productsFromWooCsv";
import { supabase } from "@/integrations/supabase/client";

import { ProductFullEditor } from "@/pages/admin/products/ProductFullEditor";
import { ProductQuickEditDrawer, type QuickEditValues } from "@/pages/admin/products/ProductQuickEditDrawer";
import type { ProductFormValues } from "@/pages/admin/products/productForm";

// Exported by Vite as a raw string at build time.
// eslint-disable-next-line import/no-unresolved
import productsImportCsvRaw from "@/data/products-import.csv?raw";

export default function AdminProducts() {
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const [fullEditor, setFullEditor] = useState<{ mode: "create" } | { mode: "edit"; id: string } | null>(null);

  const [quickEditOpen, setQuickEditOpen] = useState(false);
  const [quickEditProduct, setQuickEditProduct] = useState<DbProduct | null>(null);

  const [importing, setImporting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [draftOrder, setDraftOrder] = useState<DbProduct[]>([]);
  const [dragId, setDragId] = useState<string | null>(null);

  const productsQuery = useQuery({
    queryKey: ["admin", "products"],
    queryFn: listProductsAdmin,
  });

  const sorted = useMemo(() => productsQuery.data ?? [], [productsQuery.data]);

  const normalizedQuery = query.trim().toLowerCase();
  const isFiltering = normalizedQuery.length > 0;
  const filtered = useMemo(() => {
    if (!isFiltering) return draftOrder;
    return draftOrder.filter((p) => {
      const haystack = `${p.name} ${p.category} ${p.legacy_id ?? ""}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [draftOrder, isFiltering, normalizedQuery]);

  useEffect(() => {
    setDraftOrder(sorted);
    // If data set changed, drop selections that no longer exist.
    setSelectedIds((prev) => {
      const next = new Set<string>();
      const ids = new Set(sorted.map((p) => p.id));
      for (const id of prev) if (ids.has(id)) next.add(id);
      return next;
    });
  }, [sorted]);

  const hasOrderChanges = useMemo(() => {
    if (draftOrder.length !== sorted.length) return false;
    for (let i = 0; i < draftOrder.length; i++) {
      if (draftOrder[i]?.id !== sorted[i]?.id) return true;
    }
    return false;
  }, [draftOrder, sorted]);

  const selected = useMemo(() => Array.from(selectedIds), [selectedIds]);
  const allSelected = draftOrder.length > 0 && selectedIds.size === draftOrder.length;

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
      setFullEditor(null);
      await qc.invalidateQueries({ queryKey: ["admin", "products"] });
    },
    onError: (err: any) => {
      toast({ title: "Save failed", description: err?.message ?? "Please try again.", variant: "destructive" });
    },
  });

  const quickEditMutation = useMutation({
    mutationFn: async (input: { id: string; patch: Parameters<typeof updateProductAdmin>[1] }) =>
      updateProductAdmin(input.id, input.patch),
    onSuccess: async () => {
      toast({ title: "Saved", description: "Changes applied." });
      setQuickEditOpen(false);
      setQuickEditProduct(null);
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

  const bulkUpdateMutation = useMutation({
    mutationFn: async (input: { ids: string[]; patch: Partial<Pick<DbProduct, "published" | "featured">> }) => {
      if (!input.ids.length) return;
      const { error } = await supabase.from("products").update(input.patch).in("id", input.ids);
      if (error) throw error;
    },
    onSuccess: async () => {
      toast({ title: "Updated", description: "Bulk update applied." });
      setSelectedIds(new Set());
      await qc.invalidateQueries({ queryKey: ["admin", "products"] });
    },
    onError: (err: any) => {
      toast({ title: "Update failed", description: err?.message ?? "Please try again.", variant: "destructive" });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      if (!ids.length) return;
      const { error } = await supabase.from("products").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: async () => {
      toast({ title: "Deleted", description: "Selected products deleted." });
      setSelectedIds(new Set());
      await qc.invalidateQueries({ queryKey: ["admin", "products"] });
    },
    onError: (err: any) => {
      toast({ title: "Delete failed", description: err?.message ?? "Please try again.", variant: "destructive" });
    },
  });

  const saveOrderMutation = useMutation({
    mutationFn: async (rows: DbProduct[]) => {
      const updates = rows.map((p, idx) => ({ id: p.id, sort_order: idx }));
      const BATCH = 25;
      for (let i = 0; i < updates.length; i += BATCH) {
        const batch = updates.slice(i, i + BATCH);
        await Promise.all(
          batch.map(async (u) => {
            const { error } = await supabase.from("products").update({ sort_order: u.sort_order }).eq("id", u.id);
            if (error) throw error;
          })
        );
      }
    },
    onSuccess: async () => {
      toast({ title: "Saved", description: "Order updated." });
      await qc.invalidateQueries({ queryKey: ["admin", "products"] });
    },
    onError: (err: any) => {
      toast({ title: "Save failed", description: err?.message ?? "Please try again.", variant: "destructive" });
    },
  });

  const startCreate = () => setFullEditor({ mode: "create" });
  const startEdit = (p: DbProduct) => setFullEditor({ mode: "edit", id: p.id });

  const startQuickEdit = (p: DbProduct) => {
    setQuickEditProduct(p);
    setQuickEditOpen(true);
  };

  const activeEditorProduct = useMemo(() => {
    if (!fullEditor) return null;
    if (fullEditor.mode === "create") return null;
    return sorted.find((p) => p.id === fullEditor.id) ?? null;
  }, [fullEditor, sorted]);

  // Early return AFTER all hooks
  if (fullEditor) {
    return (
      <ProductFullEditor
        product={activeEditorProduct}
        onBack={() => setFullEditor(null)}
        isSaving={upsertMutation.isPending}
        onSubmit={(values) => upsertMutation.mutate(values)}
      />
    );
  }

  const importFromCsv = async () => {
    setImporting(true);
    try {
      const parsed = parseWooProductsCsv(productsImportCsvRaw);
      if (!parsed.length) {
        toast({ title: "Nothing to import", description: "No published products found in CSV." });
        return;
      }

      const BATCH = 200;
      for (let i = 0; i < parsed.length; i += BATCH) {
        const batch = parsed.slice(i, i + BATCH);
        const { error } = await supabase.from("products").upsert(batch, { onConflict: "legacy_id" });
        if (error) throw error;
      }

      toast({ title: "Import complete", description: `Imported ${parsed.length} products from CSV.` });
      await qc.invalidateQueries({ queryKey: ["admin", "products"] });
    } catch (err: any) {
      toast({
        title: "Import failed",
        description: err?.message ?? "Please try again.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };


  const toggleAll = (checked: boolean) => {
    setSelectedIds(() => {
      if (!checked) return new Set();
      return new Set(draftOrder.map((p) => p.id));
    });
  };

  const toggleOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const moveByDrag = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    setDraftOrder((prev) => {
      const next = [...prev];
      const from = next.findIndex((p) => p.id === sourceId);
      const to = next.findIndex((p) => p.id === targetId);
      if (from < 0 || to < 0) return prev;
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          Manage products shown on your public Products pages.
        </div>
        <div className="flex flex-wrap gap-2">
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => bulkUpdateMutation.mutate({ ids: selected, patch: { published: true } })}
                disabled={bulkUpdateMutation.isPending}
              >
                Publish
              </Button>
              <Button
                variant="outline"
                onClick={() => bulkUpdateMutation.mutate({ ids: selected, patch: { published: false } })}
                disabled={bulkUpdateMutation.isPending}
              >
                Hide
              </Button>
              <Button
                variant="outline"
                onClick={() => bulkUpdateMutation.mutate({ ids: selected, patch: { featured: true } })}
                disabled={bulkUpdateMutation.isPending}
              >
                Feature
              </Button>
              <Button
                variant="outline"
                onClick={() => bulkUpdateMutation.mutate({ ids: selected, patch: { featured: false } })}
                disabled={bulkUpdateMutation.isPending}
              >
                Unfeature
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  const ok = window.confirm(`Delete ${selected.length} selected products?`);
                  if (!ok) return;
                  bulkDeleteMutation.mutate(selected);
                }}
                disabled={bulkDeleteMutation.isPending}
              >
                Delete
              </Button>
            </div>
          )}

          {hasOrderChanges && (
            <Button
              variant="outline"
              onClick={() => saveOrderMutation.mutate(draftOrder)}
              disabled={saveOrderMutation.isPending}
            >
              {saveOrderMutation.isPending ? "Saving…" : "Save order"}
            </Button>
          )}

          <Button variant="outline" onClick={importFromCsv} disabled={importing}>
            {importing ? "Importing…" : "Import CSV"}
          </Button>
          <Button onClick={startCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products (name, category, ID)…"
            aria-label="Search products"
          />
        </div>
        <div className="text-xs text-muted-foreground">
          {isFiltering
            ? "Reordering is disabled while searching. Clear search to drag & reorder."
            : "Tip: drag the grip handle to reorder rows, then click Save order."}
        </div>
      </div>

      <div className="rounded-lg border bg-card/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[48px]">
                <Checkbox checked={allSelected} onCheckedChange={(v) => toggleAll(Boolean(v))} aria-label="Select all" />
              </TableHead>
              <TableHead className="w-[44px]" />
              <TableHead className="w-[90px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow
                key={p.id}
                onDragOver={(e) => {
                  if (isFiltering) return;
                  if (!dragId) return;
                  e.preventDefault();
                }}
                onDrop={() => {
                  if (isFiltering) return;
                  if (!dragId) return;
                  moveByDrag(dragId, p.id);
                  setDragId(null);
                }}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(p.id)}
                    onCheckedChange={(v) => toggleOne(p.id, Boolean(v))}
                    aria-label={`Select ${p.name}`}
                  />
                </TableCell>
                <TableCell>
                  <button
                    type="button"
                    draggable={!isFiltering}
                    onDragStart={() => !isFiltering && setDragId(p.id)}
                    onDragEnd={() => setDragId(null)}
                    className={cn(
                      "inline-flex items-center justify-center rounded-md p-1 text-muted-foreground hover:text-foreground",
                      isFiltering && "opacity-40 cursor-not-allowed"
                    )}
                    aria-label="Drag to reorder"
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                </TableCell>
                <TableCell className="font-mono text-xs">{p.legacy_id ?? "—"}</TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      className="text-left hover:underline"
                      onClick={() => startEdit(p)}
                      title="Open full editor"
                    >
                      <span className="line-clamp-1">{p.name}</span>
                    </button>
                    <div className="flex flex-wrap items-center gap-2">
                      {p.featured && <Badge variant="secondary">Featured</Badge>}
                      {!p.published && <Badge variant="secondary">Hidden</Badge>}
                      <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => startQuickEdit(p)}>
                        Quick Edit
                      </Button>
                    </div>
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
                    <Button variant="outline" size="icon" onClick={() => startEdit(p)} aria-label="Open full editor">
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
            {!productsQuery.isLoading && (draftOrder?.length ?? 0) === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">
                  No products yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ProductQuickEditDrawer
        open={quickEditOpen}
        onOpenChange={(o) => {
          setQuickEditOpen(o);
          if (!o) setQuickEditProduct(null);
        }}
        product={quickEditProduct}
        isSaving={quickEditMutation.isPending}
        onSubmit={(values: QuickEditValues) => {
          if (!quickEditProduct) return;
          quickEditMutation.mutate({
            id: quickEditProduct.id,
            patch: {
              name: values.name,
              category: values.category,
              description: values.description,
              sale_price: values.sale_price,
              regular_price: values.regular_price,
              published: values.published,
              featured: values.featured,
            },
          });
        }}
      />
    </div>
  );
}
