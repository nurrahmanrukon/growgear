"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileText, Headphones, Layers, LogOut } from "lucide-react";

type ContentFormat = "text" | "audio";
type PostRow = { slug: string; title: string; topicSlug: string; formats: ContentFormat[] };

const OPTIONS: { id: ContentFormat[]; label: string; icon: typeof FileText }[] = [
  { id: ["text"], label: "শুধু টেক্সট", icon: FileText },
  { id: ["audio"], label: "শুধু অডিও", icon: Headphones },
  { id: ["text", "audio"], label: "উভয়ই", icon: Layers },
];

function sameFormats(a: ContentFormat[], b: ContentFormat[]) {
  return a.length === b.length && a.every((f) => b.includes(f));
}

export function BlogFormatsAdmin({ initialPosts }: { initialPosts: PostRow[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);

  async function updateFormats(slug: string, formats: ContentFormat[]) {
    setSavingSlug(slug);
    const prev = posts;
    setPosts((p) => p.map((row) => (row.slug === slug ? { ...row, formats } : row)));
    try {
      const res = await fetch(`/api/admin/blog-formats/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formats }),
      });
      if (!res.ok) setPosts(prev);
    } catch {
      setPosts(prev);
    } finally {
      setSavingSlug(null);
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
          <h1 className="font-display text-xl font-bold text-foreground">ব্লগ ফরম্যাট নিয়ন্ত্রণ</h1>
          <p className="mt-1 text-sm text-ink-soft">
            প্রতিটি লেখার জন্য বেছে নিন — পাঠকরা শুধু টেক্সট পড়তে পারবে, শুধু অডিও শুনতে পারবে, নাকি দুটোই পাবে।
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:bg-surface-muted"
        >
          <LogOut size={14} /> লগআউট
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-muted text-xs text-ink-faint">
            <tr>
              <th className="px-4 py-2.5 font-medium">লেখার শিরোনাম</th>
              <th className="px-4 py-2.5 font-medium">উপলব্ধ ফরম্যাট</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.slug} className="border-t border-border">
                <td className="px-4 py-3 text-foreground">{post.title}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const active = sameFormats(post.formats, opt.id);
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          disabled={savingSlug === post.slug}
                          onClick={() => updateFormats(post.slug, opt.id)}
                          className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
                            active
                              ? "border-primary bg-primary-light text-primary-dark"
                              : "border-border text-ink-soft hover:border-primary/50"
                          }`}
                        >
                          <Icon size={13} /> {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
