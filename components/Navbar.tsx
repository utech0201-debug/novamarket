"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { FiShoppingBag, FiUser } from "react-icons/fi";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user } = useAuth();

  return (
    <>
      <div className="bg-ink px-4 py-2 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-white sm:text-[11px]">
        Considered style. Everyday confidence.
      </div>
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur-md">
        <div className="container-x flex h-[76px] items-center justify-between">
          <Link href="/" className="group flex flex-col leading-none" aria-label="YBG Garments home">
            <span className="font-serif text-[22px] font-semibold tracking-[0.08em] sm:text-2xl">
              YBG <span className="text-gold">GARMENTS</span>
            </span>
            <span className="mt-1 text-[9px] uppercase tracking-[0.28em] text-black/50">
              Modern wardrobe
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-[11px] font-medium uppercase tracking-[0.16em] md:flex">
            <Link href="/products" className="transition-colors hover:text-gold-dark">Shop All</Link>
            <Link href="/products?category=Men" className="transition-colors hover:text-gold-dark">Men</Link>
            <Link href="/products?category=Women" className="transition-colors hover:text-gold-dark">Women</Link>
            <Link href="/products?category=Accessories" className="transition-colors hover:text-gold-dark">Accessories</Link>
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href={user ? "/account" : "/login"}
              className="flex items-center justify-center p-3 transition-colors hover:text-gold-dark"
              aria-label={user ? "Account" : "Sign in"}
            >
              <FiUser size={19} strokeWidth={1.5} />
            </Link>
            <Link
              href="/cart"
              className="relative flex items-center justify-center p-3 transition-colors hover:text-gold-dark"
              aria-label={`Cart, ${totalItems} items`}
            >
              <FiShoppingBag size={19} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-ink">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
