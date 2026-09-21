"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GripVertical, ChevronUp, ChevronDown, RotateCcw, LogOut, Check, Eye, EyeOff } from "lucide-react";

interface NavMenuEntry {
  key: string;
  label: string;
  href: string;
  hidden: boolean;
}

export function NavMenuAdmin({ initialItems }: { initialItems: NavMenuEntry[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveOrder(nextItems: NavMenuEntry[]) {
    setSavingOrder(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/nav-menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: nextItems.map((it) => it.key) }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error || "ক্রম সংরক্ষণ করা যায়নি");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("সংরক্ষণ করা যায়নি — ইন্টারনেট সংযোগ চেক করুন");
    } finally {
      setSavingOrder(false);
    }
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= items.length) return;
    setItems((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      saveOrder(next);
      return next;
    });
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      return;
    }
    setItems((prev) => {
      const next = [...prev];
      const [item] = next.splice(dragIndex, 1);
      next.splice(targetIndex, 0, item);
      saveOrder(next);
      return next;
    });
    setDragIndex(null);
  }

  async function toggleHidden(key: string) {
    const current = items.find((it) => it.key === key);
    if (!current) return;
    const nextHidden = !current.hidden;
    setSavingKey(key);
    setError(null);
    try {
      const res = await fetch(`/api/admin/nav-menu/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hidden: nextHidden }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error || "আপডেট করা যায়নি");
        return;
      }
      setItems((prev) => prev.map((it) => (it.key === key ? { ...it, hidden: nextHidden } : it)));
    } catch {
      setError("আপডেট করা যায়নি — ইন্টারনেট সংযোগ চেক করুন");
    } finally {
      setSavingKey(null);
    }
  }

  async function resetAll() {
    setResetting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/nav-menu", { method: "DELETE" });
      if (!res.ok) {
        setError("রিসেট করা যায়নি");
        return;
      }
      const refreshed = await fetch("/api/admin/nav-menu");
      const data = await refreshed.json();
      setItems(data.items);
    } catch {
      setError("রিসেট করা যায়নি — ইন্টারনেট সংযোগ চেক করুন");
    } finally {
      setResetting(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const visibleCount = items.filter((it) => !it.hidden).length;

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">হেডার মেনু নিয়ন্ত্রণ</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            যে ফিচার এখনো লঞ্চ করতে চান না, সেটার চোখ-আইকনে ক্লিক করে হেডার মেনু থেকে লুকিয়ে ফেলুন — পেজটা তখনো
            ঠিকানা (URL) দিয়ে সরাসরি খোলা যাবে, শুধু মেনুতে দেখাবে না। টেনে (ড্র্যাগ) বা তীর বাটন দিয়ে মেনুর ক্রমও
            বদলাতে পারবেন। পরিবর্তন সাথে সাথে সাইটে লাইভ হয়ে যাবে।
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:bg-surface-muted"
        >
          <LogOut size={14} /> লগআউট
        </button>
      </div>

      <div className="mt-6 max-w-2xl">
        <div className="flex flex-col gap-2">
          {items.map((item, index) => (
            <div
              key={item.key}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
              onDragEnd={() => setDragIndex(null)}
              className={`flex items-center gap-3 rounded-lg border p-3 transition ${
                dragIndex === index ? "opacity-40" : "border-border"
              } ${item.hidden ? "bg-surface-muted" : "bg-surface"}`}
            >
              <span className="cursor-grab text-ink-faint active:cursor-grabbing" aria-hidden="true">
                <GripVertical size={18} />
              </span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary-dark">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium ${item.hidden ? "text-ink-faint line-through" : "text-foreground"}`}>
                  {item.label}
                </p>
                <p className="text-[11px] text-ink-faint">{item.href}</p>
                {item.hidden && <p className="text-[11px] font-medium text-price">লুকানো — মেনুতে দেখাবে না</p>}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  aria-label={item.hidden ? "মেনুতে দেখান" : "মেনু থেকে লুকান"}
                  onClick={() => toggleHidden(item.key)}
                  disabled={savingKey === item.key}
                  className={`rounded-md border p-1.5 ${
                    item.hidden
                      ? "border-price/40 bg-price/10 text-price"
                      : "border-border text-ink-soft hover:border-primary hover:text-primary"
                  } disabled:opacity-50`}
                >
                  {item.hidden ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button
                  type="button"
                  aria-label="উপরে সরান"
                  disabled={index === 0 || savingOrder}
                  onClick={() => move(index, index - 1)}
                  className="rounded-md border border-border p-1.5 text-ink-soft hover:border-primary hover:text-primary disabled:opacity-30"
                >
                  <ChevronUp size={15} />
                </button>
                <button
                  type="button"
                  aria-label="নিচে সরান"
                  disabled={index === items.length - 1 || savingOrder}
                  onClick={() => move(index, index + 1)}
                  className="rounded-md border border-border p-1.5 text-ink-soft hover:border-primary hover:text-primary disabled:opacity-30"
                >
                  <ChevronDown size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {error && <p className="mt-3 text-sm text-price">{error}</p>}

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={resetAll}
            disabled={resetting}
            className="flex items-center gap-1.5 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-surface-muted disabled:opacity-40"
          >
            <RotateCcw size={14} /> সব মেনু আবার দেখান ও ডিফল্ট ক্রমে ফিরে যান
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-sm font-medium text-success">
              <Check size={15} /> সংরক্ষিত হয়েছে
            </span>
          )}
        </div>

        <p className="mt-3 text-[11px] text-ink-faint">
          বর্তমানে {visibleCount} টি মেনু আইটেম মেনুতে দেখানো হচ্ছে — অন্তত একটা মেনু আইটেম দেখানো থাকতেই হবে।
        </p>
      </div>
    </div>
  );
}
