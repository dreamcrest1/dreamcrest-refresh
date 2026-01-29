import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { CyberBackground, CursorTrail } from "@/components/CyberBackground";
import OptimizedImage from "@/components/OptimizedImage";

import { useQuery } from "@tanstack/react-query";
import { listPublishedBlogPosts } from "@/lib/db/publicBlogPosts";

function readTimeFromText(text: string) {
  const words = (text ?? "").trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} Min Read`;
}

export default function Blog() {
  const postsQuery = useQuery({
    queryKey: ["public", "blog_posts"],
    queryFn: listPublishedBlogPosts,
    staleTime: 60_000,
  });

  const posts = postsQuery.data ?? [];

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <CyberBackground />
      <CursorTrail />
      <Header />
      <FloatingWhatsApp />

      <main className="relative z-10 pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-wide">
              📰 <span className="gradient-text">Blog & Updates</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Stay updated with the latest news, features, and announcements from Dreamcrest.
            </p>
          </motion.div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="glass rounded-2xl overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <OptimizedImage
                    src={post.image_url || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    width={720}
                    height={288}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.published_at || post.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {readTimeFromText(post.content)}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {!postsQuery.isLoading && posts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No posts published yet.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
