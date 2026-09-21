"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Search, Check, Lock, ExternalLink, RotateCcw, ShieldOff, ShieldAlert, ListFilter } from "lucide-react";

type Kind = "book" | "ebook" | "gear" | "blog";
type Mode = "off" | "full" | "curated";

interface Item {
  kind: Kind;
  slug: string;
  title: string;
  category: string;
  mode: Mode;
  allowedCount: number;
}

interface AllowedRef {
  kind: Kind;
  slug: string;
}

const KIND_LABEL: Record<Kind, string> = { book: "বই", ebook: "ইবুক", gear: "গিয়ার", blog: "ব্লগ" };
const KIND_PATH: Record<Kind, string> = { book: "/books", ebook: "/ebooks", gear: "/gear", blog: "/blog" };

const MODE_LABEL: Record<Mode, string> = {
  off: "স্বাভাবিক",
  full: "সম্পূর্ণ লক",
  curated: "নির্দিষ্ট পেজ দেখাতে দিন",
};

function itemKey(kind: Kind, slug: string) {
  return `${kind}:${slug}`;
}

export function LandingLockAdmin({ initialItems }: { initialItems: Item[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | Kind>("all");
  const [selected, setSelected] = useState<Item | null>(null);
  const [mode, setMode] = useState<Mode>("off");
  const [allowed, setAllowed] = useState<AllowedRef[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickerSearch, setPickerSearch] = useState("");
  const [pickerFilter, setPickerFilter] = useState<"all" | Kind>("all");

  const filteredItems = items.filter((it) => {
    if (categoryFilter !== "all" && it.kind !== categoryFilter) return false;
    if (search.trim() && !it.title.toLowerCase().includes(search.trim().toLowerCase())) return false;
    return true;
  });

  async function selectItem(item: Item) {
    setSelected(item);
    setSaved(false);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/landing-lock/${item.kind}/${item.slug}`);
      const data = await res.json();
      setMode(data.mode ?? "off");
      setAllowed(data.allowed ?? []);
    } catch {
      setError("লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  }

  function toggleAllowed(kind: Kind, slug: string) {
    setAllowed((prev) => {
      const exists = prev.some((a) => a.kind === kind && a.slug === slug);
      if (exists) return prev.filter((a) => !(a.kind === kind && a.slug === slug));
      return [...prev, { kind, slug }];
    });
    setSaved(false);
  }

  async function save() {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/landing-lock/${selected.kind}/${selected.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, allowed: mode === "curated" ? allowed : [] }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error || "সংরক্ষণ করা যায়নি");
        return;
      }
      setSaved(true);
      setItems((prev) =>
        prev.map((it) =>
          it.kind === selected.kind && it.slug === selected.slug
            ? { ...it, mode, allowedCount: mode === "curated" ? allowed.length : 0 }
            : it
        )
      );
      setTimeout(() => setSaved(false), 2000);
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
      const res = await fetch(`/api/admin/landing-lock/${selected.kind}/${selected.slug}`, { method: "DELETE" });
      if (!res.ok) {
        setError("রিসেট করা যায়নি");
        return;
      }
      setMode("off");
      setAllowed([]);
      setItems((prev) =>
        prev.map((it) => (it.kind === selected.kind && it.slug === selected.slug ? { ...it, mode: "off", allowedCount: 0 } : it))
      );
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

  const pickableItems = items.filter((it) => {
    if (selected && it.kind === selected.kind && it.slug === selected.slug) return false;
    if (pickerFilter !== "all" && it.kind !== pickerFilter) return false;
    if (pickerSearch.trim() && !it.title.toLowerCase().includes(pickerSearch.trim().toLowerCase())) return false;
    return true;
  });

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">ল্যান্ডিং পেজ লক (Meta Ad ট্র্যাফিক নিয়ন্ত্রণ)</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            যেকোনো প্রোডাক্ট বা ব্লগ পোস্টকে &ldquo;লক&rdquo; করে দিলে সেই পেজে আসা visitor হেডার/ফুটারের কোনো লিংক
            দেখবে না — শুধু সেই একটা পেজই দেখবে। &ldquo;নির্দিষ্ট পেজ দেখাতে দিন&rdquo; মোডে আপনি বেছে দেওয়া নির্দিষ্ট
            কিছু বই/ইবুক/গিয়ার/ব্লগ পেজে যাওয়ার অপশনও দিতে পারবেন — বাকি সব বন্ধ থাকবে। মনে রাখবেন: অর্ডার সম্পন্ন হলে
            visitor &ldquo;অর্ডার সফল&rdquo; পেজে যাবে, যেটা সবসময় স্বাভাবিক থাকে।
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
                placeholder="পেজের নাম খুঁজুন..."
                className="w-full rounded-md border border-border py-1.5 pl-8 pr-2.5 text-xs outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(["all", "book", "ebook", "gear", "blog"] as const).map((c) => (
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
                  {c === "all" ? "সব" : KIND_LABEL[c]}
                </button>
              ))}
            </div>
          </div>
          <div className="max-h-[560px] overflow-y-auto">
            {filteredItems.length === 0 && (
              <p className="p-4 text-center text-xs text-ink-faint">কোনো পেজ পাওয়া যায়নি</p>
            )}
            {filteredItems.map((it) => (
              <button
                key={itemKey(it.kind, it.slug)}
                type="button"
                onClick={() => selectItem(it)}
                className={`flex w-full items-center gap-2 border-b border-border px-3 py-2.5 text-left text-xs transition last:border-b-0 hover:bg-surface-muted ${
                  selected && selected.kind === it.kind && selected.slug === it.slug ? "bg-primary-light/60" : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{it.title}</p>
                  <p className="text-[10px] text-ink-faint">{KIND_LABEL[it.kind]}</p>
                </div>
                {it.mode !== "off" && (
                  <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-price/10 px-1.5 py-0.5 text-[9px] font-bold text-price">
                    <Lock size={9} /> {it.mode === "full" ? "লক" : "সীমিত"}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div>
          {!selected && (
            <div className="flex h-full min-h-[300px] items-center justify-center rounded-lg border border-dashed border-border text-sm text-ink-faint">
              বাম থেকে একটা পেজ বেছে নিন
            </div>
          )}

          {selected && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface-muted px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-foreground">{selected.title}</p>
                  <p className="text-[11px] text-ink-faint">{KIND_LABEL[selected.kind]} পেজ</p>
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

              {!loading && (
                <>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("off");
                        setSaved(false);
                      }}
                      className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center ${
                        mode === "off" ? "border-primary bg-primary-light" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <ShieldOff size={18} className={mode === "off" ? "text-primary" : "text-ink-faint"} />
                      <span className="text-xs font-semibold text-foreground">{MODE_LABEL.off}</span>
                      <span className="text-[10px] text-ink-faint">সব মেনু/লিংক স্বাভাবিক থাকবে</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("full");
                        setSaved(false);
                      }}
                      className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center ${
                        mode === "full" ? "border-price bg-price/10" : "border-border hover:border-price/50"
                      }`}
                    >
                      <Lock size={18} className={mode === "full" ? "text-price" : "text-ink-faint"} />
                      <span className="text-xs font-semibold text-foreground">{MODE_LABEL.full}</span>
                      <span className="text-[10px] text-ink-faint">শুধু এই পেজ — অন্য কোনো লিংক নেই</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("curated");
                        setSaved(false);
                      }}
                      className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center ${
                        mode === "curated" ? "border-cta bg-cta-light" : "border-border hover:border-cta/50"
                      }`}
                    >
                      <ShieldAlert size={18} className={mode === "curated" ? "text-cta-dark" : "text-ink-faint"} />
                      <span className="text-xs font-semibold text-foreground">{MODE_LABEL.curated}</span>
                      <span className="text-[10px] text-ink-faint">নিচ থেকে বেছে দেওয়া পেজগুলোও দেখা যাবে</span>
                    </button>
                  </div>

                  {mode === "curated" && (
                    <div className="mt-4 rounded-lg border border-border bg-surface p-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                        <ListFilter size={13} /> কোন পেজগুলো দেখা যাবে বেছে নিন ({allowed.length} টি নির্বাচিত)
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <div className="relative flex-1 min-w-[160px]">
                          <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                          <input
                            type="text"
                            value={pickerSearch}
                            onChange={(e) => setPickerSearch(e.target.value)}
                            placeholder="পেজ খুঁজুন..."
                            className="w-full rounded-md border border-border py-1.5 pl-7 pr-2.5 text-xs outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(["all", "book", "ebook", "gear", "blog"] as const).map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setPickerFilter(c)}
                              className={`rounded-md border px-2 py-1 text-[10px] font-medium ${
                                pickerFilter === c
                                  ? "border-primary bg-primary-light text-primary-dark"
                                  : "border-border text-ink-soft hover:border-primary/50"
                              }`}
                            >
                              {c === "all" ? "সব" : KIND_LABEL[c]}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mt-2 max-h-72 overflow-y-auto rounded-md border border-border">
                        {pickableItems.length === 0 && (
                          <p className="p-3 text-center text-xs text-ink-faint">কোনো পেজ পাওয়া যায়নি</p>
                        )}
                        {pickableItems.map((it) => {
                          const isChecked = allowed.some((a) => a.kind === it.kind && a.slug === it.slug);
                          return (
                            <label
                              key={itemKey(it.kind, it.slug)}
                              className="flex cursor-pointer items-center gap-2 border-b border-border px-3 py-2 text-xs last:border-b-0 hover:bg-surface-muted"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleAllowed(it.kind, it.slug)}
                                className="h-3.5 w-3.5 accent-primary"
                              />
                              <span className="min-w-0 flex-1 truncate text-foreground">{it.title}</span>
                              <span className="shrink-0 text-[10px] text-ink-faint">{KIND_LABEL[it.kind]}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {error && <p className="mt-3 text-sm text-price">{error}</p>}

                  <div className="mt-5 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={save}
                      disabled={saving}
                      className="rounded-md bg-cta px-5 py-2.5 text-sm font-semibold text-white hover:bg-cta-dark disabled:opacity-60"
                    >
                      {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                    </button>
                    <button
                      type="button"
                      onClick={resetToDefault}
                      disabled={saving || selected.mode === "off"}
                      className="flex items-center gap-1.5 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-surface-muted disabled:opacity-40"
                    >
                      <RotateCcw size={14} /> স্বাভাবিকে ফিরে যান
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
