"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  ExternalLink,
  LogOut,
  Check,
  Search,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";

interface SectionMeta {
  key: string;
  label: string;
  note?: string;
}

interface ProductRow {
  slug: string;
  title: string;
  category: "book" | "ebook" | "gear";
  customized: boolean;
}

const CATEGORY_LABEL: Record<ProductRow["category"], string> = {
  book: "বই",
  ebook: "ইবুক",
  gear: "গিয়ার",
};
const CATEGORY_PATH: Record<ProductRow["category"], string> = {
  book: "/books",
  ebook: "/ebooks",
  gear: "/gear",
};

export function SectionOrderAdmin({
  initialProducts,
  catalog,
}: {
  initialProducts: ProductRow[];
  catalog: SectionMeta[];
}) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [categoryFilter, setCategoryFilter] = useState<"all" | ProductRow["category"]>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ProductRow | null>(null);
  const [order, setOrder] = useState<string[] | null>(null);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const byKey = useMemo(() => new Map(catalog.map((s) => [s.key, s])), [catalog]);

  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (search.trim() && !p.title.toLowerCase().includes(search.trim().toLowerCase())) return false;
    return true;
  });

  async function selectProduct(p: ProductRow) {
    setSelected(p);
    setOrder(null);
    setHidden(new Set());
    setSaved(false);
    setError(null);
    setLoadingOrder(true);
    try {
      const res = await fetch(`/api/admin/section-order/${p.slug}`);
      const data = await res.json();
      setOrder(data.order);
      setHidden(new Set(data.hidden ?? []));
    } catch {
      setError("লোড করা যায়নি");
    } finally {
      setLoadingOrder(false);
    }
  }

  function toggleHidden(key: string) {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setSaved(false);
  }

  function move(from: number, to: number) {
    if (!order || to < 0 || to >= order.length) return;
    setOrder((prev) => {
      if (!prev) return prev;
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
    setSaved(false);
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex || !order) {
      setDragIndex(null);
      return;
    }
    setOrder((prev) => {
      if (!prev) return prev;
      const next = [...prev];
      const [item] = next.splice(dragIndex, 1);
      next.splice(targetIndex, 0, item);
      return next;
    });
    setDragIndex(null);
    setSaved(false);
  }

  async function save() {
    if (!selected || !order) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/section-order/${selected.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order, hidden: Array.from(hidden) }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error || "সংরক্ষণ করা যায়নি");
        return;
      }
      setSaved(true);
      setProducts((prev) => prev.map((p) => (p.slug === selected.slug ? { ...p, customized: true } : p)));
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("সংরক্ষণ করা যায়নি — ইন্টারনেট সংযোগ চেক করুন");
    } finally {
      setSaving(false);
    }
  }

  async function resetToDefault() {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/section-order/${selected.slug}`, { method: "DELETE" });
      if (!res.ok) {
        setError("রিসেট করা যায়নি");
        return;
      }
      setOrder(catalog.map((s) => s.key));
      setHidden(new Set());
      setProducts((prev) => prev.map((p) => (p.slug === selected.slug ? { ...p, customized: false } : p)));
      setSaved(false);
    } catch {
      setError("রিসেট করা যায়নি — ইন্টারনেট সংযোগ চেক করুন");
    } finally {
      setSaving(false);
    }
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
          <h1 className="font-display text-xl font-bold text-foreground">প্রোডাক্ট পেজ সেকশন সাজান</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            বামের লিস্ট থেকে একটা প্রোডাক্ট বেছে নিন, তারপর তার পেজের সেকশনগুলো টেনে (ড্র্যাগ) বা তীর বাটন দিয়ে
            সাজান — আর চোখ-আইকনে ক্লিক করে যেকোনো সেকশন লুকিয়েও ফেলতে পারবেন, তাহলে ভিজিটররা সেটা পেজেই দেখবে না।
            প্রতিটা প্রোডাক্ট পেজ আলাদাভাবে কাস্টমাইজ করা যাবে — একটা প্রোডাক্টে পরিবর্তন করলে অন্য প্রোডাক্টে কোনো
            প্রভাব পড়বে না। ডিজাইন একই থাকবে, শুধু সেকশনের ক্রম ও দৃশ্যমানতা বদলাবে।
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:bg-surface-muted"
        >
          <LogOut size={14} /> লগআউট
        </button>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[320px_1fr]">
        {/* Product picker */}
        <div className="rounded-lg border border-border bg-surface">
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="প্রোডাক্টের নাম খুঁজুন..."
                className="w-full rounded-md border border-border py-1.5 pl-8 pr-2.5 text-xs outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(["all", "book", "ebook", "gear"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategoryFilter(c)}
                  className={`rounded-md border px-2.5 py-1 text-[11px] font-medium ${
                    categoryFilter === c
                      ? "border-primary bg-primary-light text-primary-dark"
                      : "border-border text-ink-soft hover:border-primary/50"
                  }`}
                >
                  {c === "all" ? "সব" : CATEGORY_LABEL[c]}
                </button>
              ))}
            </div>
          </div>
          <div className="max-h-[560px] overflow-y-auto">
            {filteredProducts.length === 0 && (
              <p className="p-4 text-center text-xs text-ink-faint">কোনো প্রোডাক্ট পাওয়া যায়নি</p>
            )}
            {filteredProducts.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => selectProduct(p)}
                className={`flex w-full items-center gap-2 border-b border-border px-3 py-2.5 text-left text-xs transition last:border-b-0 hover:bg-surface-muted ${
                  selected?.slug === p.slug ? "bg-primary-light/60" : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{p.title}</p>
                  <p className="text-[10px] text-ink-faint">{CATEGORY_LABEL[p.category]}</p>
                </div>
                {p.customized && (
                  <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-cta-light px-1.5 py-0.5 text-[9px] font-bold text-cta-dark">
                    <Sparkles size={9} /> কাস্টম
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Reorder panel */}
        <div>
          {!selected && (
            <div className="flex h-full min-h-[300px] items-center justify-center rounded-lg border border-dashed border-border text-sm text-ink-faint">
              বাম থেকে একটা প্রোডাক্ট বেছে নিন
            </div>
          )}

          {selected && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface-muted px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-foreground">{selected.title}</p>
                  <p className="text-[11px] text-ink-faint">{CATEGORY_LABEL[selected.category]} প্রোডাক্ট</p>
                </div>
                <a
                  href={`${CATEGORY_PATH[selected.category]}/${selected.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-primary hover:border-primary"
                >
                  লাইভ পেজ দেখুন <ExternalLink size={11} />
                </a>
              </div>

              {loadingOrder && <p className="mt-4 text-sm text-ink-soft">লোড হচ্ছে...</p>}

              {!loadingOrder && order && (
                <>
                  <div className="mt-4 flex flex-col gap-2">
                    {order.map((key, index) => {
                      const meta = byKey.get(key);
                      if (!meta) return null;
                      const isHidden = hidden.has(key);
                      return (
                        <div
                          key={key}
                          draggable
                          onDragStart={() => setDragIndex(index)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => handleDrop(index)}
                          onDragEnd={() => setDragIndex(null)}
                          className={`flex items-center gap-3 rounded-lg border p-3 transition ${
                            dragIndex === index ? "opacity-40" : "border-border"
                          } ${isHidden ? "bg-surface-muted" : "bg-surface"}`}
                        >
                          <span className="cursor-grab text-ink-faint active:cursor-grabbing" aria-hidden="true">
                            <GripVertical size={18} />
                          </span>
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary-dark">
                            {index + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-sm font-medium ${
                                isHidden ? "text-ink-faint line-through" : "text-foreground"
                              }`}
                            >
                              {meta.label}
                            </p>
                            {meta.note && <p className="text-[11px] text-ink-faint">{meta.note}</p>}
                            {isHidden && <p className="text-[11px] font-medium text-price">লুকানো — ভিজিটররা দেখবে না</p>}
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            <button
                              type="button"
                              aria-label={isHidden ? "সেকশন দেখান" : "সেকশন লুকান"}
                              onClick={() => toggleHidden(key)}
                              className={`rounded-md border p-1.5 ${
                                isHidden
                                  ? "border-price/40 bg-price/10 text-price"
                                  : "border-border text-ink-soft hover:border-primary hover:text-primary"
                              }`}
                            >
                              {isHidden ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                            <button
                              type="button"
                              aria-label="উপরে সরান"
                              disabled={index === 0}
                              onClick={() => move(index, index - 1)}
                              className="rounded-md border border-border p-1.5 text-ink-soft hover:border-primary hover:text-primary disabled:opacity-30"
                            >
                              <ChevronUp size={15} />
                            </button>
                            <button
                              type="button"
                              aria-label="নিচে সরান"
                              disabled={index === order.length - 1}
                              onClick={() => move(index, index + 1)}
                              className="rounded-md border border-border p-1.5 text-ink-soft hover:border-primary hover:text-primary disabled:opacity-30"
                            >
                              <ChevronDown size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {error && <p className="mt-3 text-sm text-price">{error}</p>}

                  <div className="mt-5 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={save}
                      disabled={saving}
                      className="rounded-md bg-cta px-5 py-2.5 text-sm font-semibold text-white hover:bg-cta-dark disabled:opacity-60"
                    >
                      {saving ? "সংরক্ষণ হচ্ছে..." : "এই প্রোডাক্টের জন্য সংরক্ষণ করুন"}
                    </button>
                    <button
                      type="button"
                      onClick={resetToDefault}
                      disabled={saving || !selected.customized}
                      className="flex items-center gap-1.5 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-surface-muted disabled:opacity-40"
                    >
                      <RotateCcw size={14} /> ডিফল্ট অর্ডারে ফিরে যান
                    </button>
                    {saved && (
                      <span className="flex items-center gap-1 text-sm font-medium text-success">
                        <Check size={15} /> সংরক্ষিত হয়েছে
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
