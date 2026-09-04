"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "GrowGear সম্পর্কে",
    links: [
      { label: "আমাদের সম্পর্কে", href: "/" },
      { label: "ব্লগ", href: "/blog" },
      { label: "যোগাযোগ", href: "/" },
    ],
  },
  {
    title: "কিনুন",
    links: [
      { label: "বই", href: "/books" },
      { label: "ইবুক", href: "/ebooks" },
      { label: "প্রোডাক্টিভিটি গিয়ার", href: "/gear" },
    ],
  },
  {
    title: "শিখুন",
    links: [
      { label: "সব কোর্স", href: "/course" },
      { label: "enrich.com.bd", href: "https://enrich.com.bd" },
    ],
  },
  {
    title: "গ্রাহক সেবা",
    links: [
      { label: "কার্ট", href: "/cart" },
      { label: "চেকআউট", href: "/checkout" },
      { label: "ক্যাশ অন ডেলিভারি", href: "/" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-10 bg-navy-light text-white">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex w-full items-center justify-center gap-2 bg-navy-lighter py-3.5 text-sm hover:bg-navy-lighter/80"
      >
        <ArrowUp size={16} /> উপরে যান
      </button>

      <div className="container-page grid grid-cols-2 gap-8 py-10 sm:grid-cols-4">
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-3 text-sm font-bold">{col.title}</h3>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-neutral-300 hover:underline"
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-navy-lighter">
        <div className="container-page flex flex-col items-center gap-1 py-5 text-center">
          <span className="text-lg font-extrabold">Grow<span className="text-orange">Gear</span></span>
          <p className="text-xs text-neutral-400">
            © ২০২৬ GrowGear. সর্বস্বত্ব সংরক্ষিত। সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা।
          </p>
        </div>
      </div>
    </footer>
  );
}
