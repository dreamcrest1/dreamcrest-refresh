import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, Package, Calendar, Zap, ShieldCheck, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroSlides, siteConfig, blogPosts } from "@/data/siteData";
import { getCategoryFallback } from "@/data/products";
import { products, categories, featuredProducts, dealOfTheWeek, formatPrice } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CyberBackground, CursorTrail } from "@/components/CyberBackground";
import { InteractiveBackground } from "@/components/InteractiveBackground";
import { StickFigureMascot } from "@/components/StickFigureMascot";
// Floating WhatsApp Button
function WhatsAppButton() {
  return (
    <motion.a
      href={`https://wa.me/${siteConfig.contact.phone.replace(/\D/g, "")}`}
      target="_blank"
      rel="noopener"
      className="fixed bottom-6 left-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <MessageCircle className="h-6 w-6" />
      <motion.div
        className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.a>
  );
}

// Hero Section with enhanced animations
function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 pb-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
              animate={{ boxShadow: ["0 0 0 0 hsl(var(--primary) / 0.4)", "0 0 0 10px hsl(var(--primary) / 0)", "0 0 0 0 hsl(var(--primary) / 0)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              Up to 80% OFF on All Products
            </motion.span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              India's Most{" "}
              <motion.span 
                className="gradient-text inline-block"
                animate={{ 
                  textShadow: [
                    "0 0 20px hsl(var(--primary) / 0.5)",
                    "0 0 40px hsl(var(--primary) / 0.3)",
                    "0 0 20px hsl(var(--primary) / 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Trusted
              </motion.span>{" "}
              Digital Product Store
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
              Get premium AI tools, OTT subscriptions, software & more at unbeatable prices. 
              Serving {siteConfig.customers} happy customers since {siteConfig.since}.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg" className="btn-glow gap-2 text-lg px-8">
                  Explore Products <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="text-lg px-8">Contact Us</Button>
              </Link>
            </div>
            
            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mt-8">
              {[
                { icon: ShieldCheck, text: "100% Genuine" },
                { icon: Zap, text: "Instant Delivery" },
                { icon: Clock, text: "24/7 Support" },
              ].map((badge, i) => (
                <motion.div
                  key={badge.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <badge.icon className="h-4 w-4 text-primary" />
                  {badge.text}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats with enhanced animations */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: Users, value: "15,000+", label: "Happy Customers", color: "primary" },
              { icon: Package, value: "200+", label: "Products", color: "secondary" },
              { icon: Calendar, value: "Since 2021", label: "Trusted", color: "primary" },
              { icon: Sparkles, value: "24/7", label: "Support", color: "secondary" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="cyber-card text-center group"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                >
                  <stat.icon className={`h-8 w-8 mx-auto mb-3 text-${stat.color} group-hover:scale-110 transition-transform`} />
                </motion.div>
                <motion.div 
                  className="text-2xl md:text-3xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Categories Section with enhanced animations
function CategoriesSection() {
  const iconMap: Record<string, string> = {
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
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Browse Categories</h2>
          <p className="section-subtitle">Find what you need from our wide range</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.05, type: "spring" }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Link
                to={`/products?category=${cat.slug}`}
                className="cyber-card flex flex-col items-center text-center p-6 h-full group"
              >
                <motion.span 
                  className="text-5xl mb-4"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                >
                  {iconMap[cat.name]}
                </motion.span>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
                <p className="text-sm text-muted-foreground">{cat.count} Products</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Deal of the Week with countdown
function DealOfTheWeek() {
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
          {dealOfTheWeek.slice(0, 5).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="product-card group"
            >
              <div className="relative overflow-hidden rounded-lg mb-3">
                <motion.span 
                  className="discount-badge"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {product.discount}% OFF
                </motion.span>
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image w-full h-32 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = getCategoryFallback(product.category);
                  }}
                />
              </div>
              <span className="text-xs text-primary font-medium">{product.category}</span>
              <h3 className="font-medium mt-1 mb-2 text-sm line-clamp-2">{product.name}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base font-bold text-primary">{formatPrice(product.salePrice)}</span>
                <span className="text-xs text-muted-foreground line-through">{formatPrice(product.regularPrice)}</span>
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

// Featured Products with improved cards
function FeaturedProducts() {
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
          {featuredProducts.slice(0, 8).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.05, type: "spring" }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="product-card group"
            >
              <div className="relative overflow-hidden rounded-lg mb-4">
                <motion.span 
                  className="discount-badge"
                  whileHover={{ scale: 1.1 }}
                >
                  {product.discount}% OFF
                </motion.span>
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = getCategoryFallback(product.category);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xs text-primary font-medium">{product.category}</span>
              <h3 className="font-semibold mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{product.description}</p>
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

// About Section with enhanced visuals
function AboutSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-medium uppercase tracking-wider">About Us</span>
            <h2 className="section-title mt-2">Dreamcrest Solutions</h2>
            <h3 className="text-xl text-muted-foreground mb-6">Oldest Multiplatform Service Provider</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Dreamcrest Group is a leading provider of OTT services and group buy tools at discounted prices. 
              Founded in 2021, Dreamcrest has gained over 15,000+ customers and has expanded its reach internationally.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "Most Trusted Service Provider",
                "Over 200+ Products Available",
                "Most Responsive Customer Support",
                "Instant Digital Delivery",
              ].map((item, i) => (
                <motion.li 
                  key={item} 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  {item}
                </motion.li>
              ))}
            </ul>
            <div className="flex gap-4">
              <Link to="/contact">
                <Button size="lg">Contact Us</Button>
              </Link>
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener">
                <Button size="lg" variant="outline">View Proofs</Button>
              </a>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="cyber-card p-10 text-center relative overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div 
                className="text-7xl md:text-8xl font-bold gradient-text mb-4 relative"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                15,000+
              </motion.div>
              <div className="text-2xl text-muted-foreground relative">Happy Customers</div>
              <div className="text-sm text-muted-foreground mt-2 relative">& Growing Every Day</div>
            </div>
            
            {/* Floating badges */}
            <motion.div
              className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg"
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ⭐ 4.9 Rating
            </motion.div>
            <motion.div
              className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg"
              animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
              🚀 Since 2021
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Blog Section
function BlogSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Latest Updates</h2>
          <p className="section-subtitle">News and articles from Dreamcrest</p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="cyber-card overflow-hidden group"
            >
              <div className="aspect-video bg-muted relative overflow-hidden rounded-lg mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-4xl">📰</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span className="text-primary">{post.category}</span>
                <span>•</span>
                <span>{post.date}</span>
              </div>
              <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main Index Page
export default function Index() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <CyberBackground />
      <CursorTrail />
      <InteractiveBackground />
      <Header />
      <main className="relative z-10">
        <HeroSection />
        <CategoriesSection />
        <DealOfTheWeek />
        <FeaturedProducts />
        <AboutSection />
        <BlogSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <StickFigureMascot />
    </div>
  );
}
