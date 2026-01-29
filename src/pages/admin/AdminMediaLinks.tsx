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
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

import type { MediaLinkRow } from "@/lib/db/mediaLinks";
import { deleteMediaLinkAdmin, listMediaLinksAdmin, upsertMediaLinkAdmin } from "@/lib/db/mediaLinks";

const schema = z.object({
  id: z.string().optional(),
  label: z.string().trim().min(2).max(120),
  url: z.string().trim().url(),
  tagsCsv: z.string().trim().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

function toDefaults(r?: MediaLinkRow): FormValues {
  return {
    id: r?.id,
    label: r?.label ?? "",
    url: r?.url ?? "",
    tagsCsv: (r?.tags ?? []).join(", "),
  };
}

function parseTags(csv: string) {
  return (csv ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export default function AdminMediaLinks() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MediaLinkRow | null>(null);

  const query = useQuery({
    queryKey: ["admin", "media_links"],
    queryFn: listMediaLinksAdmin,
  });

  const rows = useMemo(() => query.data ?? [], [query.data]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: toDefaults(undefined),
  });

  const upsert = useMutation({
    mutationFn: async (values: FormValues) =>
      upsertMediaLinkAdmin({
        id: values.id,
        label: values.label,
        url: values.url,
        tags: parseTags(values.tagsCsv || ""),
      }),
    onSuccess: async () => {
      toast({ title: "Saved", description: "Media link updated." });
      setOpen(false);
      setEditing(null);
      await qc.invalidateQueries({ queryKey: ["admin", "media_links"] });
    },
    onError: (err: any) => {
      toast({ title: "Save failed", description: err?.message ?? "Please try again.", variant: "destructive" });
    },
  });

  const del = useMutation({
    mutationFn: deleteMediaLinkAdmin,
    onSuccess: async () => {
      toast({ title: "Deleted", description: "Media link removed." });
      await qc.invalidateQueries({ queryKey: ["admin", "media_links"] });
    },
    onError: (err: any) => {
      toast({ title: "Delete failed", description: err?.message ?? "Please try again.", variant: "destructive" });
    },
  });

  const startCreate = () => {
    setEditing(null);
    form.reset(toDefaults(undefined));
    setOpen(true);
  };

  const startEdit = (row: MediaLinkRow) => {
    setEditing(row);
    form.reset(toDefaults(row));
    setOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Manage labelled links with tags for use across the site.</p>
        <Button onClick={startCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Add Link
        </Button>
      </div>

      <div className="rounded-lg border bg-card/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead className="hidden md:table-cell">URL</TableHead>
              <TableHead className="hidden md:table-cell">Tags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.label}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <a className="text-primary hover:underline" href={r.url} target="_blank" rel="noopener noreferrer">
                    {r.url}
                  </a>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {(r.tags ?? []).slice(0, 6).map((t) => (
                      <Badge key={t} variant="secondary">
                        {t}
                      </Badge>
                    ))}
                    {(r.tags ?? []).length > 6 && <Badge variant="secondary">+{(r.tags ?? []).length - 6}</Badge>}
                  </div>
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
                        const ok = window.confirm(`Delete "${r.label}"?`);
                        if (!ok) return;
                        del.mutate(r.id);
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
                <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">
                  No media links yet.
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
            <DialogTitle>{editing ? "Edit media link" : "Add media link"}</DialogTitle>
            <DialogDescription>Tags are comma-separated.</DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit((v) => upsert.mutate(v))} className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input {...form.register("label")} />
              {form.formState.errors.label && (
                <p className="text-sm text-destructive">{form.formState.errors.label.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input {...form.register("url")} />
              {form.formState.errors.url && (
                <p className="text-sm text-destructive">{form.formState.errors.url.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <Input {...form.register("tagsCsv")} placeholder="instagram, youtube, press" />
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
