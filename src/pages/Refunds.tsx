import { motion } from "framer-motion";
import { FileText, MessageCircle, AlertTriangle, Shield, RefreshCw, Clock, Wrench, DollarSign, Ban, Server, Zap, Settings, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { CyberBackground, CursorTrail } from "@/components/CyberBackground";
import { siteConfig, refundPolicy } from "@/data/siteData";

const policyIcons = [
  Ban, RefreshCw, Shield, Clock, DollarSign, FileText, Wrench, Server, Zap, Settings, Heart
];

export default function Refunds() {
  return (
    <div className="min-h-screen bg-background noise-overlay">
      <CyberBackground />
      <CursorTrail />
      <Header />
      <FloatingWhatsApp />

      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div 
              className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center mx-auto mb-6"
              animate={{ 
                boxShadow: [
                  "0 0 0 0 hsl(var(--primary) / 0.4)",
                  "0 0 0 20px hsl(var(--primary) / 0)",
                  "0 0 0 0 hsl(var(--primary) / 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FileText className="h-10 w-10 text-primary" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-wide">
              Refund & <span className="gradient-text">Return Policy</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Effective for: <span className="text-primary font-semibold">Dreamcrest Solutions</span> & <span className="text-secondary font-semibold">Dreamstar Solutions</span>
            </p>
            <p className="text-muted-foreground mt-4">
              Thank you for choosing our services. Please read our Refund and Return Policy carefully before making any purchase.
            </p>
          </motion.div>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 border border-yellow-500/30 flex gap-4 glass"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertTriangle className="h-8 w-8 text-yellow-500 flex-shrink-0" />
            </motion.div>
            <div>
              <h3 className="font-bold text-yellow-500 text-lg mb-2">⚠️ Important Notice</h3>
              <p className="text-muted-foreground">
                By purchasing or subscribing to any of our services, you agree to the terms outlined below. 
                Since we deal in digital products, most delivered items are <strong className="text-foreground">non-refundable</strong> once activated.
              </p>
            </div>
          </motion.div>

          {/* Policy Sections Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 gap-4"
          >
            {refundPolicy.map((section, index) => {
              const IconComponent = policyIcons[index % policyIcons.length];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="frosted-button p-6 rounded-2xl text-left cursor-default"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        {section.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{section.content}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Contact for Refunds */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center p-10 rounded-2xl glass border-primary/30 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MessageCircle className="w-16 h-16 mx-auto mb-6 text-primary" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-4">Need Support or Have Questions?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Contact us with your order details. We'll review your request and get back to you within 24-48 hours. 
              <span className="text-primary font-semibold"> WhatsApp is the fastest way to reach us!</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/${siteConfig.contact.phone.replace(/\D/g, "")}?text=Hi, I have a query regarding my order.`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="gap-2 text-lg px-8 neon-glow-orange">
                  <MessageCircle className="h-5 w-5" />
                  Chat on WhatsApp
                </Button>
              </a>
              <a href={`mailto:${siteConfig.contact.email}?subject=Refund/Support Request`}>
                <Button variant="outline" size="lg" className="text-lg px-8">
                  📧 Email Us
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Last Updated */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-sm text-muted-foreground mt-10"
          >
            Last updated: January 2025 | © {siteConfig.name} Solutions & Dreamstar Solutions
          </motion.p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
