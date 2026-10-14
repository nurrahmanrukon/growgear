"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Check, Plus, X } from "lucide-react";

interface DeliveryZone {
  key: string;
  label: string;
  days: string;
  fee: number;
}
interface QuantityTier {
  quantity: number;
  description: string;
  badge?: string;
}
interface OrderFormSettings {
  deliveryZones: DeliveryZone[];
  quantityTiers: QuantityTier[];
  bulkLabel: string;
  bulkSubtext: string;
  bulkCta: string;
}

const fieldClass =
  "w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary";

let nextTempId = 0;

export function OrderFormSettingsAdmin({ initial }: { initial: OrderFormSettings }) {
  const router = useRouter();
  const [zones, setZones] = useState(initial.deliveryZones);
  const [tiers, setTiers] = useState(initial.quantityTiers);
  const [bulkLabel, setBulkLabel] = useState(initial.bulkLabel);
  const [bulkSubtext, setBulkSubtext] = useState(initial.bulkSubtext);
  const [bulkCta, setBulkCta] = useState(initial.bulkCta);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateZone(i: number, field: keyof DeliveryZone, value: string | number) {
    setZones((prev) => prev.map((z, idx) => (idx === i ? { ...z, [field]: value } : z)));
  }
  function updateTier(i: number, field: keyof QuantityTier, value: string | number) {
    setTiers((prev) => prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)));
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/order-form-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliveryZones: zones,
          quantityTiers: tiers.map((t) => ({ ...t, quantity: Number(t.quantity) || 1 })),
          bulkLabel,
          bulkSubtext,
          bulkCta,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "সংরক্ষণ করা যায়নি");
        return;
      }
      setZones(data.deliveryZones);
      setTiers(data.quantityTiers);
      setBulkLabel(data.bulkLabel);
      setBulkSubtext(data.bulkSubtext);
      setBulkCta(data.bulkCta);
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
          <h1 className="font-display text-xl font-bold text-foreground">অর্ডার ফর্ম — এরিয়া ও কপি সংখ্যা</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            প্রোডাক্ট পেজের কুইক-অর্ডার ফর্ম ও চেকআউট পেজে ডেলিভারি এরিয়া আর কতগুলো কপি নেবেন — এই দুইটা অপশনের
            লেখা এখান থেকে বদলাতে পারবেন। পরিবর্তন সব প্রোডাক্টে সাথে সাথে প্রয়োগ হবে।
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:bg-surface-muted"
        >
          <LogOut size={14} /> লগআউট
        </button>
      </div>

      <div className="mt-6 max-w-2xl space-y-8">
        <section>
          <h2 className="font-display text-base font-bold text-foreground">ডেলিভারি এরিয়া</h2>
          <p className="mt-1 text-xs text-ink-faint">
            প্রথমটা ডিফল্ট হিসেবে আগে থেকে সিলেক্ট করা থাকে — বাকিগুলো ড্রপডাউনে দেখা যাবে।
          </p>
          <div className="mt-3 flex flex-col gap-3">
            {zones.map((zone, i) => (
              <div key={zone.key} className="grid grid-cols-[1fr_1fr_100px_auto] items-end gap-2 rounded-md border border-border p-3">
                <label className="text-xs text-ink-soft">
                  এরিয়ার নাম
                  <input
                    className={`mt-1 ${fieldClass}`}
                    value={zone.label}
                    onChange={(e) => updateZone(i, "label", e.target.value)}
                  />
                </label>
                <label className="text-xs text-ink-soft">
                  সময় লাগবে
                  <input
                    className={`mt-1 ${fieldClass}`}
                    placeholder="যেমন: ২-৩ দিন"
                    value={zone.days}
                    onChange={(e) => updateZone(i, "days", e.target.value)}
                  />
                </label>
                <label className="text-xs text-ink-soft">
                  ফি (টাকা)
                  <input
                    type="number"
                    min={0}
                    className={`mt-1 ${fieldClass}`}
                    value={zone.fee}
                    onChange={(e) => updateZone(i, "fee", Number(e.target.value) || 0)}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setZones((prev) => prev.filter((_, idx) => idx !== i))}
                  disabled={zones.length <= 1}
                  aria-label="মুছে ফেলুন"
                  className="shrink-0 rounded-md border border-border p-2 text-ink-faint hover:border-price hover:text-price disabled:opacity-30"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setZones((prev) => [...prev, { key: `zone-new-${nextTempId++}`, label: "", days: "", fee: 0 }])
              }
              className="flex w-fit items-center gap-1 rounded-md border border-dashed border-border px-3 py-1.5 text-xs font-medium text-ink-soft hover:border-primary hover:text-primary"
            >
              <Plus size={13} /> এরিয়া যোগ করুন
            </button>
          </div>
        </section>

        <section>
          <h2 className="font-display text-base font-bold text-foreground">কপি সংখ্যা (কোয়ান্টিটি টিয়ার)</h2>
          <p className="mt-1 text-xs text-ink-faint">
            প্রথমটা ডিফল্ট হিসেবে সিলেক্ট থাকে। প্রতিটা প্রোডাক্টের MRP (আগের দাম) ও বর্তমান দামের পার্থক্য থেকে
            &ldquo;সাশ্রয়&rdquo; এর টাকা স্বয়ংক্রিয়ভাবে হিসাব হয়ে দেখানো হয় — এখানে শুধু বর্ণনা ও ব্যাজ লিখুন।
          </p>
          <div className="mt-3 flex flex-col gap-3">
            {tiers.map((tier, i) => (
              <div key={i} className="grid grid-cols-[70px_1fr_1fr_auto] items-end gap-2 rounded-md border border-border p-3">
                <label className="text-xs text-ink-soft">
                  কপি
                  <input
                    type="number"
                    min={1}
                    className={`mt-1 ${fieldClass}`}
                    value={tier.quantity}
                    onChange={(e) => updateTier(i, "quantity", Number(e.target.value) || 1)}
                  />
                </label>
                <label className="text-xs text-ink-soft">
                  বর্ণনা
                  <input
                    className={`mt-1 ${fieldClass}`}
                    placeholder="যেমন: নিজের জন্য"
                    value={tier.description}
                    onChange={(e) => updateTier(i, "description", e.target.value)}
                  />
                </label>
                <label className="text-xs text-ink-soft">
                  ব্যাজ (ঐচ্ছিক)
                  <input
                    className={`mt-1 ${fieldClass}`}
                    placeholder="যেমন: সবচেয়ে জনপ্রিয়"
                    value={tier.badge ?? ""}
                    onChange={(e) => updateTier(i, "badge", e.target.value)}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setTiers((prev) => prev.filter((_, idx) => idx !== i))}
                  disabled={tiers.length <= 1}
                  aria-label="মুছে ফেলুন"
                  className="shrink-0 rounded-md border border-border p-2 text-ink-faint hover:border-price hover:text-price disabled:opacity-30"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setTiers((prev) => [...prev, { quantity: prev.length + 1, description: "" }])}
              className="flex w-fit items-center gap-1 rounded-md border border-dashed border-border px-3 py-1.5 text-xs font-medium text-ink-soft hover:border-primary hover:text-primary"
            >
              <Plus size={13} /> টিয়ার যোগ করুন
            </button>
          </div>
        </section>

        <section>
          <h2 className="font-display text-base font-bold text-foreground">কর্পোরেট/বাল্ক অর্ডার (তালিকার শেষে)</h2>
          <p className="mt-1 text-xs text-ink-faint">
            ক্লিক করলে হোয়াটসঅ্যাপ (অ্যাডমিন → হোয়াটসঅ্যাপ সেটিংসে যে নম্বর দেওয়া আছে) খুলে যাবে।
          </p>
          <div className="mt-3 flex flex-col gap-3">
            <label className="block text-xs text-ink-soft">
              শিরোনাম
              <input className={`mt-1 ${fieldClass}`} value={bulkLabel} onChange={(e) => setBulkLabel(e.target.value)} />
            </label>
            <label className="block text-xs text-ink-soft">
              সাবটেক্সট
              <input
                className={`mt-1 ${fieldClass}`}
                value={bulkSubtext}
                onChange={(e) => setBulkSubtext(e.target.value)}
              />
            </label>
            <label className="block text-xs text-ink-soft">
              সিটিএ টেক্সট
              <input className={`mt-1 ${fieldClass}`} value={bulkCta} onChange={(e) => setBulkCta(e.target.value)} />
            </label>
          </div>
        </section>

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
