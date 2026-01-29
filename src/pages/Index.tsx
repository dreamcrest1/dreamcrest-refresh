import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, Package, Calendar, Zap, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig, blogPosts } from "@/data/siteData";
import { categories } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CyberBackground, CursorTrail } from "@/components/CyberBackground";
import { DeliveryProofsGallery } from "@/components/DeliveryProofsGallery";
import HomeDealOfTheWeek from "@/components/home/HomeDealOfTheWeek";
import HomeFeaturedProducts from "@/components/home/HomeFeaturedProducts";
import { useHeroSection, useAboutSection, useCategoryIcons, useSiteConfig } from "@/hooks/useSiteContent";

// Icon mapping for trust badges
const iconMap: Record<string, React.ElementType> = {
  "100% Genuine": ShieldCheck,
  "Instant Delivery": Zap,
  "24/7 Support": Clock,
};

// Icon mapping for stats
const statIconMap: Record<string, React.ElementType> = {
  "Happy Customers": Users,
  "Products": Package,
  "Trusted": Calendar,
  "Support": Sparkles,
};

// Hero Section with live content
function HeroSection() {
  const { data: heroData } = useHeroSection();
  const { data: siteConfigData } = useSiteConfig();

  const hero = heroData ?? {
    headline: "India's Most",
    highlightWord: "Trusted",
    subheadline: "Digital Product Store",
    primaryCtaText: "Explore Products",
    primaryCtaLink: "/products",
    secondaryCtaText: "Contact Us",
    secondaryCtaLink: "/contact",
    badgeText: "Up to 80% OFF on All Products",
    stats: [
      { value: "15,000+", label: "Happy Customers" },
      { value: "200+", label: "Products" },
      { value: "Since 2021", label: "Trusted" },
      { value: "24/7", label: "Support" },
    ],
    trustBadges: [
      { text: "100% Genuine" },
      { text: "Instant Delivery" },
      { text: "24/7 Support" },
    ],
  };

  const config = siteConfigData ?? siteConfig;

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
              {hero.badgeText}
            </motion.span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              {hero.headline}{" "}
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
                {hero.highlightWord}
              </motion.span>{" "}
              {hero.subheadline}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
              Get premium AI tools, OTT subscriptions, software & more at unbeatable prices. 
              Serving {config.customers} happy customers since {config.since}.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to={hero.primaryCtaLink}>
                <Button size="lg" className="btn-glow gap-2 text-lg px-8">
                  {hero.primaryCtaText} <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to={hero.secondaryCtaLink}>
                <Button size="lg" variant="outline" className="text-lg px-8">{hero.secondaryCtaText}</Button>
              </Link>
            </div>
            
            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mt-8">
              {(hero.trustBadges ?? []).map((badge: any, i: number) => {
                const IconComponent = iconMap[badge.text] ?? ShieldCheck;
                return (
                  <motion.div
                    key={badge.text}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <IconComponent className="h-4 w-4 text-primary" />
                    {badge.text}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Stats with enhanced animations */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {(hero.stats ?? []).map((stat: any, i: number) => {
              const IconComponent = statIconMap[stat.label] ?? Sparkles;
              return (
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
                    <IconComponent className="h-8 w-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
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
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Categories Section with live icons
function CategoriesSection() {
  const { data: categoryIcons } = useCategoryIcons();

  const iconMap: Record<string, string> = {};
  (categoryIcons ?? []).forEach((item: any) => {
    iconMap[item.name] = item.icon;
  });

  // Fallback icons
  const fallbackIcons: Record<string, string> = {
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
                  {iconMap[cat.name] ?? fallbackIcons[cat.name] ?? "📦"}
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


// About Section with live content
function AboutSection() {
  const { data: aboutData } = useAboutSection();
  const { data: siteConfigData } = useSiteConfig();

  const about = aboutData ?? {
    subtitle: "About Us",
    title: "Dreamcrest Solutions",
    tagline: "Oldest Multiplatform Service Provider",
    description: "Dreamcrest Group is a leading provider of OTT services and group buy tools at discounted prices. Founded in 2021, Dreamcrest has gained over 15,000+ customers and has expanded its reach internationally.",
    bulletPoints: [
      "Most Trusted Service Provider",
      "Over 200+ Products Available",
      "Most Responsive Customer Support",
      "Instant Digital Delivery",
    ],
    primaryCtaText: "Contact Us",
    primaryCtaLink: "/contact",
    secondaryCtaText: "View Proofs",
    secondaryCtaLink: "https://www.instagram.com/dreamcrest_solutions",
    highlightNumber: "15,000+",
    highlightLabel: "Happy Customers",
    highlightSubLabel: "& Growing Every Day",
    floatingBadge1: "⭐ 4.9 Rating",
    floatingBadge2: "🚀 Since 2021",
  };

  const config = siteConfigData ?? siteConfig;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-medium uppercase tracking-wider">{about.subtitle}</span>
            <h2 className="section-title mt-2">{about.title}</h2>
            <h3 className="text-xl text-muted-foreground mb-6">{about.tagline}</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {about.description}
            </p>
            <ul className="space-y-4 mb-8">
              {(about.bulletPoints ?? []).map((item: string, i: number) => (
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
              <Link to={about.primaryCtaLink}>
                <Button size="lg">{about.primaryCtaText}</Button>
              </Link>
              <a href={about.secondaryCtaLink} target="_blank" rel="noopener">
                <Button size="lg" variant="outline">{about.secondaryCtaText}</Button>
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
                {about.highlightNumber}
              </motion.div>
              <div className="text-2xl text-muted-foreground relative">{about.highlightLabel}</div>
              <div className="text-sm text-muted-foreground mt-2 relative">{about.highlightSubLabel}</div>
            </div>
            
            {/* Floating badges */}
            <motion.div
              className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg"
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {about.floatingBadge1}
            </motion.div>
            <motion.div
              className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg"
              animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
              {about.floatingBadge2}
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
      <Header />
      <main className="relative z-10">
        <HeroSection />
        <CategoriesSection />
        <HomeDealOfTheWeek />
        <HomeFeaturedProducts />
        <AboutSection />
        <DeliveryProofsGallery />
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
}
