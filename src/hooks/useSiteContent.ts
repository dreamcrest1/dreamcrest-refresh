import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { siteConfig as defaultSiteConfig, navLinks as defaultNavLinks, heroSlides as defaultHeroSlides } from "@/data/siteData";

// Type definitions for site content
export interface SiteConfigData {
  name: string;
  tagline: string;
  description: string;
  since: number;
  customers: string;
  products: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    whatsapp: Array<{ number: string; label: string }>;
  };
  social: {
    instagram: string;
    facebook: string;
    youtube: string;
  };
  sisterBrands: Array<{ name: string; url: string; description: string }>;
}

export interface NavLinkData {
  name: string;
  href: string;
}

export interface HeroSlideData {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  bgGradient: string;
}

export interface HeaderData {
  announcementBar: string;
  logoUrl: string;
  showAdminButton: boolean;
  showShopButton: boolean;
  shopButtonText: string;
}

export interface HeroData {
  headline: string;
  highlightWord: string;
  subheadline: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  badgeText: string;
  stats: Array<{ value: string; label: string }>;
  trustBadges: Array<{ text: string }>;
}

export interface AboutData {
  subtitle: string;
  title: string;
  tagline: string;
  description: string;
  bulletPoints: string[];
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  highlightNumber: string;
  highlightLabel: string;
  highlightSubLabel: string;
  floatingBadge1: string;
  floatingBadge2: string;
}

export interface FooterData {
  showBranding: boolean;
  copyrightText: string;
  subCopyrightText: string;
  quickLinksTitle: string;
  brandsTitle: string;
  contactTitle: string;
}

export interface CategoryIconData {
  name: string;
  icon: string;
}

// Fetch single content key
async function fetchSiteContentKey<T>(key: string): Promise<T | null> {
  const { data, error } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) throw error;
  return data?.value as T | null;
}

// Hook to get site config
export function useSiteConfig() {
  return useQuery({
    queryKey: ["site_content", "site.config"],
    queryFn: async () => {
      const data = await fetchSiteContentKey<SiteConfigData>("site.config");
      return data ?? defaultSiteConfig;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to get nav links
export function useNavLinks() {
  return useQuery({
    queryKey: ["site_content", "site.nav"],
    queryFn: async () => {
      const data = await fetchSiteContentKey<NavLinkData[]>("site.nav");
      return data ?? defaultNavLinks;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to get header settings
export function useHeaderSettings() {
  return useQuery({
    queryKey: ["site_content", "site.header"],
    queryFn: async () => {
      const data = await fetchSiteContentKey<HeaderData>("site.header");
      return data ?? {
        announcementBar: "INSTANT DELIVERY OF ALL DIGITAL PRODUCTS",
        logoUrl: "",
        showAdminButton: true,
        showShopButton: true,
        shopButtonText: "Shop Now",
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to get hero section
export function useHeroSection() {
  return useQuery({
    queryKey: ["site_content", "home.hero"],
    queryFn: async () => {
      const data = await fetchSiteContentKey<HeroData>("home.hero");
      return data ?? {
        headline: "India's Most",
        highlightWord: "Trusted",
        subheadline: "Digital Product Store",
        primaryCtaText: "Explore Products",
        primaryCtaLink: "/products",
        secondaryCtaText: "Contact Us",
        secondaryCtaLink: "/contact",
        badgeText: "Up to 80% OFF on All Products",
        stats: [
          { value: "15,000+", label: "Happy Customers" },
          { value: "200+", label: "Products" },
          { value: "Since 2021", label: "Trusted" },
          { value: "24/7", label: "Support" },
        ],
        trustBadges: [
          { text: "100% Genuine" },
          { text: "Instant Delivery" },
          { text: "24/7 Support" },
        ],
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to get about section
export function useAboutSection() {
  return useQuery({
    queryKey: ["site_content", "home.about"],
    queryFn: async () => {
      const data = await fetchSiteContentKey<AboutData>("home.about");
      return data ?? {
        subtitle: "About Us",
        title: "Dreamcrest Solutions",
        tagline: "Oldest Multiplatform Service Provider",
        description: "Dreamcrest Group is a leading provider of OTT services and group buy tools at discounted prices. Founded in 2021, Dreamcrest has gained over 15,000+ customers and has expanded its reach internationally.",
        bulletPoints: [
          "Most Trusted Service Provider",
          "Over 200+ Products Available",
          "Most Responsive Customer Support",
          "Instant Digital Delivery",
        ],
        primaryCtaText: "Contact Us",
        primaryCtaLink: "/contact",
        secondaryCtaText: "View Proofs",
        secondaryCtaLink: "https://www.instagram.com/dreamcrest_solutions",
        highlightNumber: "15,000+",
        highlightLabel: "Happy Customers",
        highlightSubLabel: "& Growing Every Day",
        floatingBadge1: "⭐ 4.9 Rating",
        floatingBadge2: "🚀 Since 2021",
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to get footer settings
export function useFooterSettings() {
  return useQuery({
    queryKey: ["site_content", "site.footer"],
    queryFn: async () => {
      const data = await fetchSiteContentKey<FooterData>("site.footer");
      return data ?? {
        showBranding: true,
        copyrightText: "© {year} Dreamcrest Solutions. All rights reserved.",
        subCopyrightText: "India's Most Trusted Digital Product Store | Serving 15,000+ Happy Customers Since 2021",
        quickLinksTitle: "Quick Links",
        brandsTitle: "Our Brands",
        contactTitle: "Contact Us",
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to get category icons
export function useCategoryIcons() {
  return useQuery({
    queryKey: ["site_content", "home.categoryIcons"],
    queryFn: async () => {
      const data = await fetchSiteContentKey<CategoryIconData[]>("home.categoryIcons");
      return data ?? [
        { name: "AI Tools", icon: "🤖" },
        { name: "Video Editing", icon: "🎬" },
        { name: "Indian OTT", icon: "📺" },
        { name: "International OTT", icon: "🌍" },
        { name: "Writing Tools", icon: "✍️" },
        { name: "Cloud Services", icon: "☁️" },
        { name: "Lead Generation", icon: "👥" },
        { name: "Software", icon: "💻" },
      ];
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to get hero slides
export function useHeroSlides() {
  return useQuery({
    queryKey: ["site_content", "home.slides"],
    queryFn: async () => {
      const data = await fetchSiteContentKey<HeroSlideData[]>("home.slides");
      return data ?? defaultHeroSlides;
    },
    staleTime: 5 * 60 * 1000,
  });
}
