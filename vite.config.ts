import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "node:fs";
import { componentTagger } from "lovable-tagger";
import { parseCsv } from "./src/lib/csv";
import { blogPosts } from "./src/data/siteData";

const SITE_URL = "https://dreamcrest.net";

function generateSitemapXml() {
  const csvPath = path.resolve(__dirname, "./src/data/products-export.csv");
  const csvRaw = fs.readFileSync(csvPath, "utf-8");
  const { rows } = parseCsv(csvRaw);

  const productIds = rows
    .filter((r) => (r["Published"] ?? "") === "1")
    .map((r) => Number((r["ID"] ?? "").replace(/[^0-9]/g, "")))
    .filter((n) => Number.isFinite(n) && n > 0);

  const blogSlugs = blogPosts.map((p) => p.slug).filter(Boolean);

  const staticRoutes = [
    "/",
    "/products",
    "/all-tools",
    "/blog",
    "/about",
    "/faq",
    "/contact",
    "/refunds",
  ];

  const urls = [
    ...staticRoutes.map((p) => `${SITE_URL}${p}`),
    ...productIds.map((id) => `${SITE_URL}/product/${id}`),
    ...blogSlugs.map((slug) => `${SITE_URL}/blog/${slug}`),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((loc) => `  <url><loc>${loc}</loc></url>`).join("\n") +
    `\n</urlset>\n`;
}

function sitemapPlugin(): PluginOption {
  return {
    name: "dreamcrest-sitemap",
    apply: "build" as const,
    buildStart() {
      const xml = generateSitemapXml();
      const outPath = path.resolve(__dirname, "./public/sitemap.xml");
      fs.writeFileSync(outPath, xml, "utf-8");
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: ([react(), sitemapPlugin(), mode === "development" && componentTagger()].filter(Boolean) as PluginOption[]),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
