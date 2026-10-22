"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Check, Eye, EyeOff } from "lucide-react";
import { GEAR_SUBCATEGORIES } from "@/lib/data/gear";

interface GearSubcategorySettings {
  hiddenSlugs: string[];
  labelOverrides: Record<string, string>;
}

const fieldClass =
  "w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary";

export function GearSubcategoryAdmin({ initial }: { initial: GearSubcategorySettings }) {
  const router = useRouter();
  const [hidden, setHidden] = useState<Set<string>>(new Set(initial.hiddenSlugs));
  const [labels, setLabels] = useState<Record<string, string>>(initial.labelOverrides);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleHidden(slug: string) {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
    setSaved(false);
  }

  function updateLabel(slug: string, value: string) {
    setLabels((prev) => ({ ...prev, [slug]: value }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/gear-subcategories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hiddenSlugs: Array.from(hidden), labelOverrides: labels }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "সংরক্ষণ করা যায়নি");
        return;
      }
      setHidden(new Set(data.hiddenSlugs));
      setLabels(data.labelOverrides);
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
          <h1 className="font-display text-xl font-bold text-foreground">গিয়ার সাব-ক্যাটাগরি</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            হেডারের &ldquo;গিয়ার&rdquo; মেনুর সাব-মেনু বারে এই ক্যাটাগরিগুলো দেখা যায় — কোনোটা লুকিয়ে রাখতে পারবেন
            বা নাম বদলাতে পারবেন।
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:bg-surface-muted"
        >
          <LogOut size={14} /> লগআউট
        </button>
      </div>

      <div className="mt-6 max-w-lg space-y-2">
        {GEAR_SUBCATEGORIES.map((cat) => {
          const isHidden = hidden.has(cat.slug);
          return (
            <div key={cat.slug} className="flex items-center gap-2 rounded-md border border-border bg-surface p-2.5">
              <input
                className={`flex-1 ${fieldClass} ${isHidden ? "opacity-50" : ""}`}
                value={labels[cat.slug] ?? cat.label}
                onChange={(e) => updateLabel(cat.slug, e.target.value)}
                disabled={isHidden}
              />
              <button
                type="button"
                aria-label={isHidden ? "দেখান" : "লুকান"}
                onClick={() => toggleHidden(cat.slug)}
                className={`shrink-0 rounded-md border p-1.5 ${
                  isHidden
                    ? "border-price/40 bg-price/10 text-price"
                    : "border-border text-ink-soft hover:border-primary hover:text-primary"
                }`}
              >
                {isHidden ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          );
        })}

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
