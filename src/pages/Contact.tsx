import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, Send, Instagram, Facebook, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CyberBackground, CursorTrail } from "@/components/CyberBackground";
import { siteConfig } from "@/data/siteData";

export default function Contact() {
  const contactMethods = [
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: siteConfig.contact.phone,
      href: `https://wa.me/${siteConfig.contact.phone.replace(/\D/g, "")}`,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Mail,
      title: "Email",
      value: siteConfig.contact.email,
      href: `mailto:${siteConfig.contact.email}`,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Phone,
      title: "Phone",
      value: siteConfig.contact.phone,
      href: `tel:${siteConfig.contact.phone}`,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: MapPin,
      title: "Address",
      value: `${siteConfig.address.city}, ${siteConfig.address.state}`,
      href: "#",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  const socialLinks = [
    { icon: Instagram, href: siteConfig.social.instagram, label: "Instagram" },
    { icon: Facebook, href: siteConfig.social.facebook, label: "Facebook" },
    { icon: Youtube, href: siteConfig.social.youtube, label: "YouTube" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <CyberBackground />
      <CursorTrail />
      <Header />

      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Have questions? We're here to help. Reach out to us through any of these channels.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Methods */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {contactMethods.map((method) => (
                  <a
                    key={method.title}
                    href={method.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-6 rounded-xl ${method.bgColor} border border-border hover:border-primary/50 transition-all group`}
                  >
                    <method.icon className={`h-8 w-8 ${method.color} mb-4`} />
                    <h3 className="font-semibold mb-1">{method.title}</h3>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {method.value}
                    </p>
                  </a>
                ))}
              </div>

              {/* Social Links */}
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-semibold mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-muted hover:bg-primary/20 transition-colors"
                    >
                      <social.icon className="h-6 w-6" />
                    </a>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 p-6 rounded-xl bg-green-500/10 border border-green-500/30"
              >
                <h3 className="text-xl font-bold mb-2">Fastest Response on WhatsApp!</h3>
                <p className="text-muted-foreground mb-4">
                  Get instant replies and support via WhatsApp. We typically respond within minutes.
                </p>
                <a
                  href={`https://wa.me/${siteConfig.contact.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-green-500 hover:bg-green-600 gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Chat on WhatsApp
                  </Button>
                </a>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

              <form className="space-y-6 p-6 rounded-xl bg-card border border-border">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Name</label>
                    <Input placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input placeholder="How can we help?" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea
                    placeholder="Tell us more about your query..."
                    className="min-h-[150px]"
                  />
                </div>

                <Button type="submit" className="w-full gap-2">
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  We'll get back to you within 24 hours via email.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
