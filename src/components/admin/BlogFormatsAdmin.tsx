"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExternalLink, LogOut, Check, Search, Sparkles, Eye, EyeOff, Lock } from "lucide-react";

interface FormatMeta {
  key: string;
  label: string;
  note?: string;
}

interface PostRow {
  slug: string;
  title: string;
  topicSlug: string;
  premium: boolean;
  hidden: string[];
}

export function BlogFormatsAdmin({ initialPosts, catalog }: { initialPosts: PostRow[]; catalog: FormatMeta[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [premiumFilter, setPremiumFilter] = useState<"all" | "premium" | "normal">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PostRow | null>(null);
  const [hidden, setHidden] = useState<Set<string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredPosts = posts.filter((p) => {
    if (premiumFilter === "premium" && !p.premium) return false;
    if (premiumFilter === "normal" && p.premium) return false;
    if (search.trim() && !p.title.toLowerCase().includes(search.trim().toLowerCase())) return false;
    return true;
  });

  const rows = catalog.filter((c) => selected?.premium || c.key !== "both");

  async function selectPost(p: PostRow) {
    setSelected(p);
    setHidden(null);
    setSaved(false);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/blog-formats/${p.slug}`);
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
      const res = await fetch(`/api/admin/blog-formats/${selected.slug}`, {
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
      setPosts((prev) => prev.map((p) => (p.slug === selected.slug ? { ...p, hidden: hiddenArr } : p)));
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
      const res = await fetch(`/api/admin/blog-formats/${selected.slug}`, { method: "DELETE" });
      if (!res.ok) {
        setError("রিসেট করা যায়নি");
        return;
      }
      setHidden(new Set());
      setPosts((prev) => prev.map((p) => (p.slug === selected.slug ? { ...p, hidden: [] } : p)));
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

  const customized = selected ? posts.find((p) => p.slug === selected.slug)?.hidden.length : 0;

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">ব্লগ ফরম্যাট নিয়ন্ত্রণ</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            বামের লিস্ট থেকে একটা লেখা বেছে নিন, তারপর চোখ-আইকনে ক্লিক করে যেকোনো ফরম্যাট (টেক্সট / অডিও / প্রিমিয়াম
            লেখার কম্বো অফার) লুকিয়ে ফেলুন — তাহলে ভিজিটররা সেই লেখায় সেটা আর দেখবে না। প্রতিটা লেখা আলাদাভাবে
            কাস্টমাইজ করা যাবে — একটায় পরিবর্তন করলে অন্য লেখায় কোনো প্রভাব পড়বে না।
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
        {/* Post picker */}
        <div className="rounded-lg border border-border bg-surface">
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="লেখার শিরোনাম খুঁজুন..."
                className="w-full rounded-md border border-border py-1.5 pl-8 pr-2.5 text-xs outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(["all", "premium", "normal"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setPremiumFilter(f)}
                  className={`rounded-md border px-2.5 py-1 text-[11px] font-medium ${
                    premiumFilter === f
                      ? "border-primary bg-primary-light text-primary-dark"
                      : "border-border text-ink-soft hover:border-primary/50"
                  }`}
                >
                  {f === "all" ? "সব" : f === "premium" ? "প্রিমিয়াম" : "সাধারণ"}
                </button>
              ))}
            </div>
          </div>
          <div className="max-h-[560px] overflow-y-auto">
            {filteredPosts.length === 0 && (
              <p className="p-4 text-center text-xs text-ink-faint">কোনো লেখা পাওয়া যায়নি</p>
            )}
            {filteredPosts.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => selectPost(p)}
                className={`flex w-full items-center gap-2 border-b border-border px-3 py-2.5 text-left text-xs transition last:border-b-0 hover:bg-surface-muted ${
                  selected?.slug === p.slug ? "bg-primary-light/60" : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{p.title}</p>
                  <p className="flex items-center gap-1 text-[10px] text-ink-faint">
                    {p.premium && <Lock size={9} />} {p.premium ? "প্রিমিয়াম" : "সাধারণ"}
                  </p>
                </div>
                {p.hidden.length > 0 && (
                  <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-cta-light px-1.5 py-0.5 text-[9px] font-bold text-cta-dark">
                    <Sparkles size={9} /> কাস্টম
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Format toggle panel */}
        <div>
          {!selected && (
            <div className="flex h-full min-h-[300px] items-center justify-center rounded-lg border border-dashed border-border text-sm text-ink-faint">
              বাম থেকে একটা লেখা বেছে নিন
            </div>
          )}

          {selected && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface-muted px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-foreground">{selected.title}</p>
                  <p className="text-[11px] text-ink-faint">{selected.premium ? "প্রিমিয়াম লেখা" : "সাধারণ লেখা"}</p>
                </div>
                <a
                  href={`/blog/${selected.slug}`}
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
                            {meta.note && <p className="text-[11px] text-ink-faint">{meta.note}</p>}
                            {isHidden && <p className="text-[11px] font-medium text-price">লুকানো — ভিজিটররা দেখবে না</p>}
                          </div>
                          <button
                            type="button"
                            aria-label={isHidden ? "ফরম্যাট দেখান" : "ফরম্যাট লুকান"}
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
                      {saving ? "সংরক্ষণ হচ্ছে..." : "এই লেখার জন্য সংরক্ষণ করুন"}
                    </button>
                    <button
                      type="button"
                      onClick={resetToDefault}
                      disabled={saving || !customized}
                      className="rounded-md border border-border px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-surface-muted disabled:opacity-40"
                    >
                      সব ফরম্যাট আবার দেখান
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
