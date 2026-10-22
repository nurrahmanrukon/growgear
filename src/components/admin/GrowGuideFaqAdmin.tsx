"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Check, Plus, X, GripVertical, ChevronUp, ChevronDown } from "lucide-react";

interface Faq {
  q: string;
  a: string;
}
interface FaqSettings {
  eyebrow: string;
  heading: string;
  faqs: Faq[];
}

const fieldClass =
  "w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary";

export function GrowGuideFaqAdmin({ initial }: { initial: FaqSettings }) {
  const router = useRouter();
  const [settings, setSettings] = useState(initial);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateFaq(i: number, field: keyof Faq, value: string) {
    setSettings((prev) => ({ ...prev, faqs: prev.faqs.map((f, idx) => (idx === i ? { ...f, [field]: value } : f)) }));
    setSaved(false);
  }

  function addFaq() {
    setSettings((prev) => ({ ...prev, faqs: [...prev.faqs, { q: "", a: "" }] }));
    setSaved(false);
  }

  function removeFaq(i: number) {
    setSettings((prev) => ({ ...prev, faqs: prev.faqs.filter((_, idx) => idx !== i) }));
    setSaved(false);
  }

  function moveFaq(from: number, to: number) {
    setSettings((prev) => {
      const list = [...prev.faqs];
      if (to < 0 || to >= list.length) return prev;
      const [item] = list.splice(from, 1);
      list.splice(to, 0, item);
      return { ...prev, faqs: list };
    });
    setSaved(false);
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      return;
    }
    moveFaq(dragIndex, targetIndex);
    setDragIndex(null);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/growguide-faq", {
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
          <h1 className="font-display text-xl font-bold text-foreground">GrowGuide FAQ</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            প্রতিটা অডিয়েন্স পেজের নিচে একটা &ldquo;সাধারণ জিজ্ঞাসা&rdquo; সেকশন থাকে — সব অডিয়েন্সে একই প্রশ্ন-উত্তর
            দেখা যায়। প্রশ্ন যোগ/বাদ/ক্রম বদল করা যাবে।
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:bg-surface-muted"
        >
          <LogOut size={14} /> লগআউট
        </button>
      </div>

      <div className="mt-6 max-w-2xl space-y-5">
        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs text-ink-soft">
            সেকশনের উপরের ছোট লেখা
            <input
              className={`mt-1 ${fieldClass}`}
              value={settings.eyebrow}
              onChange={(e) => {
                setSettings((s) => ({ ...s, eyebrow: e.target.value }));
                setSaved(false);
              }}
            />
          </label>
          <label className="text-xs text-ink-soft">
            হেডিং
            <input
              className={`mt-1 ${fieldClass}`}
              value={settings.heading}
              onChange={(e) => {
                setSettings((s) => ({ ...s, heading: e.target.value }));
                setSaved(false);
              }}
            />
          </label>
        </div>

        <div className="flex flex-col gap-3">
          {settings.faqs.map((faq, i) => (
            <div
              key={i}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(i)}
              onDragEnd={() => setDragIndex(null)}
              className={`rounded-md border border-border p-3 transition ${dragIndex === i ? "opacity-40" : ""}`}
            >
              <div className="flex items-start gap-2">
                <span className="mt-1.5 shrink-0 cursor-grab text-ink-faint active:cursor-grabbing" aria-hidden="true">
                  <GripVertical size={14} />
                </span>
                <div className="min-w-0 flex-1 space-y-2">
                  <label className="block text-xs text-ink-soft">
                    প্রশ্ন
                    <input className={`mt-1 ${fieldClass}`} value={faq.q} onChange={(e) => updateFaq(i, "q", e.target.value)} />
                  </label>
                  <label className="block text-xs text-ink-soft">
                    উত্তর
                    <textarea rows={2} className={`mt-1 ${fieldClass}`} value={faq.a} onChange={(e) => updateFaq(i, "a", e.target.value)} />
                  </label>
                </div>
                <div className="mt-5 flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    aria-label="উপরে সরান"
                    disabled={i === 0}
                    onClick={() => moveFaq(i, i - 1)}
                    className="rounded-md border border-border p-1.5 text-ink-soft hover:border-primary hover:text-primary disabled:opacity-30"
                  >
                    <ChevronUp size={12} />
                  </button>
                  <button
                    type="button"
                    aria-label="নিচে সরান"
                    disabled={i === settings.faqs.length - 1}
                    onClick={() => moveFaq(i, i + 1)}
                    className="rounded-md border border-border p-1.5 text-ink-soft hover:border-primary hover:text-primary disabled:opacity-30"
                  >
                    <ChevronDown size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFaq(i)}
                    aria-label="মুছে ফেলুন"
                    className="rounded-md border border-border p-1.5 text-ink-faint hover:border-price hover:text-price"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addFaq}
            className="flex w-fit items-center gap-1 rounded-md border border-dashed border-border px-3 py-1.5 text-xs font-medium text-ink-soft hover:border-primary hover:text-primary"
          >
            <Plus size={13} /> প্রশ্ন যোগ করুন
          </button>
        </div>

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
