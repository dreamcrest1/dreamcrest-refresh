import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, Star, Rocket, Wrench, Youtube, Instagram, ExternalLink, Sparkles, Globe, Package } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { CyberBackground, CursorTrail } from "@/components/CyberBackground";
import { siteConfig } from "@/data/siteData";

export default function Contact() {
  const sisterBrands = [
    { name: "Dreamcrest", subtitle: "Premier OTT & Cloud Services", icon: Star, href: "https://dreamcrest.net", color: "from-primary to-orange-500" },
    { name: "Dreamstar Solution", subtitle: "Our Second Firm", icon: Rocket, href: "https://dreamstarsolution.com", color: "from-blue-500 to-purple-500" },
    { name: "Dreamtools.in", subtitle: "Group Buy Tools Panel", icon: Wrench, href: "https://dreamtools.in", color: "from-green-500 to-emerald-500" },
    { name: "Delivery Proofs", subtitle: "Instagram Showcase", icon: Package, href: "https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTkzOTExNzgwNDk4NDU1?igshid=YmMyMTA2M2Y=", color: "from-pink-500 to-rose-500" },
    { name: "YouTube Channel", subtitle: "Product Demos", icon: Youtube, href: "https://www.youtube.com/channel/UCbqBFmu4oZ3PpcwEdMVDDcw", color: "from-red-500 to-orange-500" },
  ];

  const dreamcrestPhones = [
    { number: "+91 97123 01164", whatsapp: "919712301164" },
    { number: "+91 63579 98730", whatsapp: "916357998730" },
    { number: "+91 63579 98724", whatsapp: "916357998724" },
  ];
  
  const dreamstarPhones = [
    { number: "+91 99914 83279", whatsapp: "919991483279" },
    { number: "+91 97292 13279", whatsapp: "919729213279" },
    { number: "+91 91769 00944", whatsapp: "919176900944" },
    { number: "+91 80030 78749", whatsapp: "918003078749" },
  ];
  
  const emails = ["dreamcrestsolutions@gmail.com", "dreamstarott@gmail.com"];

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <CyberBackground />
      <CursorTrail />
      <Header />
      <FloatingWhatsApp />

      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <span className="text-7xl">📞</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-wide">
              <span className="gradient-text">Contact Us</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're here to help! Reach out to us through any of our channels below.
            </p>
          </motion.div>

          {/* Sister Brands Grid */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <motion.h2 
              className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Sparkles className="w-6 h-6 text-primary" />
              Our Brands & Channels
              <Sparkles className="w-6 h-6 text-primary" />
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {sisterBrands.map((brand, index) => (
                <motion.a
                  key={brand.name}
                  href={brand.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="frosted-button p-6 rounded-2xl text-center group relative overflow-hidden"
                >
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${brand.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                  />
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    <brand.icon className="w-8 h-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                  </motion.div>
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                    {brand.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {brand.subtitle}
                  </p>
                  <ExternalLink className="w-4 h-4 absolute top-3 right-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.a>
              ))}
            </div>
          </motion.section>

          {/* WhatsApp Contact Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Dreamcrest Solutions */}
            <motion.section
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-8 rounded-3xl border-primary/20"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center"
                >
                  <Globe className="w-5 h-5 text-white" />
                </motion.div>
                <span>Dreamcrest Solutions</span>
              </h2>
              <div className="space-y-3">
                {dreamcrestPhones.map((phone, i) => (
                  <motion.a
                    key={phone.number}
                    href={`https://wa.me/${phone.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="frosted-button p-4 rounded-xl flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                      <Phone className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="font-medium">{phone.number}</span>
                    <MessageCircle className="w-5 h-5 text-green-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                ))}
              </div>
            </motion.section>

            {/* Dreamstar Solutions */}
            <motion.section
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass p-8 rounded-3xl border-secondary/20"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center"
                >
                  <Rocket className="w-5 h-5 text-white" />
                </motion.div>
                <span>Dreamstar Solutions</span>
              </h2>
              <div className="space-y-3">
                {dreamstarPhones.map((phone, i) => (
                  <motion.a
                    key={phone.number}
                    href={`https://wa.me/${phone.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    whileHover={{ scale: 1.02, x: -5 }}
                    className="frosted-button p-4 rounded-xl flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                      <Phone className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="font-medium">{phone.number}</span>
                    <MessageCircle className="w-5 h-5 text-green-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Emails Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass p-8 rounded-3xl mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 justify-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Mail className="w-8 h-8 text-primary" />
              </motion.div>
              <span>Email Us</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {emails.map((email, i) => (
                <motion.a
                  key={email}
                  href={`mailto:${email}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="frosted-button p-6 rounded-2xl flex items-center justify-center gap-3 group"
                >
                  <Mail className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  <span className="font-medium break-all">{email}</span>
                </motion.a>
              ))}
            </div>
          </motion.section>

          {/* Address Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass p-8 rounded-3xl mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 justify-center">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MapPin className="w-8 h-8 text-primary" />
              </motion.div>
              <span>Our Address</span>
            </h2>
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="frosted-button p-8 rounded-2xl text-center"
            >
              <p className="text-xl font-medium">
                🏢 D-18 Richmond Heights, Sector 37, Gandhinagar, GJ 382010
              </p>
            </motion.div>
          </motion.section>

          {/* WhatsApp CTA */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass p-10 rounded-3xl bg-gradient-to-br from-green-500/10 via-transparent to-primary/10 border-green-500/30"
          >
            <div className="text-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MessageCircle className="w-16 h-16 mx-auto mb-6 text-green-500" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-3">⚡ Fastest Response on WhatsApp!</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Get instant replies and support via WhatsApp. We typically respond within minutes.
              </p>
              <motion.a
                href={`https://wa.me/${siteConfig.contact.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-shadow"
              >
                <MessageCircle className="w-7 h-7" />
                Chat on WhatsApp
              </motion.a>
            </div>
          </motion.section>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-12 text-muted-foreground"
          >
            <p className="flex items-center justify-center gap-2 flex-wrap">
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
