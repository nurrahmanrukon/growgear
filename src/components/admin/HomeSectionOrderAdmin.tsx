"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { GripVertical, ChevronUp, ChevronDown, RotateCcw, ExternalLink, LogOut, Check, Eye, EyeOff } from "lucide-react";

interface HomeSectionMeta {
  key: string;
  label: string;
  note?: string;
}

export function HomeSectionOrderAdmin({
  catalog,
  initialOrder,
  initialHidden,
  initialCustomized,
}: {
  catalog: HomeSectionMeta[];
  initialOrder: string[];
  initialHidden: string[];
  initialCustomized: boolean;
}) {
  const router = useRouter();
  const [order, setOrder] = useState<string[]>(initialOrder);
  const [hidden, setHidden] = useState<Set<string>>(new Set(initialHidden));
  const [customized, setCustomized] = useState(initialCustomized);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const byKey = useMemo(() => new Map(catalog.map((s) => [s.key, s])), [catalog]);

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
    setOrder((prev) => {
      const next = [...prev];
      const [item] = next.splice(dragIndex, 1);
      next.splice(targetIndex, 0, item);
      return next;
    });
    setDragIndex(null);
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/home-sections", {
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
      setCustomized(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("সংরক্ষণ করা যায়নি — ইন্টারনেট সংযোগ চেক করুন");
    } finally {
      setSaving(false);
    }
  }

  async function resetToDefault() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/home-sections", { method: "DELETE" });
      if (!res.ok) {
        setError("রিসেট করা যায়নি");
        return;
      }
      setOrder(catalog.map((s) => s.key));
      setHidden(new Set());
      setCustomized(false);
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
          <h1 className="font-display text-xl font-bold text-foreground">হোমপেজ সেকশন সাজান</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            হোমপেজের বড় ব্লকগুলো (হিরো ব্যানার, বেস্ট সেলার, কোর্স সেকশন ইত্যাদি) টেনে (ড্র্যাগ) বা তীর বাটন দিয়ে
            সাজান — আর চোখ-আইকনে ক্লিক করে যেকোনো সেকশন লুকিয়েও ফেলতে পারবেন, তাহলে ভিজিটররা সেটা হোমপেজে দেখবে না।
            ডিজাইন একই থাকবে, শুধু সেকশনের ক্রম ও দৃশ্যমানতা বদলাবে।
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-primary hover:border-primary"
          >
            লাইভ হোমপেজ দেখুন <ExternalLink size={11} />
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:bg-surface-muted"
          >
            <LogOut size={14} /> লগআউট
          </button>
        </div>
      </div>

      <div className="mt-6 max-w-2xl">
        <div className="flex flex-col gap-2">
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
                  <p className={`text-sm font-medium ${isHidden ? "text-ink-faint line-through" : "text-foreground"}`}>
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
            {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
          </button>
          <button
            type="button"
            onClick={resetToDefault}
            disabled={saving || !customized}
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
      </div>
    </div>
  );
}
