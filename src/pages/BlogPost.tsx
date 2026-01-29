import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { CyberBackground, CursorTrail } from "@/components/CyberBackground";
import { Button } from "@/components/ui/button";
import OptimizedImage from "@/components/OptimizedImage";

import { useQuery } from "@tanstack/react-query";
import { getPublishedBlogPostBySlug } from "@/lib/db/publicBlogPosts";
import MarkdownRenderer from "@/components/markdown/MarkdownRenderer";

function readTimeFromText(text: string) {
  const words = (text ?? "").trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} Min Read`;
}

export default function BlogPost() {
  const { id } = useParams();
  const slug = id ?? "";

  const postQuery = useQuery({
    queryKey: ["public", "blog_post", slug],
    enabled: !!slug,
    queryFn: () => getPublishedBlogPostBySlug(slug),
    staleTime: 60_000,
  });

  const post = postQuery.data;

  if (postQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <CyberBackground />
        <CursorTrail />
        <Header />
        <FloatingWhatsApp />
        <main className="relative z-10 pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="animate-pulse space-y-6">
              <div className="h-6 w-40 bg-muted rounded" />
              <div className="h-64 md:h-96 w-full bg-muted rounded-2xl" />
              <div className="h-10 w-3/4 bg-muted rounded" />
              <div className="h-32 w-full bg-muted rounded-2xl" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-primary hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <CyberBackground />
      <CursorTrail />
      <Header />
      <FloatingWhatsApp />

      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden mb-8"
          >
            <OptimizedImage
              src={post.image_url || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop"}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover"
              width={1200}
              height={600}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </motion.div>

          {/* Post Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                {post.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.published_at || post.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {readTimeFromText(post.content)}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              {post.title}
            </h1>
          </motion.div>

          {/* Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-8 rounded-2xl mb-8"
          >
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <MarkdownRenderer markdown={post.content} />
            </div>
          </motion.article>

          {/* Back to Blog */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <Link to="/blog">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                View All Posts
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
