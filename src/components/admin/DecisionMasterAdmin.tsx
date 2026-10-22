"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Check } from "lucide-react";

interface DecisionMasterStep {
  title: string;
  body: string;
}
interface DecisionMasterSettings {
  heading: string;
  subheading: string;
  formLabel: string;
  formPlaceholder: string;
  formErrorText: string;
  submitButtonLabel: string;
  resultHeading: string;
  steps: DecisionMasterStep[];
  ctaText: string;
  ctaBookSlug: string;
  ctaLinkLabel: string;
}

const fieldClass =
  "w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary";

export function DecisionMasterAdmin({
  initial,
  books,
}: {
  initial: DecisionMasterSettings;
  books: { slug: string; title: string }[];
}) {
  const router = useRouter();
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof DecisionMasterSettings>(field: K, value: DecisionMasterSettings[K]) {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function updateStep(i: number, field: keyof DecisionMasterStep, value: string) {
    setSettings((prev) => ({
      ...prev,
      steps: prev.steps.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)),
    }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/decisionmaster", {
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
          <h1 className="font-display text-xl font-bold text-foreground">ডিসিশনমাস্টার পেজ</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            /decisionmaster পেজের শিরোনাম, ফর্মের লেখা এবং ৫টি ধাপের লেখা এখান থেকে বদলাতে পারবেন।
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
        <section className="space-y-3">
          <h2 className="font-display text-sm font-bold text-foreground">উপরের অংশ</h2>
          <label className="block text-xs text-ink-soft">
            শিরোনাম
            <textarea
              rows={2}
              className={`mt-1 ${fieldClass}`}
              value={settings.heading}
              onChange={(e) => update("heading", e.target.value)}
            />
          </label>
          <label className="block text-xs text-ink-soft">
            সাব-হেডিং
            <input className={`mt-1 ${fieldClass}`} value={settings.subheading} onChange={(e) => update("subheading", e.target.value)} />
          </label>
        </section>

        <section className="space-y-3 border-t border-border pt-4">
          <h2 className="font-display text-sm font-bold text-foreground">ফর্ম</h2>
          <label className="block text-xs text-ink-soft">
            ফর্মের লেবেল
            <input className={`mt-1 ${fieldClass}`} value={settings.formLabel} onChange={(e) => update("formLabel", e.target.value)} />
          </label>
          <label className="block text-xs text-ink-soft">
            প্লেসহোল্ডার
            <input
              className={`mt-1 ${fieldClass}`}
              value={settings.formPlaceholder}
              onChange={(e) => update("formPlaceholder", e.target.value)}
            />
          </label>
          <label className="block text-xs text-ink-soft">
            খালি রেখে সাবমিট করলে যে এরর দেখাবে
            <input
              className={`mt-1 ${fieldClass}`}
              value={settings.formErrorText}
              onChange={(e) => update("formErrorText", e.target.value)}
            />
          </label>
          <label className="block text-xs text-ink-soft">
            সাবমিট বাটনের লেখা
            <input
              className={`mt-1 ${fieldClass}`}
              value={settings.submitButtonLabel}
              onChange={(e) => update("submitButtonLabel", e.target.value)}
            />
          </label>
        </section>

        <section className="space-y-3 border-t border-border pt-4">
          <h2 className="font-display text-sm font-bold text-foreground">ফলাফল — ৫টি ধাপ</h2>
          <label className="block text-xs text-ink-soft">
            ধাপগুলোর উপরের হেডিং
            <input
              className={`mt-1 ${fieldClass}`}
              value={settings.resultHeading}
              onChange={(e) => update("resultHeading", e.target.value)}
            />
          </label>
          <div className="flex flex-col gap-3">
            {settings.steps.map((step, i) => (
              <div key={i} className="rounded-md border border-border p-3">
                <p className="text-[11px] font-medium text-ink-faint">ধাপ {i + 1}</p>
                <label className="mt-1 block text-xs text-ink-soft">
                  শিরোনাম
                  <input
                    className={`mt-1 ${fieldClass}`}
                    value={step.title}
                    onChange={(e) => updateStep(i, "title", e.target.value)}
                  />
                </label>
                <label className="mt-2 block text-xs text-ink-soft">
                  বর্ণনা
                  <textarea
                    rows={2}
                    className={`mt-1 ${fieldClass}`}
                    value={step.body}
                    onChange={(e) => updateStep(i, "body", e.target.value)}
                  />
                </label>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3 border-t border-border pt-4">
          <h2 className="font-display text-sm font-bold text-foreground">নিচের বই-প্রমোশন</h2>
          <label className="block text-xs text-ink-soft">
            প্রমোশনের লেখা
            <input className={`mt-1 ${fieldClass}`} value={settings.ctaText} onChange={(e) => update("ctaText", e.target.value)} />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-ink-soft">
              কোন বই প্রমোট করবেন
              <select
                className={`mt-1 ${fieldClass}`}
                value={settings.ctaBookSlug}
                onChange={(e) => update("ctaBookSlug", e.target.value)}
              >
                {books.map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs text-ink-soft">
              লিংকের লেখা
              <input
                className={`mt-1 ${fieldClass}`}
                value={settings.ctaLinkLabel}
                onChange={(e) => update("ctaLinkLabel", e.target.value)}
              />
            </label>
          </div>
        </section>

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
