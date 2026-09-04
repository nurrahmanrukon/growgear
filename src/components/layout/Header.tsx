"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import clsx from "clsx";
import { useCartStore, useHasHydrated } from "@/store/cart";
import { toBengaliNumber } from "@/lib/format";

const navLinks = [
  { label: "হোম", href: "/" },
  { label: "বই", href: "/books" },
  { label: "ইবুক", href: "/ebooks" },
  { label: "গিয়ার", href: "/gear" },
  { label: "কোর্স", href: "/course" },
  { label: "ব্লগ", href: "/blog" },
];

export function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const hydrated = useHasHydrated();
  const totalItems = useCartStore((s) => s.totalItems());

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    router.push(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search");
  }

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-navy text-white">
        <div className="container-page flex items-center gap-3 py-2.5">
          <button
            className="lg:hidden -ml-1 rounded p-1.5 hover:bg-navy-light"
            aria-label="মেনু খুলুন"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link href="/" className="flex shrink-0 items-baseline gap-1 rounded p-1 hover:outline hover:outline-1 hover:outline-white">
            <span className="text-xl font-extrabold tracking-tight">Grow<span className="text-orange">Gear</span></span>
          </Link>

          <form onSubmit={handleSearch} className="hidden flex-1 items-stretch sm:flex">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="বই, ইবুক বা গিয়ার খুঁজুন..."
              className="w-full min-w-0 rounded-l-md border-0 px-3 py-2 text-sm text-[#0f1111] outline-none focus:ring-2 focus:ring-orange"
            />
            <button
              type="submit"
              aria-label="খুঁজুন"
              className="flex items-center justify-center rounded-r-md bg-orange px-3.5 text-navy hover:bg-orange-light"
            >
              <Search size={18} />
            </button>
          </form>

          <div className="ml-auto flex items-center gap-4 sm:ml-0">
            <Link
              href="/course"
              className="hidden rounded p-1.5 text-sm hover:outline hover:outline-1 hover:outline-white md:block"
            >
              <span className="block text-[11px] text-neutral-300">অনলাইন</span>
              <span className="font-bold">কোর্স</span>
            </Link>
            <Link
              href="/cart"
              className="relative flex items-center gap-1 rounded p-1.5 hover:outline hover:outline-1 hover:outline-white"
            >
              <span className="relative">
                <ShoppingCart size={26} />
                {hydrated && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-orange px-1 text-[11px] font-bold text-navy">
                    {toBengaliNumber(totalItems)}
                  </span>
                )}
              </span>
              <span className="hidden text-sm font-bold sm:block">কার্ট</span>
            </Link>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex items-stretch px-3 pb-2.5 sm:hidden">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="বই, ইবুক বা গিয়ার খুঁজুন..."
            className="w-full min-w-0 rounded-l-md border-0 px-3 py-2 text-sm text-[#0f1111] outline-none"
          />
          <button
            type="submit"
            aria-label="খুঁজুন"
            className="flex items-center justify-center rounded-r-md bg-orange px-3.5 text-navy"
          >
            <Search size={18} />
          </button>
        </form>
      </div>

      <nav className="hidden bg-navy-light text-sm text-white lg:block">
        <div className="container-page flex items-center gap-5 py-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded px-1 py-0.5 hover:outline hover:outline-1 hover:outline-white">
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      <nav
        className={clsx(
          "bg-navy-light text-white lg:hidden",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <div className="container-page flex flex-col py-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="border-b border-navy-lighter/60 py-2.5 text-sm last:border-none"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
