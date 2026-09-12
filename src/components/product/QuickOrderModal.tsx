"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Banknote, CreditCard, Smartphone } from "lucide-react";
import { Product } from "@/lib/types";
import { formatTaka, toBengaliNumber } from "@/lib/format";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

const AREAS = ["ঢাকার ভিতরে", "ঢাকার বাইরে"];
const DELIVERY_FEES: Record<string, number> = { "ঢাকার ভিতরে": 70, "ঢাকার বাইরে": 130 };
const QUANTITIES = [1, 2, 3, 4, 5];

type PaymentMethod = "cod" | "bkash" | "card";
const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: typeof Banknote; enabled: boolean }[] = [
  { id: "cod", label: "ক্যাশ অন ডেলিভারি", icon: Banknote, enabled: true },
  { id: "bkash", label: "বিকাশ", icon: Smartphone, enabled: false },
  { id: "card", label: "কার্ড", icon: CreditCard, enabled: false },
];

export function QuickOrderModal({
  product,
  open,
  onClose,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState(AREAS[0]);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deliveryFee = DELIVERY_FEES[area];
  const total = product.price * quantity + deliveryFee;

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
          items: [{ productId: product.id, title: product.title, price: product.price, quantity }],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "অর্ডার প্রসেস করা যায়নি, আবার চেষ্টা করুন।");
        return;
      }
      onClose();
      router.push(`/order-success?orderId=${data.orderId}`);
    } catch {
      setError("নেটওয়ার্ক সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="pr-6 text-base font-bold text-foreground">অর্ডার করুন</h2>
      <p className="mt-0.5 line-clamp-1 text-xs text-ink-faint">{product.title}</p>

      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="নাম *"
            className="rounded border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="ফোন নম্বর *"
            className="rounded border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <textarea
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="সম্পূর্ণ ঠিকানা লিখুন *"
          rows={2}
          className="w-full resize-none rounded border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />

        <div className="grid grid-cols-2 gap-2">
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="rounded border border-border px-2.5 py-2 text-sm outline-none"
          >
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="rounded border border-border px-2.5 py-2 text-sm outline-none"
          >
            {QUANTITIES.map((q) => (
              <option key={q} value={q}>
                {toBengaliNumber(q)} কপি
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="mb-1.5 block text-xs text-ink-soft">পেমেন্ট পদ্ধতি</span>
          <div className="grid grid-cols-3 gap-2">
            {PAYMENT_METHODS.map((m) => {
              const Icon = m.icon;
              const active = paymentMethod === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  disabled={!m.enabled}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`flex flex-col items-center gap-1 rounded-md border px-2 py-2 text-center text-[11px] transition ${
                    active ? "border-primary bg-primary-light text-primary" : "border-border text-ink-soft"
                  } ${m.enabled ? "hover:border-primary/50" : "cursor-not-allowed opacity-50"}`}
                >
                  <Icon size={15} />
                  <span className="font-medium">{m.label}</span>
                  {!m.enabled && <span className="text-[9px] text-ink-faint">শীঘ্রই যুক্ত হবে</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between rounded bg-surface-muted px-3 py-2 text-xs text-ink-soft">
          <span>
            {formatTaka(product.price)} × {toBengaliNumber(quantity)} + ডেলিভারি {formatTaka(deliveryFee)}
          </span>
          <span className="text-sm font-bold text-price">মোট {formatTaka(total)}</span>
        </div>

        {error && <p className="text-xs text-price">{error}</p>}

        <Button type="submit" variant="primary" fullWidth disabled={submitting} className="mt-1 py-2.5">
          {submitting ? "অর্ডার হচ্ছে..." : `অর্ডার করুন — ${formatTaka(total)}`}
        </Button>
      </form>
    </Modal>
  );
}
