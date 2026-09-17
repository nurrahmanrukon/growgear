"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Banknote, CreditCard, Smartphone, Tag, X } from "lucide-react";
import { useCartStore, useHasHydrated } from "@/store/cart";
import { Button } from "@/components/ui/Button";
import { formatTaka, toBengaliNumber } from "@/lib/format";
import { validatePromoCode, PromoCode } from "@/lib/data/promo";
import { PromoGiftModal } from "@/components/checkout/PromoGiftModal";

const areas = ["ঢাকার ভিতরে", "ঢাকার বাইরে"];
const deliveryFees: Record<string, number> = { "ঢাকার ভিতরে": 70, "ঢাকার বাইরে": 130 };

export default function CheckoutPage() {
  const router = useRouter();
  const hydrated = useHasHydrated();
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const clear = useCartStore((s) => s.clear);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState(areas[0]);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [showGiftModal, setShowGiftModal] = useState(false);

  const deliveryFee = deliveryFees[area];
  const discount = promo ? Math.round((totalPrice * promo.discountPercent) / 100) : 0;
  const grandTotal = totalPrice - discount + deliveryFee;

  function handleApplyPromo(e: FormEvent) {
    e.preventDefault();
    const match = validatePromoCode(promoInput);
    if (!match) {
      setPromoError("সঠিক প্রোমো কোড নয়, আবার চেষ্টা করুন।");
      return;
    }
    setPromo(match);
    setPromoError(null);
    setShowGiftModal(true);
  }

  function handleRemovePromo() {
    setPromo(null);
    setPromoInput("");
    setPromoError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          address,
          area,
          paymentMethod,
          promoCode: promo?.code ?? null,
          discount,
          items: items.map((i) => ({
            productId: i.productId,
            title: i.title,
            price: i.price,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "অর্ডার প্রসেস করা যায়নি, আবার চেষ্টা করুন।");
        return;
      }
      clear();
      router.push(`/order-success?orderId=${data.orderId}`);
    } catch {
      setError("নেটওয়ার্ক সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) return <div className="container-page py-10" />;

  if (items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-20 text-center">
        <h1 className="text-lg font-semibold text-foreground">আপনার কার্ট খালি</h1>
        <Link href="/">
          <Button variant="primary">কেনাকাটা শুরু করুন</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-6">
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">চেকআউট</h1>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-5 lg:flex-row">
        <div className="flex-1 space-y-5">
          <div className="rounded-lg border border-border bg-surface p-4">
            <h2 className="mb-3 text-sm font-bold text-foreground">ডেলিভারির তথ্য</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম *"
                className="rounded border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange"
              />
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="মোবাইল নম্বর *"
                className="rounded border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange"
              />
            </div>
            <textarea
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="সম্পূর্ণ ঠিকানা * (বাসা/হোল্ডিং নং, রোড, এলাকা, থানা, জেলা)"
              rows={3}
              className="mt-3 w-full rounded border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange"
            />
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="mt-3 w-full rounded border border-border px-3 py-2 text-sm outline-none sm:w-64"
            >
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a} (ডেলিভারি {formatTaka(deliveryFees[a])})
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4">
            <h2 className="mb-3 text-sm font-bold text-foreground">পেমেন্ট পদ্ধতি</h2>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-3 rounded border border-border p-3 has-[:checked]:border-orange has-[:checked]:bg-orange/5">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <Banknote size={18} className="text-navy-light" />
                <div>
                  <p className="text-sm font-medium text-foreground">ক্যাশ অন ডেলিভারি</p>
                  <p className="text-xs text-neutral-500">পণ্য হাতে পেয়ে টাকা পরিশোধ করুন</p>
                </div>
              </label>

              <label className="flex cursor-not-allowed items-center gap-3 rounded border border-border p-3 opacity-60">
                <input type="radio" name="payment" disabled />
                <Smartphone size={18} className="text-navy-light" />
                <div>
                  <p className="text-sm font-medium text-foreground">bKash / Nagad</p>
                  <p className="text-xs text-neutral-500">পেমেন্ট গেটওয়ে শীঘ্রই যুক্ত হবে</p>
                </div>
              </label>

              <label className="flex cursor-not-allowed items-center gap-3 rounded border border-border p-3 opacity-60">
                <input type="radio" name="payment" disabled />
                <CreditCard size={18} className="text-navy-light" />
                <div>
                  <p className="text-sm font-medium text-foreground">ডেবিট / ক্রেডিট কার্ড</p>
                  <p className="text-xs text-neutral-500">পেমেন্ট গেটওয়ে শীঘ্রই যুক্ত হবে</p>
                </div>
              </label>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4">
            <h2 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-foreground">
              <Tag size={15} className="text-primary" /> প্রোমো কোড
            </h2>
            {promo ? (
              <div className="flex items-center justify-between rounded-md bg-primary-light px-3 py-2">
                <div>
                  <p className="text-sm font-semibold text-primary-dark">{promo.code} প্রয়োগ হয়েছে</p>
                  <p className="text-xs text-ink-soft">{promo.discountPercent}% ডিসকাউন্ট — {promo.source}</p>
                </div>
                <button
                  type="button"
                  onClick={handleRemovePromo}
                  aria-label="প্রোমো কোড সরান"
                  className="rounded p-1 text-ink-faint hover:text-foreground"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <input
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="প্রোমো কোড লিখুন"
                    className="flex-1 rounded border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange"
                  />
                  <Button type="button" variant="outline" onClick={handleApplyPromo}>
                    প্রয়োগ করুন
                  </Button>
                </div>
                {promoError && <p className="mt-1.5 text-xs text-price">{promoError}</p>}
                <p className="mt-1.5 text-[11px] text-ink-faint">
                  নূর রহমান পডকাস্ট বা Enrich Everyday-এর অডিয়েন্স? আপনার কোড দিয়ে ১০% ছাড় পান।
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="h-fit w-full space-y-3 rounded-lg border border-border bg-surface p-4 lg:w-80">
          <h2 className="text-sm font-bold text-foreground">অর্ডার সামারি</h2>
          <div className="max-h-48 space-y-1.5 overflow-y-auto text-xs text-neutral-600">
            {items.map((i) => (
              <div key={i.productId} className="flex justify-between gap-2">
                <span className="line-clamp-1">
                  {i.title} × {toBengaliNumber(i.quantity)}
                </span>
                <span className="shrink-0">{formatTaka(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1 border-t border-border pt-2 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>সাবটোটাল</span>
              <span>{formatTaka(totalPrice)}</span>
            </div>
            {promo && (
              <div className="flex justify-between text-success">
                <span>প্রোমো ছাড় ({promo.discountPercent}%)</span>
                <span>-{formatTaka(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>ডেলিভারি চার্জ</span>
              <span>{formatTaka(deliveryFee)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-1.5 text-base font-bold text-price">
              <span>মোট</span>
              <span>{formatTaka(grandTotal)}</span>
            </div>
          </div>

          {error && <p className="text-xs text-price">{error}</p>}

          <Button type="submit" variant="primary" fullWidth disabled={submitting}>
            {submitting ? "অর্ডার হচ্ছে..." : "অর্ডার কনফার্ম করুন"}
          </Button>
        </div>
      </form>

      <PromoGiftModal open={showGiftModal} onClose={() => setShowGiftModal(false)} />
    </div>
  );
}
