import { useEffect } from "react";

const SITE_URL = "https://dreamcrest.net";
const SITE_NAME = "Dreamcrest Solutions";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

export interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noindex?: boolean;
  // Product specific
  product?: {
    name: string;
    description: string;
    image: string;
    price: number;
    currency?: string;
    availability?: "InStock" | "OutOfStock" | "PreOrder";
    category?: string;
  };
  // Article specific
  article?: {
    headline: string;
    description: string;
    image: string;
    publishedTime: string;
    modifiedTime?: string;
    author?: string;
    category?: string;
  };
  // Breadcrumbs
  breadcrumbs?: Array<{ name: string; url: string }>;
}

function setMetaTag(name: string, content: string, isProperty = false) {
  const attribute = isProperty ? "property" : "name";
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute("content", content);
}

function removeMetaTag(name: string, isProperty = false) {
  const attribute = isProperty ? "property" : "name";
  const element = document.querySelector(`meta[${attribute}="${name}"]`);
  if (element) {
    element.remove();
  }
}

function setLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`);
  
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  
  element.setAttribute("href", href);
}

function setJsonLd(id: string, data: object) {
  let script = document.getElementById(id) as HTMLScriptElement;
  
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  
  script.textContent = JSON.stringify(data);
}

function removeJsonLd(id: string) {
  const script = document.getElementById(id);
  if (script) {
    script.remove();
  }
}

export function SEOHead({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  noindex = false,
  product,
  article,
  breadcrumbs,
}: SEOHeadProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const metaDescription = description || "India's Most Trusted Digital Product Store. Get premium AI tools, OTT subscriptions, software & more at unbeatable prices.";
    const metaImage = image || DEFAULT_IMAGE;
    const canonicalUrl = url || window.location.href.split("?")[0];
    
    // Set document title
    document.title = fullTitle;
    
    // Basic meta tags
    setMetaTag("description", metaDescription);
    if (keywords) {
      setMetaTag("keywords", keywords);
    }
    
    // Robots
    if (noindex) {
      setMetaTag("robots", "noindex, nofollow");
    } else {
      setMetaTag("robots", "index, follow");
    }
    
    // Open Graph
    setMetaTag("og:title", fullTitle, true);
    setMetaTag("og:description", metaDescription, true);
    setMetaTag("og:image", metaImage, true);
    setMetaTag("og:url", canonicalUrl, true);
    setMetaTag("og:type", type, true);
    setMetaTag("og:site_name", SITE_NAME, true);
    
    // Twitter Card
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", fullTitle);
    setMetaTag("twitter:description", metaDescription);
    setMetaTag("twitter:image", metaImage);
    
    // Canonical URL
    setLinkTag("canonical", canonicalUrl);
    
    // Article specific
    if (publishedTime) {
      setMetaTag("article:published_time", publishedTime, true);
    }
    if (modifiedTime) {
      setMetaTag("article:modified_time", modifiedTime, true);
    }
    
    // Product Schema
    if (product) {
      setJsonLd("product-schema", {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.image,
        brand: {
          "@type": "Organization",
          name: SITE_NAME,
        },
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: product.currency || "INR",
          availability: `https://schema.org/${product.availability || "InStock"}`,
          seller: {
            "@type": "Organization",
            name: SITE_NAME,
          },
        },
        ...(product.category && { category: product.category }),
      });
    } else {
      removeJsonLd("product-schema");
    }
    
    // Article Schema
    if (article) {
      setJsonLd("article-schema", {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.headline,
        description: article.description,
        image: article.image,
        datePublished: article.publishedTime,
        dateModified: article.modifiedTime || article.publishedTime,
        author: {
          "@type": "Organization",
          name: article.author || SITE_NAME,
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/logo.png`,
          },
        },
        ...(article.category && { articleSection: article.category }),
      });
    } else {
      removeJsonLd("article-schema");
    }
    
    // Breadcrumbs Schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      setJsonLd("breadcrumb-schema", {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
        })),
      });
    } else {
      removeJsonLd("breadcrumb-schema");
    }
    
    // Cleanup on unmount
    return () => {
      // Reset to defaults on page change
      document.title = SITE_NAME;
    };
  }, [title, description, keywords, image, url, type, publishedTime, modifiedTime, noindex, product, article, breadcrumbs]);
  
  return null;
}

export default SEOHead;
