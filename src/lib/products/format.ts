export function formatPriceINR(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function calcDiscountPercent(regularPrice: number, salePrice: number) {
  if (!regularPrice || !salePrice) return 0;
  if (salePrice >= regularPrice) return 0;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
}

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

export function getCategoryFallbackImage(category: string) {
  return categoryFallbacks[category] || categoryFallbacks["Software"]!;
}
