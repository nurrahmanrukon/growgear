"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Check } from "lucide-react";

export function PurchaseToastAdmin({ initial }: { initial: { enabled: boolean } }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initial.enabled);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(next: boolean) {
    setEnabled(next);
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/purchase-toast", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "সংরক্ষণ করা যায়নি");
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

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">ক্রয় বিজ্ঞপ্তি (Purchase Pop-up)</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            সাইটে ঘুরে বেড়ানোর সময় নিচে-বাম কোণে মাঝে মাঝে একটা পপ-আপ দেখায় — &ldquo;অমুক ব্যক্তি এই প্রোডাক্টটি
            কিনেছেন&rdquo;। এটা শুধু সেই প্রোডাক্টগুলো থেকেই দেখায় যেগুলো এখন স্টকে/লাইভ আছে। এখান থেকে পুরো পপ-আপটা
            বন্ধ বা চালু করতে পারবেন।
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:bg-surface-muted"
        >
          <LogOut size={14} /> লগআউট
        </button>
      </div>

      <div className="mt-6 max-w-md space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => save(true)}
            disabled={saving}
            className={`rounded-lg border p-3 text-center ${
              enabled ? "border-cta bg-cta-light" : "border-border hover:border-cta/50"
            } disabled:opacity-50`}
          >
            <span className="text-xs font-semibold text-foreground">চালু আছে</span>
          </button>
          <button
            type="button"
            onClick={() => save(false)}
            disabled={saving}
            className={`rounded-lg border p-3 text-center ${
              !enabled ? "border-cta bg-cta-light" : "border-border hover:border-cta/50"
            } disabled:opacity-50`}
          >
            <span className="text-xs font-semibold text-foreground">বন্ধ আছে</span>
          </button>
        </div>

        {error && <p className="text-sm text-price">{error}</p>}
        {saved && (
          <span className="flex items-center gap-1 text-sm font-medium text-success">
            <Check size={15} /> সংরক্ষিত হয়েছে
          </span>
        )}
      </div>
    </div>
  );
}
