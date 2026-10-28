-- ============================================================================
-- Atelier — Phase 4: orders
-- ----------------------------------------------------------------------------
-- HOW TO RUN: Supabase -> SQL Editor -> New query -> paste -> Run.
-- Safe to re-run.
-- ============================================================================

create table if not exists public.orders (
  id                 uuid primary key default gen_random_uuid(),
  stripe_session_id  text unique,
  user_id            uuid references auth.users (id) on delete set null,
  email              text,
  amount_total       numeric(10, 2) not null default 0,
  currency           text not null default 'usd',
  status             text not null default 'paid',
  items              jsonb not null default '[]'::jsonb,
  created_at         timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

alter table public.orders enable row level security;

-- Admins can see every order.
drop policy if exists "Admins can view all orders" on public.orders;
create policy "Admins can view all orders"
  on public.orders for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- Customers can see their own orders.
drop policy if exists "Users can view their own orders" on public.orders;
create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- NOTE: there is intentionally NO insert/update policy. Orders are written only
-- by the server using the service-role key (which bypasses RLS) after Stripe
-- confirms payment, so the client can never forge an order.
