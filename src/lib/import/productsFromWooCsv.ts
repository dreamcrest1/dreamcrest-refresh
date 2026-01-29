import { parseCsv } from "@/lib/csv";

function toNumber(value: string) {
  const cleaned = (value ?? "").toString().replace(/[^0-9.]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
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

function firstImage(imagesField: string) {
  const raw = (imagesField ?? "").trim();
  if (!raw) return "";
  const parts = raw.split(",").map((p) => p.trim()).filter(Boolean);
  return parts[0] ?? "";
}

export type WooCsvProductRow = {
  legacy_id: number;
  name: string;
  description: string;
  long_description: string | null;
  category: string;
  sale_price: number;
  regular_price: number;
  image_url: string;
  external_url: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
};

export function parseWooProductsCsv(csvRaw: string): WooCsvProductRow[] {
  const { rows } = parseCsv(csvRaw);
  return rows
    .filter((r) => (r["Published"] ?? "") === "1")
    .map((r) => {
      const legacy_id = toNumber(r["ID"]);
      const name = r["Name"] || "Untitled";

      // Keep exactly as in CSV: Woo exports often contain HTML.
      const description = r["Short description"] || r["Description"] || "";
      const long_description = r["Description"] || description || "";

      const category = firstCategory(r["Categories"]);
      const sale_price = toNumber(r["Sale price"]);
      const regular_price = toNumber(r["Regular price"]);
      const image_url = firstImage(r["Images"]);
      const external_url = r["External URL"] || "";
      const featured = (r["Is featured?"] ?? "") === "1";
      const published = (r["Published"] ?? "") === "1";
      const sort_order = Number.isFinite(Number(r["Position"])) ? Number(r["Position"]) : 0;

      return {
        legacy_id,
        name,
        description,
        long_description,
        category,
        sale_price,
        regular_price,
        image_url,
        external_url,
        featured,
        published,
        sort_order,
      } satisfies WooCsvProductRow;
    })
    .filter((p) => p.legacy_id > 0);
}
