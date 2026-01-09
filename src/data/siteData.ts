export const siteConfig = {
  name: "Dreamcrest",
  tagline: "India's Most Trusted & Oldest Multi Platform Service Provider",
  description: "Get premium digital products at discounted prices. OTT subscriptions, AI tools, software, and more with 15,000+ happy customers.",
  since: 2021,
  customers: "15,000+",
  products: "200+",
  address: {
    street: "320 VGN Tranquil Pother",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "603203",
    country: "India",
  },
  contact: {
    phone: "+91 6357998730",
    email: "dreamcrestsolutions@gmail.com",
    whatsapp: [
      { number: "+91 6357998730", label: "Primary" },
    ],
  },
  social: {
    instagram: "https://www.instagram.com/dreamcrest_solutions",
    facebook: "https://www.facebook.com/dreamcrestsolutions/",
    youtube: "https://www.youtube.com/@dreamcrestsolutions5120",
  },
  sisterBrands: [
    { name: "Dreamtools", url: "https://dreamtools.in/", description: "Group Buy Tools" },
    { name: "Dreamstar Solutions", url: "#", description: "Digital Services" },
  ],
  links: {
    deliveryProofs: "https://www.instagram.com/dreamcrest_solutions",
    shop: "/products",
    contact: "/contact",
  },
};

export const heroSlides = [
  {
    id: 1,
    title: "Up to 70% Off on AI Tools",
    subtitle: "We Offer AI Tools Like Perplexity AI, ChatGPT, SuperGrok, You.com & Many More",
    cta: "Explore Now",
    link: "/products?category=ai-tools",
    bgGradient: "from-amber-500/20 via-orange-500/10 to-transparent",
  },
  {
    id: 2,
    title: "Upto 80% OFF",
    subtitle: "Video & Graphics Editing Tools",
    cta: "Buy Now",
    link: "/products?category=video-editing",
    bgGradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
  },
  {
    id: 3,
    title: "2025 OTT Sale",
    subtitle: "Amazing Deals on Netflix, Prime, Hotstar & More",
    cta: "Explore Now",
    link: "/products?category=indian-ott",
    bgGradient: "from-purple-500/20 via-pink-500/10 to-transparent",
  },
  {
    id: 4,
    title: "Business Essentials",
    subtitle: "Grab Your Deal Now on Software & Cloud Services",
    cta: "Shop Now",
    link: "/products?category=software",
    bgGradient: "from-green-500/20 via-emerald-500/10 to-transparent",
  },
];

export const blogPosts = [
  {
    id: 1,
    title: "Now Stream Netflix Without The Issue of Household/Travel Errors",
    excerpt: "Learn how to bypass Netflix household restrictions and enjoy streaming anywhere.",
    date: "Jan 10, 2025",
    category: "OTT",
    image: "https://dreamcrest.net/wp-content/uploads/2025/01/netflix-household.jpg",
    slug: "netflix-no-household",
  },
  {
    id: 2,
    title: "Movie Box Pro – Ultimate OTT Killer",
    excerpt: "Discover the all-in-one streaming solution that rivals all major OTT platforms.",
    date: "Dec 08, 2022",
    category: "OTT",
    image: "https://dreamcrest.net/wp-content/uploads/2022/12/moviebox.jpg",
    slug: "movieboxpro-ultimate-ott-killer",
  },
  {
    id: 3,
    title: "Dreamtools.in – A New Addition To Dreamcrest Group Buy Services",
    excerpt: "Introducing our sister brand offering premium group buy tools at affordable prices.",
    date: "Jan 05, 2022",
    category: "Cloud",
    image: "https://dreamcrest.net/wp-content/uploads/2022/01/dreamtools.jpg",
    slug: "dreamtools-in-new-addition",
  },
];

export const deliveryProofs = [
  { id: 1, image: "/proof-1.jpg", alt: "Delivery Proof 1" },
  { id: 2, image: "/proof-2.jpg", alt: "Delivery Proof 2" },
  { id: 3, image: "/proof-3.jpg", alt: "Delivery Proof 3" },
  { id: 4, image: "/proof-4.jpg", alt: "Delivery Proof 4" },
  { id: 5, image: "/proof-5.jpg", alt: "Delivery Proof 5" },
  { id: 6, image: "/proof-6.jpg", alt: "Delivery Proof 6" },
];

export const refundPolicy = [
  {
    title: "Eligible for Refund",
    content: "Refunds are applicable only if the product or service is not delivered within the promised timeframe or if it is defective/not as described."
  },
  {
    title: "Refund Request Period",
    content: "Customers must request a refund within 7 days of purchase. After this period, refund requests will not be accepted."
  },
  {
    title: "Non-Refundable Items",
    content: "Digital products that have already been delivered or activated (e.g., software keys, subscriptions) are non-refundable."
  },
  {
    title: "Partial Refunds",
    content: "In cases where a partial service has been rendered, only a partial refund will be issued."
  },
  {
    title: "Refund Processing Time",
    content: "Refunds will be processed within 7-10 business days after approval."
  },
  {
    title: "How to Request a Refund",
    content: "Contact us via email at dreamcrestsolutions@gmail.com with your order details and reason for the refund request."
  },
  {
    title: "Chargebacks",
    content: "Initiating a chargeback without contacting us first may result in account suspension and denial of future services."
  },
  {
    title: "Exceptions",
    content: "In rare cases, exceptions may be made at the discretion of Dreamcrest Solutions management."
  },
  {
    title: "Currency",
    content: "All refunds will be processed in the same currency as the original payment."
  },
  {
    title: "Contact Support",
    content: "For any refund-related queries, please contact our support team via WhatsApp or email."
  },
  {
    title: "Policy Updates",
    content: "Dreamcrest Solutions reserves the right to modify this refund policy at any time without prior notice."
  },
];

export const navLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
  { name: "Return & Refunds", href: "/refunds" },
];
