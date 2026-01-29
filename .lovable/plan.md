
# Fix Homepage Blog Section Images

## Problem Identified
The "Latest Updates" section on the homepage is showing placeholder icons (📰) instead of actual blog post images. This happens because:

1. The `BlogSection` component in `Index.tsx` uses static data from `siteData.ts`
2. It hardcodes a gradient placeholder with an emoji instead of rendering actual images
3. Blog posts aren't clickable - they don't link to the full blog post page

Meanwhile, the `/blog` page works correctly by fetching posts from the database and displaying real images.

## Solution
Update the homepage `BlogSection` to:
1. Fetch live blog posts from the database (like the Blog page does)
2. Display actual images using the `OptimizedImage` component
3. Make each blog card clickable, linking to the full post
4. Add proper fallback handling for missing images

---

## Implementation Steps

### Step 1: Update BlogSection in Index.tsx

**Changes:**
- Add the database fetch using `useQuery` and `listPublishedBlogPosts`
- Replace the hardcoded placeholder with actual images using `OptimizedImage`
- Wrap each blog card in a `Link` to `/blog/{slug}`
- Show only the 3 most recent posts
- Add a "View All" button linking to the full blog page
- Handle loading state gracefully

**Before (current code):**
```jsx
<div className="aspect-video bg-muted relative overflow-hidden rounded-lg mb-4">
  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
    <span className="text-4xl">📰</span>
  </div>
</div>
```

**After (fixed code):**
```jsx
<div className="aspect-video relative overflow-hidden rounded-lg mb-4">
  <OptimizedImage
    src={post.image_url || "/images/blog/placeholder.jpg"}
    alt={post.title}
    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
    loading="lazy"
  />
</div>
```

### Step 2: Add Required Imports

Add these imports to `Index.tsx`:
- `useQuery` from `@tanstack/react-query`
- `listPublishedBlogPosts` from `@/lib/db/publicBlogPosts`
- `OptimizedImage` from `@/components/OptimizedImage`

### Step 3: Format Dates Properly

Use the database `published_at` or `created_at` fields and format them nicely (e.g., "Jan 29, 2026").

---

## Technical Summary

| File | Changes |
|------|---------|
| `src/pages/Index.tsx` | Update `BlogSection` to fetch from database, render real images, add links |

This approach ensures the homepage blog section matches the actual published blog posts and displays their proper featured images instead of placeholder icons.
