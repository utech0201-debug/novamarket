# YBG Garments — Fashion Store

YBG Garments is a modern fashion storefront built with **Next.js 15 (App Router)**, **React 19**, **Supabase**, and **Stripe**. It includes product browsing, customer accounts, a database-backed catalog, Stripe Checkout, order history, and an admin dashboard.

> This project is adapted from the public starter by [Tahir Mehmood](https://tahirmehmood-dev.vercel.app).

## ✨ Features

- **Storefront** — hero, category browsing, search, sorting, product detail pages, and a persistent cart (localStorage).
- **Authentication** — email/password sign up & sign in via Supabase Auth, protected account pages.
- **Database-backed catalog** — products served from Supabase Postgres with Row Level Security; gracefully falls back to a static demo catalog when not configured.
- **Checkout** — Stripe Checkout and a native PaymentIntent endpoint, with server-side price validation so client-supplied amounts cannot be trusted.
- **Orders** — paid orders recorded server-side via a Stripe webhook and an idempotent success-page confirmation. Customers see their own orders; admins see all.
- **Admin panel** — role-gated (`is_admin`) dashboard to create / edit / delete products and view orders.

## 🛠 Tech Stack

| Area | Tech |
|------|------|
| Framework | Next.js 15 (App Router, Server Components, Server Actions) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database & Auth | Supabase (Postgres + Auth + RLS) |
| Payments | Stripe Checkout + PaymentIntents |
| UI niceties | Framer Motion, react-hot-toast, react-icons |

## 🚀 Getting Started

### 1. Install

```bash
npm ci
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Fill in your keys (see [`.env.local.example`](./.env.local.example)):

- **Supabase** → Project Settings → API: project URL, anon/publishable key, and the secret/`service_role` key.
- **Stripe** (test mode) → Developers → API keys: publishable + secret keys.

### 3. Set up the database

In the Supabase **SQL Editor**, run these two files (in order):

1. [`supabase/schema.sql`](./supabase/schema.sql) — products, profiles, RLS, seed data, and the new-user trigger.
2. [`supabase/orders.sql`](./supabase/orders.sql) — orders table + RLS.

If this Supabase project already had the schema applied before the security hardening, also run [`supabase/migrations/20261028000000_lock_profile_admin.sql`](./supabase/migrations/20261028000000_lock_profile_admin.sql). It prevents users from changing their own `is_admin` flag while preserving profile-name updates.

Then make yourself an admin (after signing up in the app):

```sql
update public.profiles set is_admin = true
where id = (select id from auth.users where email = 'you@example.com');
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 💳 Testing checkout

Use Stripe's test card on the checkout page:

- Card: `4242 4242 4242 4242`
- Expiry: any future date · CVC: any 3 digits · ZIP: any

### Recording orders locally (optional)

Orders are recorded automatically by the success page. To also exercise the production webhook locally, use the [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` it prints into `STRIPE_WEBHOOK_SECRET`.

## 📁 Project Structure

```
app/
  account/            # protected account + order history
  admin/              # role-gated dashboard, product CRUD, orders
  api/                # checkout, orders/confirm, webhooks/stripe, payment-intent
  auth/callback/      # Supabase auth callback
  cart/ checkout/     # shopping cart and checkout
  login/ signup/      # auth pages
components/            # Navbar, Footer, ProductCard
context/               # CartContext, AuthContext
lib/                   # Supabase clients, Stripe, data layer
supabase/              # schema.sql, orders.sql, migrations
```

## ☁️ Deployment (Vercel)

1. Push this repo to GitHub.
2. Import it on [Vercel](https://vercel.com/new).
3. Add all environment variables from `.env.local` to the Vercel project settings, and set `NEXT_PUBLIC_SITE_URL` to your deployed URL.
4. Add a Stripe webhook endpoint in the Stripe dashboard pointing to `https://your-app.vercel.app/api/webhooks/stripe` and set `STRIPE_WEBHOOK_SECRET`.

## 📝 Notes

- The storefront uses a sample catalog until Supabase is configured; Stripe checkout stays disabled until payment keys are configured.
- All payment amounts are re-validated server-side.
- The Supabase secret/service-role key is server-only and must never be exposed to the browser.
- This branch uses Next.js 15.5.28, the patched Next.js 15 release line as of October 2026. Review the current framework support lifecycle before planning future upgrades.

## License

MIT — free to use as a learning reference or portfolio starting point.
