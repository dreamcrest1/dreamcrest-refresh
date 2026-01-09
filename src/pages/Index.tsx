import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, Package, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroSlides, siteConfig } from "@/data/siteData";
import { products, categories, featuredProducts, formatPrice } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CyberBackground, CursorTrail } from "@/components/CyberBackground";

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Up to 80% OFF on All Products
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              India's Most{" "}
              <span className="gradient-text">Trusted</span> Digital Product Store
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Get premium AI tools, OTT subscriptions, software & more at unbeatable prices. 
              Serving {siteConfig.customers} happy customers since {siteConfig.since}.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg" className="btn-glow gap-2">
                  Explore Products <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">Contact Us</Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: Users, value: "15,000+", label: "Happy Customers" },
              { icon: Package, value: "200+", label: "Products" },
              { icon: Calendar, value: "Since 2021", label: "Trusted" },
              { icon: Sparkles, value: "24/7", label: "Support" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="cyber-card text-center"
              >
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Categories Section
function CategoriesSection() {
  const iconMap: Record<string, React.ReactNode> = {
    "AI Tools": "🤖",
    "Video Editing": "🎬",
    "Indian OTT": "📺",
    "International OTT": "🌍",
    "Writing Tools": "✍️",
    "Cloud Services": "☁️",
    "Lead Generation": "👥",
    "Software": "💻",
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Browse Categories</h2>
          <p className="section-subtitle">Find what you need from our wide range</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/products?category=${cat.slug}`}
                className="cyber-card flex flex-col items-center text-center p-6 hover:border-primary/50"
              >
                <span className="text-4xl mb-3">{iconMap[cat.name]}</span>
                <h3 className="font-semibold mb-1">{cat.name}</h3>
                <p className="text-sm text-muted-foreground">{cat.count} Products</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Featured Products
function FeaturedProducts() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="text-muted-foreground">Top picks for you</p>
          </div>
          <Link to="/products">
            <Button variant="outline" className="gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 8).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="product-card group"
            >
              <div className="relative overflow-hidden rounded-lg mb-4">
                <span className="discount-badge">{product.discount}% OFF</span>
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/300x200?text=Product";
                  }}
                />
              </div>
              <span className="text-xs text-primary font-medium">{product.category}</span>
              <h3 className="font-semibold mt-1 mb-2 line-clamp-2">{product.name}</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-bold text-primary">{formatPrice(product.salePrice)}</span>
                <span className="text-sm text-muted-foreground line-through">{formatPrice(product.regularPrice)}</span>
              </div>
              <a href={product.externalUrl} target="_blank" rel="noopener">
                <Button className="w-full btn-glow" size="sm">Buy Now</Button>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// About Section
function AboutSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-primary font-medium">ABOUT US</span>
            <h2 className="section-title mt-2">Dreamcrest Solutions</h2>
            <p className="text-muted-foreground mb-6">
              Dreamcrest Group is a leading provider of OTT services and group buy tools at discounted prices. 
              Founded in 2021, Dreamcrest has gained over 15,000+ customers and has expanded its reach internationally.
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "Most Trusted Service Provider",
                "Over 200+ Products",
                "Most Responsive Customer Support",
                "Instant Digital Delivery",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/contact">
              <Button>Contact Us</Button>
            </Link>
          </div>
          <div className="cyber-card p-8 text-center">
            <div className="text-6xl font-bold gradient-text mb-2">15,000+</div>
            <div className="text-xl text-muted-foreground">Happy Customers</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main Index Page
export default function Index() {
  return (
    <div className="min-h-screen bg-background relative">
      <CyberBackground />
      <CursorTrail />
      <Header />
      <main className="relative z-10">
        <HeroSection />
        <CategoriesSection />
        <FeaturedProducts />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
