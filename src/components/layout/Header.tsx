"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FormEvent, useState } from "react";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import clsx from "clsx";
import { useCartStore, useHasHydrated } from "@/store/cart";
import { toBengaliNumber } from "@/lib/format";
import { TOPICS } from "@/lib/data/blog";
import { GEAR_SUBCATEGORIES } from "@/lib/data/gear";

const productSub = (basePath: string) => [
  { label: `সব ${basePath === "/books" ? "বই" : basePath === "/ebooks" ? "ইবুক" : "গিয়ার"}`, href: basePath },
  { label: "বেস্ট সেলার", href: `${basePath}?badge=${encodeURIComponent("বেস্ট সেলার")}` },
  { label: "নতুন", href: `${basePath}?badge=${encodeURIComponent("নতুন")}` },
  { label: "অফার", href: `${basePath}?badge=${encodeURIComponent("লিমিটেড অফার")}` },
];

const gearSub = [
  { label: "সব গিয়ার", href: "/gear" },
  ...GEAR_SUBCATEGORIES.map((c) => ({ label: c.label, href: `/gear?category=${c.slug}` })),
  { label: "বেস্ট সেলার", href: `/gear?badge=${encodeURIComponent("বেস্ট সেলার")}` },
  { label: "নতুন", href: `/gear?badge=${encodeURIComponent("নতুন")}` },
  { label: "অফার", href: `/gear?badge=${encodeURIComponent("লিমিটেড অফার")}` },
];

const navLinks: { key: string; label: string; href: string; sub?: { label: string; href: string }[] }[] = [
  {
    key: "home",
    label: "হোম",
    href: "/",
    sub: [
      { label: "সব প্রোডাক্ট", href: "/" },
      { label: "বেস্ট সেলার", href: `/search?badge=${encodeURIComponent("বেস্ট সেলার")}` },
      { label: "নতুন", href: `/search?badge=${encodeURIComponent("নতুন")}` },
      { label: "অফার", href: `/search?badge=${encodeURIComponent("লিমিটেড অফার")}` },
    ],
  },
  { key: "book", label: "বই", href: "/books", sub: productSub("/books") },
  { key: "ebook", label: "ইবুক", href: "/ebooks", sub: productSub("/ebooks") },
  { key: "gear", label: "গিয়ার", href: "/gear", sub: gearSub },
  { key: "course", label: "কোর্স", href: "/course", sub: [{ label: "সব কোর্স", href: "/course" }] },
  {
    key: "blog",
    label: "ব্লগ",
    href: "/blog",
    sub: [{ label: "সব লেখা", href: "/blog" }, ...TOPICS.map((t) => ({ label: t.label, href: `/blog?topic=${t.slug}` }))],
  },
];

function getActiveCategoryKey(pathname: string): string {
  if (pathname.startsWith("/books")) return "book";
  if (pathname.startsWith("/ebooks")) return "ebook";
  if (pathname.startsWith("/gear")) return "gear";
  if (pathname.startsWith("/course")) return "course";
  if (pathname.startsWith("/blog")) return "blog";
  return "home";
}

const utilityLinks = [
  { label: "আজকের অফার", href: "/" },
  { label: "গ্রাহক সেবা", href: "/" },
  { label: "প্রিমিয়াম ব্লগ", href: "/blog" },
  { label: "গিফট কার্ড", href: "/" },
  { label: "বিক্রি করুন", href: "/" },
  { label: "উইশলিস্ট", href: "/" },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const hydrated = useHasHydrated();
  const totalItems = useCartStore((s) => s.totalItems());

  const activeKey = getActiveCategoryKey(pathname);
  const activeCategory = navLinks.find((l) => l.key === activeKey);

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

      {/* Category nav bar (layer 1) — always visible, directly below the search box */}
      <div style={{ background: "#232f3e" }} className="text-white">
        <div className="container-page flex items-center gap-x-3 gap-y-1.5 overflow-x-auto py-2 text-sm scrollbar-none lg:flex-wrap lg:gap-x-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "shrink-0 rounded border px-1 py-1 hover:border-white/40 hover:text-white",
                link.key === activeKey ? "border-white font-semibold text-white" : "border-transparent text-white/90"
              )}
            >
              {link.label}
            </Link>
          ))}
          <span className="hidden h-4 w-px shrink-0 bg-white/20 lg:block" aria-hidden />
          {utilityLinks.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              className={clsx(
                "hidden shrink-0 rounded border px-1.5 py-1 text-white/90 hover:border-white/40 hover:text-white lg:inline-block",
                i === 0 ? "border-white" : "border-transparent"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
        {/* Sub-category bar (layer 2) — subcategories of the currently active menu item */}
        {activeCategory?.sub && activeCategory.sub.length > 0 && (
          <div style={{ background: "#37475a" }}>
            <div className="container-page flex items-center gap-4 overflow-x-auto py-1.5 text-xs scrollbar-none">
              {activeCategory.sub.map((s) => (
                <Link key={s.href} href={s.href} className="shrink-0 text-white/80 hover:text-white hover:underline">
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile-only dropdown: utility links (categories are already always visible above) */}
      <nav
        className={clsx(
          "border-t border-white/10 lg:hidden",
          mobileOpen ? "block" : "hidden"
        )}
        style={{ background: "#232f3e" }}
      >
        <div className="container-page flex flex-col py-1">
          {utilityLinks.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                "border-b border-white/10 py-2.5 text-sm text-white/90 last:border-none hover:text-white",
                i === 0 && "font-semibold text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
