"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Check, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { TOPICS } from "@/lib/data/blog";
import { BlogTopicSlug } from "@/lib/types";

const LABEL_BY_SLUG = new Map(TOPICS.map((t) => [t.slug, t.label]));

export function BlogTopicOrderAdmin({ initial }: { initial: { order: BlogTopicSlug[] } }) {
  const router = useRouter();
  const [order, setOrder] = useState<BlogTopicSlug[]>(initial.order);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function move(from: number, to: number) {
    if (to < 0 || to >= order.length) return;
    setOrder((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
    setSaved(false);
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      return;
    }
    move(dragIndex, targetIndex);
    setDragIndex(null);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/blog-topic-order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "সংরক্ষণ করা যায়নি");
        return;
      }
      setOrder(data.order);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("সংরক্ষণ করা যায়নি — ইন্টারনেট সংযোগ চেক করুন");
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
          <h1 className="font-display text-xl font-bold text-foreground">ব্লগ বিষয়ের ক্রম</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            হোমপেজের বিষয়ভিত্তিক টাইলস, ব্লগ পেজের টপ নেভিগেশন ও বিষয়ভিত্তিক সেকশনগুলো কোন ক্রমে দেখাবে তা এখান থেকে
            টানা-ছাড়া (ড্র্যাগ) করে সাজাতে পারবেন।
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:bg-surface-muted"
        >
          <LogOut size={14} /> লগআউট
        </button>
      </div>

      <div className="mt-6 max-w-md space-y-2">
        {order.map((slug, i) => (
          <div
            key={slug}
            draggable
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(i)}
            onDragEnd={() => setDragIndex(null)}
            className={`flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3 transition ${
              dragIndex === i ? "opacity-40" : ""
            }`}
          >
            <span className="flex items-center gap-2 text-sm font-medium text-foreground">
              <span className="shrink-0 cursor-grab text-ink-faint active:cursor-grabbing" aria-hidden="true">
                <GripVertical size={14} />
              </span>
              {LABEL_BY_SLUG.get(slug) ?? slug}
            </span>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                aria-label="উপরে সরান"
                disabled={i === 0}
                onClick={() => move(i, i - 1)}
                className="rounded-md border border-border p-1.5 text-ink-soft hover:border-primary hover:text-primary disabled:opacity-30"
              >
                <ChevronUp size={12} />
              </button>
              <button
                type="button"
                aria-label="নিচে সরান"
                disabled={i === order.length - 1}
                onClick={() => move(i, i + 1)}
                className="rounded-md border border-border p-1.5 text-ink-soft hover:border-primary hover:text-primary disabled:opacity-30"
              >
                <ChevronDown size={12} />
              </button>
            </div>
          </div>
        ))}

        {error && <p className="text-sm text-price">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-md bg-cta px-5 py-2.5 text-sm font-semibold text-white hover:bg-cta-dark disabled:opacity-60"
          >
            {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-sm font-medium text-success">
              <Check size={15} /> সংরক্ষিত হয়েছে
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
