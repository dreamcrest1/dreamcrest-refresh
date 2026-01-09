import { motion } from "framer-motion";
import { HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CyberBackground, CursorTrail } from "@/components/CyberBackground";
import { siteConfig } from "@/data/siteData";

const faqs = [
  {
    question: "Are the products genuine?",
    answer:
      "Yes, 100%! All our products are genuine and sourced from authorized channels. We've been serving 15,000+ customers since 2021 with a commitment to authenticity.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Most digital products are delivered instantly within minutes. For some products, delivery may take up to 24 hours maximum. You'll receive your product details via email and WhatsApp.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major payment methods including UPI, Credit/Debit Cards, Net Banking, and Wallets through our secure payment partner Cosmofeed.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Yes, refunds are available for products not delivered within the promised timeframe or if defective. Digital products that have been delivered and activated are non-refundable. See our Refund Policy for details.",
  },
  {
    question: "How do I receive my product?",
    answer:
      "After payment, you'll receive an email and WhatsApp message with your product details, login credentials, or activation keys depending on the product type.",
  },
  {
    question: "What if my subscription stops working?",
    answer:
      "We offer replacement guarantee on all our products. If your subscription stops working unexpectedly, contact us on WhatsApp and we'll provide a replacement or solution.",
  },
  {
    question: "Can I share my subscription with others?",
    answer:
      "This depends on the specific product. Some products like family plans allow sharing, while others are single-user. Check the product description or ask us before purchasing.",
  },
  {
    question: "Why are your prices so low?",
    answer:
      "We source products in bulk and through authorized reseller programs, allowing us to pass significant savings to our customers. All products are 100% genuine despite the low prices.",
  },
  {
    question: "Do you provide invoices?",
    answer:
      "Yes, we provide digital invoices for all purchases. The invoice is sent to your email after successful payment.",
  },
  {
    question: "How can I contact support?",
    answer:
      "The fastest way to reach us is via WhatsApp. You can also email us or fill out the contact form. We typically respond within minutes on WhatsApp and within 24 hours on email.",
  },
  {
    question: "Are there any hidden charges?",
    answer:
      "No, the price you see is the final price. There are no hidden charges, taxes, or fees. What you see is what you pay.",
  },
  {
    question: "Can I upgrade my plan later?",
    answer:
      "Yes! You can upgrade to a longer duration or higher tier plan anytime. Contact us on WhatsApp and we'll help you with the upgrade process.",
  },
];

export default function FAQ() {
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
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Find answers to common questions about our products and services.
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.03 }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="bg-card/80 backdrop-blur border border-border rounded-xl px-6 data-[state=open]:border-primary/50"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-5">
                      <span className="font-semibold">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>

          {/* Still have questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center p-8 rounded-xl bg-primary/10 border border-primary/30"
          >
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Chat with us on WhatsApp for instant support.
            </p>
            <a
              href={`https://wa.me/${siteConfig.contact.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="gap-2">
                <MessageCircle className="h-5 w-5" />
                Chat on WhatsApp
              </Button>
            </a>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
