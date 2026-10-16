"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Banknote, BookOpen, Clock, CreditCard, Smartphone, Star, Users } from "lucide-react";
import { Product } from "@/lib/types";
import { categoryMeta } from "@/lib/data/products";
import { formatTaka, discountPercent, toBengaliNumber } from "@/lib/format";
import { Modal } from "@/components/ui/Modal";
import { ProductImage } from "@/components/ui/ProductImage";
import { AreaSelector, DeliveryZone } from "@/components/product/AreaSelector";
import { TableOfContentsToggle } from "@/components/product/TableOfContentsToggle";
import { ProfileAuthModal } from "@/components/profile/ProfileAuthModal";

type PaymentMethod = "cod" | "bkash" | "card";
const EBOOK_PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: typeof Smartphone }[] = [
  { id: "bkash", label: "বিকাশ", icon: Smartphone },
  { id: "card", label: "কার্ড", icon: CreditCard },
];
const BOOK_PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: typeof Smartphone }[] = [
  { id: "cod", label: "ক্যাশ অন ডেলিভারি", icon: Banknote },
  { id: "bkash", label: "বিকাশ", icon: Smartphone },
  { id: "card", label: "কার্ড", icon: CreditCard },
];
const FALLBACK_ZONES: DeliveryZone[] = [
  { key: "inside-dhaka", label: "ঢাকার ভিতরে", days: "২-৩ দিন", fee: 70 },
  { key: "outside-dhaka", label: "ঢাকার বাইরে", days: "৪-৬ দিন", fee: 130 },
];

type View = "offer" | "preview" | "payment" | "success" | "secondPreview";

export type SecondOffer = { category: "book" | "gear"; product: Product };

export function CrossSellModal({
  product,
  category,
  message,
  soldCount,
  customerName,
  customerPhone,
  secondOffer,
  open,
  onClose,
}: {
  product: Product;
  category: "ebook" | "book";
  message: string;
  soldCount: number;
  customerName: string;
  customerPhone: string;
  secondOffer?: SecondOffer;
  open: boolean;
  onClose: () => void;
}) {
  const isEbook = category === "ebook";
  const [view, setView] = useState<View>("offer");
  const [hiddenPayment, setHiddenPayment] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [address, setAddress] = useState("");
  const [zones, setZones] = useState<DeliveryZone[]>(FALLBACK_ZONES);
  const [area, setArea] = useState(FALLBACK_ZONES[0].label);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  const discount = discountPercent(product.price, product.oldPrice);
  const text = message.replace("{count}", toBengaliNumber(soldCount));
  const allMethods = isEbook ? EBOOK_PAYMENT_METHODS : BOOK_PAYMENT_METHODS;
  const methods = allMethods.filter((m) => !hiddenPayment.includes(m.id));
  const effectiveMethod = paymentMethod && methods.some((m) => m.id === paymentMethod) ? paymentMethod : methods[0]?.id;
  const deliveryFee = isEbook ? 0 : zones.find((z) => z.label === area)?.fee ?? zones[0]?.fee ?? 0;
  const total = product.price + deliveryFee;

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/payment-methods/${product.slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setHiddenPayment(data.hidden ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [product.slug]);

  useEffect(() => {
    if (isEbook) return;
    let cancelled = false;
    fetch("/api/order-form-settings")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data.deliveryZones) && data.deliveryZones.length > 0) {
          setZones(data.deliveryZones);
          setArea(data.deliveryZones[0].label);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isEbook]);

  function handleClose() {
    setView("offer");
    setError(null);
    onClose();
  }

  async function placeOrder() {
    if (!effectiveMethod) return;
    if (!isEbook && !address.trim()) {
      setError("ঠিকানা আবশ্যক");
      return;
    }
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
          address: isEbook ? undefined : address,
          area: isEbook ? undefined : area,
          items: [{ productId: product.id, title: product.title, price: product.price, quantity: 1 }],
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
      <Modal open={open && !authOpen} onClose={handleClose} variant="offer">
        {view === "offer" && (
          <div className="text-left">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-700">
              <Clock size={13} /> সীমিত সময়ের বিশেষ অফার
            </p>
            <h2 className="mt-1.5 font-display text-base font-bold text-foreground">
              আপনার জন্য বিশেষভাবে বাছাই করা
            </h2>

            <div className="mt-3 flex items-center gap-3">
              <ProductImage
                title={product.title}
                category={product.category}
                colorFrom={product.colorFrom}
                colorTo={product.colorTo}
                imageUrl={product.coverImageUrl}
                hideLabel
                className="h-20 w-14 shrink-0 rounded-md"
              />
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-bold text-foreground">{product.title}</p>
                <div className="mt-1 flex items-center gap-1">
                  <Star size={12} className="text-star" fill="currentColor" strokeWidth={0} />
                  <span className="text-xs font-medium text-ink-soft">{product.rating.toFixed(1)}</span>
                  <span className="text-xs text-ink-faint">({toBengaliNumber(product.reviewCount)}+ রিভিউ)</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">{formatTaka(product.price)}</span>
                  {product.oldPrice && (
                    <span className="text-xs text-ink-faint line-through">{formatTaka(product.oldPrice)}</span>
                  )}
                  {discount && (
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[11px] font-bold text-emerald-700">
                      -{discount}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2">
              <p className="flex items-start gap-1.5 text-xs font-bold leading-relaxed text-amber-900">
                <Users size={14} className="mt-0.5 shrink-0" />
                <span>{text}</span>
              </p>
              <p className="mt-1 flex items-center gap-1 pl-[21px] text-[11px] text-amber-800/80">
                <Star size={11} className="shrink-0 text-star" fill="currentColor" strokeWidth={0} />
                {product.rating.toFixed(1)} রেটিং — পাঠকদের আস্থার পছন্দ
              </p>
            </div>

            <button
              type="button"
              onClick={() => setView("payment")}
              className="mt-4 w-full rounded-md bg-cta py-2.5 text-center text-sm font-semibold text-white hover:bg-cta-dark"
            >
              এখনই অর্ডারে যোগ করুন
            </button>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <TableOfContentsToggle product={product} variant="light" />
              <button
                type="button"
                onClick={() => setView("preview")}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface-muted px-3 py-2.5 text-xs font-medium text-foreground"
              >
                <BookOpen size={14} /> কেনার আগে ১৫ পৃষ্ঠা পড়ে নিন
              </button>
            </div>
          </div>
        )}

        {view === "preview" && (
          <div className="text-left">
            <button type="button" onClick={() => setView("offer")} className="text-xs font-medium text-ink-faint hover:text-foreground">
              ← ফিরে যান
            </button>
            <p className="mt-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-emerald-700">
              <BookOpen size={13} /> নমুনা — প্রথম ১৫ পৃষ্ঠা পর্যন্ত বিনামূল্যে
            </p>
            <h2 className="mt-1.5 font-display text-base font-bold text-foreground">{product.title}</h2>
            <div className="mt-3 max-h-64 space-y-2.5 overflow-y-auto pr-1 text-sm leading-relaxed text-ink-soft">
              <p>{product.description}</p>
              <ul className="space-y-1.5">
                {product.bullets.map((b) => (
                  <li key={b}>• {b}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4 rounded-md border border-dashed border-border bg-surface-muted p-3 text-center">
              <p className="text-xs text-ink-faint">এটি একটি সংক্ষিপ্ত নমুনা — সম্পূর্ণ কনটেন্ট পড়তে অর্ডার করুন।</p>
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
            <button type="button" onClick={() => setView("offer")} className="text-xs font-medium text-ink-faint hover:text-foreground">
              ← ফিরে যান
            </button>
            <h2 className="mt-2 font-display text-base font-bold text-foreground">
              {isEbook ? "পেমেন্ট পদ্ধতি বেছে নিন" : "ঠিকানা ও পেমেন্ট পদ্ধতি"}
            </h2>
            <p className="mt-1 text-xs text-ink-soft">
              {isEbook
                ? "ইবুক ইনস্ট্যান্ট ডেলিভারি — তাই অনলাইন পেমেন্ট প্রয়োজন।"
                : "আপনার ঠিকানায় পৌঁছে দেওয়া হবে — ক্যাশ অন ডেলিভারি অথবা অনলাইন পেমেন্ট বেছে নিন।"}
            </p>

            {!isEbook && (
              <div className="mt-3 flex flex-col gap-2">
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  placeholder="সম্পূর্ণ ঠিকানা লিখুন *"
                  className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                />
                <AreaSelector zones={zones} value={area} onChange={setArea} />
              </div>
            )}

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
                      active ? "border-primary bg-primary-light" : "border-border bg-surface-muted"
                    }`}
                  >
                    <Icon size={18} className="text-foreground" />
                    <span className="text-xs font-medium text-foreground">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {error && <p className="mt-3 text-xs text-price">{error}</p>}

            <button
              type="button"
              onClick={placeOrder}
              disabled={submitting || !effectiveMethod}
              className="mt-4 w-full rounded-md bg-cta py-2.5 text-center text-sm font-semibold text-white hover:bg-cta-dark disabled:opacity-60"
            >
              {submitting ? "প্রসেস হচ্ছে..." : `কনফার্ম করুন — ${formatTaka(total)}`}
            </button>
          </div>
        )}

        {view === "success" && (
          <div className="py-2 text-center text-left">
            <p className="text-center font-display text-base font-bold text-foreground">
              {isEbook ? "ইবুকটি অর্ডার হয়ে গেছে!" : "অর্ডারটি গ্রহণ করা হয়েছে!"}
            </p>
            <p className="mt-2 text-center text-sm text-ink-soft">
              {isEbook
                ? "ডাউনলোড লিংক আপনার প্রোফাইলে পাওয়া যাবে — যেকোনো সময় পড়তে পারবেন।"
                : "আমাদের একজন প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন। পণ্য হাতে পেয়ে টাকা পরিশোধ করুন।"}
            </p>
            {isEbook ? (
              <Link
                href="/profile"
                onClick={handleClose}
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-md bg-cta py-2.5 text-center text-sm font-semibold text-white hover:bg-cta-dark"
              >
                আমার প্রোফাইলে পড়ুন <ArrowRight size={14} />
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleClose}
                className="mt-4 w-full rounded-md bg-cta py-2.5 text-center text-sm font-semibold text-white hover:bg-cta-dark"
              >
                ঠিক আছে
              </button>
            )}
            {isEbook && (
              <button
                type="button"
                onClick={handleClose}
                className="mt-2 w-full py-1.5 text-center text-xs font-medium text-ink-faint hover:text-foreground"
              >
                ঠিক আছে
              </button>
            )}

            {secondOffer && (
              <div className="mt-5 border-t border-border pt-4">
                <p className="text-xs font-bold uppercase tracking-wide text-primary">আপনার জন্য আরও একটি সুযোগ</p>
                <div className="mt-2 flex items-center gap-3">
                  <ProductImage
                    title={secondOffer.product.title}
                    category={secondOffer.product.category}
                    colorFrom={secondOffer.product.colorFrom}
                    colorTo={secondOffer.product.colorTo}
                    imageUrl={secondOffer.product.coverImageUrl}
                    hideLabel
                    className="h-20 w-14 shrink-0 rounded-md"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-bold text-foreground">{secondOffer.product.title}</p>
                    <div className="mt-1 flex items-center gap-1">
                      <Star size={12} className="text-star" fill="currentColor" strokeWidth={0} />
                      <span className="text-xs font-medium text-ink-soft">{secondOffer.product.rating.toFixed(1)}</span>
                      <span className="text-xs text-ink-faint">({toBengaliNumber(secondOffer.product.reviewCount)}+ রিভিউ)</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-base font-bold text-foreground">{formatTaka(secondOffer.product.price)}</span>
                      {secondOffer.product.oldPrice && (
                        <span className="text-xs text-ink-faint line-through">{formatTaka(secondOffer.product.oldPrice)}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2">
                  <p className="flex items-start gap-1.5 text-xs font-bold leading-relaxed text-amber-900">
                    <Users size={14} className="mt-0.5 shrink-0" />
                    <span>ইতিমধ্যে {toBengaliNumber(secondOffer.product.reviewCount)}+ জন এটি ব্যবহার করছেন — আজকের অর্ডারের সাথেই যোগ করে নিন।</span>
                  </p>
                </div>

                <Link
                  href={`${categoryMeta[secondOffer.product.category].path}/${secondOffer.product.slug}`}
                  onClick={handleClose}
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md bg-cta py-2.5 text-center text-sm font-semibold text-white hover:bg-cta-dark"
                >
                  এখনই কিনুন <ArrowRight size={14} />
                </Link>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <TableOfContentsToggle product={secondOffer.product} variant="light" />
                  <button
                    type="button"
                    onClick={() => setView("secondPreview")}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface-muted px-3 py-2.5 text-xs font-medium text-foreground"
                  >
                    <BookOpen size={14} /> কেনার আগে ১৫ পৃষ্ঠা পড়ে নিন
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {view === "secondPreview" && secondOffer && (
          <div className="text-left">
            <button
              type="button"
              onClick={() => setView("success")}
              className="text-xs font-medium text-ink-faint hover:text-foreground"
            >
              ← ফিরে যান
            </button>
            <p className="mt-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-emerald-700">
              <BookOpen size={13} /> নমুনা — প্রথম ১৫ পৃষ্ঠা পর্যন্ত বিনামূল্যে
            </p>
            <h2 className="mt-1.5 font-display text-base font-bold text-foreground">{secondOffer.product.title}</h2>
            <div className="mt-3 max-h-64 space-y-2.5 overflow-y-auto pr-1 text-sm leading-relaxed text-ink-soft">
              <p>{secondOffer.product.description}</p>
              <ul className="space-y-1.5">
                {secondOffer.product.bullets.map((b) => (
                  <li key={b}>• {b}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4 rounded-md border border-dashed border-border bg-surface-muted p-3 text-center">
              <p className="text-xs text-ink-faint">এটি একটি সংক্ষিপ্ত নমুনা — সম্পূর্ণ কনটেন্ট পড়তে অর্ডার করুন।</p>
              <Link
                href={`${categoryMeta[secondOffer.product.category].path}/${secondOffer.product.slug}`}
                onClick={handleClose}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md bg-cta py-2.5 text-center text-sm font-semibold text-white hover:bg-cta-dark"
              >
                এখনই কিনুন <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </Modal>

      <ProfileAuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={handleAuthSuccess} />
    </>
  );
}
