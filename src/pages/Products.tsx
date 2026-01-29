import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Grid, List, ExternalLink, Sparkles, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CyberBackground, CursorTrail } from "@/components/CyberBackground";
import { useQuery } from "@tanstack/react-query";
import { listPublishedProducts } from "@/lib/db/publicProducts";
import { formatPrice, getCategoryFallback } from "@/data/products";
import { stripHtml } from "@/lib/text/stripHtml";
import { buildWhatsAppInquireUrl } from "@/lib/whatsapp";

export default function Products() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"discount" | "price-low" | "price-high">("discount");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const productsQuery = useQuery({
    queryKey: ["public", "products"],
    queryFn: listPublishedProducts,
  });

  const products = useMemo(() => {
    const rows = productsQuery.data ?? [];
    return rows
      .map((p) => {
        const regularPrice = Number(p.regular_price ?? 0);
        const salePrice = Number(p.sale_price ?? 0);
        const discount =
          regularPrice > 0 && salePrice > 0 && salePrice < regularPrice
            ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
            : 0;

        return {
          id: p.legacy_id ? Number(p.legacy_id) : 0,
          name: p.name,
          description: stripHtml(p.description),
          salePrice,
          regularPrice,
          category: p.category,
          image: p.image_url,
          externalUrl: p.external_url,
          discount,
        };
      })
      .filter((p) => p.id > 0);
  }, [productsQuery.data]);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    return Array.from(counts.entries())
      .map(([name, count]) => ({
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        count,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Sorting
    switch (sortBy) {
      case "discount":
        filtered.sort((a, b) => b.discount - a.discount);
        break;
      case "price-low":
        filtered.sort((a, b) => a.salePrice - b.salePrice);
        break;
      case "price-high":
        filtered.sort((a, b) => b.salePrice - a.salePrice);
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const handleCardClick = (productId: number, e: React.MouseEvent) => {
    // Don't navigate if clicking on the Buy Now button
    if ((e.target as HTMLElement).closest('a[target="_blank"]')) {
      return;
    }
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <CyberBackground />
      <CursorTrail />
      <Header />

      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 md:mb-12"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              All <span className="gradient-text">Products</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-4">
              Browse our collection of {products.length}+ premium digital products at unbeatable prices
            </p>
          </motion.div>

          {/* Filters Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-3 mb-6 md:mb-8"
          >
            {/* Search - Full width on mobile */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>

            {/* Sort and View Mode Row */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="flex-1 px-3 py-2.5 rounded-lg bg-card border border-border text-foreground text-sm"
              >
                <option value="discount">Highest Discount</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              {/* View Mode - Hidden on mobile */}
              <div className="hidden md:flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Categories - Horizontal scroll on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 md:mb-8 -mx-4 px-4 md:mx-0 md:px-0"
          >
            <div className="flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible scrollbar-hide">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="shrink-0"
              >
                All ({products.length})
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.name}
                  variant={selectedCategory === cat.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.name)}
                  className="shrink-0 whitespace-nowrap"
                >
                  {cat.name} ({cat.count})
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Results Count */}
          <p className="text-muted-foreground mb-4 md:mb-6 text-sm">
            Showing {filteredProducts.length} of {products.length} products
          </p>

          {/* Products Grid - Always grid on mobile */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${sortBy}-${viewMode}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                viewMode === "grid" || window.innerWidth < 768
                  ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.02, 0.5) }}
                  onClick={(e) => handleCardClick(product.id, e)}
                  className={`group bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 cursor-pointer active:scale-[0.98] ${
                    viewMode === "list" && window.innerWidth >= 768 ? "flex gap-4 p-4" : ""
                  }`}
                >
                  {/* Image */}
                  <div
                    className={
                      viewMode === "grid" || window.innerWidth < 768
                        ? "relative aspect-square overflow-hidden bg-muted/50"
                        : "relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted/50"
                    }
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getCategoryFallback(product.category);
                      }}
                    />
                    <Badge className="absolute top-1.5 left-1.5 md:top-2 md:left-2 bg-primary text-primary-foreground text-[10px] md:text-xs px-1.5 py-0.5 md:px-2 md:py-1">
                      {product.discount}% OFF
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className={viewMode === "grid" || window.innerWidth < 768 ? "p-2.5 md:p-4" : "flex-1 flex flex-col justify-center"}>
                    <span className="text-[10px] md:text-xs text-primary font-medium">{product.category}</span>
                    <h3 className="font-semibold text-foreground mt-0.5 md:mt-1 line-clamp-2 text-xs md:text-base group-hover:text-primary transition-colors leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-[10px] md:text-sm text-muted-foreground mt-0.5 md:mt-1 line-clamp-2 hidden md:block">
                      {product.description}
                    </p>

                    <div className="flex items-center gap-1.5 md:gap-2 mt-2 md:mt-3">
                      <span className="text-sm md:text-lg font-bold text-primary">
                        {formatPrice(product.salePrice)}
                      </span>
                      <span className="text-[10px] md:text-sm text-muted-foreground line-through">
                        {formatPrice(product.regularPrice)}
                      </span>
                    </div>

                    <div className="mt-2 md:mt-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <a
                          href={product.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="block"
                        >
                          <Button size="sm" className="w-full gap-1 text-xs md:text-sm h-8 md:h-9">
                            Buy Now <ExternalLink className="h-3 w-3" />
                          </Button>
                        </a>

                        <a
                          href={buildWhatsAppInquireUrl(`Hi, I'm interested in ${product.name}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="block"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-1 text-xs md:text-sm h-8 md:h-9"
                          >
                            <MessageCircle className="h-3 w-3" />
                            Inquire
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 md:py-16">
              <Sparkles className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground text-sm md:text-base">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
