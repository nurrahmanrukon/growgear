"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Search, Minus, Plus, RotateCcw, Check } from "lucide-react";
import { toBengaliNumber } from "@/lib/format";

type ProductCategory = "book" | "ebook" | "gear";

interface InventoryRow {
  slug: string;
  title: string;
  category: ProductCategory;
  stockCount: number | null;
  defaultInStock: boolean;
  effectiveInStock: boolean;
}

const CATEGORY_LABEL: Record<ProductCategory, string> = { book: "বই", ebook: "ইবুক", gear: "গিয়ার" };

export function InventoryAdmin({ initialItems }: { initialItems: InventoryRow[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | ProductCategory>("all");
  const [stockFilter, setStockFilter] = useState<"all" | "in" | "out" | "unset">("all");
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);

  const filtered = items.filter((it) => {
    if (categoryFilter !== "all" && it.category !== categoryFilter) return false;
    if (stockFilter === "in" && !it.effectiveInStock) return false;
    if (stockFilter === "out" && it.effectiveInStock) return false;
    if (stockFilter === "unset" && it.stockCount !== null) return false;
    if (search.trim() && !it.title.toLowerCase().includes(search.trim().toLowerCase())) return false;
    return true;
  });

  async function saveCount(slug: string, count: number) {
    setSavingSlug(slug);
    try {
      const res = await fetch(`/api/admin/inventory/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockCount: count }),
      });
      if (!res.ok) return;
      setItems((prev) =>
        prev.map((it) => (it.slug === slug ? { ...it, stockCount: count, effectiveInStock: count > 0 } : it))
      );
      setSavedSlug(slug);
      setTimeout(() => setSavedSlug((s) => (s === slug ? null : s)), 1500);
    } finally {
      setSavingSlug(null);
    }
  }

  async function resetCount(slug: string) {
    setSavingSlug(slug);
    try {
      const res = await fetch(`/api/admin/inventory/${slug}`, { method: "DELETE" });
      if (!res.ok) return;
      setItems((prev) =>
        prev.map((it) => (it.slug === slug ? { ...it, stockCount: null, effectiveInStock: it.defaultInStock } : it))
      );
    } finally {
      setSavingSlug(null);
    }
  }

  function adjust(slug: string, delta: number) {
    const item = items.find((it) => it.slug === slug);
    if (!item) return;
    const base = item.stockCount ?? 0;
    saveCount(slug, Math.max(0, base + delta));
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">ইনভেন্টরি নিয়ন্ত্রণ</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            প্রতিটা প্রোডাক্টের জন্য কতগুলো স্টকে আছে সেই সংখ্যা লিখে দিন — সংখ্যা ০ হয়ে গেলে সাইটে সাথে সাথে
            &ldquo;স্টকে নেই&rdquo; দেখাবে। কোনো প্রোডাক্টে সংখ্যা না বসালে সেটা আগের ডিফল্ট অবস্থাতেই থাকবে। কোনো
            অর্ডার &ldquo;কনফার্ম&rdquo; করলে সেই প্রোডাক্টের স্টক থেকে অটোমেটিক পরিমাণ কমে যাবে (শুধু যেসব
            প্রোডাক্টে আপনি সংখ্যা বসিয়েছেন)।
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:bg-surface-muted"
        >
          <LogOut size={14} /> লগআউট
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface p-3">
        <div className="relative">
          <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="প্রোডাক্টের নাম খুঁজুন..."
            className="w-56 rounded-md border border-border py-1.5 pl-8 pr-2.5 text-xs outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["all", "book", "ebook", "gear"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategoryFilter(c)}
              className={`rounded-md border px-2.5 py-1.5 text-[11px] font-medium ${
                categoryFilter === c
                  ? "border-primary bg-primary-light text-primary-dark"
                  : "border-border text-ink-soft hover:border-primary/50"
              }`}
            >
              {c === "all" ? "সব ক্যাটাগরি" : CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["all", "in", "out", "unset"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStockFilter(s)}
              className={`rounded-md border px-2.5 py-1.5 text-[11px] font-medium ${
                stockFilter === s
                  ? "border-primary bg-primary-light text-primary-dark"
                  : "border-border text-ink-soft hover:border-primary/50"
              }`}
            >
              {s === "all" ? "সব" : s === "in" ? "স্টকে আছে" : s === "out" ? "স্টকে নেই" : "সংখ্যা বসানো হয়নি"}
            </button>
          ))}
        </div>
        <span className="ml-auto text-[11px] text-ink-faint">{toBengaliNumber(filtered.length)} টি প্রোডাক্ট</span>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-muted text-[11px] text-ink-faint">
            <tr>
              <th className="px-3 py-2.5 font-medium">প্রোডাক্ট</th>
              <th className="px-3 py-2.5 font-medium">ক্যাটাগরি</th>
              <th className="px-3 py-2.5 font-medium">স্টক সংখ্যা</th>
              <th className="px-3 py-2.5 font-medium">অবস্থা</th>
              <th className="px-3 py-2.5 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-ink-faint">
                  কোনো প্রোডাক্ট পাওয়া যায়নি
                </td>
              </tr>
            )}
            {filtered.map((it) => (
              <tr key={it.slug} className="border-t border-border">
                <td className="px-3 py-2.5 font-medium text-foreground">{it.title}</td>
                <td className="px-3 py-2.5 text-ink-soft">{CATEGORY_LABEL[it.category]}</td>
                <td className="px-3 py-2.5">
                  {it.stockCount !== null ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => adjust(it.slug, -1)}
                        disabled={savingSlug === it.slug}
                        aria-label="কমান"
                        className="rounded border border-border p-1 text-ink-soft hover:border-primary hover:text-primary disabled:opacity-50"
                      >
                        <Minus size={12} />
                      </button>
                      <input
                        type="number"
                        min={0}
                        value={it.stockCount}
                        onChange={(e) =>
                          setItems((prev) =>
                            prev.map((p) => (p.slug === it.slug ? { ...p, stockCount: Number(e.target.value) } : p))
                          )
                        }
                        onBlur={(e) => saveCount(it.slug, Math.max(0, Number(e.target.value) || 0))}
                        className="w-14 rounded border border-border px-1.5 py-1 text-center text-xs outline-none focus:ring-1 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => adjust(it.slug, 1)}
                        disabled={savingSlug === it.slug}
                        aria-label="বাড়ান"
                        className="rounded border border-border p-1 text-ink-soft hover:border-primary hover:text-primary disabled:opacity-50"
                      >
                        <Plus size={12} />
                      </button>
                      {savedSlug === it.slug && <Check size={13} className="text-success" />}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => saveCount(it.slug, it.defaultInStock ? 10 : 0)}
                      className="rounded-md border border-dashed border-border px-2.5 py-1.5 text-[11px] font-medium text-ink-soft hover:border-primary hover:text-primary"
                    >
                      + সংখ্যা যোগ করুন
                    </button>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      it.effectiveInStock ? "bg-success/15 text-success" : "bg-price/10 text-price"
                    }`}
                  >
                    {it.effectiveInStock ? "স্টকে আছে" : "স্টকে নেই"}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right">
                  {it.stockCount !== null && (
                    <button
                      type="button"
                      onClick={() => resetCount(it.slug)}
                      disabled={savingSlug === it.slug}
                      aria-label="ডিফল্টে ফিরান"
                      className="rounded-md border border-border p-1.5 text-ink-faint hover:border-primary hover:text-primary disabled:opacity-50"
                    >
                      <RotateCcw size={13} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
