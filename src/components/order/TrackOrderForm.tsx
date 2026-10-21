"use client";

import { useState } from "react";
import { Package, Phone, MapPin, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatTaka, toBengaliNumber } from "@/lib/format";

type OrderStatus = "pending" | "confirmed" | "rejected" | "delivered";

interface TrackedOrder {
  orderId: string;
  status: OrderStatus;
  createdAt: string;
  statusUpdatedAt: string;
  items: { title: string; quantity: number; price: number }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  address?: string;
  area?: string;
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "অপেক্ষমাণ — আমরা শীঘ্রই কনফার্ম করব",
  confirmed: "কনফার্ম হয়েছে — ডেলিভারির জন্য প্রস্তুত হচ্ছে",
  rejected: "বাতিল হয়ে গেছে",
  delivered: "ডেলিভারি সম্পন্ন হয়েছে",
};
const STATUS_COLOR: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-primary-light text-primary-dark",
  rejected: "bg-price/10 text-price",
  delivered: "bg-success/15 text-success",
};

export function TrackOrderForm({
  initialOrderId,
  whatsappEnabled,
  whatsappNumber,
}: {
  initialOrderId: string;
  whatsappEnabled: boolean;
  whatsappNumber: string;
}) {
  const [orderId, setOrderId] = useState(initialOrderId);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "অর্ডার খুঁজে পাওয়া যায়নি");
        return;
      }
      setOrder(data);
    } catch {
      setError("সংযোগ করা যায়নি — ইন্টারনেট সংযোগ চেক করুন");
    } finally {
      setLoading(false);
    }
  }

  const whatsappHref = order
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `আসসালামু আলাইকুম, আমি অর্ডার ${order.orderId} নিয়ে জানতে চাইছি।`
      )}`
    : undefined;

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
        <label className="text-xs text-ink-soft">
          অর্ডার আইডি
          <input
            required
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="যেমন: GG12345678"
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </label>
        <label className="text-xs text-ink-soft">
          ফোন নম্বর (অর্ডার করার সময় যেটা দিয়েছিলেন)
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="০১৭XXXXXXXX"
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </label>
        <Button type="submit" disabled={loading} fullWidth>
          {loading ? <Loader2 size={15} className="animate-spin" /> : null}
          {loading ? "খোঁজা হচ্ছে..." : "অর্ডার খুঁজুন"}
        </Button>
        {error && <p className="text-sm text-price">{error}</p>}
      </form>

      {order && (
        <div className="mt-4 rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <p className="font-display text-sm font-bold text-foreground">{order.orderId}</p>
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_COLOR[order.status]}`}>
              {STATUS_LABEL[order.status]}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-ink-faint">
            অর্ডার করা হয়েছে: {new Date(order.createdAt).toLocaleString("bn-BD", { dateStyle: "full", timeStyle: "short" })}
          </p>

          <div className="mt-3 space-y-1.5 border-t border-border pt-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-1.5 text-ink-soft">
                  <Package size={13} className="shrink-0" />
                  {item.title} × {toBengaliNumber(item.quantity)}
                </span>
                <span className="shrink-0 font-medium text-foreground">{formatTaka(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>সাবটোটাল</span>
              <span>{formatTaka(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-success">
                <span>ছাড়</span>
                <span>-{formatTaka(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-ink-soft">
              <span>ডেলিভারি চার্জ</span>
              <span>{formatTaka(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-1.5 font-bold text-price">
              <span>মোট</span>
              <span>{formatTaka(order.total)}</span>
            </div>
          </div>

          <div className="mt-3 space-y-1.5 border-t border-border pt-3 text-xs text-ink-soft">
            {order.address && (
              <p className="flex items-start gap-1.5">
                <MapPin size={12} className="mt-0.5 shrink-0" />
                <span>
                  {order.address}
                  {order.area && ` — ${order.area}`}
                </span>
              </p>
            )}
            <p className="flex items-center gap-1.5">
              <CreditCard size={12} /> {order.paymentMethod}
            </p>
          </div>

          {whatsappEnabled && whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-1.5 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface-muted"
            >
              <Phone size={14} /> অর্ডার নিয়ে প্রশ্ন থাকলে হোয়াটসঅ্যাপে জিজ্ঞেস করুন
            </a>
          )}
        </div>
      )}
    </div>
  );
}
