-- Create SEO metadata table for static pages
CREATE TABLE public.seo_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT UNIQUE NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  robots TEXT DEFAULT 'index, follow',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;

-- RLS Policies for seo_metadata
CREATE POLICY "Admins can manage SEO metadata"
  ON public.seo_metadata FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can read SEO metadata"
  ON public.seo_metadata FOR SELECT
  USING (true);

-- Add SEO columns to products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS meta_title TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS og_image_url TEXT;

-- Add SEO columns to blog_posts
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS meta_title TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS og_image_url TEXT;

-- Update trigger for seo_metadata
CREATE TRIGGER update_seo_metadata_updated_at
  BEFORE UPDATE ON public.seo_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();