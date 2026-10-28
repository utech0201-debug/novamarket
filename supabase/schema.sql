-- ============================================================================
-- Atelier — Phase 2 schema (products + auth/profiles)
-- ----------------------------------------------------------------------------
-- HOW TO RUN:
--   1. Open your Supabase project -> SQL Editor -> New query
--   2. Paste this whole file and click "Run"
--   3. Done. The storefront will now read products from the database.
--
-- Safe to re-run: it uses "if not exists" / "on conflict" guards.
-- ============================================================================

-- Needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- PRODUCTS
-- ----------------------------------------------------------------------------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  price       numeric(10, 2) not null check (price >= 0),
  category    text not null check (category in ('Men', 'Women', 'Accessories')),
  description text not null default '',
  image       text not null default '',
  featured    boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.products enable row level security;

-- ----------------------------------------------------------------------------
-- PROFILES (1:1 with auth.users)
-- Created before any policies because the products admin policies reference it.
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text,
  is_admin   boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- ----------------------------------------------------------------------------
-- PRODUCTS POLICIES
-- ----------------------------------------------------------------------------
-- Anyone (even logged-out visitors) can read products.
drop policy if exists "Products are viewable by everyone" on public.products;
create policy "Products are viewable by everyone"
  on public.products for select
  using (true);

-- Only admins can write. (Admin panel arrives in Phase 4; policy is ready now.)
drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
  on public.products for insert
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
  on public.products for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
  on public.products for delete
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- ----------------------------------------------------------------------------
-- PROFILES POLICIES
-- ----------------------------------------------------------------------------
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- SEED PRODUCTS (mirrors the demo catalog in lib/products.ts)
-- ----------------------------------------------------------------------------
insert into public.products (name, price, category, description, image, featured)
values
  ('Classic Wool Overcoat', 189, 'Men', 'A timeless tailored overcoat in premium wool blend. Structured shoulders and a clean silhouette make it a winter staple.', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80', true),
  ('Linen Summer Dress', 89, 'Women', 'Breathable linen dress with a relaxed fit. Perfect for warm days, effortlessly elegant from morning to evening.', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80', true),
  ('Leather Crossbody Bag', 129, 'Accessories', 'Handcrafted full-grain leather crossbody bag with adjustable strap and gold hardware. Ages beautifully over time.', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80', true),
  ('Slim Fit Denim Jeans', 79, 'Men', 'Mid-wash slim fit jeans with a touch of stretch for all-day comfort. A wardrobe essential.', 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80', false),
  ('Knit Turtleneck Sweater', 95, 'Women', 'Soft ribbed turtleneck in a cozy wool blend. Layer it or wear it on its own for understated warmth.', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80', false),
  ('Minimalist Watch', 149, 'Accessories', 'Clean dial, stainless steel case, and a genuine leather strap. Quiet sophistication for any outfit.', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80', true),
  ('Tailored Blazer', 159, 'Men', 'A versatile single-breasted blazer that dresses up or down. Half-canvas construction for a refined drape.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', false),
  ('Silk Scarf', 49, 'Accessories', 'Hand-rolled silk scarf with a painterly print. A small detail that elevates the whole look.', 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80', false),
  ('Pleated Midi Skirt', 85, 'Women', 'Flowing pleated midi skirt with a high waist. Moves beautifully and pairs with everything.', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80', false),
  ('Canvas Sneakers', 69, 'Accessories', 'Low-top canvas sneakers with a vulcanized rubber sole. Clean, casual, and endlessly wearable.', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80', false),
  ('Cotton Oxford Shirt', 65, 'Men', 'Crisp oxford shirt in breathable cotton. A button-down that works from the office to the weekend.', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80', false),
  ('Wide-Leg Trousers', 99, 'Women', 'High-rise wide-leg trousers with a fluid drape. Polished comfort for work and beyond.', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80', false)
on conflict do nothing;

-- ----------------------------------------------------------------------------
-- MAKE YOURSELF AN ADMIN (needed later for the Phase 4 admin panel)
-- ----------------------------------------------------------------------------
-- After you sign up in the app, run this once with your email:
--   update public.profiles set is_admin = true
--   where id = (select id from auth.users where email = 'you@example.com');

-- ----------------------------------------------------------------------------
-- SECURITY: prevent users from promoting themselves to admin.
-- Row-level policies restrict which profile row is writable, but do not restrict
-- which columns on that row can be changed. Only full_name is user-editable.
-- ----------------------------------------------------------------------------
revoke update on table public.profiles from public, anon, authenticated;
grant update (full_name) on table public.profiles to authenticated;
