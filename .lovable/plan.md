
## Goal
Migrate your backend off Lovable Cloud so it lives independently in **your own external Supabase project**, while keeping:
- Your existing tables + data (`products`, `blog_posts`, `site_content`, `media_links`, `user_roles`)
- Admin-only access control via roles
- User accounts (email/password) working after migration, as much as technically possible

You said:
- Target: External Supabase
- Keep logins: Yes
- Downtime: Some downtime OK
- Storage: Not needed (URLs only)

---

## Important reality check (logins)
Most hosted auth systems (including Supabase Auth) **do not let you export existing users’ password hashes in a reusable way**. That means:

- We can typically **migrate the user list (emails/ids)**, but **not the passwords**, so users may need to **reset their password once** on the new backend.
- If you truly need “no password reset required”, that usually requires specialized access to password hashes and a compatible import mechanism (rare/limited).

So the practical “keep logins” plan is:
1) migrate users (email identities) where possible, and  
2) force a password reset / password re-set on first login after cutover.

This still preserves “accounts”, but users may need one-time action.

---

## Phase 0 — Preparation (no downtime)
### 0.1 Inventory what we need to migrate
Backend objects in your project:
- Tables: `products`, `blog_posts`, `site_content`, `media_links`, `user_roles`
- Enum: `app_role`
- Function: `has_role(_user_id uuid, _role app_role)`
- RLS policies on the tables above

### 0.2 Decide your new “canonical” site URL
You’ll need:
- Production domain (e.g. `https://www.yourdomain.com`)
- Optional staging domain

These must be added to the new backend auth redirect allowlist.

---

## Phase 1 — Create the new independent backend (external Supabase)
### 1.1 Create a new Supabase project (in your own account)
You will:
- Create a new project
- Enable email/password authentication
- Configure allowed redirect URLs for your frontend domain(s)

### 1.2 Recreate schema (tables, enum, function, RLS)
Recommended approach:
- Use your existing `supabase/migrations/` in this repo as the source of truth.
- Apply those migrations to the new backend.

If the migrations folder isn’t complete/representative (sometimes happens), we’ll generate an explicit “schema SQL” package containing:
- `CREATE TYPE public.app_role ...`
- `CREATE TABLE public.* ...`
- `CREATE FUNCTION public.has_role ... SECURITY DEFINER ...`
- `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
- `CREATE POLICY ...` for each table

Key note:
- Your current setup references `auth.users` in `user_roles` in the database (that’s expected in Supabase). That part is fine.

---

## Phase 2 — Migrate data (some downtime not required yet)
### 2.1 Export data from current backend
Export these tables as CSV/JSON:
- `products`
- `blog_posts`
- `site_content`
- `media_links`
- `user_roles` (this one depends on user ids; see user migration section)

### 2.2 Import data into new backend
Import in this order:
1) `site_content` (safe)
2) `media_links` (safe)
3) `products` (safe)
4) `blog_posts` (safe)
5) `user_roles` (only after user ids exist in the new auth system)

---

## Phase 3 — Migrate authentication users (hard part)
### 3.1 Best-practice “account continuity” strategy
Because password hashes typically can’t be migrated:
- Recreate the user identities (emails) in the new backend
- Trigger password reset emails (or require users to use “Forgot password”)

For your admin user:
- Create the admin account in the new backend (same email)
- Reset/set password
- Then grant the admin role via `user_roles`

### 3.2 Rebuild `user_roles` mapping
`user_roles` stores `user_id` as UUID from the auth system.

During migration, the UUID in the old backend will not automatically match the UUID in the new backend unless you have a way to preserve IDs (often you don’t).

So we do:
- Create the user(s) first in the new backend
- Look up their new `user_id`
- Insert `user_roles` rows using the **new** `user_id`

Minimum for your case:
- Insert one row: `(user_id=<new admin uuid>, role='admin')`

Optional:
- If you have multiple admins/editors, we’ll repeat.

---

## Phase 4 — Update the frontend to point to the new backend (cutover step)
Your app reads backend config from environment variables and the generated integration.

Cutover steps:
1) Replace backend URL + publishable/anon key in the project’s connection (switch from Lovable Cloud to external Supabase connection).
2) Ensure auth redirect URLs match the production domain.
3) Deploy the updated frontend build to cPanel.

Downtime approach (simple and safe):
- Put the site in “maintenance” briefly (or just accept that admin writes are paused)
- Do a final data export from old backend for tables that may have changed (products/blog/site_content/media_links)
- Import final data into new backend
- Switch frontend keys to new backend
- Test `/auth` + `/admin` + public pages

---

## Phase 5 — Verification checklist (must do)
### Public pages
- `/products` loads published products
- `/blog` lists published posts
- `/blog/:slug` renders markdown safely

### Admin
- `/auth` login works
- `/admin` opens and shows overview counts
- Products CRUD works (bulk actions + drag sorting + save order)
- Blog CRUD works (markdown write/preview + publish toggles)
- Site content templates save without JSON errors
- Media links CRUD works

### Security
- Confirm RLS is enabled and enforced (non-admin cannot write)
- Confirm `has_role()` works in the new backend
- Confirm only admins can access admin tables

---

## What I need from you to execute this cleanly
1) Your production domain(s) you will use (with/without `www`)
2) How many admin accounts you need to migrate (just one, or multiple?)
3) Whether you’re OK with the one-time password reset requirement for users/admins (this is usually unavoidable)

---

## Deliverables I will produce (once approved to implement)
1) A step-by-step “migration runbook” you can follow (copy/paste checklist)
2) The exact SQL needed to recreate your schema/RLS on the new backend (if your migrations aren’t sufficient)
3) Exact instructions to switch the app from Lovable Cloud backend to your external Supabase connection (so cPanel build points to the new backend)
4) A safe cutover plan with a short maintenance window and a final verification checklist

---

## Risks / pitfalls (so nothing surprises you)
- User passwords almost certainly cannot be carried over; plan for reset.
- If you switch frontend to the new backend before importing final data, public pages may look empty.
- If redirect URLs aren’t configured on the new backend, login/signup can fail or redirect incorrectly.
- `user_roles` must be reinserted using new user ids, or admin access will fail.

