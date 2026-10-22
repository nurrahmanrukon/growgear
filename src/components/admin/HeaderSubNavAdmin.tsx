"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Check, Eye, EyeOff } from "lucide-react";
import { HEADER_SUBNAV_CATALOG, HEADER_SUBNAV_GROUP_LABELS } from "@/lib/data/headerSubNav";

interface HeaderSubNavSettings {
  hiddenHrefs: string[];
  labelOverrides: Record<string, string>;
}

const fieldClass =
  "w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary";

export function HeaderSubNavAdmin({ initial }: { initial: HeaderSubNavSettings }) {
  const router = useRouter();
  const [hidden, setHidden] = useState<Set<string>>(new Set(initial.hiddenHrefs));
  const [labels, setLabels] = useState<Record<string, string>>(initial.labelOverrides);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleHidden(href: string) {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(href)) next.delete(href);
      else next.add(href);
      return next;
    });
    setSaved(false);
  }

  function updateLabel(href: string, value: string) {
    setLabels((prev) => ({ ...prev, [href]: value }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/header-subnav", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hiddenHrefs: Array.from(hidden), labelOverrides: labels }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "সংরক্ষণ করা যায়নি");
        return;
      }
      setHidden(new Set(data.hiddenHrefs));
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
          <h1 className="font-display text-xl font-bold text-foreground">হেডার সাব-মেনু</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            হোম/বই/ইবুক/গিয়ার/কোর্স/GrowGuide-এর নিচে যে ছোট মেনু বার দেখা যায় (যেমন &ldquo;বেস্ট সেলার&rdquo;,
            &ldquo;নতুন&rdquo;, &ldquo;অফার&rdquo;) — তার যেকোনো আইটেম লুকিয়ে রাখতে পারবেন বা লেখা বদলাতে পারবেন।
            গিয়ারের সাব-ক্যাটাগরি (ফোকাস ও টাইমার ইত্যাদি) আলাদা পেজ থেকে ম্যানেজ করবেন।
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:bg-surface-muted"
        >
          <LogOut size={14} /> লগআউট
        </button>
      </div>

      <div className="mt-6 max-w-2xl space-y-6">
        {Object.entries(HEADER_SUBNAV_CATALOG).map(([key, items]) => (
          <div key={key}>
            <h2 className="font-display text-sm font-bold text-foreground">{HEADER_SUBNAV_GROUP_LABELS[key]}</h2>
            <div className="mt-2 flex flex-col gap-2">
              {items.map((item) => {
                const isHidden = hidden.has(item.href);
                return (
                  <div
                    key={item.href}
                    className="flex items-center gap-2 rounded-md border border-border bg-surface p-2.5"
                  >
                    <input
                      className={`flex-1 ${fieldClass} ${isHidden ? "opacity-50" : ""}`}
                      value={labels[item.href] ?? item.label}
                      onChange={(e) => updateLabel(item.href, e.target.value)}
                      disabled={isHidden}
                    />
                    <button
                      type="button"
                      aria-label={isHidden ? "দেখান" : "লুকান"}
                      onClick={() => toggleHidden(item.href)}
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
