import { useQuery } from "@tanstack/react-query";
import { getSEOMetadataByPath } from "@/lib/db/seoMetadata";

export function useSEO(pagePath: string) {
  return useQuery({
    queryKey: ["seo_metadata", pagePath],
    queryFn: () => getSEOMetadataByPath(pagePath),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSEODefaults(pagePath: string, defaults: {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
}) {
  const { data: seoData, isLoading } = useSEO(pagePath);
  
  return {
    isLoading,
    title: seoData?.meta_title || defaults.title,
    description: seoData?.meta_description || defaults.description,
    keywords: seoData?.meta_keywords || defaults.keywords,
    image: seoData?.og_image_url || defaults.image,
    ogTitle: seoData?.og_title,
    ogDescription: seoData?.og_description,
    canonicalUrl: seoData?.canonical_url,
    robots: seoData?.robots,
  };
}
