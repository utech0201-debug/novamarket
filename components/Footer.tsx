import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-sand">
      <div className="container-x grid gap-8 py-12 md:grid-cols-4">
        <div>
          <h3 className="font-serif text-xl font-bold">YBG Garments</h3>
          <p className="mt-2 text-sm text-ink/60">
            Thoughtfully selected styles for everyday confidence.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Shop</h4>
          <ul className="space-y-2 text-sm text-ink/60">
            <li>
              <Link href="/products?category=Men" className="hover:text-accent">
                Men
              </Link>
            </li>
            <li>
              <Link href="/products?category=Women" className="hover:text-accent">
                Women
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=Accessories"
                className="hover:text-accent"
              >
                Accessories
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Help</h4>
          <ul className="space-y-2 text-sm text-ink/60">
            <li>Shipping &amp; Returns</li>
            <li>Size Guide</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Newsletter</h4>
          <p className="text-sm text-ink/60">
            Subscribe for new arrivals and offers.
          </p>
          <div className="mt-3 flex">
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-l-full border border-ink/20 bg-cream px-4 py-2 text-sm outline-none focus:border-ink"
            />
            <button className="rounded-r-full bg-ink px-4 py-2 text-sm text-cream hover:bg-accent">
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="container-x border-t border-ink/10 py-6 text-center text-xs text-ink/50">
        © {new Date().getFullYear()} YBG Garments. All rights reserved.
      </div>
    </footer>
  );
}
