"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Check } from "lucide-react";

interface CouponSettings {
  enabled: boolean;
  code: string;
  discountPercent: number;
}

const fieldClass =
  "w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary";

export function CouponAdmin({ initial }: { initial: CouponSettings }) {
  const router = useRouter();
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof CouponSettings>(field: K, value: CouponSettings[K]) {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/coupon", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "সংরক্ষণ করা যায়নি");
        return;
      }
      setSettings(data);
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
          <h1 className="font-display text-xl font-bold text-foreground">ডিসকাউন্ট কুপন</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            অর্ডার ফর্মে (প্রথম, দ্বিতীয়, তৃতীয় — সব কেনাকাটার ধাপে) একটা কুপন কোড বক্স দেখাবে, যেখানে কাস্টমার
            কোড লিখে ছাড় পেতে পারেন। নিচের টগল বন্ধ রাখলে এই বক্সটা কোথাও দেখা যাবে না — শুধু যখন চালু করবেন,
            তখনই দেখা যাবে। কোড ও ছাড়ের পরিমাণ যেকোনো সময় বদলাতে পারবেন।
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:bg-surface-muted"
        >
          <LogOut size={14} /> লগআউট
        </button>
      </div>

      <div className="mt-6 max-w-xl space-y-5">
        <div>
          <span className="mb-1.5 block text-xs text-ink-soft">কুপন বক্স দেখাবেন কিনা</span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => update("enabled", true)}
              disabled={saving}
              className={`rounded-lg border p-3 text-center ${
                settings.enabled ? "border-cta bg-cta-light" : "border-border hover:border-cta/50"
              } disabled:opacity-50`}
            >
              <span className="text-xs font-semibold text-foreground">চালু আছে</span>
            </button>
            <button
              type="button"
              onClick={() => update("enabled", false)}
              disabled={saving}
              className={`rounded-lg border p-3 text-center ${
                !settings.enabled ? "border-cta bg-cta-light" : "border-border hover:border-cta/50"
              } disabled:opacity-50`}
            >
              <span className="text-xs font-semibold text-foreground">বন্ধ আছে</span>
            </button>
          </div>
        </div>

        <label className="block text-xs text-ink-soft">
          কুপন কোড
          <input
            className={`mt-1 ${fieldClass}`}
            placeholder="যেমন: EID2026"
            value={settings.code}
            onChange={(e) => update("code", e.target.value)}
          />
          <span className="mt-1 block text-[11px] text-ink-faint">
            কাস্টমার ঠিক এই কোডটাই লিখে &ldquo;প্রয়োগ করুন&rdquo; চাপবেন। ছোট/বড় হাতের অক্ষর নিয়ে সমস্যা নেই।
          </span>
        </label>

        <label className="block text-xs text-ink-soft">
          ছাড় (%)
          <input
            type="number"
            min={0}
            max={100}
            className={`mt-1 ${fieldClass}`}
            value={settings.discountPercent}
            onChange={(e) => update("discountPercent", Number(e.target.value) || 0)}
          />
        </label>

        {error && <p className="text-sm text-price">{error}</p>}

        <div className="flex items-center gap-3">
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
