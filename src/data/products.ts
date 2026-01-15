import { parseCsv } from "@/lib/csv";

export interface Product {
  id: number;
  name: string;
  description: string;
  longDescription?: string;
  salePrice: number;
  regularPrice: number;
  category: string;
  image: string;
  externalUrl: string;
  discount: number;
  featured?: boolean;
}

// Exported by Vite as a raw string at build time.
// eslint-disable-next-line import/no-unresolved
import productsCsvRaw from "./products-export.csv?raw";

function stripHtml(html: string) {
  return (html ?? "")
    // Replace <br> with spaces so UI doesn't show ugly newlines.
    .replace(/<br\s*\/?\s*>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function removeEmojis(input: string) {
  // Broad emoji/symbol ranges; safe no-op if none.
  return input.replace(
    /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu,
    ""
  );
}

function normalizeSentence(input: string) {
  const s = input.replace(/\s+/g, " ").trim();
  if (!s) return "";
  // Ensure a professional ending.
  return /[.!?]$/.test(s) ? s : `${s}.`;
}

function stripBoilerplate(input: string) {
  let s = input;

  // Remove URLs and obvious CTA boilerplate.
  s = s.replace(/https?:\/\/\S+/gi, "");
  s = s.replace(/\b(whatsapp|telegram|dm|inbox|contact us|call us|chat now)\b.*$/i, "");

  // Remove common ecommerce/export boilerplate.
  const boilerplatePatterns: RegExp[] = [
    /\b(refund|returns?|money[- ]back|guarantee)\b.*$/i,
    /\b(terms?|conditions?|disclaimer)\b.*$/i,
    /\b(shipping|delivery)\b.*$/i,
    /\b(support|customer support)\b.*$/i,
  ];
  for (const p of boilerplatePatterns) s = s.replace(p, "");

  return s.trim();
}

function deDuplicateName(input: string, name: string) {
  if (!input) return "";
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Remove standalone occurrences of the product name to avoid repetition.
  return input.replace(new RegExp(`\\b${escaped}\\b`, "gi"), "").replace(/\s{2,}/g, " ").trim();
}

function seoSnippetFromName(name: string, category: string) {
  const cat = (category || "").trim();
  const lowerCat = cat.toLowerCase();

  if (lowerCat.includes("ott") || lowerCat.includes("stream")) {
    return `Explore ${name} pricing and streaming plan details. Compare options and grab the best available deal link. (${cat})`;
  }
  if (lowerCat.includes("ai")) {
    return `Explore ${name} pricing and key highlights. Compare options and get the best available deal link. (${cat})`;
  }
  if (lowerCat.includes("windows") || lowerCat.includes("office")) {
    return `Explore ${name} pricing and license details. Compare options and get the best available deal link. (${cat})`;
  }
  return `Explore ${name} pricing and key details. Compare options and get the best available deal link. (${cat || "Software"})`;
}

function optimizeDescription(params: {
  name: string;
  category: string;
  raw: string;
  maxChars?: number;
  allowLong?: boolean;
}) {
  const maxChars = params.maxChars ?? 160;

  let s = stripHtml(params.raw);

  // Handle *literal* backslash-n sequences coming from CSV exports.
  s = s.replace(/\\n/g, " ").replace(/\\r/g, " ");

  s = removeEmojis(s);
  s = stripBoilerplate(s);
  s = deDuplicateName(s, params.name);

  // Keep to a single paragraph.
  s = s.replace(/[\r\n]+/g, " ").replace(/\s{2,}/g, " ").trim();

  // If still empty/ugly, generate a clean SEO-safe snippet from name/category.
  if (!s || s.length < 40) {
    s = seoSnippetFromName(params.name, params.category);
  }

  // SEO-enhance without adding new claims: ensure category keyword appears.
  if (
    params.category &&
    !new RegExp(`\\b${params.category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(s)
  ) {
    s = s ? `${s} (${params.category})` : `${params.category}: ${params.name}`;
  }

  s = normalizeSentence(s);

  if (!params.allowLong && s.length > maxChars) {
    s = s.slice(0, maxChars - 1).trimEnd();
    s = s.replace(/[\s,;:-]+$/g, "");
    s = `${s}…`;
  }

  return s;
}

function toNumber(value: string) {
  const cleaned = (value ?? "").toString().replace(/[^0-9.]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function firstImage(imagesField: string) {
  // Woo export usually stores a single url, but sometimes multiple separated by comma.
  // We take the first non-empty url.
  const raw = (imagesField ?? "").trim();
  if (!raw) return "";
  const parts = raw.split(",").map((p) => p.trim()).filter(Boolean);
  return parts[0] ?? "";
}

function firstCategory(categoriesField: string) {
  const raw = (categoriesField ?? "").trim();
  if (!raw) return "Software";
  const parts = raw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  return parts[0] ?? "Software";
}

function calcDiscount(regularPrice: number, salePrice: number) {
  if (!regularPrice || !salePrice) return 0;
  if (salePrice >= regularPrice) return 0;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
}

const priceOverridesById: Record<number, Partial<Pick<Product, "salePrice" | "regularPrice">>> = {
  // Fix: Open AI Sora should be ₹399, not ₹1
  1722: { salePrice: 399 },
};

const { rows } = parseCsv(productsCsvRaw);

export const products: Product[] = rows
  .filter((r) => (r["Published"] ?? "") === "1")
  .map((r) => {
    const id = toNumber(r["ID"]);
    const name = r["Name"] || "Untitled";

    const salePriceRaw = toNumber(r["Sale price"]);
    const regularPriceRaw = toNumber(r["Regular price"]);

    const category = firstCategory(r["Categories"]);

    const shortDesc = r["Short description"];
    const fullDesc = r["Description"];
    const rawDesc = shortDesc || fullDesc || "";

    const description = optimizeDescription({
      name,
      category,
      raw: rawDesc,
      maxChars: 160,
    });

    const longDescription = optimizeDescription({
      name,
      category,
      raw: rawDesc,
      maxChars: 480,
      allowLong: true,
    });

    const image = firstImage(r["Images"]);
    const externalUrl = r["External URL"] || "";
    const featured = (r["Is featured?"] ?? "") === "1";

    const override = priceOverridesById[id] || {};
    const salePrice = override.salePrice ?? salePriceRaw;
    const regularPrice = override.regularPrice ?? regularPriceRaw;

    return {
      id,
      name,
      description,
      longDescription,
      salePrice,
      regularPrice,
      category,
      image,
      externalUrl,
      discount: calcDiscount(regularPrice, salePrice),
      featured,
    };
  })
  // Defensive: ensure stable sort so UI ordering doesn't jump
  .sort((a, b) => a.id - b.id);

export const categories = [
  { name: "AI Tools", slug: "ai-tools", count: products.filter((p) => p.category === "AI Tools").length },
  { name: "Video Editing", slug: "video-editing", count: products.filter((p) => p.category === "Video Editing").length },
  { name: "Indian OTT", slug: "indian-ott", count: products.filter((p) => p.category === "Indian OTT").length },
  { name: "International OTT", slug: "international-ott", count: products.filter((p) => p.category === "International OTT").length },
  { name: "Writing Tools", slug: "writing-tools", count: products.filter((p) => p.category === "Writing Tools").length },
  { name: "Cloud Services", slug: "cloud-services", count: products.filter((p) => p.category === "Cloud Services").length },
  { name: "Lead Generation", slug: "lead-generation", count: products.filter((p) => p.category === "Lead Generation").length },
  { name: "Software", slug: "software", count: products.filter((p) => p.category === "Software").length },
];

export const featuredProducts = products.filter((p) => p.featured);
export const dealOfTheWeek = [...products].sort((a, b) => b.discount - a.discount).slice(0, 10);

export const getProductsByCategory = (categorySlug: string) => {
  const categoryMap: Record<string, string> = {
    "ai-tools": "AI Tools",
    "video-editing": "Video Editing",
    "indian-ott": "Indian OTT",
    "international-ott": "International OTT",
    "writing-tools": "Writing Tools",
    "cloud-services": "Cloud Services",
    "lead-generation": "Lead Generation",
    software: "Software",
  };
  const categoryName = categoryMap[categorySlug];
  return products.filter((p) => p.category === categoryName);
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

// Category fallback images
const categoryFallbacks: Record<string, string> = {
  "AI Tools": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=400&fit=crop",
  "Video Editing": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=400&fit=crop",
  "Indian OTT": "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=400&fit=crop",
  "International OTT": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=400&fit=crop",
  "Writing Tools": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=400&fit=crop",
  "Cloud Services": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=400&fit=crop",
  "Lead Generation": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop",
  "Software": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop",
};

export const getCategoryFallback = (category: string) => {
  return categoryFallbacks[category] || categoryFallbacks["Software"];
};
