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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MarkdownRenderer from "@/components/markdown/MarkdownRenderer";

import type { BlogPostRow } from "@/lib/db/blogPosts";
import { deleteBlogPostAdmin, listBlogPostsAdmin, upsertBlogPostAdmin } from "@/lib/db/blogPosts";

const schema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(3).max(200),
  category: z.string().trim().min(2).max(80),
  image_url: z.string().trim().url().optional().or(z.literal("")),
  excerpt: z.string().trim().min(10).max(600),
  content: z.string().trim().min(20).max(50_000),
  published: z.boolean().default(true),
});

type FormValues = z.infer<typeof schema>;

function toDefaults(p?: BlogPostRow): FormValues {
  return {
    id: p?.id,
    title: p?.title ?? "",
    slug: p?.slug ?? "",
    category: p?.category ?? "General",
    image_url: p?.image_url ?? "",
    excerpt: p?.excerpt ?? "",
    content: p?.content ?? "",
    published: p?.published ?? true,
  };
}

export default function AdminBlog() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPostRow | null>(null);

  const query = useQuery({
    queryKey: ["admin", "blog_posts"],
    queryFn: listBlogPostsAdmin,
  });

  const rows = useMemo(() => query.data ?? [], [query.data]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: toDefaults(undefined),
  });

  const upsert = useMutation({
    mutationFn: async (values: FormValues) => {
      const now = new Date().toISOString();
      const publishedAt = values.published
        ? editing?.published_at ?? now
        : editing?.published_at ?? null;

      return upsertBlogPostAdmin({
        id: values.id,
        title: values.title,
        slug: values.slug,
        excerpt: values.excerpt,
        content: values.content,
        category: values.category,
        image_url: values.image_url ? values.image_url : null,
        published: values.published,
        published_at: publishedAt,
      });
    },
    onSuccess: async () => {
      toast({ title: "Saved", description: "Post updated." });
      setOpen(false);
      setEditing(null);
      await qc.invalidateQueries({ queryKey: ["admin", "blog_posts"] });
    },
    onError: (err: any) => {
      toast({ title: "Save failed", description: err?.message ?? "Please try again.", variant: "destructive" });
    },
  });

  const del = useMutation({
    mutationFn: deleteBlogPostAdmin,
    onSuccess: async () => {
      toast({ title: "Deleted", description: "Post removed." });
      await qc.invalidateQueries({ queryKey: ["admin", "blog_posts"] });
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

  const startEdit = (row: BlogPostRow) => {
    setEditing(row);
    form.reset(toDefaults(row));
    setOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Create and publish posts. (Public blog pages can be migrated next.)</p>
        <Button onClick={startCreate} className="gap-2">
          <Plus className="h-4 w-4" /> New Post
        </Button>
      </div>

      <div className="rounded-lg border bg-card/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Slug</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span className="line-clamp-1">{r.title}</span>
                    <Badge variant="secondary">{r.category}</Badge>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell font-mono text-xs">{r.slug}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant={r.published ? "default" : "secondary"}>{r.published ? "Published" : "Draft"}</Badge>
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
                        const ok = window.confirm(`Delete "${r.title}"?`);
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
                  No blog posts yet.
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
            <DialogTitle>{editing ? "Edit post" : "New post"}</DialogTitle>
            <DialogDescription>Tip: keep slug stable (used in URLs).</DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit((v) => upsert.mutate(v))} className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input {...form.register("title")} />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input {...form.register("slug")} placeholder="e.g. netflix-no-household" />
                {form.formState.errors.slug && (
                  <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input {...form.register("category")} />
              </div>
              <div className="space-y-2">
                <Label>Image URL (optional)</Label>
                <Input {...form.register("image_url")} />
                {form.formState.errors.image_url && (
                  <p className="text-sm text-destructive">{form.formState.errors.image_url.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Excerpt</Label>
              <textarea
                className="w-full min-h-[90px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                {...form.register("excerpt")}
              />
              {form.formState.errors.excerpt && (
                <p className="text-sm text-destructive">{form.formState.errors.excerpt.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <Tabs defaultValue="write" className="w-full">
                <TabsList>
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="write" className="mt-2">
                  <textarea
                    className="w-full min-h-[240px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...form.register("content")}
                  />
                </TabsContent>

                <TabsContent value="preview" className="mt-2">
                  <div className="rounded-md border bg-card/50 p-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <MarkdownRenderer markdown={form.watch("content") || ""} />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              {form.formState.errors.content && (
                <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={form.watch("published") ? "default" : "outline"}
                onClick={() => form.setValue("published", !form.getValues("published"))}
              >
                {form.watch("published") ? "Published" : "Draft"}
              </Button>
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
