

# User Sign-Up and Order Tracking System

## Overview

This plan adds a complete user authentication system where customers can create accounts with email and password, and have their purchases stored and linked to their account. The current admin-focused `/auth` page will be kept separate, and a new customer-focused signup/login system will be created.

## What You'll Get

1. **Customer Sign-Up/Login Pages** - Dedicated pages for customers to create accounts and sign in
2. **User Account Menu** - Header shows account options when logged in (My Account, Order History, Sign Out)
3. **Order History Tracking** - Every checkout is recorded and linked to the user's account
4. **Profile Dashboard** - Users can view their order history and account details
5. **Guest Checkout Still Works** - Users can still checkout without an account

---

## Implementation Steps

### Step 1: Database Setup

Create two new tables to store user profiles and orders:

**`profiles` table** - Stores user display information
- `id` (UUID, primary key, references auth.users)
- `full_name` (text, optional)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**`orders` table** - Tracks checkout history
- `id` (UUID, primary key)
- `user_id` (UUID, references auth.users)
- `items` (JSONB - stores cart items at checkout time)
- `total_amount` (numeric)
- `checkout_url` (text - the Cosmofeed link used)
- `created_at` (timestamp)

Both tables will have Row-Level Security (RLS) policies so users can only see their own data.

A database trigger will automatically create a profile when a user signs up.

### Step 2: Create Customer Authentication Pages

**New file: `src/pages/SignUp.tsx`**
- Clean sign-up form with email, password, and optional display name
- Validates inputs using Zod
- Creates account via authentication system
- Shows success message and redirects to login

**New file: `src/pages/Login.tsx`**
- Login form for returning customers
- Link to sign-up page
- After login, redirects to home or previous page

### Step 3: Update Header with User Account Menu

Modify the header to show:
- **When logged out**: "Sign In" button
- **When logged in**: User dropdown menu with:
  - My Account (links to profile/orders page)
  - Order History
  - Sign Out button

### Step 4: Create Account Dashboard Page

**New file: `src/pages/Account.tsx`**
- Shows user profile (name, email)
- Displays order history (list of past checkouts with dates, items, totals)
- Option to update display name

### Step 5: Track Orders on Checkout

Modify the cart checkout flow:
- When a logged-in user clicks "Proceed to Checkout", save the order to the database before redirecting
- Store the cart items, total, and timestamp
- Clear the cart after successful order creation (optional)

### Step 6: Add Routes

Register new routes in `App.tsx`:
- `/signup` - Customer sign-up page
- `/login` - Customer login page
- `/account` - Account dashboard (protected, requires login)

---

## Technical Details

### Database Migration SQL

```sql
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies: users can read/update only their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  checkout_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders policies: users can read only their own orders
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### Files to Create

| File | Purpose |
|------|---------|
| `src/pages/SignUp.tsx` | Customer registration page |
| `src/pages/Login.tsx` | Customer login page |
| `src/pages/Account.tsx` | Account dashboard with order history |
| `src/components/UserMenu.tsx` | Dropdown menu for logged-in users |
| `src/lib/db/orders.ts` | Database functions for order operations |
| `src/lib/db/profiles.ts` | Database functions for profile operations |

### Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Add new routes for /signup, /login, /account |
| `src/components/Header.tsx` | Add UserMenu component, show Sign In when logged out |
| `src/pages/Cart.tsx` | Save order to database on checkout (if logged in) |
| `src/contexts/CartContext.tsx` | Optional: Add function to clear cart after checkout |

---

## User Flow

1. **New user visits site** - Sees "Sign In" button in header
2. **Clicks Sign In** - Goes to login page, sees "Create Account" link
3. **Creates account** - Fills form, gets success message, redirected to login
4. **Logs in** - Header now shows their name/avatar with dropdown
5. **Adds products to cart** - Same as before
6. **Clicks Checkout** - Order is saved to their account, then redirected to Cosmofeed
7. **Later visits Account page** - Can see all past orders

---

## Security Considerations

- Email verification will be required before users can log in (default behavior)
- RLS policies ensure users can only access their own data
- Passwords are handled securely by the authentication system
- The admin `/auth` page remains separate from customer authentication

