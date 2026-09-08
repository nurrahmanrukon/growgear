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
    <header id="site-header" className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="border-b border-border/70 bg-primary-light/60 py-1.5 text-center text-[11px] text-primary-dark">
        সারাদেশে ক্যাশ অন ডেলিভারি — অর্ডারের পর হাতে পেয়ে মূল্য পরিশোধ করুন
      </div>

      <div className="container-page flex items-center gap-4 py-3.5">
        <button
          className="-ml-1 rounded p-1.5 text-foreground hover:bg-surface-muted lg:hidden"
          aria-label="মেনু খুলুন"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link href="/" className="shrink-0 font-display text-xl font-bold text-foreground">
          Grow<span className="text-primary">Gear</span>
        </Link>

        <nav className="hidden items-center gap-6 pl-4 text-sm text-ink-soft lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="ml-auto hidden max-w-xs flex-1 items-stretch sm:flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="বই, ইবুক বা গিয়ার খুঁজুন..."
            className="w-full min-w-0 rounded-l-md border border-r-0 border-border bg-surface-muted px-3 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            aria-label="খুঁজুন"
            className="flex items-center justify-center rounded-r-md border border-border bg-surface-muted px-3 text-ink-soft hover:text-primary"
          >
            <Search size={16} />
          </button>
        </form>

        <Link
          href="/cart"
          className="relative ml-auto flex items-center gap-1.5 rounded p-1.5 text-foreground hover:bg-surface-muted sm:ml-0"
        >
          <span className="relative">
            <ShoppingCart size={22} />
            {hydrated && totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                {toBengaliNumber(totalItems)}
              </span>
            )}
          </span>
          <span className="hidden text-sm font-medium sm:block">কার্ট</span>
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex items-stretch px-3 pb-3 sm:hidden">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="বই, ইবুক বা গিয়ার খুঁজুন..."
          className="w-full min-w-0 rounded-l-md border border-r-0 border-border bg-surface-muted px-3 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          className="flex items-center justify-center rounded-r-md border border-border bg-surface-muted px-3.5 text-ink-soft"
        >
          <Search size={16} />
        </button>
      </form>

      <nav
        className={clsx(
          "border-t border-border bg-surface lg:hidden",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <div className="container-page flex flex-col py-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="border-b border-border/70 py-2.5 text-sm text-ink-soft last:border-none hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
