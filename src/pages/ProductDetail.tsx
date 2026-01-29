import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, ShieldCheck, Zap, Clock, MessageCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExpandableText } from "@/components/ExpandableText";
import OptimizedImage from "@/components/OptimizedImage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CyberBackground, CursorTrail } from "@/components/CyberBackground";
import { useQuery } from "@tanstack/react-query";
import { formatPrice, getCategoryFallback } from "@/data/products";
import { getPublishedProductByLegacyId, listPublishedProducts } from "@/lib/db/publicProducts";
import { siteConfig } from "@/data/siteData";
import { stripHtml } from "@/lib/text/stripHtml";

export default function ProductDetail() {
  const { id } = useParams();
  const legacyId = Number(id);

  const productQuery = useQuery({
    queryKey: ["public", "product", legacyId],
    enabled: Number.isFinite(legacyId) && legacyId > 0,
    queryFn: () => getPublishedProductByLegacyId(legacyId),
  });

  const allProductsQuery = useQuery({
    queryKey: ["public", "products"],
    queryFn: listPublishedProducts,
  });

  const product = productQuery.data;

  // Make sure product detail always starts at the top when navigating between products.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [id]);

  if (productQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <CyberBackground />
        <CursorTrail />
        <Header />
        <main className="relative z-10 pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-6">
              <div className="h-6 w-48 rounded bg-muted" />
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="aspect-square rounded-2xl bg-muted" />
                <div className="space-y-4">
                  <div className="h-5 w-28 rounded bg-muted" />
                  <div className="h-10 w-3/4 rounded bg-muted" />
                  <div className="h-24 w-full rounded bg-muted" />
                  <div className="h-12 w-2/3 rounded bg-muted" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!productQuery.isLoading && !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = (allProductsQuery.data ?? [])
    .filter((p) => p.category === product.category)
    .filter((p) => p.legacy_id !== product.legacy_id)
    .slice(0, 4)
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
        salePrice,
        regularPrice,
        category: p.category,
        image: p.image_url,
        discount,
          externalUrl: p.external_url,
      };
    })
    .filter((p) => p.id > 0);

  const features = [
    { icon: ShieldCheck, text: "100% Genuine Product" },
    { icon: Zap, text: "Instant Delivery" },
    { icon: Clock, text: "24/7 Support" },
    { icon: MessageCircle, text: "WhatsApp Assistance" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <CyberBackground />
      <CursorTrail />
      <Header />

      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
          >
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary transition-colors">
              Products
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </motion.div>

          {/* Product Section */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted/50 border border-border">
                <OptimizedImage
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                  width={900}
                  height={900}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getCategoryFallback(product.category);
                  }}
                />
              </div>
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground text-lg px-4 py-2">
                {(() => {
                  const regularPrice = Number(product.regular_price ?? 0);
                  const salePrice = Number(product.sale_price ?? 0);
                  return regularPrice > 0 && salePrice > 0 && salePrice < regularPrice
                    ? `${Math.round(((regularPrice - salePrice) / regularPrice) * 100)}% OFF`
                    : "Deal";
                })()}
              </Badge>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <Badge variant="secondary" className="w-fit mb-4">
                {product.category}
              </Badge>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>

              <ExpandableText
                text={stripHtml(product.long_description || product.description)}
                collapsedChars={220}
                className="mb-6"
              />

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(Number(product.sale_price ?? 0))}
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(Number(product.regular_price ?? 0))}
                </span>
                <Badge variant="destructive" className="text-sm">
                  Save {formatPrice(Number(product.regular_price ?? 0) - Number(product.sale_price ?? 0))}
                </Badge>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {features.map((feature) => (
                  <div
                    key={feature.text}
                    className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border"
                  >
                    <feature.icon className="h-5 w-5 text-primary" />
                    <span className="text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* What's Included */}
              <div className="mb-8 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <h3 className="font-semibold mb-3">What's Included:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Premium account access
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Instant delivery via email/WhatsApp
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Replacement guarantee
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    24/7 customer support
                  </li>
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={product.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button size="lg" className="w-full gap-2 text-lg">
                    Buy Now <ExternalLink className="h-5 w-5" />
                  </Button>
                </a>
                <a
                  href={`https://wa.me/${siteConfig.contact.phone.replace(/\D/g, "")}?text=Hi, I'm interested in ${product.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" size="lg" className="w-full gap-2 text-lg">
                    <MessageCircle className="h-5 w-5" />
                    Ask on WhatsApp
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relProduct) => (
                  <div
                    key={relProduct.id}
                    className="group bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all"
                  >
                    <Link to={`/product/${relProduct.id}`} className="block">
                      <div className="aspect-square overflow-hidden bg-muted/50">
                        <OptimizedImage
                          src={relProduct.image}
                          alt={relProduct.name}
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                          width={600}
                          height={600}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getCategoryFallback(relProduct.category);
                          }}
                        />
                      </div>
                    </Link>

                    <div className="p-4">
                      <Link to={`/product/${relProduct.id}`} className="block">
                        <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                          {relProduct.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-primary font-bold">
                            {formatPrice(relProduct.salePrice)}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {relProduct.discount}% OFF
                          </Badge>
                        </div>
                      </Link>

                      <div className="mt-3 grid grid-cols-1 gap-2">
                        <a href={relProduct.externalUrl} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="w-full gap-2">
                            Buy Now <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                        <a
                          href={`https://wa.me/${siteConfig.contact.phone.replace(/\D/g, "")}?text=Hi, I'm interested in ${relProduct.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm" className="w-full gap-2">
                            <MessageCircle className="h-4 w-4" />
                            Inquire on WhatsApp
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
