import { motion } from "framer-motion";
import { Users, Package, Calendar, ShieldCheck, Zap, Award, Heart, Globe } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CyberBackground, CursorTrail } from "@/components/CyberBackground";
import { siteConfig } from "@/data/siteData";

export default function About() {
  const stats = [
    { icon: Users, value: siteConfig.customers, label: "Happy Customers" },
    { icon: Package, value: siteConfig.products, label: "Products" },
    { icon: Calendar, value: `Since ${siteConfig.since}`, label: "Years of Trust" },
    { icon: ShieldCheck, value: "100%", label: "Genuine Products" },
  ];

  const values = [
    {
      icon: Zap,
      title: "Instant Delivery",
      description: "Get your digital products delivered within minutes of purchase.",
    },
    {
      icon: ShieldCheck,
      title: "Genuine Products",
      description: "100% authentic subscriptions and licenses from authorized sources.",
    },
    {
      icon: Award,
      title: "Best Prices",
      description: "Up to 80% off on premium digital products and subscriptions.",
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "24/7 support and hassle-free replacement guarantee.",
    },
  ];

  const timeline = [
    { year: "2021", event: "Dreamcrest Solutions founded in Chennai" },
    { year: "2022", event: "Launched Dreamtools.in for group buy services" },
    { year: "2023", event: "Crossed 10,000 happy customers" },
    { year: "2024", event: "Expanded product catalog to 200+ products" },
    { year: "2025", event: "Serving 15,000+ customers across India" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <CyberBackground />
      <CursorTrail />
      <Header />

      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About <span className="gradient-text">{siteConfig.name}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {siteConfig.tagline}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="text-center p-6 rounded-xl bg-card/80 border border-border"
              >
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Story Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Dreamcrest Solutions was founded in 2021 with a simple mission: to make premium
                    digital products accessible to everyone at affordable prices.
                  </p>
                  <p>
                    What started as a small venture in Chennai has grown into India's most trusted
                    digital product marketplace, serving over 15,000 happy customers across the country.
                  </p>
                  <p>
                    We specialize in providing genuine subscriptions for AI tools, OTT platforms,
                    software licenses, and cloud services at discounts of up to 80% off retail prices.
                  </p>
                  <p>
                    Our commitment to authenticity, instant delivery, and exceptional customer support
                    has made us the go-to destination for digital products in India.
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/30" />
                {timeline.map((item, index) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="relative pl-12 pb-8 last:pb-0"
                  >
                    <div className="absolute left-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {item.year.slice(-2)}
                    </div>
                    <div className="p-4 rounded-lg bg-card border border-border">
                      <span className="text-primary font-bold">{item.year}</span>
                      <p className="text-muted-foreground">{item.event}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Values */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-10">Why Choose Us?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="p-6 rounded-xl bg-card/80 border border-border hover:border-primary/50 transition-all text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Sister Brands */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Our Brands</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Dreamcrest is part of a growing family of digital service brands.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {siteConfig.sisterBrands.map((brand) => (
                <a
                  key={brand.name}
                  href={brand.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all min-w-[200px]"
                >
                  <Globe className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-bold">{brand.name}</h3>
                  <p className="text-sm text-muted-foreground">{brand.description}</p>
                </a>
              ))}
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
