"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";
import { Product } from "@/lib/types";
import { allProducts, catalogByCategory, categoryMeta } from "@/lib/data/products";
import { PERSON_NAMES, BD_LOCATIONS, hashString } from "@/lib/data/social";

const SUPPRESSED_PREFIXES = ["/checkout"];
const FIRST_DELAY_MS = 6000;
const SHOW_DURATION_MS = 5500;
const GAP_MIN_MS = 9000;
const GAP_RANGE_MS = 8000;

function poolForPath(pathname: string): Product[] {
  if (pathname.startsWith("/books")) return catalogByCategory.book;
  if (pathname.startsWith("/ebooks")) return catalogByCategory.ebook;
  if (pathname.startsWith("/gear")) return catalogByCategory.gear;
  return allProducts;
}

interface ToastData {
  name: string;
  location: string;
  minutesAgo: number;
  product: Product;
}

export function PurchaseToast() {
  const pathname = usePathname();
  const [toast, setToast] = useState<ToastData | null>(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seqRef = useRef(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hide any toast from the previous route before scheduling the next one
    setVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);

    if (SUPPRESSED_PREFIXES.some((p) => pathname.startsWith(p))) return;
    const pool = poolForPath(pathname);
    if (pool.length === 0) return;

    function scheduleNext(delay: number) {
      timerRef.current = setTimeout(() => {
        const seed = hashString(pathname + ":" + seqRef.current);
        seqRef.current += 1;
        const product = pool[seed % pool.length];
        const name = PERSON_NAMES[Math.floor(seed / 7) % PERSON_NAMES.length];
        const location = BD_LOCATIONS[Math.floor(seed / 13) % BD_LOCATIONS.length];
        const minutesAgo = 2 + (seed % 27);
        setToast({ name, location, minutesAgo, product });
        setVisible(true);
        timerRef.current = setTimeout(() => {
          setVisible(false);
          scheduleNext(GAP_MIN_MS + (seed % GAP_RANGE_MS));
        }, SHOW_DURATION_MS);
      }, delay);
    }

    scheduleNext(FIRST_DELAY_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  if (!toast) return null;

  const meta = categoryMeta[toast.product.category];
  const href = `${meta.path}/${toast.product.slug}`;

  return (
    <div
      className={`fixed bottom-20 left-4 z-40 w-72 transition-all duration-300 lg:bottom-4 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <div className="relative rounded-lg border border-border bg-surface p-3 pr-7 shadow-lg">
        <button
          onClick={() => setVisible(false)}
          aria-label="বন্ধ করুন"
          className="absolute right-1.5 top-1.5 rounded p-0.5 text-ink-faint hover:text-foreground"
        >
          <X size={13} />
        </button>
        <Link href={href} className="flex items-start gap-2.5">
          <span
            className="mt-0.5 h-9 w-9 shrink-0 rounded-md"
            style={{ background: `linear-gradient(135deg, ${toast.product.colorFrom}, ${toast.product.colorTo})` }}
          />
          <span className="min-w-0">
            <span className="block text-xs font-medium text-foreground">
              {toast.name} <span className="font-normal text-ink-faint">— {toast.location}</span>
            </span>
            <span className="mt-0.5 block truncate text-xs text-ink-soft">
              &ldquo;{toast.product.title}&rdquo; কিনেছেন
            </span>
            <span className="mt-0.5 block text-[11px] text-ink-faint">{toast.minutesAgo} মিনিট আগে</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
