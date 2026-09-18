"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { LogOut, Search, Sparkles, UploadCloud, Trash2, ImageIcon, Film, ExternalLink } from "lucide-react";

type ProductCategory = "book" | "ebook" | "gear";

interface ProductListItem {
  slug: string;
  title: string;
  category: ProductCategory;
  hasImage: boolean;
  hasVideo: boolean;
}
interface BlogListItem {
  slug: string;
  title: string;
  hasImage: boolean;
}

const CATEGORY_LABEL: Record<ProductCategory, string> = { book: "বই", ebook: "ইবুক", gear: "গিয়ার" };
const CATEGORY_PATH: Record<ProductCategory, string> = { book: "/books", ebook: "/ebooks", gear: "/gear" };

function MediaSlot({
  label,
  endpoint,
  previewUrl,
  accept,
  hint,
  kind,
  hasMedia,
  onChanged,
}: {
  label: string;
  endpoint: string;
  previewUrl: string;
  accept: string;
  hint: string;
  kind: "image" | "video";
  hasMedia: boolean;
  onChanged: (hasMedia: boolean) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheBust, setCacheBust] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(endpoint, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "আপলোড করা যায়নি");
        return;
      }
      setCacheBust((n) => n + 1);
      onChanged(true);
    } catch {
      setError("আপলোড করা যায়নি — ইন্টারনেট সংযোগ চেক করুন");
    } finally {
      setUploading(false);
    }
  }

  async function remove() {
    setUploading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) {
        setError("মুছে ফেলা যায়নি");
        return;
      }
      onChanged(false);
    } catch {
      setError("মুছে ফেলা যায়নি — ইন্টারনেট সংযোগ চেক করুন");
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

  return (
    <div>
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-ink-soft">
        {kind === "image" ? <ImageIcon size={13} /> : <Film size={13} />} {label}
      </span>

      {hasMedia && (
        <div className="mb-2 overflow-hidden rounded-lg border border-border bg-surface">
          {kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview of an uploaded file
            <img key={cacheBust} src={`${previewUrl}?t=${cacheBust}`} alt="" className="max-h-56 w-full object-contain" />
          ) : (
            <video key={cacheBust} src={`${previewUrl}?t=${cacheBust}`} controls className="max-h-56 w-full bg-black" />
          )}
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed p-4 text-center transition ${
          dragOver ? "border-primary bg-primary-light" : "border-border bg-surface hover:border-primary/50"
        }`}
      >
        <UploadCloud size={20} className="text-primary" />
        <p className="text-xs font-medium text-foreground">
          {uploading ? "আপলোড হচ্ছে..." : hasMedia ? "বদলাতে চাইলে নতুন ফাইল ড্র্যাগ করুন" : "ফাইল ড্র্যাগ করুন, অথবা ক্লিক করে বেছে নিন"}
        </p>
        <p className="text-[10px] text-ink-faint">{hint}</p>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />
      </div>

      {hasMedia && (
        <button
          type="button"
          onClick={remove}
          disabled={uploading}
          className="mt-2 flex items-center gap-1.5 rounded-md border border-price/40 bg-price/10 px-3 py-1.5 text-xs font-medium text-price hover:bg-price/20 disabled:opacity-50"
        >
          <Trash2 size={13} /> মুছে ফেলুন
        </button>
      )}

      {error && <p className="mt-1.5 text-xs text-price">{error}</p>}
    </div>
  );
}

export function MediaAdmin({
  initialProducts,
  initialBlog,
}: {
  initialProducts: ProductListItem[];
  initialBlog: BlogListItem[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"products" | "blog">("products");
  const [products, setProducts] = useState(initialProducts);
  const [blog, setBlog] = useState(initialBlog);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | ProductCategory>("all");
  const [selected, setSelected] = useState<string | null>(null);

  function switchTab(next: "products" | "blog") {
    setTab(next);
    setSelected(null);
  }

  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (search.trim() && !p.title.toLowerCase().includes(search.trim().toLowerCase())) return false;
    return true;
  });
  const filteredBlog = blog.filter(
    (p) => !search.trim() || p.title.toLowerCase().includes(search.trim().toLowerCase())
  );

  const selectedProduct = tab === "products" ? products.find((p) => p.slug === selected) ?? null : null;
  const selectedBlog = tab === "blog" ? blog.find((p) => p.slug === selected) ?? null : null;

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">ছবি ও ভিডিও নিয়ন্ত্রণ</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            বামের লিস্ট থেকে একটা প্রোডাক্ট বা ব্লগ পোস্ট বেছে নিন, তারপর ফাইল ড্র্যাগ করে বক্সে ছেড়ে দিন — সাথে
            সাথে সাইটের সব জায়গায় (কার্ড, হোমপেজ, ডিটেইল পেজ, কার্ট) নতুন ছবি/ভিডিও দেখাবে। ছবি না দিলে আগের মতোই
            রঙিন আইকন দেখাবে। এটা শুধু সেই একটা প্রোডাক্ট/পোস্টের জন্যই প্রযোজ্য হবে।
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:bg-surface-muted"
        >
          <LogOut size={14} /> লগআউট
        </button>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => switchTab("products")}
          className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
            tab === "products" ? "border-primary bg-primary-light text-primary-dark" : "border-border text-ink-soft"
          }`}
        >
          প্রোডাক্ট (বই/ইবুক/গিয়ার)
        </button>
        <button
          type="button"
          onClick={() => switchTab("blog")}
          className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
            tab === "blog" ? "border-primary bg-primary-light text-primary-dark" : "border-border text-ink-soft"
          }`}
        >
          ব্লগ পোস্ট
        </button>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[320px_1fr]">
        {/* Picker */}
        <div className="rounded-lg border border-border bg-surface">
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="খুঁজুন..."
                className="w-full rounded-md border border-border py-1.5 pl-8 pr-2.5 text-xs outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            {tab === "products" && (
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
            )}
          </div>
          <div className="max-h-[560px] overflow-y-auto">
            {tab === "products" &&
              filteredProducts.map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setSelected(p.slug)}
                  className={`flex w-full items-center gap-2 border-b border-border px-3 py-2.5 text-left text-xs transition last:border-b-0 hover:bg-surface-muted ${
                    selected === p.slug ? "bg-primary-light/60" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{p.title}</p>
                    <p className="text-[10px] text-ink-faint">{CATEGORY_LABEL[p.category]}</p>
                  </div>
                  {(p.hasImage || p.hasVideo) && (
                    <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-cta-light px-1.5 py-0.5 text-[9px] font-bold text-cta-dark">
                      <Sparkles size={9} /> মিডিয়া
                    </span>
                  )}
                </button>
              ))}
            {tab === "blog" &&
              filteredBlog.map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setSelected(p.slug)}
                  className={`flex w-full items-center gap-2 border-b border-border px-3 py-2.5 text-left text-xs transition last:border-b-0 hover:bg-surface-muted ${
                    selected === p.slug ? "bg-primary-light/60" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{p.title}</p>
                  </div>
                  {p.hasImage && (
                    <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-cta-light px-1.5 py-0.5 text-[9px] font-bold text-cta-dark">
                      <Sparkles size={9} /> মিডিয়া
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
              বাম থেকে একটা প্রোডাক্ট বা ব্লগ পোস্ট বেছে নিন
            </div>
          )}

          {selectedProduct && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface-muted px-4 py-3">
                <p className="text-sm font-bold text-foreground">{selectedProduct.title}</p>
                <a
                  href={`${CATEGORY_PATH[selectedProduct.category]}/${selectedProduct.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-primary hover:border-primary"
                >
                  লাইভ পেজ দেখুন <ExternalLink size={11} />
                </a>
              </div>

              <MediaSlot
                key={`${selectedProduct.slug}-image`}
                label="কভার ছবি"
                endpoint={`/api/admin/media/products/${selectedProduct.slug}/image`}
                previewUrl={`/api/media/product-image/${selectedProduct.slug}`}
                accept="image/*,.jpg,.jpeg,.png,.webp,.gif"
                hint="jpg, png, webp, gif — সর্বোচ্চ ৮ এমবি"
                kind="image"
                hasMedia={selectedProduct.hasImage}
                onChanged={(has) =>
                  setProducts((prev) => prev.map((p) => (p.slug === selectedProduct.slug ? { ...p, hasImage: has } : p)))
                }
              />

              <MediaSlot
                key={`${selectedProduct.slug}-video`}
                label="প্রোডাক্ট ভিডিও"
                endpoint={`/api/admin/media/products/${selectedProduct.slug}/video`}
                previewUrl={`/api/media/product-video/${selectedProduct.slug}`}
                accept="video/*,.mp4,.webm,.mov"
                hint="mp4, webm, mov — সর্বোচ্চ ৬০ এমবি"
                kind="video"
                hasMedia={selectedProduct.hasVideo}
                onChanged={(has) =>
                  setProducts((prev) => prev.map((p) => (p.slug === selectedProduct.slug ? { ...p, hasVideo: has } : p)))
                }
              />

              {selectedProduct.category === "gear" && (
                <p className="text-[11px] text-ink-faint">
                  গিয়ারের ৫টা অ্যাঙ্গেল-ছবির স্লাইডারে (সামনে/পাশ/উপর ইত্যাদি) আপাতত এই একই কভার ছবিটা সবগুলো
                  অ্যাঙ্গেলে দেখাবে — প্রতিটা অ্যাঙ্গেলের জন্য আলাদা ছবি আপলোডের সুবিধা এখনো তৈরি হয়নি।
                </p>
              )}
            </div>
          )}

          {selectedBlog && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface-muted px-4 py-3">
                <p className="text-sm font-bold text-foreground">{selectedBlog.title}</p>
                <a
                  href={`/blog/${selectedBlog.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-primary hover:border-primary"
                >
                  লাইভ পেজ দেখুন <ExternalLink size={11} />
                </a>
              </div>

              <MediaSlot
                key={`${selectedBlog.slug}-image`}
                label="কভার ছবি"
                endpoint={`/api/admin/media/blog/${selectedBlog.slug}/image`}
                previewUrl={`/api/media/blog-image/${selectedBlog.slug}`}
                accept="image/*,.jpg,.jpeg,.png,.webp,.gif"
                hint="jpg, png, webp, gif — সর্বোচ্চ ৮ এমবি"
                kind="image"
                hasMedia={selectedBlog.hasImage}
                onChanged={(has) =>
                  setBlog((prev) => prev.map((p) => (p.slug === selectedBlog.slug ? { ...p, hasImage: has } : p)))
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
