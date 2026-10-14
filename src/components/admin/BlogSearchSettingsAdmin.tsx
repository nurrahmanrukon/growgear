"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Search, SearchX } from "lucide-react";

export function BlogSearchSettingsAdmin({ initial }: { initial: { enabled: boolean } }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initial.enabled);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle(next: boolean) {
    if (next === enabled) return;
    setEnabled(next);
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/blog-search-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: next }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setEnabled(!next);
        setError(body?.error || "সংরক্ষণ করা যায়নি");
        return;
      }
    } catch {
      setEnabled(!next);
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
          <h1 className="font-display text-xl font-bold text-foreground">ব্লগ সার্চ</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            ব্লগ পেজের উপরে &ldquo;বিষয় বা লেখা সার্চ করুন&rdquo; বক্সটা এখান থেকে চালু/বন্ধ করতে পারবেন। লেখার
            সংখ্যা কম থাকলে বন্ধ রাখাই ভালো — লেখা বেশি হলে চালু করে দিন।
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:bg-surface-muted"
        >
          <LogOut size={14} /> লগআউট
        </button>
      </div>

      <div className="mt-6 max-w-xl">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => toggle(true)}
            disabled={saving}
            className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center ${
              enabled ? "border-cta bg-cta-light" : "border-border hover:border-cta/50"
            } disabled:opacity-50`}
          >
            <Search size={18} className={enabled ? "text-cta-dark" : "text-ink-faint"} />
            <span className="text-xs font-semibold text-foreground">চালু আছে</span>
            <span className="text-[10px] text-ink-faint">ব্লগ পেজে সার্চ বক্স দেখাবে</span>
          </button>
          <button
            type="button"
            onClick={() => toggle(false)}
            disabled={saving}
            className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center ${
              !enabled ? "border-price bg-price/10" : "border-border hover:border-price/50"
            } disabled:opacity-50`}
          >
            <SearchX size={18} className={!enabled ? "text-price" : "text-ink-faint"} />
            <span className="text-xs font-semibold text-foreground">বন্ধ</span>
            <span className="text-[10px] text-ink-faint">সার্চ বক্স দেখাবে না</span>
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-price">{error}</p>}
      </div>
    </div>
  );
}
