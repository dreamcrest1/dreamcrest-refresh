import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, Tag, ArrowLeft, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { CyberBackground, CursorTrail } from "@/components/CyberBackground";
import { Button } from "@/components/ui/button";
import OptimizedImage from "@/components/OptimizedImage";

import blogNetflixImg from "@/assets/blog-netflix-household.webp";
import blogDreamtoolsImg from "@/assets/blog-dreamtools.webp";

const blogPosts = [
  {
    id: "netflix-no-household",
    title: "Now Stream Netflix Without The Issue of Household/Travel Errors",
    content: [
      "At Dreamcrest, innovation is at the core of everything we do. Since 2021, we've been proud to lead the way in OTT and cloud service solutions, delivering seamless and user-friendly experiences for our clients.",
      "One of our latest advancements is a proprietary technology designed to simplify the process of retrieving Netflix household and travel codes. Often, users encounter access issues due to household or travel code errors. To resolve this quickly and without hassle, users can visit code.dreamcrest.net, enter their registered email address, and instantly retrieve the necessary code—no complicated steps, no waiting.",
      "This exclusive solution is powered by our in-house technology, available only through Dreamcrest. It represents our commitment to providing practical, secure, and efficient tools that enhance user experience and reduce downtime.",
      "Our dedication to quality and innovation has established us as one of the most trusted names in the OTT and cloud services space. With Dreamcrest, you're not just accessing a service—you're partnering with a team that values reliability, excellence, and forward-thinking solutions.",
    ],
    date: "January 10, 2025",
    readTime: "1 Min Read",
    category: "OTT",
    image: blogNetflixImg,
    link: "https://code.dreamcrest.net",
    linkText: "Get Your Netflix Code",
  },
  {
    id: "movieboxpro-ultimate-ott-killer",
    title: "Movie Box Pro – Ultimate OTT Killer",
    content: [
      "MovieBox Pro – The Ultimate OTT App Alternative",
      "Discover MovieBox Pro, the all-in-one streaming solution designed to bring your favorite content from platforms like Netflix, Prime Video, Hulu, Starz, HBO, Showtime, and many more—all in one place.",
      "Whether you're using a laptop, Smart TV, Firestick, Android TV, or mobile device, MovieBox Pro offers a seamless, cross-platform experience that works worldwide.",
      "Available exclusively at movieboxpro.info, this is a private, invite-only service—making it one of the most exclusive streaming platforms available today. Access is limited and highly sought after, so don't miss your chance to get in. Join now while access is still open!",
    ],
    date: "December 8, 2022",
    readTime: "1 Min Read",
    category: "OTT",
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1200&h=600&fit=crop",
    link: "https://movieboxpro.info",
    linkText: "Visit MovieBox Pro",
  },
  {
    id: "dreamtools-in-new-addition",
    title: "Dreamtools.in – A New Addition To Dreamcrest Group Buy Services",
    content: [
      "Introducing DreamTools – Your Gateway to Effortless Premium Access",
      "We are excited to announce the launch of our newly developed panel, designed to provide seamless access to a wide range of premium services. With DreamTools, users can simply log in to their account and access all subscribed tools and services without any hassle.",
      "Built using modern, powerful technologies like React.js, PHP, and JavaScript, our platform ensures a smooth and responsive user experience. DreamTools is engineered to support multiple users and simultaneous access to various services—making it a scalable and reliable solution for both individuals and teams.",
      "One of the key features of this platform is its transparency. Users can easily track their usage history, monitor service activity, and view the expiration dates of their subscriptions in real time. This makes managing your tools not only easier, but also more efficient and organized.",
      "At Dreamcrest, we're committed to constant innovation. With DreamTools, we aim to turn ambitious ideas into reality by continuously expanding the range of premium services available on the platform.",
    ],
    date: "January 5, 2022",
    readTime: "2 Min Read",
    category: "Cloud",
    image: blogDreamtoolsImg,
    link: "https://dreamtools.in",
    linkText: "Visit DreamTools",
  },
];

export default function BlogPost() {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-primary hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <CyberBackground />
      <CursorTrail />
      <Header />
      <FloatingWhatsApp />

      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden mb-8"
          >
            <OptimizedImage
              src={post.image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover"
              width={1200}
              height={600}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </motion.div>

          {/* Post Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                {post.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              {post.title}
            </h1>
          </motion.div>

          {/* Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-8 rounded-2xl mb-8"
          >
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {post.content.map((paragraph, index) => (
                <p key={index} className="text-lg leading-relaxed mb-4 text-foreground/90">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* CTA */}
            {post.link && (
              <div className="mt-8 pt-8 border-t border-border">
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="gap-2">
                    {post.linkText}
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            )}
          </motion.article>

          {/* Back to Blog */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <Link to="/blog">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                View All Posts
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
