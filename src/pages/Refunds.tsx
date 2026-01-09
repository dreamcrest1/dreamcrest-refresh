import { motion } from "framer-motion";
import { FileText, MessageCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CyberBackground, CursorTrail } from "@/components/CyberBackground";
import { siteConfig, refundPolicy } from "@/data/siteData";

export default function Refunds() {
  return (
    <div className="min-h-screen bg-background">
      <CyberBackground />
      <CursorTrail />
      <Header />

      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Return & <span className="gradient-text">Refund Policy</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Our policies to ensure your satisfaction and peace of mind.
            </p>
          </motion.div>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex gap-4"
          >
            <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-yellow-500 mb-2">Important Notice</h3>
              <p className="text-sm text-muted-foreground">
                Since we deal in digital products, most delivered items are non-refundable once
                activated. Please read each product description carefully before purchasing.
              </p>
            </div>
          </motion.div>

          {/* Policy Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {refundPolicy.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="p-6 rounded-xl bg-card/80 border border-border"
              >
                <h3 className="font-bold text-lg mb-3 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  {section.title}
                </h3>
                <p className="text-muted-foreground ml-11">{section.content}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact for Refunds */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center p-8 rounded-xl bg-primary/10 border border-primary/30"
          >
            <h2 className="text-2xl font-bold mb-4">Need to Request a Refund?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Contact us within 7 days of purchase with your order details. We'll review your
              request and get back to you within 24-48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/${siteConfig.contact.phone.replace(/\D/g, "")}?text=Hi, I'd like to request a refund for my order.`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Request on WhatsApp
                </Button>
              </a>
              <a href={`mailto:${siteConfig.contact.email}?subject=Refund Request`}>
                <Button variant="outline" size="lg">
                  Email Us
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Last Updated */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-sm text-muted-foreground mt-8"
          >
            Last updated: January 2025 | © {siteConfig.name} Solutions
          </motion.p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
