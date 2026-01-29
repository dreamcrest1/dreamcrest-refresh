import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import OptimizedImage from "@/components/OptimizedImage";
import { Button } from "@/components/ui/button";
import { listPublishedProducts } from "@/lib/db/publicProducts";
import { calcDiscountPercent, formatPriceINR, getCategoryFallbackImage } from "@/lib/products/format";
import { stripHtml } from "@/lib/text/stripHtml";
import { buildWhatsAppInquireUrl } from "@/lib/whatsapp";

export default function HomeDealOfTheWeek() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-products"],
    queryFn: listPublishedProducts,
    staleTime: 60_000,
  });

  const deals = useMemo(() => {
    const rows = (data ?? [])
      .filter((p) => p.legacy_id != null)
      .map((p) => ({
        ...p,
        discount: calcDiscountPercent(Number(p.regular_price), Number(p.sale_price)),
      }));

    // Shuffle array randomly using Fisher-Yates algorithm
    const shuffled = [...rows];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, 5);
  }, [data]);

  if (isLoading) return null;
  if (isError || deals.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Zap className="h-4 w-4" /> Limited Time Offers
          </motion.span>
          <h2 className="section-title">Deal of the Week</h2>
          <p className="section-subtitle">Massive discounts - Don't miss out!</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {deals.map((product, i) => (
            <Link
              key={product.id}
              to={`/product/${product.legacy_id}`}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="product-card group cursor-pointer h-full"
              >
                <div className="relative overflow-hidden rounded-lg mb-3">
                  <motion.span
                    className="discount-badge"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {product.discount}% OFF
                  </motion.span>
                  <OptimizedImage
                    src={product.image_url}
                    alt={product.name}
                    className="product-image w-full h-32 object-cover"
                    width={320}
                    height={128}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = getCategoryFallbackImage(product.category);
                    }}
                  />
                </div>
                <span className="text-xs text-primary font-medium">{product.category}</span>
                <h3 className="font-medium mt-1 mb-2 text-sm line-clamp-2">{product.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                  {stripHtml(product.description)}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base font-bold text-primary">
                    {formatPriceINR(Number(product.sale_price))}
                  </span>
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPriceINR(Number(product.regular_price))}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2">
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

                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(
                        buildWhatsAppInquireUrl(`Hi, I'm interested in ${product.name}`),
                        "_blank"
                      );
                    }}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Inquire
                  </Button>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
