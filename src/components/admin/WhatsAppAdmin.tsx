"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Check, MessageCircle, MessageCircleOff } from "lucide-react";

interface WhatsAppSettings {
  enabled: boolean;
  number: string;
  message: string;
}

export function WhatsAppAdmin({ initial }: { initial: WhatsAppSettings }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initial.enabled);
  const [number, setNumber] = useState(initial.number);
  const [message, setMessage] = useState(initial.message);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(update: Partial<WhatsAppSettings>) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/whatsapp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setError(body?.error || "সংরক্ষণ করা যায়নি");
        return;
      }
      if (typeof body.enabled === "boolean") setEnabled(body.enabled);
      if (typeof body.number === "string") setNumber(body.number);
      if (typeof body.message === "string") setMessage(body.message);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("সংরক্ষণ করা যায়নি — ইন্টারনেট সংযোগ চেক করুন");
    } finally {
      setSaving(false);
    }
  }

  async function toggleEnabled() {
    const next = !enabled;
    setEnabled(next);
    await save({ enabled: next });
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
          <h1 className="font-display text-xl font-bold text-foreground">হোয়াটসঅ্যাপ চ্যাট বাটন</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            সাইটের নিচে ডানদিকে ভাসমান হোয়াটসঅ্যাপ আইকনটা এখান থেকে চালু/বন্ধ করতে পারবেন, এবং নম্বর ও ডিফল্ট
            মেসেজ বদলাতে পারবেন। পরিবর্তন সাথে সাথে পুরো সাইটে লাইভ হয়ে যাবে।
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
            onClick={() => enabled || toggleEnabled()}
            disabled={saving}
            className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center ${
              enabled ? "border-cta bg-cta-light" : "border-border hover:border-cta/50"
            } disabled:opacity-50`}
          >
            <MessageCircle size={18} className={enabled ? "text-cta-dark" : "text-ink-faint"} />
            <span className="text-xs font-semibold text-foreground">চালু আছে</span>
            <span className="text-[10px] text-ink-faint">সাইটে বাটন দেখাবে</span>
          </button>
          <button
            type="button"
            onClick={() => enabled && toggleEnabled()}
            disabled={saving}
            className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center ${
              !enabled ? "border-price bg-price/10" : "border-border hover:border-price/50"
            } disabled:opacity-50`}
          >
            <MessageCircleOff size={18} className={!enabled ? "text-price" : "text-ink-faint"} />
            <span className="text-xs font-semibold text-foreground">বন্ধ</span>
            <span className="text-[10px] text-ink-faint">সাইটে বাটন দেখাবে না</span>
          </button>
        </div>

        <label className="mt-5 block text-xs font-medium text-ink-soft">
          হোয়াটসঅ্যাপ নম্বর (দেশের কোড সহ, + বা স্পেস ছাড়া)
        </label>
        <input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="8801XXXXXXXXX"
          className="mt-1.5 w-full rounded border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />

        <label className="mt-4 block text-xs font-medium text-ink-soft">চ্যাট শুরু হলে ডিফল্ট মেসেজ</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="mt-1.5 w-full resize-none rounded border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />

        {error && <p className="mt-3 text-sm text-price">{error}</p>}

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => save({ number, message })}
            disabled={saving}
            className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
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
