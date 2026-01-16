import * as React from "react";
import { cn } from "@/lib/utils";

type Loading = "eager" | "lazy";

type Props = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: Loading;
  decoding?: "async" | "auto" | "sync";
  fetchPriority?: "high" | "low" | "auto";
  onError?: React.ImgHTMLAttributes<HTMLImageElement>["onError"];
};

function withQuery(url: string, params: Record<string, string>) {
  try {
    const u = new URL(url);
    Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
    return u.toString();
  } catch {
    return url;
  }
}

function webpCandidate(src: string) {
  if (!src) return "";
  if (src.startsWith("data:")) return "";
  if (src.endsWith(".webp")) return src;

  // Unsplash supports output format selection.
  if (src.includes("images.unsplash.com")) {
    return withQuery(src, { auto: "format", fm: "webp" });
  }

  // Best-effort extension swap (works if your CDN/origin provides .webp variants).
  const replaced = src.replace(/\.(png|jpe?g)(\?.*)?$/i, ".webp$2");
  return replaced === src ? "" : replaced;
}

export function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  loading = "lazy",
  decoding = "async",
  fetchPriority = "auto",
  onError,
}: Props) {
  const webpSrc = webpCandidate(src);

  // If we don't have a safe webp candidate, render a plain img.
  if (!webpSrc || webpSrc === src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(className)}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        onError={onError}
      />
    );
  }

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={src}
        alt={alt}
        className={cn(className)}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        onError={onError}
      />
    </picture>
  );
}

export default OptimizedImage;
