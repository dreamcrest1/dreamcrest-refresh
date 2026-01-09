import { motion } from "framer-motion";
import { Calendar, Clock, Tag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { CyberBackground, CursorTrail } from "@/components/CyberBackground";

import blogNetflixImg from "@/assets/blog-netflix-household.webp";
import blogDreamtoolsImg from "@/assets/blog-dreamtools.webp";

const blogPosts = [
  {
    id: "netflix-no-household",
    title: "Now Stream Netflix Without The Issue of Household/Travel Errors",
    excerpt: "At Dreamcrest, innovation is at the core of everything we do. Since 2021, we've been proud to lead the way in OTT and cloud service solutions, delivering seamless and user-friendly experiences for our clients.",
    content: `At Dreamcrest, innovation is at the core of everything we do. Since 2021, we've been proud to lead the way in OTT and cloud service solutions, delivering seamless and user-friendly experiences for our clients.

One of our latest advancements is a proprietary technology designed to simplify the process of retrieving Netflix household and travel codes. Often, users encounter access issues due to household or travel code errors. To resolve this quickly and without hassle, users can visit code.dreamcrest.net, enter their registered email address, and instantly retrieve the necessary code—no complicated steps, no waiting.

This exclusive solution is powered by our in-house technology, available only through Dreamcrest. It represents our commitment to providing practical, secure, and efficient tools that enhance user experience and reduce downtime.

Our dedication to quality and innovation has established us as one of the most trusted names in the OTT and cloud services space. With Dreamcrest, you're not just accessing a service—you're partnering with a team that values reliability, excellence, and forward-thinking solutions.`,
    date: "January 10, 2025",
    readTime: "1 Min Read",
    category: "OTT",
    image: blogNetflixImg,
    link: "https://code.dreamcrest.net",
  },
  {
    id: "movieboxpro-ultimate-ott-killer",
    title: "Movie Box Pro – Ultimate OTT Killer",
    excerpt: "Discover MovieBox Pro, the all-in-one streaming solution designed to bring your favorite content from platforms like Netflix, Prime Video, Hulu, Starz, HBO, Showtime, and many more—all in one place.",
    content: `MovieBox Pro – The Ultimate OTT App Alternative

Discover MovieBox Pro, the all-in-one streaming solution designed to bring your favorite content from platforms like Netflix, Prime Video, Hulu, Starz, HBO, Showtime, and many more—all in one place.

Whether you're using a laptop, Smart TV, Firestick, Android TV, or mobile device, MovieBox Pro offers a seamless, cross-platform experience that works worldwide.

Available exclusively at movieboxpro.info, this is a private, invite-only service—making it one of the most exclusive streaming platforms available today. Access is limited and highly sought after, so don't miss your chance to get in. Join now while access is still open!`,
    date: "December 8, 2022",
    readTime: "1 Min Read",
    category: "OTT",
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&h=300&fit=crop",
    link: "https://movieboxpro.info",
  },
  {
    id: "dreamtools-in-new-addition",
    title: "Dreamtools.in – A New Addition To Dreamcrest Group Buy Services",
    excerpt: "Introducing DreamTools – Your Gateway to Effortless Premium Access. We are excited to announce the launch of our newly developed panel, designed to provide seamless access to a wide range of premium services.",
    content: `Introducing DreamTools – Your Gateway to Effortless Premium Access

We are excited to announce the launch of our newly developed panel, designed to provide seamless access to a wide range of premium services. With DreamTools, users can simply log in to their account and access all subscribed tools and services without any hassle.

Built using modern, powerful technologies like React.js, PHP, and JavaScript, our platform ensures a smooth and responsive user experience. DreamTools is engineered to support multiple users and simultaneous access to various services—making it a scalable and reliable solution for both individuals and teams.

One of the key features of this platform is its transparency. Users can easily track their usage history, monitor service activity, and view the expiration dates of their subscriptions in real time. This makes managing your tools not only easier, but also more efficient and organized.

At Dreamcrest, we're committed to constant innovation. With DreamTools, we aim to turn ambitious ideas into reality by continuously expanding the range of premium services available on the platform.`,
    date: "January 5, 2022",
    readTime: "2 Min Read",
    category: "Cloud",
    image: blogDreamtoolsImg,
    link: "https://dreamtools.in",
  },
];

export default function Blog() {
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
              📰 <span className="gradient-text">Blog & Updates</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Stay updated with the latest news, features, and announcements from Dreamcrest.
            </p>
          </motion.div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="glass rounded-2xl overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
