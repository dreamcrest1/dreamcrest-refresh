import { motion } from "framer-motion";
import { ExternalLink, MessageCircle, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CyberBackground } from "@/components/CyberBackground";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "916357998730";
const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/HAygGmjN7cNLePOWBtrPjc";

type ToolCategory = {
  title: string;
  emoji: string;
  tools: string[];
};

const toolCategories: ToolCategory[] = [
  {
    title: "Learning Tools",
    emoji: "📚",
    tools: [
      "Skillshare",
      "Scribd Premium",
      "Trading View Premium",
      "Magzter Gold",
      "Udemy Business",
      "Tinder Plus",
      "Coursera Premium",
      "Edx Premium",
      "Duolingo",
      "Datacamp",
      "Grammarly Premium",
      "Quillbot Premium",
      "Wordtune Premium",
      "Turnitin Student",
      "Turnitin Instructor",
      "Quetext",
      "Scopus",
      "Paperpal",
      "Scispace",
      "Tableau",
      "RefnWrite",
      "PyCharm",
      "Flutterflow",
      "Figma",
      "Loom",
      "Linguix Premium",
      "Notion Pro",
      "Consensus AI",
    ],
  },
  {
    title: "AI Bypass & AI Writers",
    emoji: "✍️",
    tools: [
      "Writehuman AI",
      "Hix AI Bypass",
      "Stealth Writer",
      "AI Humanizer.io",
      "Jasper AI",
      "Jenni AI",
      "Wordhero AI",
      "Bramework",
      "Writecream",
      "Designrr (Ebook Maker)",
      "Creaitor AI",
      "Scriptelo",
      "Texta AI",
      "Nichesss",
      "Rytr AI",
    ],
  },
  {
    title: "AI & Image Generation",
    emoji: "🤖",
    tools: [
      "ChatGPT Pro",
      "You.com (Multiple AI Models)",
      "Perplexity (Multi-AI Models)",
      "Bolt.new (AI website/app builder)",
      "One AI",
      "Midjourney",
      "Leonardo AI",
      "Open AI Sora",
      "Beautiful AI",
      "Gamma AI",
      "Riku AI",
      "Supermachine AI",
      "Ocoya AI (Post Scheduler)",
      "Gemini Pro",
      "Gemini Ulra",
      "Heygen AI",
      "RunwayML",
      "Hailuo AI",
      "Microsoft Co-Pilot",
      "Eleven Labs",
    ],
  },
  {
    title: "SEO Tools",
    emoji: "📈",
    tools: [
      "Ahrefs",
      "Moz Pro",
      "Helium 10",
      "Writerzen",
      "SEMrush",
      "Link Chest by SEO Buddy",
      "Keyword Search",
      "Screpy",
      "Ubersuggest",
      "Jungle Scout",
    ],
  },
  {
    title: "Stock Assets",
    emoji: "🖼️",
    tools: ["Freepik Premium", "Envato Elements", "Storyblocks", "Artlist.io", "Pngtree"],
  },
  {
    title: "Video & Graphics Editing",
    emoji: "🎥",
    tools: [
      "Adobe Creative Cloud",
      "Autodesk Collection",
      "Corel Draw",
      "Wondershare Filmora",
      "Democreator",
      "Recoverit",
      "Canva Pro",
      "Invideo Studio",
      "Sketchwow",
      "Sketchgenius",
      "Doodle Maker",
      "Doodly Standard & Enterprise",
      "Toonly",
      "Create Studio",
      "Wideoco",
      "PhotoVibrance",
      "Flexclip",
      "Design Beast",
      "Voicely",
      "Murf AI",
      "Video Creator",
      "Avatar Builder",
      "Videtoon 2.1",
      "Offeo Premium",
      "Doodle Stanza",
      "People Creator",
      "Remini AI",
      "Eleven Labs",
    ],
  },
  {
    title: "Lead Generation",
    emoji: "🎯",
    tools: [
      "Leadrocks",
      "LeadsGorilla",
      "Instantly",
      "WhatsCRM",
      "Pabbly Connect",
      "Useartemis",
      "Outscraper",
      "Leadscrape",
    ],
  },
  {
    title: "Cloud & Other Services",
    emoji: "☁️",
    tools: [
      "Tally Prime",
      "IBM SPSS",
      "Microsoft Azure",
      "GitHub Student Pack",
      "WhatsApp Contact Saver",
      "WinRAR License",
      "Zoom Premium",
      "LinkedIn Premium",
      "Epic Games",
      "Xbox Game Pass Ultimate",
      "Windows 10/11 Keys",
      "Windows Server Key",
      "Microsoft Office (2016/2019/2021/2024/365)",
      "Coolnewpdf",
      "Wondershare PDF Elements",
      "Adobe Acrobat DC Pro",
      "Screentovideo Recorder",
      "IDM (Internet Download Manager)",
      "Avast",
      "Bitdefender",
      "McAfee",
      "Avira",
      "Wondershare Recover it",
      "Data Recovery Tools",
      "Tinder Plus",
      "Magzter Gold",
    ],
  },
  {
    title: "VPN Services",
    emoji: "🔐",
    tools: [
      "NordVPN",
      "StarVPN",
      "IPVanish VPN",
      "CyberGhost VPN",
      "Express VPN",
      "PureVPN",
      "HMA",
      "Surfshark",
    ],
  },
  {
    title: "Hotsellers",
    emoji: "🔥",
    tools: [
      "Lovable Pro",
      "n8n (1 Year)",
      "Gamma Pro",
      "Descript Creator",
      "Bolt.new",
      "Replit Core",
      "Warp Pro",
      "Mobbin Pro",
      "Magic Pattern",
      "Wispr Flow",
      "ChatPRD Pro",
      "Linear Business",
      "Raycast Pro",
      "Superhuman Starter",
    ],
  },
];

type Deal = { title: string; details: string };

const streamingDeals: Deal[] = [
  {
    title: "WATCHO ULTRA PLAN - 13 OTTs Combo",
    details: "₹300 – 6 Months (5 Devices). Works on TV & Mobile. Activated on your number.",
  },
  {
    title: "NETFLIX UHD 4K Premium Plan",
    details: "₹450 – 3 Months (1 Device) | ₹799 – 6 Months | ₹1499 – 1 Year",
  },
  {
    title: "PRIME VIDEO (Private)",
    details: "₹350 – 6 Months (5 Devices) | ₹650 – 1 Year (5 Devices)",
  },
  {
    title: "ZEE5 PREMIUM (Your Number Activation)",
    details: "₹750 – 1 Year (Full HD, 5 Devices)",
  },
  {
    title: "SONYLIV PREMIUM (Your Number Activation)",
    details: "₹850 – 1 Year (4K, 5 Devices)",
  },
  {
    title: "YOUTUBE PREMIUM",
    details: "₹1200 – 12 Months (Existing ID)",
  },
  {
    title: "HOTSTAR (Your Number Activation)",
    details: "₹1250 – 1 Year (Premium 4K Plan)",
  },
];

function waLink(itemName: string) {
  const text = `Hi Dreamcrest Solutions! I'm interested in ${itemName}. Please share price and details.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function ToolCard({ name }: { name: string }) {
  return (
    <a
      href={waLink(name)}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block rounded-2xl border border-border bg-card/70 backdrop-blur-md p-5 transition-transform duration-200 hover:-translate-y-1"
      style={{
        boxShadow:
          "0 18px 50px -24px hsl(var(--foreground) / 0.35), 0 0 0 1px hsl(var(--border) / 0.6) inset",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            "radial-gradient(800px circle at 30% 20%, hsl(var(--primary) / 0.18), transparent 40%), radial-gradient(800px circle at 70% 80%, hsl(var(--secondary) / 0.12), transparent 45%)",
        }}
      />
      <div className="relative" style={{ transform: "translateZ(16px)" }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Click to chat</div>
            <div className="mt-1 font-semibold leading-snug">{name}</div>
          </div>
          <div className="shrink-0 rounded-xl border border-border bg-background/40 p-2">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Dreamcrest Solutions</span>
          <span className="inline-flex items-center gap-1">
            WhatsApp <ExternalLink className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      <div
        className="pointer-events-none absolute -bottom-6 left-1/2 h-10 w-[70%] -translate-x-1/2 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: "hsl(var(--primary) / 0.22)" }}
      />
    </a>
  );
}

function DealCard({ title, details }: Deal) {
  return (
    <a
      href={waLink(title)}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block rounded-2xl border border-border bg-card/70 backdrop-blur-md p-6 transition-transform duration-200 hover:-translate-y-1"
      style={{
        boxShadow: "0 18px 50px -26px hsl(var(--foreground) / 0.35)",
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--primary) / 0.14), transparent 55%), linear-gradient(315deg, hsl(var(--secondary) / 0.12), transparent 55%)",
        }}
      />
      <div className="relative">
        <div className="text-sm text-muted-foreground">Streaming Deal</div>
        <div className="mt-1 text-lg font-semibold leading-snug">{title}</div>
        <div className="mt-2 text-sm text-muted-foreground leading-relaxed">{details}</div>
        <div className="mt-5">
          <Button className="btn-glow gap-2">
            Chat on WhatsApp <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </a>
  );
}

export default function AllTools() {
  return (
    <div className="min-h-screen bg-background">
      <CyberBackground />
      <Header />

      <main className="relative z-10 pt-28 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl border border-border bg-card/60 backdrop-blur-xl p-8 md:p-12"
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(900px circle at 20% 10%, hsl(var(--primary) / 0.22), transparent 45%), radial-gradient(900px circle at 80% 90%, hsl(var(--secondary) / 0.16), transparent 46%)",
              }}
            />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-4 py-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                TOOL LIST — Click any tool to chat on WhatsApp
              </div>

              <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-tight">
                Dreamcrest <span className="gradient-text">Solutions</span>
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Welcome to Dreamcrest Solutions! Explore our premium tool offerings below. Tap any item to
                message us on WhatsApp at +91 6357998730.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a href={waLink("All Tools")} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="btn-glow gap-2">
                    Chat on WhatsApp <MessageCircle className="h-5 w-5" />
                  </Button>
                </a>
                <a href={WHATSAPP_GROUP_URL} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="gap-2">
                    Join WhatsApp Group <ExternalLink className="h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Categories */}
        <section className="container mx-auto px-4 mt-14">
          <div className="space-y-14">
            {toolCategories.map((cat, idx) => (
              <motion.section
                key={cat.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: idx * 0.03 }}
                className=""
              >
                <div className="flex items-end justify-between gap-6 mb-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">
                      <span className="mr-2">{cat.emoji}</span>
                      {cat.title}
                    </h2>
                    <p className="text-muted-foreground mt-1">Tap a tool to open WhatsApp chat.</p>
                  </div>
                  <div className="hidden md:block text-sm text-muted-foreground">{cat.tools.length} tools</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {cat.tools.map((tool) => (
                    <ToolCard key={tool} name={tool} />
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        </section>

        {/* Streaming */}
        <section className="container mx-auto px-4 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
            className=""
          >
            <div className="flex items-end justify-between gap-6 mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">📺 Streaming Subscriptions – Best Deals</h2>
                <p className="text-muted-foreground mt-1">Best prices guaranteed — DM to grab now.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {streamingDeals.map((deal) => (
                <DealCard key={deal.title} {...deal} />
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
