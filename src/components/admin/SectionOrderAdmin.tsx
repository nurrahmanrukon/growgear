"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GripVertical, ChevronUp, ChevronDown, RotateCcw, ExternalLink, LogOut, Check } from "lucide-react";

interface SectionMeta {
  key: string;
  label: string;
  note?: string;
}

const PREVIEW_LINKS = [
  { label: "বই প্রিভিউ", href: "/books/book-1" },
  { label: "ইবুক প্রিভিউ", href: "/ebooks/ebook-1" },
  { label: "গিয়ার প্রিভিউ", href: "/gear/gear-1" },
];

export function SectionOrderAdmin({
  initialOrder,
  catalog,
}: {
  initialOrder: string[];
  catalog: SectionMeta[];
}) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const byKey = new Map(catalog.map((s) => [s.key, s]));

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

  async function save(newOrder: string[]) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/section-order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newOrder }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error || "সংরক্ষণ করা যায়নি");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("সংরক্ষণ করা যায়নি — ইন্টারনেট সংযোগ চেক করুন");
    } finally {
      setSaving(false);
    }
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      return;
    }
    setOrder((prev) => {
      const next = [...prev];
      const [item] = next.splice(dragIndex, 1);
      next.splice(targetIndex, 0, item);
      return next;
    });
    setDragIndex(null);
    setSaved(false);
  }

  async function handleReset() {
    const defaultOrder = catalog.map((s) => s.key);
    setOrder(defaultOrder);
    await save(defaultOrder);
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
            নিচের সেকশনগুলো টেনে (ড্র্যাগ করে) বা তীর বাটন দিয়ে উপরে-নিচে সাজান। এই অর্ডার বই, ইবুক ও গিয়ার — তিন
            ধরনের প্রোডাক্ট পেজেই একইভাবে প্রযোজ্য হবে। ডিজাইন একই থাকবে, শুধু সেকশনের ক্রম বদলাবে।
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:bg-surface-muted"
        >
          <LogOut size={14} /> লগআউট
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface-muted px-4 py-3">
        <span className="text-xs font-medium text-ink-soft">লাইভ পেজে দেখুন:</span>
        {PREVIEW_LINKS.map((p) => (
          <a
            key={p.href}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-primary hover:border-primary"
          >
            {p.label} <ExternalLink size={11} />
          </a>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {order.map((key, index) => {
          const meta = byKey.get(key);
          if (!meta) return null;
          return (
            <div
              key={key}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
              onDragEnd={() => setDragIndex(null)}
              className={`flex items-center gap-3 rounded-lg border bg-surface p-3 transition ${
                dragIndex === index ? "opacity-40" : "border-border"
              }`}
            >
              <span className="cursor-grab text-ink-faint active:cursor-grabbing" aria-hidden="true">
                <GripVertical size={18} />
              </span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary-dark">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{meta.label}</p>
                {meta.note && <p className="text-[11px] text-ink-faint">{meta.note}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-1">
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
          onClick={() => save(order)}
          disabled={saving}
          className="rounded-md bg-cta px-5 py-2.5 text-sm font-semibold text-white hover:bg-cta-dark disabled:opacity-60"
        >
          {saving ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={saving}
          className="flex items-center gap-1.5 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-surface-muted disabled:opacity-60"
        >
          <RotateCcw size={14} /> ডিফল্ট অর্ডারে ফিরে যান
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-sm font-medium text-success">
            <Check size={15} /> সংরক্ষিত হয়েছে
          </span>
        )}
      </div>
    </div>
  );
}
