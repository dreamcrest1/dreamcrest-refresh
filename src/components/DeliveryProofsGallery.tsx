import { motion } from "framer-motion";
import { ExternalLink, Instagram, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/siteData";

// Sample delivery proof images - these would be real screenshots from Instagram
const deliveryProofs = [
  { id: 1, type: "Netflix", customer: "Mumbai", emoji: "🎬" },
  { id: 2, type: "ChatGPT Plus", customer: "Delhi", emoji: "🤖" },
  { id: 3, type: "Prime Video", customer: "Bangalore", emoji: "📺" },
  { id: 4, type: "Canva Pro", customer: "Chennai", emoji: "🎨" },
  { id: 5, type: "Spotify Premium", customer: "Pune", emoji: "🎵" },
  { id: 6, type: "Hotstar", customer: "Kolkata", emoji: "🏏" },
  { id: 7, type: "Adobe CC", customer: "Hyderabad", emoji: "🖌️" },
  { id: 8, type: "YouTube Premium", customer: "Ahmedabad", emoji: "▶️" },
  { id: 9, type: "Microsoft 365", customer: "Jaipur", emoji: "📊" },
  { id: 10, type: "Grammarly", customer: "Lucknow", emoji: "✍️" },
  { id: 11, type: "Perplexity AI", customer: "Chandigarh", emoji: "🔍" },
  { id: 12, type: "Zee5", customer: "Indore", emoji: "📱" },
];

function ProofCard({ proof, index }: { proof: typeof deliveryProofs[0]; index: number }) {
  return (
    <motion.div
      className="flex-shrink-0 w-64 h-40 rounded-2xl glass border border-border/50 p-4 flex flex-col justify-between relative overflow-hidden group"
      whileHover={{ scale: 1.05, y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl">{proof.emoji}</span>
          <div>
            <h4 className="font-bold text-sm">{proof.type}</h4>
            <p className="text-xs text-muted-foreground">Customer from {proof.customer}</p>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-green-500" />
        <span className="text-xs text-green-500 font-medium">Delivered Successfully</span>
      </div>
      
      {/* Decorative stars */}
      <motion.div
        className="absolute top-2 right-2"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <Star className="w-4 h-4 text-primary/30" />
      </motion.div>
    </motion.div>
  );
}

export function DeliveryProofsGallery() {
  // Duplicate the proofs for seamless infinite scroll
  const duplicatedProofs = [...deliveryProofs, ...deliveryProofs];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-sm font-medium mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <CheckCircle2 className="w-4 h-4" />
            15,000+ Happy Customers
          </motion.span>
          <h2 className="section-title">Delivery Proofs</h2>
          <p className="section-subtitle">Real deliveries. Real customers. Real trust.</p>
        </motion.div>

        {/* Scrolling Gallery - Row 1 (Left to Right) */}
        <div className="relative mb-6">
          <div className="flex gap-4 animate-scroll-left">
            {duplicatedProofs.map((proof, i) => (
              <ProofCard key={`row1-${i}`} proof={proof} index={i} />
            ))}
          </div>
        </div>

        {/* Scrolling Gallery - Row 2 (Right to Left) */}
        <div className="relative mb-10">
          <div className="flex gap-4 animate-scroll-right">
            {[...duplicatedProofs].reverse().map((proof, i) => (
              <ProofCard key={`row2-${i}`} proof={proof} index={i} />
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <a
            href="https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTkzOTExNzgwNDk4NDU1?igshid=YmMyMTA2M2Y="
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="outline" className="gap-2">
              <Instagram className="w-5 h-5" />
              View All Proofs on Instagram
              <ExternalLink className="w-4 h-4" />
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default DeliveryProofsGallery;
