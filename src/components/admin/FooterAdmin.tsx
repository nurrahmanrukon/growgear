"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Check, Eye, EyeOff } from "lucide-react";
import { FooterGroupMeta } from "@/lib/server/footerSettings";

export function FooterAdmin({
  catalog,
  initialHidden,
}: {
  catalog: FooterGroupMeta[];
  initialHidden: string[];
}) {
  const router = useRouter();
  const [hidden, setHidden] = useState<Set<string>>(new Set(initialHidden));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleHidden(key: string) {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hiddenGroups: Array.from(hidden) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "সংরক্ষণ করা যায়নি");
        return;
      }
      setHidden(new Set(data.hiddenGroups));
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
          <h1 className="font-display text-xl font-bold text-foreground">ফুটার</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            সাইটের সবচেয়ে নিচের অংশে (ফুটার) যে ৪টা লিংকের দল দেখা যায়, তার যেকোনোটা চাইলে পুরোপুরি লুকিয়ে রাখতে
            পারবেন।
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
        {catalog.map((group) => {
          const isHidden = hidden.has(group.key);
          return (
            <div
              key={group.key}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3"
            >
              <div>
                <p className={`text-sm font-medium ${isHidden ? "text-ink-faint line-through" : "text-foreground"}`}>
                  {group.label}
                </p>
                {isHidden && <p className="text-[11px] font-medium text-price">লুকানো — ভিজিটররা দেখবে না</p>}
              </div>
              <button
                type="button"
                aria-label={isHidden ? "দেখান" : "লুকান"}
                onClick={() => toggleHidden(group.key)}
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
