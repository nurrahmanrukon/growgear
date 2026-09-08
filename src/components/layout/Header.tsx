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
    <header id="site-header" className="sticky top-0 z-40">
      <div className="border-b border-border/70 bg-primary-light/60 py-1.5 text-center text-[11px] text-primary-dark">
        সারাদেশে ক্যাশ অন ডেলিভারি — অর্ডারের পর হাতে পেয়ে মূল্য পরিশোধ করুন
      </div>

      {/* Top bar */}
      <div style={{ background: "#131921" }} className="text-white">
        <div className="container-page flex items-center gap-3 py-2.5">
          <button
            className="-ml-1 rounded p-1.5 hover:bg-white/10 lg:hidden"
            aria-label="মেনু খুলুন"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link href="/" className="shrink-0 rounded border border-transparent px-1 py-1 font-display text-lg font-bold hover:border-white/40 sm:text-xl">
            Grow<span style={{ color: "#febd69" }}>Gear</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden max-w-2xl flex-1 items-stretch sm:flex">
            <span className="hidden items-center rounded-l-md border-r border-border bg-surface-muted px-3 text-xs text-ink-soft md:flex">
              সব বিভাগ
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="বই, ইবুক বা গিয়ার খুঁজুন..."
              className="w-full min-w-0 border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none md:rounded-none md:border-l-0"
            />
            <button
              type="submit"
              aria-label="খুঁজুন"
              style={{ background: "#febd69" }}
              className="flex items-center justify-center rounded-r-md px-3.5 text-foreground hover:brightness-95"
            >
              <Search size={17} />
            </button>
          </form>

          <Link
            href="/cart"
            className="relative ml-auto flex items-center gap-1.5 rounded p-1.5 hover:bg-white/10 sm:ml-2"
          >
            <span className="relative">
              <ShoppingCart size={22} />
              {hydrated && totalItems > 0 && (
                <span
                  style={{ background: "#febd69" }}
                  className="absolute -top-1.5 -right-2 flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-foreground"
                >
                  {toBengaliNumber(totalItems)}
                </span>
              )}
            </span>
            <span className="hidden text-sm font-medium sm:block">কার্ট</span>
          </Link>
        </div>

        <form onSubmit={handleSearch} className="flex items-stretch px-3 pb-2.5 sm:hidden">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="বই, ইবুক বা গিয়ার খুঁজুন..."
            className="w-full min-w-0 rounded-l-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none"
          />
          <button
            type="submit"
            style={{ background: "#febd69" }}
            className="flex items-center justify-center rounded-r-md px-3.5 text-foreground"
          >
            <Search size={16} />
          </button>
        </form>
      </div>

      {/* Secondary nav bar */}
      <div style={{ background: "#232f3e" }} className="hidden text-white lg:block">
        <div className="container-page flex items-center gap-5 py-2 text-sm">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded border border-transparent px-1.5 py-1 font-medium hover:border-white/40"
          >
            <Menu size={16} /> সব
          </button>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded border border-transparent px-1 py-1 text-white/90 hover:border-white/40 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <nav
        className={clsx(
          "border-t border-white/10 lg:hidden",
          mobileOpen ? "block" : "hidden"
        )}
        style={{ background: "#232f3e" }}
      >
        <div className="container-page flex flex-col py-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="border-b border-white/10 py-2.5 text-sm text-white/90 last:border-none hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
