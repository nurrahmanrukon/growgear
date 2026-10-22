"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Check } from "lucide-react";

interface CoursePageSettings {
  heading: string;
  introBefore: string;
  platformName: string;
  platformUrl: string;
  introAfter: string;
  enrollCtaLabel: string;
}

const fieldClass =
  "w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary";

export function CoursePageAdmin({ initial }: { initial: CoursePageSettings }) {
  const router = useRouter();
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof CoursePageSettings>(field: K, value: CoursePageSettings[K]) {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/course-page", {
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
          <h1 className="font-display text-xl font-bold text-foreground">কোর্স পেজ</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            /course পেজের উপরের শিরোনাম, পরিচিতি লেখা ও &ldquo;এনরোল করুন&rdquo; বাটনের লেখা এখান থেকে বদলাতে
            পারবেন। পরিচিতি লেখার মাঝে একটা লিংক (পার্টনার প্ল্যাটফর্মের নাম ও ঠিকানা) আলাদাভাবে বসানো আছে।
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:bg-surface-muted"
        >
          <LogOut size={14} /> লগআউট
        </button>
      </div>

      <div className="mt-6 max-w-xl space-y-4">
        <label className="block text-xs text-ink-soft">
          শিরোনাম
          <input className={`mt-1 ${fieldClass}`} value={settings.heading} onChange={(e) => update("heading", e.target.value)} />
        </label>

        <label className="block text-xs text-ink-soft">
          পরিচিতি লেখা (লিংকের আগের অংশ)
          <textarea
            rows={2}
            className={`mt-1 ${fieldClass}`}
            value={settings.introBefore}
            onChange={(e) => update("introBefore", e.target.value)}
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs text-ink-soft">
            লিংকের লেখা (প্ল্যাটফর্মের নাম)
            <input
              className={`mt-1 ${fieldClass}`}
              value={settings.platformName}
              onChange={(e) => update("platformName", e.target.value)}
            />
          </label>
          <label className="text-xs text-ink-soft">
            লিংকের ঠিকানা (URL)
            <input
              className={`mt-1 ${fieldClass}`}
              value={settings.platformUrl}
              onChange={(e) => update("platformUrl", e.target.value)}
            />
          </label>
        </div>

        <label className="block text-xs text-ink-soft">
          পরিচিতি লেখা (লিংকের পরের অংশ)
          <textarea
            rows={2}
            className={`mt-1 ${fieldClass}`}
            value={settings.introAfter}
            onChange={(e) => update("introAfter", e.target.value)}
          />
        </label>

        <label className="block text-xs text-ink-soft">
          &ldquo;এনরোল করুন&rdquo; বাটনের লেখা
          <input
            className={`mt-1 ${fieldClass}`}
            value={settings.enrollCtaLabel}
            onChange={(e) => update("enrollCtaLabel", e.target.value)}
          />
        </label>

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
