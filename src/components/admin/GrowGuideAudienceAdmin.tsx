"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Check } from "lucide-react";
import { GROWGUIDE_AUDIENCE } from "@/lib/data/growguideAudience";

interface Benefit {
  title: string;
  body: string;
}
interface Testimonial {
  name: string;
  quote: string;
  rating: number;
}
interface AudienceOverride {
  label: string;
  body: string;
  heroHeading: string;
  heroSubtitle: string;
  videoCaption: string;
  benefits: Benefit[];
  testimonials: Testimonial[];
}
type AudienceSettings = Record<string, AudienceOverride>;

const fieldClass =
  "w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary";

const TABS = GROWGUIDE_AUDIENCE.map((a) => ({ slug: a.slug, defaultLabel: a.label }));

export function GrowGuideAudienceAdmin({ initial }: { initial: AudienceSettings }) {
  const router = useRouter();
  const [settings, setSettings] = useState(initial);
  const [tab, setTab] = useState(TABS[0].slug);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = settings[tab];

  function updateField<K extends keyof AudienceOverride>(field: K, value: AudienceOverride[K]) {
    setSettings((prev) => ({ ...prev, [tab]: { ...prev[tab], [field]: value } }));
    setSaved(false);
  }

  function updateBenefit(i: number, field: keyof Benefit, value: string) {
    setSettings((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], benefits: prev[tab].benefits.map((b, idx) => (idx === i ? { ...b, [field]: value } : b)) },
    }));
    setSaved(false);
  }

  function updateTestimonial(i: number, field: keyof Testimonial, value: string | number) {
    setSettings((prev) => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        testimonials: prev[tab].testimonials.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)),
      },
    }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/growguide-audience", {
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
          <h1 className="font-display text-xl font-bold text-foreground">GrowGuide — অডিয়েন্স</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            GrowGuide-এর ৩টা অডিয়েন্স (শিক্ষার্থী/প্রফেশনাল/উদ্যোক্তা) এর নাম, হিরো হেডিং, ভিডিও ক্যাপশন, ৩টা বেনিফিট
            ও ২টা টেস্টিমোনিয়াল এখান থেকে বদলাতে পারবেন।
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
        <div className="flex gap-2 border-b border-border">
          {TABS.map((t) => (
            <button
              key={t.slug}
              type="button"
              onClick={() => setTab(t.slug)}
              className={`border-b-2 px-3 py-2 text-sm font-medium ${
                tab === t.slug ? "border-primary text-primary" : "border-transparent text-ink-soft hover:text-foreground"
              }`}
            >
              {settings[t.slug]?.label ?? t.defaultLabel}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs text-ink-soft">
            নাম (লেবেল)
            <input className={`mt-1 ${fieldClass}`} value={current.label} onChange={(e) => updateField("label", e.target.value)} />
          </label>
          <label className="text-xs text-ink-soft">
            ভিডিও ক্যাপশন
            <input
              className={`mt-1 ${fieldClass}`}
              value={current.videoCaption}
              onChange={(e) => updateField("videoCaption", e.target.value)}
            />
          </label>
        </div>

        <label className="block text-xs text-ink-soft">
          ছোট বর্ণনা (ইনডেক্স পেজের পিলে ব্যবহৃত হয় না, তবে সংরক্ষিত থাকে)
          <textarea rows={2} className={`mt-1 ${fieldClass}`} value={current.body} onChange={(e) => updateField("body", e.target.value)} />
        </label>

        <label className="block text-xs text-ink-soft">
          হিরো হেডিং
          <textarea
            rows={2}
            className={`mt-1 ${fieldClass}`}
            value={current.heroHeading}
            onChange={(e) => updateField("heroHeading", e.target.value)}
          />
        </label>

        <label className="block text-xs text-ink-soft">
          হিরো সাব-টাইটেল
          <textarea
            rows={2}
            className={`mt-1 ${fieldClass}`}
            value={current.heroSubtitle}
            onChange={(e) => updateField("heroSubtitle", e.target.value)}
          />
        </label>

        <section className="space-y-3 border-t border-border pt-4">
          <h2 className="font-display text-sm font-bold text-foreground">বেনিফিট (৩টা)</h2>
          {current.benefits.map((b, i) => (
            <div key={i} className="rounded-md border border-border p-3">
              <label className="block text-xs text-ink-soft">
                শিরোনাম
                <input className={`mt-1 ${fieldClass}`} value={b.title} onChange={(e) => updateBenefit(i, "title", e.target.value)} />
              </label>
              <label className="mt-2 block text-xs text-ink-soft">
                বর্ণনা
                <textarea rows={2} className={`mt-1 ${fieldClass}`} value={b.body} onChange={(e) => updateBenefit(i, "body", e.target.value)} />
              </label>
            </div>
          ))}
        </section>

        <section className="space-y-3 border-t border-border pt-4">
          <h2 className="font-display text-sm font-bold text-foreground">টেস্টিমোনিয়াল (২টা)</h2>
          {current.testimonials.map((t, i) => (
            <div key={i} className="rounded-md border border-border p-3">
              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs text-ink-soft">
                  নাম
                  <input className={`mt-1 ${fieldClass}`} value={t.name} onChange={(e) => updateTestimonial(i, "name", e.target.value)} />
                </label>
                <label className="text-xs text-ink-soft">
                  রেটিং (০-৫)
                  <input
                    type="number"
                    step="0.5"
                    min={0}
                    max={5}
                    className={`mt-1 ${fieldClass}`}
                    value={t.rating}
                    onChange={(e) => updateTestimonial(i, "rating", Number(e.target.value) || 0)}
                  />
                </label>
              </div>
              <label className="mt-2 block text-xs text-ink-soft">
                মন্তব্য
                <textarea rows={2} className={`mt-1 ${fieldClass}`} value={t.quote} onChange={(e) => updateTestimonial(i, "quote", e.target.value)} />
              </label>
            </div>
          ))}
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
