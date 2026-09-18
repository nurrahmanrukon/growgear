"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExternalLink, LogOut, Check, Search, Sparkles, Eye, EyeOff } from "lucide-react";

interface MethodMeta {
  key: string;
  label: string;
}

type Kind = "book" | "ebook" | "gear" | "blog";

interface ItemRow {
  slug: string;
  title: string;
  kind: Kind;
  offered: string[];
  hidden: string[];
}

const KIND_LABEL: Record<Kind, string> = { book: "বই", ebook: "ইবুক", gear: "গিয়ার", blog: "ব্লগ" };
const KIND_PATH: Record<Kind, string> = { book: "/books", ebook: "/ebooks", gear: "/gear", blog: "/blog" };

export function PaymentMethodsAdmin({ initialItems, catalog }: { initialItems: ItemRow[]; catalog: MethodMeta[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [kindFilter, setKindFilter] = useState<"all" | Kind>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ItemRow | null>(null);
  const [hidden, setHidden] = useState<Set<string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredItems = items.filter((it) => {
    if (kindFilter !== "all" && it.kind !== kindFilter) return false;
    if (search.trim() && !it.title.toLowerCase().includes(search.trim().toLowerCase())) return false;
    return true;
  });

  const rows = selected ? catalog.filter((c) => selected.offered.includes(c.key)) : [];

  async function selectItem(it: ItemRow) {
    setSelected(it);
    setHidden(null);
    setSaved(false);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/payment-methods/${it.slug}`);
      const data = await res.json();
      setHidden(new Set(data.hidden ?? []));
    } catch {
      setError("লোড করা যায়নি");
    } finally {
      setLoading(false);
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
    setError(null);
  }

  async function save() {
    if (!selected || !hidden) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/payment-methods/${selected.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hidden: Array.from(hidden) }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error || "সংরক্ষণ করা যায়নি");
        return;
      }
      setSaved(true);
      const hiddenArr = Array.from(hidden);
      setItems((prev) => prev.map((it) => (it.slug === selected.slug ? { ...it, hidden: hiddenArr } : it)));
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
      const res = await fetch(`/api/admin/payment-methods/${selected.slug}`, { method: "DELETE" });
      if (!res.ok) {
        setError("রিসেট করা যায়নি");
        return;
      }
      setHidden(new Set());
      setItems((prev) => prev.map((it) => (it.slug === selected.slug ? { ...it, hidden: [] } : it)));
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

  const customized = selected ? items.find((it) => it.slug === selected.slug)?.hidden.length : 0;

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">পেমেন্ট পদ্ধতি নিয়ন্ত্রণ</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            বামের লিস্ট থেকে একটা বই/ইবুক/গিয়ার প্রোডাক্ট বা প্রিমিয়াম ব্লগ বেছে নিন, তারপর চোখ-আইকনে ক্লিক করে
            ক্যাশ অন ডেলিভারি / বিকাশ / কার্ড — যেকোনো পেমেন্ট পদ্ধতি লুকিয়ে ফেলুন। এটা শুধু সেই নির্দিষ্ট আইটেমের
            অর্ডার ফর্মেই প্রযোজ্য হবে — বাকি সব প্রোডাক্ট/ব্লগে কোনো প্রভাব পড়বে না।
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
        {/* Item picker */}
        <div className="rounded-lg border border-border bg-surface">
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="নাম খুঁজুন..."
                className="w-full rounded-md border border-border py-1.5 pl-8 pr-2.5 text-xs outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(["all", "book", "ebook", "gear", "blog"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKindFilter(k)}
                  className={`rounded-md border px-2.5 py-1 text-[11px] font-medium ${
                    kindFilter === k
                      ? "border-primary bg-primary-light text-primary-dark"
                      : "border-border text-ink-soft hover:border-primary/50"
                  }`}
                >
                  {k === "all" ? "সব" : KIND_LABEL[k]}
                </button>
              ))}
            </div>
          </div>
          <div className="max-h-[560px] overflow-y-auto">
            {filteredItems.length === 0 && (
              <p className="p-4 text-center text-xs text-ink-faint">কোনো আইটেম পাওয়া যায়নি</p>
            )}
            {filteredItems.map((it) => (
              <button
                key={it.slug}
                type="button"
                onClick={() => selectItem(it)}
                className={`flex w-full items-center gap-2 border-b border-border px-3 py-2.5 text-left text-xs transition last:border-b-0 hover:bg-surface-muted ${
                  selected?.slug === it.slug ? "bg-primary-light/60" : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{it.title}</p>
                  <p className="text-[10px] text-ink-faint">{KIND_LABEL[it.kind]}</p>
                </div>
                {it.hidden.length > 0 && (
                  <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-cta-light px-1.5 py-0.5 text-[9px] font-bold text-cta-dark">
                    <Sparkles size={9} /> কাস্টম
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Method toggle panel */}
        <div>
          {!selected && (
            <div className="flex h-full min-h-[300px] items-center justify-center rounded-lg border border-dashed border-border text-sm text-ink-faint">
              বাম থেকে একটা প্রোডাক্ট বা ব্লগ বেছে নিন
            </div>
          )}

          {selected && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface-muted px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-foreground">{selected.title}</p>
                  <p className="text-[11px] text-ink-faint">{KIND_LABEL[selected.kind]}</p>
                </div>
                <a
                  href={`${KIND_PATH[selected.kind]}/${selected.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-primary hover:border-primary"
                >
                  লাইভ পেজ দেখুন <ExternalLink size={11} />
                </a>
              </div>

              {loading && <p className="mt-4 text-sm text-ink-soft">লোড হচ্ছে...</p>}

              {!loading && hidden && (
                <>
                  <div className="mt-4 flex flex-col gap-2">
                    {rows.map((meta) => {
                      const isHidden = hidden.has(meta.key);
                      return (
                        <div
                          key={meta.key}
                          className={`flex items-center gap-3 rounded-lg border p-3 ${
                            isHidden ? "border-border bg-surface-muted" : "border-border bg-surface"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-sm font-medium ${
                                isHidden ? "text-ink-faint line-through" : "text-foreground"
                              }`}
                            >
                              {meta.label}
                            </p>
                            {isHidden && <p className="text-[11px] font-medium text-price">লুকানো — ভিজিটররা দেখবে না</p>}
                          </div>
                          <button
                            type="button"
                            aria-label={isHidden ? "পেমেন্ট পদ্ধতি দেখান" : "পেমেন্ট পদ্ধতি লুকান"}
                            onClick={() => toggleHidden(meta.key)}
                            className={`shrink-0 rounded-md border p-1.5 ${
                              isHidden
                                ? "border-price/40 bg-price/10 text-price"
                                : "border-border text-ink-soft hover:border-primary hover:text-primary"
                            }`}
                          >
                            {isHidden ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
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
                      {saving ? "সংরক্ষণ হচ্ছে..." : "এই আইটেমের জন্য সংরক্ষণ করুন"}
                    </button>
                    <button
                      type="button"
                      onClick={resetToDefault}
                      disabled={saving || !customized}
                      className="rounded-md border border-border px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-surface-muted disabled:opacity-40"
                    >
                      সব পদ্ধতি আবার দেখান
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
