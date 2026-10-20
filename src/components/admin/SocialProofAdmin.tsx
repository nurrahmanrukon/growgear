"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  GripVertical,
  Trash2,
  Pencil,
  Plus,
  RotateCcw,
  ExternalLink,
  LogOut,
  Check,
  Search,
  Sparkles,
  UploadCloud,
  X,
  Info,
} from "lucide-react";

type Platform = "facebook" | "instagram" | "whatsapp";

interface ProductRow {
  slug: string;
  title: string;
  category: "book" | "ebook" | "gear";
  customized: boolean;
}

interface Post {
  id: string;
  name: string;
  platform: Platform;
  text: string;
  likes: number;
  hoursAgo: number;
  imageId?: string;
  imageUrl?: string;
}

const CATEGORY_LABEL: Record<ProductRow["category"], string> = { book: "বই", ebook: "ইবুক", gear: "গিয়ার" };
const CATEGORY_PATH: Record<ProductRow["category"], string> = { book: "/books", ebook: "/ebooks", gear: "/gear" };
const PLATFORM_LABEL: Record<Platform, string> = { facebook: "ফেসবুক", instagram: "ইনস্টাগ্রাম", whatsapp: "হোয়াটসঅ্যাপ" };

function newPost(): Post {
  return {
    id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: "",
    platform: "facebook",
    text: "",
    likes: 20,
    hoursAgo: 5,
  };
}

function ImageDropzone({
  slug,
  imageUrl,
  onUploaded,
  onRemoved,
}: {
  slug: string;
  imageUrl?: string;
  onUploaded: (imageId: string, url: string) => void;
  onRemoved: () => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`/api/admin/social-proof/${slug}/image`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "আপলোড করা যায়নি");
        return;
      }
      onUploaded(data.id, data.url);
    } catch {
      setError("আপলোড করা যায়নি — ইন্টারনেট সংযোগ চেক করুন");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  }

  if (imageUrl) {
    return (
      <div>
        <span className="mb-1.5 block text-xs font-medium text-ink-soft">আসল স্ক্রিনশট</span>
        <div className="overflow-hidden rounded-md border border-border bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin preview of an uploaded file */}
          <img src={imageUrl} alt="" className="max-h-48 w-full object-contain" />
        </div>
        <button
          type="button"
          onClick={onRemoved}
          className="mt-1.5 flex items-center gap-1.5 rounded-md border border-price/40 bg-price/10 px-2.5 py-1 text-xs font-medium text-price hover:bg-price/20"
        >
          <Trash2 size={12} /> ছবি সরান
        </button>
        {error && <p className="mt-1 text-xs text-price">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium text-ink-soft">
        আসল স্ক্রিনশট (ঐচ্ছিক — না দিলে নিচের তথ্য দিয়ে একটা তৈরি কার্ড দেখানো হবে)
      </span>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed p-3 text-center transition ${
          dragOver ? "border-primary bg-primary-light" : "border-border bg-surface hover:border-primary/50"
        }`}
      >
        <UploadCloud size={18} className="text-primary" />
        <p className="text-xs font-medium text-foreground">
          {uploading ? "আপলোড হচ্ছে..." : "স্ক্রিনশট ছবি ড্র্যাগ করুন, অথবা ক্লিক করে বেছে নিন"}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />
      </div>
      {error && <p className="mt-1 text-xs text-price">{error}</p>}
    </div>
  );
}

export function SocialProofAdmin({ initialProducts }: { initialProducts: ProductRow[] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [categoryFilter, setCategoryFilter] = useState<"all" | ProductRow["category"]>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ProductRow | null>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [customized, setCustomized] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (search.trim() && !p.title.toLowerCase().includes(search.trim().toLowerCase())) return false;
    return true;
  });

  async function selectProduct(p: ProductRow) {
    setSelected(p);
    setPosts(null);
    setEditingId(null);
    setSaved(false);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/social-proof/${p.slug}`);
      const data = await res.json();
      setPosts(data.posts ?? []);
      setCustomized(Boolean(data.customized));
    } catch {
      setError("লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  }

  function updatePost(id: string, patch: Partial<Post>) {
    setPosts((prev) => (prev ? prev.map((p) => (p.id === id ? { ...p, ...patch } : p)) : prev));
    setSaved(false);
  }

  function addPost() {
    const post = newPost();
    setPosts((prev) => (prev ? [...prev, post] : [post]));
    setEditingId(post.id);
    setSaved(false);
  }

  function deletePost(id: string) {
    setPosts((prev) => (prev ? prev.filter((p) => p.id !== id) : prev));
    if (editingId === id) setEditingId(null);
    setSaved(false);
  }

  function move(from: number, to: number) {
    if (!posts || to < 0 || to >= posts.length) return;
    setPosts((prev) => {
      if (!prev) return prev;
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
    setSaved(false);
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex || !posts) {
      setDragIndex(null);
      return;
    }
    move(dragIndex, targetIndex);
    setDragIndex(null);
  }

  async function save() {
    if (!selected || !posts) return;
    setError(null);
    for (const p of posts) {
      if (!p.name.trim() || !p.text.trim()) {
        setError("প্রতিটি পোস্টে নাম ও কমেন্ট টেক্সট আবশ্যক — অসম্পূর্ণ পোস্ট মুছে ফেলুন অথবা পূরণ করুন");
        return;
      }
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/social-proof/${selected.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error || "সংরক্ষণ করা যায়নি");
        return;
      }
      setSaved(true);
      setCustomized(posts.length > 0);
      setProducts((prev) => prev.map((p) => (p.slug === selected.slug ? { ...p, customized: posts.length > 0 } : p)));
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("সংরক্ষণ করা যায়নি — ইন্টারনেট সংযোগ চেক করুন");
    } finally {
      setSaving(false);
    }
  }

  async function resetToDemo() {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/social-proof/${selected.slug}`, { method: "DELETE" });
      if (!res.ok) {
        setError("রিসেট করা যায়নি");
        return;
      }
      setPosts([]);
      setCustomized(false);
      setEditingId(null);
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
          <h1 className="font-display text-xl font-bold text-foreground">সোশ্যাল মিডিয়া স্ক্রিনশট</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            বামের লিস্ট থেকে একটা প্রোডাক্ট বেছে নিন, তারপর আসল কাস্টমারের কমেন্ট/স্ক্রিনশট যোগ করুন — টেনে (ড্র্যাগ) সাজাতে
            পারবেন, মুছেও ফেলতে পারবেন। কোনো প্রোডাক্টে এখনো কিছু যোগ না করলে ভিজিটররা একটা অটো-জেনারেটেড ডেমো সেকশন দেখবে।
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

        {/* Editor panel */}
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

              {loading && <p className="mt-4 text-sm text-ink-soft">লোড হচ্ছে...</p>}

              {!loading && posts && (
                <>
                  {posts.length === 0 && (
                    <div className="mt-4 flex items-start gap-2 rounded-lg border border-sky-300 bg-sky-50 px-3 py-2.5 text-xs text-sky-900">
                      <Info size={14} className="mt-0.5 shrink-0" />
                      এখনো কোনো আসল কমেন্ট যোগ করা হয়নি — ভিজিটররা এখন একটা অটো-জেনারেটেড ডেমো সেকশন দেখছেন। নিচে
                      &quot;নতুন পোস্ট যোগ করুন&quot; দিয়ে আসল কমেন্ট/স্ক্রিনশট যোগ করুন।
                    </div>
                  )}

                  <div className="mt-4 flex flex-col gap-2">
                    {posts.map((post, index) => {
                      const isEditing = editingId === post.id;
                      return (
                        <div
                          key={post.id}
                          draggable={!isEditing}
                          onDragStart={() => setDragIndex(index)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => handleDrop(index)}
                          onDragEnd={() => setDragIndex(null)}
                          className={`rounded-lg border p-3 transition ${
                            dragIndex === index ? "opacity-40" : "border-border"
                          } bg-surface`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="cursor-grab text-ink-faint active:cursor-grabbing" aria-hidden="true">
                              <GripVertical size={18} />
                            </span>
                            {post.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail preview
                              <img src={post.imageUrl} alt="" className="h-9 w-9 shrink-0 rounded-md object-cover" />
                            ) : (
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary-dark">
                                {post.name.trim().charAt(0) || "?"}
                              </span>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-foreground">
                                {post.name || "(নাম নেই)"}{" "}
                                <span className="text-[10px] font-normal text-ink-faint">— {PLATFORM_LABEL[post.platform]}</span>
                              </p>
                              <p className="truncate text-xs text-ink-faint">{post.text || "(কমেন্ট টেক্সট নেই)"}</p>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                              <button
                                type="button"
                                aria-label="এডিট করুন"
                                onClick={() => setEditingId(isEditing ? null : post.id)}
                                className={`rounded-md border p-1.5 ${
                                  isEditing
                                    ? "border-primary bg-primary-light text-primary"
                                    : "border-border text-ink-soft hover:border-primary hover:text-primary"
                                }`}
                              >
                                {isEditing ? <X size={15} /> : <Pencil size={15} />}
                              </button>
                              <button
                                type="button"
                                aria-label="মুছে ফেলুন"
                                onClick={() => deletePost(post.id)}
                                className="rounded-md border border-price/40 bg-price/10 p-1.5 text-price hover:bg-price/20"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>

                          {isEditing && (
                            <div className="mt-3 grid gap-3 border-t border-border pt-3 sm:grid-cols-2">
                              <div>
                                <label className="mb-1 block text-xs font-medium text-ink-soft">নাম</label>
                                <input
                                  value={post.name}
                                  onChange={(e) => updatePost(post.id, { name: e.target.value })}
                                  className="w-full rounded-md border border-border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-xs font-medium text-ink-soft">প্ল্যাটফর্ম</label>
                                <select
                                  value={post.platform}
                                  onChange={(e) => updatePost(post.id, { platform: e.target.value as Platform })}
                                  className="w-full rounded-md border border-border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                                >
                                  <option value="facebook">ফেসবুক</option>
                                  <option value="instagram">ইনস্টাগ্রাম</option>
                                  <option value="whatsapp">হোয়াটসঅ্যাপ</option>
                                </select>
                              </div>
                              <div className="sm:col-span-2">
                                <label className="mb-1 block text-xs font-medium text-ink-soft">কমেন্ট টেক্সট</label>
                                <textarea
                                  value={post.text}
                                  onChange={(e) => updatePost(post.id, { text: e.target.value })}
                                  rows={2}
                                  className="w-full resize-none rounded-md border border-border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-xs font-medium text-ink-soft">লাইক সংখ্যা</label>
                                <input
                                  type="number"
                                  min={0}
                                  value={post.likes}
                                  onChange={(e) => updatePost(post.id, { likes: Number(e.target.value) || 0 })}
                                  className="w-full rounded-md border border-border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-xs font-medium text-ink-soft">কত ঘণ্টা আগে</label>
                                <input
                                  type="number"
                                  min={0}
                                  value={post.hoursAgo}
                                  onChange={(e) => updatePost(post.id, { hoursAgo: Number(e.target.value) || 0 })}
                                  className="w-full rounded-md border border-border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <ImageDropzone
                                  slug={selected.slug}
                                  imageUrl={post.imageUrl}
                                  onUploaded={(imageId, url) => updatePost(post.id, { imageId, imageUrl: url })}
                                  onRemoved={() => updatePost(post.id, { imageId: undefined, imageUrl: undefined })}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={addPost}
                    className="mt-3 flex items-center gap-1.5 rounded-md border border-dashed border-primary/50 px-3 py-2 text-sm font-medium text-primary hover:bg-primary-light"
                  >
                    <Plus size={15} /> নতুন পোস্ট যোগ করুন
                  </button>

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
                      onClick={resetToDemo}
                      disabled={saving || !customized}
                      className="flex items-center gap-1.5 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-surface-muted disabled:opacity-40"
                    >
                      <RotateCcw size={14} /> ডেমো ভার্সনে ফিরে যান
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
