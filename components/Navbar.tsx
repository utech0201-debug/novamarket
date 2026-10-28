"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { FiMenu, FiShoppingBag, FiUser, FiX } from "react-icons/fi";

const navigation = [
  { href: "/products", label: "Shop All" },
  { href: "/products?category=Men", label: "Men" },
  { href: "/products?category=Women", label: "Women" },
  { href: "/products?category=Accessories", label: "Accessories" },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <>
      <div className="bg-ink px-4 py-2 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-white sm:text-[11px]">
        Considered style. Everyday confidence.
      </div>
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur-md">
        <div className="container-x flex h-[72px] items-center justify-between sm:h-[76px]">
          <Link href="/" className="group flex min-w-0 flex-col leading-none" aria-label="YBG Garments home" onClick={closeMobileMenu}>
            <span className="whitespace-nowrap font-serif text-[18px] font-semibold tracking-[0.06em] sm:text-2xl sm:tracking-[0.08em]">
              YBG <span className="text-gold">GARMENTS</span>
            </span>
            <span className="mt-1 text-[8px] uppercase tracking-[0.22em] text-black/50 sm:text-[9px] sm:tracking-[0.28em]">
              Modern wardrobe
            </span>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-8 text-[11px] font-medium uppercase tracking-[0.16em] md:flex">
            {navigation.map((item) => (
              <Link key={item.label} href={item.href} className="transition-colors hover:text-gold-dark">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-shrink-0 items-center gap-0 sm:gap-1">
            <Link
              href={user ? "/account" : "/login"}
              className="flex h-11 w-10 items-center justify-center transition-colors hover:text-gold-dark sm:w-12"
              aria-label={user ? "Account" : "Sign in"}
              onClick={closeMobileMenu}
            >
              <FiUser size={19} strokeWidth={1.5} />
            </Link>
            <Link
              href="/cart"
              className="relative flex h-11 w-10 items-center justify-center transition-colors hover:text-gold-dark sm:w-12"
              aria-label={`Cart, ${totalItems} items`}
              onClick={closeMobileMenu}
            >
              <FiShoppingBag size={19} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-ink">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              type="button"
              className="ml-1 flex h-11 w-10 items-center justify-center border-l border-ink/10 transition-colors hover:text-gold-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold md:hidden"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="ybg-mobile-navigation"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <FiX size={22} strokeWidth={1.5} /> : <FiMenu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav
            id="ybg-mobile-navigation"
            aria-label="Mobile navigation"
            className="border-t border-ink/10 bg-white px-5 pb-5 pt-3 shadow-lg md:hidden"
          >
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.25em] text-gold">Explore YBG</p>
            {navigation.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMobileMenu}
                className={`flex min-h-12 items-center justify-between py-3 text-sm font-medium uppercase tracking-[0.14em] transition-colors hover:text-gold-dark ${index < navigation.length - 1 ? "border-b border-ink/10" : ""}`}
              >
                {item.label}
                <span aria-hidden="true" className="text-gold">→</span>
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
