
Goal
- Add a WordPress-like admin panel inside your existing website (same Vite/React app) so you can:
  - Add/edit products
  - Edit site content (hero slides, contact info, etc.)
  - Create/edit blog posts
  - Manage media (in v1 you chose “External URLs only”, so this will be an organized URL library rather than uploads)
- Host the admin UI on your cPanel domain (same site build). The database/auth will run on Lovable Cloud/Supabase (backend), but nothing “admin UI” is hosted elsewhere.

What the codebase does today (important)
- Products are currently compiled into the frontend from `src/data/products-export.csv` via `src/data/products.ts`.
- Blog posts and site content are currently hardcoded in `src/data/siteData.ts`.
- This is why you can’t “edit like WordPress” today: there’s no database and no login.

Key decision (confirmed)
- Backend choice: Use Cloud/Supabase backend (required for real-time editing).
- Admin users: Single admin.
- First version manages: Products + Site content + Blog + Media.
- Product images: External URLs only (no file uploads).

High-level approach
1) Add authentication (login + signup page), but restrict admin access by role (server-side enforced via RLS and a roles table).
2) Create database tables for products, site content, blog posts, and media links.
3) Update the public pages to read from the database (published records) with sensible loading/error fallbacks.
4) Build an `/admin` area (protected route) with CRUD screens.
5) Deploy the same compiled build to cPanel (admin is just another route: `/admin`).

Architecture (simple & secure)
- Frontend (your site + admin UI): hosted on cPanel as static files (Vite build).
- Backend (data + auth + security): Lovable Cloud / Supabase (database, RLS policies).
- Security:
  - Public visitors can only read “published” content.
  - Only your admin user can create/update/delete.
  - No client-side “isAdmin” checks via localStorage. All privileges enforced by RLS.

Phase 0 — Prerequisites / Setup checks
- Confirm we have Lovable Cloud enabled for this project (or a connected Supabase project).
- Decide your admin login email (the one you will use).

Phase 1 — Database schema (Cloud/Supabase)
We will create:
A) Roles (required even for single admin; prevents privilege escalation)
- Enum: `public.app_role` with values ('admin', 'user')
- Table: `public.user_roles`
  - `id uuid pk`
  - `user_id uuid references auth.users(id) on delete cascade not null`
  - `role app_role not null`
  - unique(user_id, role)
- Function (SECURITY DEFINER): `public.has_role(_user_id uuid, _role app_role) returns boolean`

B) Products
Table: `public.products`
- `id uuid primary key default gen_random_uuid()`
- `name text not null`
- `description text not null`
- `long_description text null`
- `category text not null`
- `sale_price numeric not null`
- `regular_price numeric not null`
- `image_url text not null` (external URL)
- `external_url text not null`
- `featured boolean not null default false`
- `published boolean not null default true`
- `sort_order int not null default 0`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

C) Site content (for editable homepage/footer/etc.)
Option 1 (recommended for speed): key/value JSON blobs
Table: `public.site_content`
- `key text primary key` (e.g. 'siteConfig', 'heroSlides')
- `value jsonb not null`
- `updated_at timestamptz not null default now()`

D) Blog
Table: `public.blog_posts`
- `id uuid primary key default gen_random_uuid()`
- `slug text not null unique`
- `title text not null`
- `excerpt text not null`
- `content text not null` (Markdown or plain text for v1)
- `category text not null`
- `image_url text null`
- `published boolean not null default true`
- `published_at timestamptz null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

E) Media (URL library)
Table: `public.media_links`
- `id uuid primary key default gen_random_uuid()`
- `label text not null`
- `url text not null`
- `tags text[] not null default '{}'`
- `created_at timestamptz not null default now()`

RLS policies (critical)
- Enable RLS on all tables.
- Public read:
  - products: allow SELECT where `published = true`
  - blog_posts: allow SELECT where `published = true`
  - site_content: allow SELECT for everyone (or at least anon) because the homepage needs it
  - media_links: admin only (or private), since it’s an internal library
- Admin write:
  - INSERT/UPDATE/DELETE allowed only if `public.has_role(auth.uid(), 'admin')` is true

Admin bootstrapping
- After you create your admin user via signup/login, we will insert one row into `user_roles` to grant you admin.
- This is a one-time step.

Phase 2 — Authentication UI and session handling
Add an `/auth` page:
- Email + password login
- Email + password signup (required for implementation completeness)
- Important behavior:
  - After login: redirect to `/admin`
  - If logged in already: visiting `/auth` redirects to `/admin`
  - Signup does not automatically grant admin role. Non-admin users will be blocked from `/admin`.

Create an Auth provider/hook:
- Centralize:
  - `session`
  - `user`
  - loading state
- Use `supabase.auth.onAuthStateChange` + `supabase.auth.getSession()` in correct order (no async callbacks).
- Provide a `signOut()` function.

Phase 3 — Admin route protection (server-side + UI)
Create `AdminRoute` wrapper:
- If not logged in: redirect to `/auth`
- If logged in but not admin:
  - show “Access denied” page (and sign out button)
- Admin check method:
  - Call `supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' })`
  - Do not store role in localStorage; keep it in React state only.

Phase 4 — Admin panel UI (WordPress-like structure)
Route: `/admin`
Layout:
- Left sidebar navigation:
  - Products
  - Site Content
  - Blog
  - Media (URLs)
- Top bar:
  - “View site” link
  - “Logout”
- Use existing UI stack:
  - shadcn components already in repo (tables, dialogs, forms, etc.)
  - react-hook-form + zod for validation
  - TanStack Query for loading/mutations, with optimistic updates where safe

Admin screens (v1)
A) Products
- Table list with search + filters (category, published, featured)
- Actions:
  - Create product (modal or dedicated page)
  - Edit product
  - Toggle publish/featured
  - Delete (confirm dialog)
- Validation:
  - required fields
  - price numeric > 0
  - image_url and external_url must be valid URLs

B) Site Content
- “Site Config” editor:
  - tagline, contact info, social links, address
- “Hero Slides” editor:
  - list + reorder + edit slides (title, subtitle, cta text, link, gradient)
- We’ll store these as JSON in `site_content` (fastest to ship).
- UI includes “Preview changes” section (optional) or immediate save.

C) Blog
- List posts with slug, title, published, date
- Create/edit post:
  - title, slug (auto-generate from title but editable)
  - excerpt
  - content (textarea/Markdown in v1)
  - image_url
  - published toggle + published_at
- Slug uniqueness enforced by DB.

D) Media (URLs)
- A simple “media links” library:
  - Add label + URL + tags
  - Copy URL button
  - Search by label/tag
- Later (if you want): can upgrade to real uploads with storage.

Phase 5 — Update public website to read from DB
Products page + product detail
- Replace usage of static `products` array with DB query:
  - `select * from products where published = true order by sort_order, created_at desc`
- Product detail route:
  - currently `/product/:id` expects numeric ID from CSV
  - We will change to UUID-based products (two options):
    1) Keep route `/product/:id` but treat it as UUID string (recommended)
    2) Keep numeric IDs by adding a `legacy_id int` column and mapping (more work)
- I’ll propose option (1) for cleanliness unless you require preserving existing URLs.

Homepage + header/footer
- Replace `siteConfig`, `heroSlides`, `blogPosts` reads from `src/data/siteData.ts` with DB fetches from `site_content` and `blog_posts`.
- Add caching via React Query to keep it fast.

Graceful fallback
- While DB loads: show skeleton UI (no layout shift)
- On error: fallback to existing static data (optional), so the site never “goes blank”

Phase 6 — Hosting on cPanel (your requirement)
- The admin panel is part of the same static build.
- On cPanel you will:
  1) Run `npm run build` to create `dist/`
  2) Upload contents of `dist/` to `public_html/`
  3) Ensure SPA routing works via `.htaccess` rewrite so `/admin` and `/product/<uuid>` don’t 404 on refresh
- Backend remains Cloud/Supabase and is accessed via HTTPS from your domain.

Phase 7 — QA checklist (end-to-end)
- Auth:
  - Signup works (but does not grant admin)
  - Login works
  - Logout works
  - Session persists after refresh
- Admin security:
  - Non-admin cannot access `/admin` (both UI redirect + RLS blocks writes)
- Products:
  - Create/edit/delete works
  - Public `/products` shows updates immediately
- Site content:
  - Editing hero slides updates homepage
- Blog:
  - Create/edit post shows in public blog list and blog detail
- cPanel deployment:
  - Refreshing `/admin` and `/blog/<slug>` works (no 404)

Risks / Notes
- URL compatibility: switching products from numeric IDs to UUIDs may break old links. If you need to keep current numeric product URLs, we’ll add a `legacy_id` column and use it in routes.
- “Media” with external URLs is safe and easy. If later you want uploads, we must use storage (not DB blobs).

Files/components we will likely touch (implementation phase)
- Routing: `src/App.tsx` (add /auth, /admin, update product route if needed)
- Data sources: replace `src/data/products.ts` + parts of `src/data/siteData.ts` usage in pages
- New pages: `src/pages/Auth.tsx`, `src/pages/admin/*` (or a single `Admin.tsx` with tabs)
- New components: `src/components/admin/*`, `ProtectedRoute`, `AuthProvider`
- Supabase/Cloud integration layer (existing path depends on what’s already set up in the project)

Before implementation: one critical confirmation
- Product URLs: Do you want to keep existing `/product/1234` links working, or is it okay to move to UUID links like `/product/6f2c...`?
  - If you want to keep old links, we’ll store a `legacy_id` and route by that.

