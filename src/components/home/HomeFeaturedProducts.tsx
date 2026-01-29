import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import OptimizedImage from "@/components/OptimizedImage";
import { Button } from "@/components/ui/button";
import { listPublishedProducts } from "@/lib/db/publicProducts";
import { formatPriceINR, getCategoryFallbackImage } from "@/lib/products/format";
import { stripHtml } from "@/lib/text/stripHtml";

export default function HomeFeaturedProducts() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-products"],
    queryFn: listPublishedProducts,
    staleTime: 60_000,
  });

  const featured = useMemo(() => {
    return (data ?? [])
      .filter((p) => p.featured)
      .filter((p) => p.legacy_id != null)
      .slice(0, 8);
  }, [data]);

  if (isLoading) return null;
  if (isError || featured.length === 0) return null;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Featured Products</h2>
            <p className="text-muted-foreground">Top picks for you</p>
          </motion.div>
          <Link to="/products">
            <Button variant="outline" className="gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product, i) => (
            <Link key={product.id} to={`/product/${product.legacy_id}`} className="block">
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.05, type: "spring" }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="product-card group cursor-pointer h-full"
              >
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <OptimizedImage
                    src={product.image_url}
                    alt={product.name}
                    className="product-image w-full h-48 object-cover"
                    width={480}
                    height={192}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = getCategoryFallbackImage(product.category);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-xs text-primary font-medium">{product.category}</span>
                <h3 className="font-semibold mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                  {stripHtml(product.description)}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-bold text-primary">
                    {formatPriceINR(Number(product.sale_price))}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPriceINR(Number(product.regular_price))}
                  </span>
                </div>
                <Button
                  className="w-full btn-glow"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(product.external_url, "_blank");
                  }}
                >
                  Buy Now
                </Button>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
