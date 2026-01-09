import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, Star, Rocket, Wrench, Image, Globe, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { CyberBackground, CursorTrail } from "@/components/CyberBackground";
import { siteConfig } from "@/data/siteData";

const FrostedButton = ({ 
  children, 
  href, 
  icon: Icon,
  className = "" 
}: { 
  children: React.ReactNode; 
  href: string; 
  icon?: React.ElementType;
  className?: string;
}) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`frosted-button block p-5 rounded-2xl text-center transition-all duration-300 ${className}`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.98 }}
  >
    {Icon && <Icon className="w-5 h-5 inline-block mr-2" />}
    {children}
  </motion.a>
);

export default function Contact() {
  const sisterBrands = [
    { name: "Dreamcrest", subtitle: "Premier OTT & Cloud Services", icon: Star, href: "https://dreamcrest.net" },
    { name: "Dreamstar Solution", subtitle: "Our Second Firm", icon: Rocket, href: "#" },
    { name: "Dreamtools.in", subtitle: "Group Buy Tools Panel", icon: Wrench, href: "https://dreamtools.in" },
    { name: "Comet Images", subtitle: "Cosmic View", icon: Image, href: "#" },
    { name: "Explore Neptune", subtitle: "Discover Outer Space", icon: Globe, href: "#" },
  ];

  const dreamcrestPhones = ["+91 97123 01164", "+91 63579 98730", "+91 63579 98724"];
  const dreamstarPhones = ["+91 99914 83279", "+91 97292 13279", "+91 91769 00944", "+91 80030 78749"];
  const emails = ["dreamcrestsolutions@gmail.com", "dreamstarott@gmail.com"];

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <CyberBackground />
      <CursorTrail />
      <Header />
      <FloatingWhatsApp />

      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-wide">
              📞 <span className="gradient-text">Contact Us</span>
            </h1>
          </motion.div>

          {/* Sister Brands Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {sisterBrands.map((brand, index) => (
                <motion.a
                  key={brand.name}
                  href={brand.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="frosted-button p-5 rounded-2xl text-center group"
                >
                  <brand.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <h3 className="font-bold text-foreground group-hover:text-primary-foreground transition-colors">
                    {brand.name}
                  </h3>
                  <p className="text-sm text-muted-foreground group-hover:text-primary-foreground/80 transition-colors">
                    {brand.subtitle}
                  </p>
                </motion.a>
              ))}
            </div>
          </motion.section>

          {/* Contact Info Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Dreamcrest Solutions */}
            <motion.section
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-8 rounded-2xl"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Globe className="w-6 h-6 text-primary" />
                Dreamcrest Solutions
              </h2>
              <div className="space-y-3">
                {dreamcrestPhones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="frosted-button p-4 rounded-xl flex items-center gap-3"
                  >
                    <Phone className="w-5 h-5 text-primary" />
                    <span>{phone}</span>
                  </a>
                ))}
              </div>
            </motion.section>

            {/* Dreamstar Solutions */}
            <motion.section
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass p-8 rounded-2xl"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Rocket className="w-6 h-6 text-secondary" />
                Dreamstar Solutions
              </h2>
              <div className="space-y-3">
                {dreamstarPhones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="frosted-button p-4 rounded-xl flex items-center gap-3"
                  >
                    <Phone className="w-5 h-5 text-secondary" />
                    <span>{phone}</span>
                  </a>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Emails Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass p-8 rounded-2xl mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Mail className="w-6 h-6 text-primary" />
              Email Us
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {emails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="frosted-button p-5 rounded-xl flex items-center justify-center gap-3"
                >
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="break-all">{email}</span>
                </a>
              ))}
            </div>
          </motion.section>

          {/* Address Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass p-8 rounded-2xl mb-12"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary" />
              Our Address
            </h2>
            <div className="frosted-button p-6 rounded-xl text-center">
              <p className="text-lg">
                D-18 Richmond Heights, Sector 37, Gandhinagar, GJ 382010
              </p>
            </div>
          </motion.section>

          {/* WhatsApp CTA */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass p-8 rounded-2xl border-primary/30 bg-primary/5"
          >
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Fastest Response on WhatsApp!</h2>
              <p className="text-muted-foreground mb-6">
                Get instant replies and support via WhatsApp. We typically respond within minutes.
              </p>
              <a
                href={`https://wa.me/${siteConfig.contact.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:scale-105 transition-transform neon-glow-orange"
              >
                <MessageCircle className="w-6 h-6" />
                Chat on WhatsApp
              </a>
            </div>
          </motion.section>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center mt-12 text-muted-foreground"
          >
            <p className="flex items-center justify-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              Powered by Dreamcrest & Dreamstar | All rights reserved
              <Star className="w-4 h-4 text-primary" />
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
