import { useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

import type { SiteContentRow } from "@/lib/db/siteContent";
import { deleteSiteContentAdmin, listSiteContentAdmin, upsertSiteContentAdmin } from "@/lib/db/siteContent";
import type { Json } from "@/integrations/supabase/types";

const schema = z.object({
  key: z.string().trim().min(1).max(200),
  valueJson: z.string().trim().min(2, "Value must be valid JSON"),
});

type FormValues = z.infer<typeof schema>;

function rowToDefaults(row?: SiteContentRow): FormValues {
  return {
    key: row?.key ?? "",
    valueJson: JSON.stringify(row?.value ?? {}, null, 2),
  };
}

export default function AdminSiteContent() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SiteContentRow | null>(null);

  const query = useQuery({
    queryKey: ["admin", "site_content"],
    queryFn: listSiteContentAdmin,
  });

  const rows = useMemo(() => query.data ?? [], [query.data]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: rowToDefaults(undefined),
  });

  const upsert = useMutation({
    mutationFn: async (values: FormValues) => {
      let parsed: Json;
      try {
        parsed = JSON.parse(values.valueJson) as Json;
      } catch {
        throw new Error("Invalid JSON in value");
      }
      return upsertSiteContentAdmin({ key: values.key, value: parsed });
    },
    onSuccess: async () => {
      toast({ title: "Saved", description: "Site content updated." });
      setOpen(false);
      setEditing(null);
      await qc.invalidateQueries({ queryKey: ["admin", "site_content"] });
    },
    onError: (err: any) => {
      toast({ title: "Save failed", description: err?.message ?? "Please try again.", variant: "destructive" });
    },
  });

  const del = useMutation({
    mutationFn: deleteSiteContentAdmin,
    onSuccess: async () => {
      toast({ title: "Deleted", description: "Key removed." });
      await qc.invalidateQueries({ queryKey: ["admin", "site_content"] });
    },
    onError: (err: any) => {
      toast({ title: "Delete failed", description: err?.message ?? "Please try again.", variant: "destructive" });
    },
  });

  const startCreate = () => {
    setEditing(null);
    form.reset(rowToDefaults(undefined));
    setOpen(true);
  };

  const startEdit = (row: SiteContentRow) => {
    setEditing(row);
    form.reset(rowToDefaults(row));
    setOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Keys are public-readable; only admins can edit. Store JSON values for flexible site configuration.
        </p>
        <Button onClick={startCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Add Key
        </Button>
      </div>

      <div className="rounded-lg border bg-card/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead className="hidden md:table-cell">Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.key}>
                <TableCell className="font-mono text-xs">{r.key}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="secondary">{new Date(r.updated_at).toLocaleString()}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => startEdit(r)} aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const ok = window.confirm(`Delete key "${r.key}"?`);
                        if (!ok) return;
                        del.mutate(r.key);
                      }}
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!query.isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-sm text-muted-foreground py-8">
                  No site content yet.
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit site key" : "Add site key"}</DialogTitle>
            <DialogDescription>Value must be valid JSON.</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit((v) => upsert.mutate(v))}
            className="grid grid-cols-1 gap-4"
          >
            <div className="space-y-2">
              <Label>Key</Label>
              <Input disabled={!!editing} {...form.register("key")} placeholder="e.g. home.hero" />
              {form.formState.errors.key && (
                <p className="text-sm text-destructive">{form.formState.errors.key.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Value (JSON)</Label>
              <textarea
                className="w-full min-h-[280px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                {...form.register("valueJson")}
              />
              {form.formState.errors.valueJson && (
                <p className="text-sm text-destructive">{form.formState.errors.valueJson.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button type="submit" disabled={upsert.isPending}>
                {upsert.isPending ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
