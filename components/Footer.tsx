import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-4 md:py-16">
        <div className="sm:col-span-2 md:col-span-1">
          <Link href="/" className="inline-block font-serif text-2xl font-semibold tracking-[0.06em]">
            YBG <span className="text-gold">GARMENTS</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/60">
            Thoughtfully selected styles for everyday confidence. Find pieces that feel like you.
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">Explore</h4>
          <ul className="space-y-3 text-sm text-white/65">
            <li><Link href="/products" className="transition-colors hover:text-gold-light">Shop all</Link></li>
            <li><Link href="/products?category=Men" className="transition-colors hover:text-gold-light">Men</Link></li>
            <li><Link href="/products?category=Women" className="transition-colors hover:text-gold-light">Women</Link></li>
            <li><Link href="/products?category=Accessories" className="transition-colors hover:text-gold-light">Accessories</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">Customer care</h4>
          <ul className="space-y-3 text-sm text-white/65">
            <li>Shipping &amp; Returns</li>
            <li>Size Guide</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">Stay in the know</h4>
          <p className="text-sm leading-6 text-white/60">Hear about new arrivals and considered edits.</p>
          <form action="/newsletter" method="post" className="mt-4 flex border-b border-white/25 pb-2 focus-within:border-gold">
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              aria-label="Your email address"
              className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/40"
            />
            <button type="submit" className="px-2 text-xs font-semibold uppercase tracking-wider text-gold transition-colors hover:text-gold-light">
              Join ↗
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-[10px] uppercase tracking-[0.12em] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} YBG Garments. All rights reserved.</span>
          <span>Designed with intention <span className="text-gold">✦</span></span>
        </div>
      </div>
    </footer>
  );
}
