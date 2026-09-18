"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Search, Sparkles, Check, Plus, X, RotateCcw, ExternalLink } from "lucide-react";

type ProductCategory = "book" | "ebook" | "gear";

interface ProductListItem {
  slug: string;
  title: string;
  category: ProductCategory;
  customized: boolean;
}
interface BlogListItem {
  slug: string;
  title: string;
  customized: boolean;
}

interface ProductForm {
  title: string;
  author: string;
  shortDescription: string;
  description: string;
  bullets: string[];
  badge: string;
  category: ProductCategory;
}
interface BlogForm {
  title: string;
  excerpt: string;
  content: string[];
  author: string;
  category: string;
}

const CATEGORY_LABEL: Record<ProductCategory, string> = { book: "বই", ebook: "ইবুক", gear: "গিয়ার" };
const CATEGORY_PATH: Record<ProductCategory, string> = { book: "/books", ebook: "/ebooks", gear: "/gear" };

export function ContentTextAdmin({
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
  const [productForm, setProductForm] = useState<ProductForm | null>(null);
  const [blogForm, setBlogForm] = useState<BlogForm | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customized, setCustomized] = useState(false);

  function switchTab(next: "products" | "blog") {
    setTab(next);
    setSelected(null);
    setProductForm(null);
    setBlogForm(null);
    setSaved(false);
    setError(null);
  }

  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (search.trim() && !p.title.toLowerCase().includes(search.trim().toLowerCase())) return false;
    return true;
  });
  const filteredBlog = blog.filter(
    (p) => !search.trim() || p.title.toLowerCase().includes(search.trim().toLowerCase())
  );

  async function selectProduct(slug: string) {
    setSelected(slug);
    setProductForm(null);
    setSaved(false);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content-text/products/${slug}`);
      const data = await res.json();
      const c = data.current;
      setProductForm({
        title: c.title,
        author: c.author ?? "",
        shortDescription: c.shortDescription,
        description: c.description,
        bullets: c.bullets ?? [],
        badge: c.badge ?? "",
        category: c.category,
      });
      setCustomized(data.customized);
    } catch {
      setError("লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  }

  async function selectBlog(slug: string) {
    setSelected(slug);
    setBlogForm(null);
    setSaved(false);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content-text/blog/${slug}`);
      const data = await res.json();
      const c = data.current;
      setBlogForm({
        title: c.title,
        excerpt: c.excerpt,
        content: c.content ?? [],
        author: c.author,
        category: c.category,
      });
      setCustomized(data.customized);
    } catch {
      setError("লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  }

  async function saveProduct() {
    if (!selected || !productForm) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/content-text/products/${selected}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: productForm.title,
          author: productForm.author,
          shortDescription: productForm.shortDescription,
          description: productForm.description,
          bullets: productForm.bullets,
          badge: productForm.badge,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "সংরক্ষণ করা যায়নি");
        return;
      }
      setSaved(true);
      setCustomized(true);
      setProducts((prev) => prev.map((p) => (p.slug === selected ? { ...p, title: productForm.title, customized: true } : p)));
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("সংরক্ষণ করা যায়নি — ইন্টারনেট সংযোগ চেক করুন");
    } finally {
      setSaving(false);
    }
  }

  async function saveBlog() {
    if (!selected || !blogForm) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/content-text/blog/${selected}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: blogForm.title,
          excerpt: blogForm.excerpt,
          content: blogForm.content,
          author: blogForm.author,
          category: blogForm.category,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "সংরক্ষণ করা যায়নি");
        return;
      }
      setSaved(true);
      setCustomized(true);
      setBlog((prev) => prev.map((p) => (p.slug === selected ? { ...p, title: blogForm.title, customized: true } : p)));
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("সংরক্ষণ করা যায়নি — ইন্টারনেট সংযোগ চেক করুন");
    } finally {
      setSaving(false);
    }
  }

  async function resetItem() {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      const endpoint = tab === "products" ? "products" : "blog";
      const res = await fetch(`/api/admin/content-text/${endpoint}/${selected}`, { method: "DELETE" });
      if (!res.ok) {
        setError("রিসেট করা যায়নি");
        return;
      }
      setSaved(false);
      if (tab === "products") {
        setProducts((prev) => prev.map((p) => (p.slug === selected ? { ...p, customized: false } : p)));
        await selectProduct(selected);
      } else {
        setBlog((prev) => prev.map((p) => (p.slug === selected ? { ...p, customized: false } : p)));
        await selectBlog(selected);
      }
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

  const fieldClass =
    "w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">টেক্সট কনটেন্ট নিয়ন্ত্রণ</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            বামের লিস্ট থেকে একটা প্রোডাক্ট বা ব্লগ পোস্ট বেছে নিন, তারপর শিরোনাম, বিবরণ, বুলেট পয়েন্ট ইত্যাদি
            ফিল্ড সরাসরি এডিট করে সংরক্ষণ করুন — কোনো কোড ছোঁয়া লাগবে না। এটা শুধু সেই একটা প্রোডাক্ট/পোস্টের জন্যই
            প্রযোজ্য হবে, বাকিগুলো অপরিবর্তিত থাকবে।
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
                  onClick={() => selectProduct(p.slug)}
                  className={`flex w-full items-center gap-2 border-b border-border px-3 py-2.5 text-left text-xs transition last:border-b-0 hover:bg-surface-muted ${
                    selected === p.slug ? "bg-primary-light/60" : ""
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
            {tab === "blog" &&
              filteredBlog.map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => selectBlog(p.slug)}
                  className={`flex w-full items-center gap-2 border-b border-border px-3 py-2.5 text-left text-xs transition last:border-b-0 hover:bg-surface-muted ${
                    selected === p.slug ? "bg-primary-light/60" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{p.title}</p>
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

        {/* Form panel */}
        <div>
          {!selected && (
            <div className="flex h-full min-h-[300px] items-center justify-center rounded-lg border border-dashed border-border text-sm text-ink-faint">
              বাম থেকে একটা আইটেম বেছে নিন
            </div>
          )}

          {selected && loading && <p className="text-sm text-ink-soft">লোড হচ্ছে...</p>}

          {selected && !loading && tab === "products" && productForm && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface-muted px-4 py-3">
                <p className="text-sm font-bold text-foreground">{productForm.title}</p>
                <a
                  href={`${CATEGORY_PATH[productForm.category]}/${selected}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-primary hover:border-primary"
                >
                  লাইভ পেজ দেখুন <ExternalLink size={11} />
                </a>
              </div>

              <label className="block text-xs font-medium text-ink-soft">
                শিরোনাম
                <input
                  className={`mt-1 ${fieldClass}`}
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                />
              </label>

              {productForm.category !== "gear" && (
                <label className="block text-xs font-medium text-ink-soft">
                  লেখক
                  <input
                    className={`mt-1 ${fieldClass}`}
                    value={productForm.author}
                    onChange={(e) => setProductForm({ ...productForm, author: e.target.value })}
                  />
                </label>
              )}

              <label className="block text-xs font-medium text-ink-soft">
                সংক্ষিপ্ত বিবরণ
                <textarea
                  rows={2}
                  className={`mt-1 ${fieldClass}`}
                  value={productForm.shortDescription}
                  onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                />
              </label>

              <label className="block text-xs font-medium text-ink-soft">
                বিস্তারিত বিবরণ
                <textarea
                  rows={4}
                  className={`mt-1 ${fieldClass}`}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                />
              </label>

              <div>
                <span className="mb-1.5 block text-xs font-medium text-ink-soft">বুলেট পয়েন্ট</span>
                <p className="mb-1.5 text-[11px] text-ink-faint">
                  এটা মূল পেজে না দেখিয়ে &ldquo;একটু পড়ে দেখুন&rdquo; প্রিভিউ পপআপে দেখানো হয়
                </p>
                <div className="flex flex-col gap-2">
                  {productForm.bullets.map((b, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        className={fieldClass}
                        value={b}
                        onChange={(e) => {
                          const bullets = [...productForm.bullets];
                          bullets[i] = e.target.value;
                          setProductForm({ ...productForm, bullets });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setProductForm({ ...productForm, bullets: productForm.bullets.filter((_, idx) => idx !== i) })}
                        aria-label="মুছে ফেলুন"
                        className="shrink-0 rounded-md border border-border p-2 text-ink-faint hover:border-price hover:text-price"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setProductForm({ ...productForm, bullets: [...productForm.bullets, ""] })}
                    className="flex w-fit items-center gap-1 rounded-md border border-dashed border-border px-3 py-1.5 text-xs font-medium text-ink-soft hover:border-primary hover:text-primary"
                  >
                    <Plus size={13} /> বুলেট যোগ করুন
                  </button>
                </div>
              </div>

              <label className="block text-xs font-medium text-ink-soft">
                ব্যাজ (ঐচ্ছিক)
                <input
                  className={`mt-1 ${fieldClass}`}
                  value={productForm.badge}
                  onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                />
              </label>

              {error && <p className="text-sm text-price">{error}</p>}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={saveProduct}
                  disabled={saving}
                  className="rounded-md bg-cta px-5 py-2.5 text-sm font-semibold text-white hover:bg-cta-dark disabled:opacity-60"
                >
                  {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                </button>
                <button
                  type="button"
                  onClick={resetItem}
                  disabled={saving || !customized}
                  className="flex items-center gap-1.5 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-surface-muted disabled:opacity-40"
                >
                  <RotateCcw size={14} /> মূল লেখায় ফিরে যান
                </button>
                {saved && (
                  <span className="flex items-center gap-1 text-sm font-medium text-success">
                    <Check size={15} /> সংরক্ষিত হয়েছে
                  </span>
                )}
              </div>
            </div>
          )}

          {selected && !loading && tab === "blog" && blogForm && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface-muted px-4 py-3">
                <p className="text-sm font-bold text-foreground">{blogForm.title}</p>
                <a
                  href={`/blog/${selected}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-primary hover:border-primary"
                >
                  লাইভ পেজ দেখুন <ExternalLink size={11} />
                </a>
              </div>

              <label className="block text-xs font-medium text-ink-soft">
                শিরোনাম
                <input
                  className={`mt-1 ${fieldClass}`}
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-medium text-ink-soft">
                  লেখক
                  <input
                    className={`mt-1 ${fieldClass}`}
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                  />
                </label>
                <label className="block text-xs font-medium text-ink-soft">
                  ক্যাটাগরি
                  <input
                    className={`mt-1 ${fieldClass}`}
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                  />
                </label>
              </div>

              <label className="block text-xs font-medium text-ink-soft">
                সংক্ষিপ্তসার
                <textarea
                  rows={2}
                  className={`mt-1 ${fieldClass}`}
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                />
              </label>

              <div>
                <span className="mb-1.5 block text-xs font-medium text-ink-soft">মূল লেখা (অনুচ্ছেদ অনুযায়ী)</span>
                <div className="flex flex-col gap-2">
                  {blogForm.content.map((para, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <textarea
                        rows={3}
                        className={fieldClass}
                        value={para}
                        onChange={(e) => {
                          const content = [...blogForm.content];
                          content[i] = e.target.value;
                          setBlogForm({ ...blogForm, content });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setBlogForm({ ...blogForm, content: blogForm.content.filter((_, idx) => idx !== i) })}
                        aria-label="মুছে ফেলুন"
                        className="shrink-0 rounded-md border border-border p-2 text-ink-faint hover:border-price hover:text-price"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setBlogForm({ ...blogForm, content: [...blogForm.content, ""] })}
                    className="flex w-fit items-center gap-1 rounded-md border border-dashed border-border px-3 py-1.5 text-xs font-medium text-ink-soft hover:border-primary hover:text-primary"
                  >
                    <Plus size={13} /> অনুচ্ছেদ যোগ করুন
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-price">{error}</p>}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={saveBlog}
                  disabled={saving}
                  className="rounded-md bg-cta px-5 py-2.5 text-sm font-semibold text-white hover:bg-cta-dark disabled:opacity-60"
                >
                  {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                </button>
                <button
                  type="button"
                  onClick={resetItem}
                  disabled={saving || !customized}
                  className="flex items-center gap-1.5 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-surface-muted disabled:opacity-40"
                >
                  <RotateCcw size={14} /> মূল লেখায় ফিরে যান
                </button>
                {saved && (
                  <span className="flex items-center gap-1 text-sm font-medium text-success">
                    <Check size={15} /> সংরক্ষিত হয়েছে
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
