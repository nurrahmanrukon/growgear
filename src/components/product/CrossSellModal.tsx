"use client";

import { useEffect, useState } from "react";
import { BookOpen, Clock, CreditCard, Smartphone, Star } from "lucide-react";
import { Product } from "@/lib/types";
import { formatTaka, discountPercent, toBengaliNumber } from "@/lib/format";
import { msUntilMidnight, formatCountdown } from "@/lib/countdown";
import { Modal } from "@/components/ui/Modal";
import { ProductImage } from "@/components/ui/ProductImage";
import { TableOfContentsToggle } from "@/components/product/TableOfContentsToggle";
import { ProfileAuthModal } from "@/components/profile/ProfileAuthModal";

type PaymentMethod = "bkash" | "card";
const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: typeof Smartphone }[] = [
  { id: "bkash", label: "বিকাশ", icon: Smartphone },
  { id: "card", label: "কার্ড", icon: CreditCard },
];

type View = "offer" | "preview" | "payment" | "success";

export function CrossSellModal({
  ebook,
  message,
  soldCount,
  customerName,
  customerPhone,
  open,
  onClose,
}: {
  ebook: Product;
  message: string;
  soldCount: number;
  customerName: string;
  customerPhone: string;
  open: boolean;
  onClose: () => void;
}) {
  const [view, setView] = useState<View>("offer");
  const [msLeft, setMsLeft] = useState<number | null>(null);
  const [hiddenPayment, setHiddenPayment] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  const discount = discountPercent(ebook.price, ebook.oldPrice);
  const text = message.replace("{count}", toBengaliNumber(soldCount));
  const methods = PAYMENT_METHODS.filter((m) => !hiddenPayment.includes(m.id));
  const effectiveMethod = paymentMethod && methods.some((m) => m.id === paymentMethod) ? paymentMethod : methods[0]?.id;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only clock value, avoids SSR/client time mismatch
    setMsLeft(msUntilMidnight());
    const timer = setInterval(() => setMsLeft(msUntilMidnight()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/payment-methods/${ebook.slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setHiddenPayment(data.hidden ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [ebook.slug]);

  function handleClose() {
    setView("offer");
    setError(null);
    onClose();
  }

  async function placeOrder() {
    if (!effectiveMethod) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customerName,
          phone: customerPhone,
          paymentMethod: effectiveMethod,
          items: [{ productId: ebook.id, title: ebook.title, price: ebook.price, quantity: 1 }],
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        setAuthOpen(true);
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "অর্ডার প্রসেস করা যায়নি, আবার চেষ্টা করুন।");
        return;
      }
      setView("success");
    } catch {
      setError("নেটওয়ার্ক সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  }

  function handleAuthSuccess() {
    setAuthOpen(false);
    placeOrder();
  }

  return (
    <>
      <Modal open={open && !authOpen} onClose={handleClose} variant="dark">
        {view === "offer" && (
          <div className="text-left">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-300">
              <Clock size={13} /> সীমিত সময়ের বিশেষ অফার
            </p>
            <h2 className="mt-1.5 font-display text-base font-bold text-white">
              আপনার জন্য বিশেষভাবে বাছাই করা
            </h2>

            <div className="mt-3 flex items-center gap-3">
              <ProductImage
                title={ebook.title}
                category={ebook.category}
                colorFrom={ebook.colorFrom}
                colorTo={ebook.colorTo}
                imageUrl={ebook.coverImageUrl}
                hideLabel
                className="h-20 w-14 shrink-0 rounded-md"
              />
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-bold text-white">{ebook.title}</p>
                <div className="mt-1 flex items-center gap-1">
                  <Star size={12} className="text-star" fill="currentColor" strokeWidth={0} />
                  <span className="text-xs font-medium text-white/85">{ebook.rating.toFixed(1)}</span>
                  <span className="text-xs text-white/50">({toBengaliNumber(ebook.reviewCount)}+ রিভিউ)</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-lg font-bold text-white">{formatTaka(ebook.price)}</span>
                  {ebook.oldPrice && (
                    <span className="text-xs text-white/50 line-through">{formatTaka(ebook.oldPrice)}</span>
                  )}
                  {discount && (
                    <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[11px] font-bold text-emerald-300">
                      -{discount}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-white/75">{text}</p>

            <div className="mt-3 flex items-center gap-2 rounded-md border border-red-500/40 bg-red-500/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-red-300">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              অফার শেষ হতে বাকি: {msLeft !== null ? formatCountdown(msLeft) : "..."}
            </div>

            <button
              type="button"
              onClick={() => setView("payment")}
              className="mt-4 w-full rounded-md bg-cta py-2.5 text-center text-sm font-semibold text-white hover:bg-cta-dark"
            >
              এখনই অর্ডারে যোগ করুন
            </button>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <TableOfContentsToggle product={ebook} />
              <button
                type="button"
                onClick={() => setView("preview")}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-xs font-medium text-white"
              >
                <BookOpen size={14} /> কেনার আগে দেখুন
              </button>
            </div>
          </div>
        )}

        {view === "preview" && (
          <div className="text-left">
            <button type="button" onClick={() => setView("offer")} className="text-xs font-medium text-white/60 hover:text-white">
              ← ফিরে যান
            </button>
            <h2 className="mt-2 font-display text-base font-bold text-white">{ebook.title}</h2>
            <div className="mt-3 space-y-2.5 text-sm leading-relaxed text-white/75">
              <p>{ebook.description}</p>
              <ul className="space-y-1.5">
                {ebook.bullets.slice(0, 3).map((b) => (
                  <li key={b}>• {b}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4 rounded-md border border-dashed border-white/20 bg-white/5 p-3 text-center">
              <p className="text-xs text-white/60">এটি একটি সংক্ষিপ্ত নমুনা — সম্পূর্ণ কনটেন্ট পড়তে অর্ডার করুন।</p>
              <button
                type="button"
                onClick={() => setView("payment")}
                className="mt-3 w-full rounded-md bg-cta py-2.5 text-center text-sm font-semibold text-white hover:bg-cta-dark"
              >
                এখনই অর্ডারে যোগ করুন
              </button>
            </div>
          </div>
        )}

        {view === "payment" && (
          <div className="text-left">
            <button type="button" onClick={() => setView("offer")} className="text-xs font-medium text-white/60 hover:text-white">
              ← ফিরে যান
            </button>
            <h2 className="mt-2 font-display text-base font-bold text-white">পেমেন্ট পদ্ধতি বেছে নিন</h2>
            <p className="mt-1 text-xs text-white/60">
              ইবুক ইনস্ট্যান্ট ডেলিভারি — তাই অনলাইন পেমেন্ট প্রয়োজন।
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {methods.map((m) => {
                const Icon = m.icon;
                const active = effectiveMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-center ${
                      active ? "border-primary-light bg-white/10" : "border-white/15 bg-white/5"
                    }`}
                  >
                    <Icon size={18} className="text-white" />
                    <span className="text-xs font-medium text-white">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {error && <p className="mt-3 text-xs text-red-300">{error}</p>}

            <button
              type="button"
              onClick={placeOrder}
              disabled={submitting || !effectiveMethod}
              className="mt-4 w-full rounded-md bg-cta py-2.5 text-center text-sm font-semibold text-white hover:bg-cta-dark disabled:opacity-60"
            >
              {submitting ? "প্রসেস হচ্ছে..." : `কনফার্ম করুন — ${formatTaka(ebook.price)}`}
            </button>
          </div>
        )}

        {view === "success" && (
          <div className="py-2 text-center text-left">
            <p className="text-center font-display text-base font-bold text-white">ইবুকটি অর্ডার হয়ে গেছে!</p>
            <p className="mt-2 text-center text-sm text-white/75">
              ডাউনলোড লিংক আপনার প্রোফাইলে পাওয়া যাবে — যেকোনো সময় পড়তে পারবেন।
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-4 w-full rounded-md bg-cta py-2.5 text-center text-sm font-semibold text-white hover:bg-cta-dark"
            >
              ঠিক আছে
            </button>
          </div>
        )}
      </Modal>

      <ProfileAuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={handleAuthSuccess} />
    </>
  );
}
