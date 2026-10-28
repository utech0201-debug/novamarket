"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { FiShoppingBag, FiUser } from "react-icons/fi";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/80 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-bold tracking-tight">
          YBG Garments
        </Link>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          <Link href="/products" className="transition-colors hover:text-accent">
            Shop All
          </Link>
          <Link
            href="/products?category=Men"
            className="transition-colors hover:text-accent"
          >
            Men
          </Link>
          <Link
            href="/products?category=Women"
            className="transition-colors hover:text-accent"
          >
            Women
          </Link>
          <Link
            href="/products?category=Accessories"
            className="transition-colors hover:text-accent"
          >
            Accessories
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href={user ? "/account" : "/login"}
            className="flex items-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-sand"
            aria-label={user ? "Account" : "Sign in"}
          >
            <FiUser size={20} />
          </Link>

          <Link
            href="/cart"
            className="relative flex items-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-sand"
            aria-label="Cart"
          >
            <FiShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-medium text-cream">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
