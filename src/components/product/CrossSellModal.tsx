"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  CreditCard,
  Image as ImageIcon,
  MessageSquare,
  Newspaper,
  Play,
  Smartphone,
  Sparkles,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { Product } from "@/lib/types";
import { categoryMeta } from "@/lib/data/products";
import { ExpertOpinion, getExpertOpinions, getExpertVideoOpinions, getProductVideoSlots } from "@/lib/data/landingContent";
import { formatTaka, discountPercent, toBengaliNumber } from "@/lib/format";
import { Modal } from "@/components/ui/Modal";
import { ProductImage } from "@/components/ui/ProductImage";
import { AreaSelector, DeliveryZone } from "@/components/product/AreaSelector";
import { TableOfContentsToggle } from "@/components/product/TableOfContentsToggle";
import { ANGLE_LABELS } from "@/components/product/ProductImageGallery";
import { ProfileAuthModal } from "@/components/profile/ProfileAuthModal";

const SECOND_VIDEO_THUMB_COUNT = 5;

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

function offerCategoryLabel(category: Product["category"]) {
  return category === "gear" ? "প্রোডাক্টিভিটি গিয়ার" : categoryMeta[category].label;
}

function badgeColorClass(badge?: string) {
  if (badge === "বেস্ট সেলার") return "bg-amber-500";
  if (badge === "নতুন") return "bg-sky-500";
  return "bg-price";
}

type View =
  | "offer"
  | "preview"
  | "gallery"
  | "video"
  | "reviews"
  | "payment"
  | "success"
  | "secondPreview"
  | "secondReviews"
  | "secondVideo"
  | "secondGallery"
  | "secondPayment"
  | "secondSuccess";

export type SecondOffer = { category: "book" | "gear"; product: Product };

export function CrossSellModal({
  product,
  category,
  message,
  soldCount,
  customerName,
  customerPhone,
  customerAddress,
  customerArea,
  orderId,
  orderProductTitle,
  orderProductCategory,
  orderProductPrice,
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
  customerAddress?: string;
  customerArea?: string;
  orderId?: string;
  orderProductTitle?: string;
  orderProductCategory?: Product["category"];
  orderProductPrice?: number;
  secondOffer?: SecondOffer;
  open: boolean;
  onClose: () => void;
}) {
  const isEbook = category === "ebook";
  const [view, setView] = useState<View>("offer");
  const [hiddenPayment, setHiddenPayment] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [orderName, setOrderName] = useState(customerName);
  const [orderPhone, setOrderPhone] = useState(customerPhone);
  const [address, setAddress] = useState("");
  const [zones, setZones] = useState<DeliveryZone[]>(FALLBACK_ZONES);
  const [area, setArea] = useState(FALLBACK_ZONES[0].label);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [galleryActive, setGalleryActive] = useState(0);
  const [videoActive, setVideoActive] = useState(0);
  const [secondGalleryActive, setSecondGalleryActive] = useState(0);
  const [secondVideoActive, setSecondVideoActive] = useState(0);
  const [secondHiddenPayment, setSecondHiddenPayment] = useState<string[]>([]);
  const [secondAddress, setSecondAddress] = useState(customerAddress ?? "");
  const [secondAddressEditing, setSecondAddressEditing] = useState(false);
  const [secondArea, setSecondArea] = useState(customerArea || FALLBACK_ZONES[0].label);
  const [secondPaymentMethod, setSecondPaymentMethod] = useState<PaymentMethod | null>(null);
  const [secondSubmitting, setSecondSubmitting] = useState(false);
  const [secondError, setSecondError] = useState<string | null>(null);
  const [expandedVideoReview, setExpandedVideoReview] = useState<ExpertOpinion | null>(null);
  const [secondExpandedVideoReview, setSecondExpandedVideoReview] = useState<ExpertOpinion | null>(null);

  const discount = discountPercent(product.price, product.oldPrice);
  const text = message.replace("{count}", toBengaliNumber(soldCount));
  const allMethods = isEbook ? EBOOK_PAYMENT_METHODS : BOOK_PAYMENT_METHODS;
  const methods = allMethods.filter((m) => !hiddenPayment.includes(m.id));
  const effectiveMethod = paymentMethod && methods.some((m) => m.id === paymentMethod) ? paymentMethod : methods[0]?.id;
  const deliveryFee = isEbook ? 0 : zones.find((z) => z.label === area)?.fee ?? zones[0]?.fee ?? 0;
  const total = product.price + deliveryFee;

  const secondMethods = BOOK_PAYMENT_METHODS.filter((m) => !secondHiddenPayment.includes(m.id));
  const secondEffectiveMethod =
    secondPaymentMethod && secondMethods.some((m) => m.id === secondPaymentMethod) ? secondPaymentMethod : secondMethods[0]?.id;
  const secondDeliveryFee = zones.find((z) => z.label === secondArea)?.fee ?? zones[0]?.fee ?? 0;
  const secondTotal = (secondOffer?.product.price ?? 0) + secondDeliveryFee;

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
    if (isEbook && !secondOffer) return;
    let cancelled = false;
    fetch("/api/order-form-settings")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data.deliveryZones) && data.deliveryZones.length > 0) {
          setZones(data.deliveryZones);
          if (!isEbook) setArea(data.deliveryZones[0].label);
          setSecondArea((prev: string) =>
            data.deliveryZones.some((z: DeliveryZone) => z.label === prev) ? prev : data.deliveryZones[0].label
          );
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isEbook, secondOffer]);

  useEffect(() => {
    if (!secondOffer) return;
    let cancelled = false;
    fetch(`/api/payment-methods/${secondOffer.product.slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setSecondHiddenPayment(data.hidden ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [secondOffer]);

  function handleClose() {
    setView("offer");
    setError(null);
    setSecondError(null);
    setGalleryActive(0);
    setVideoActive(0);
    setSecondGalleryActive(0);
    setSecondVideoActive(0);
    setSecondAddressEditing(false);
    setExpandedVideoReview(null);
    setSecondExpandedVideoReview(null);
    onClose();
  }

  function goToSecondPayment() {
    setView("secondPayment");
  }

  async function placeOrder() {
    if (!effectiveMethod) return;
    if (!orderName.trim() || !orderPhone.trim()) {
      setError("নাম এবং ফোন নম্বর আবশ্যক");
      return;
    }
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
          name: orderName,
          phone: orderPhone,
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

  async function placeSecondOrder() {
    if (!secondOffer || !secondEffectiveMethod) return;
    if (!orderName.trim() || !orderPhone.trim()) {
      setSecondError("নাম এবং ফোন নম্বর আবশ্যক");
      return;
    }
    if (!secondAddress.trim()) {
      setSecondError("ঠিকানা আবশ্যক");
      return;
    }
    setSecondSubmitting(true);
    setSecondError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: orderName,
          phone: orderPhone,
          paymentMethod: secondEffectiveMethod,
          address: secondAddress,
          area: secondArea,
          items: [
            {
              productId: secondOffer.product.id,
              title: secondOffer.product.title,
              price: secondOffer.product.price,
              quantity: 1,
            },
          ],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSecondError(data.error ?? "অর্ডার প্রসেস করা যায়নি, আবার চেষ্টা করুন।");
        return;
      }
      setView("secondSuccess");
    } catch {
      setSecondError("নেটওয়ার্ক সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    } finally {
      setSecondSubmitting(false);
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
            {orderId && (
              <div className="mb-3 flex items-center gap-2.5 rounded-lg border-2 border-emerald-400 bg-emerald-100 px-3.5 py-3 shadow-sm">
                <CheckCircle2 size={22} className="shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-bold text-emerald-900">
                    {orderProductTitle ? (
                      <>
                        <strong>{orderProductTitle}</strong>
                        {orderProductCategory && ` (${categoryMeta[orderProductCategory].label})`} অর্ডারটি সফলভাবে সম্পন্ন হয়েছে —{" "}
                      </>
                    ) : (
                      "আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে — "
                    )}
                    অর্ডার আইডি: <span className="text-emerald-700">{orderId}</span>
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-700">
                    <Sparkles size={12} className="shrink-0" /> দারুণ একটা সিদ্ধান্ত! নিজের জন্য এই বিনিয়োগটা করার জন্য অভিনন্দন।
                  </p>
                </div>
              </div>
            )}
            <div className="mt-4 rounded-lg border border-border bg-surface p-3 shadow-sm">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-700">
                <Clock size={13} /> সীমিত সময়ের বিশেষ অফার
              </p>
              <h2 className="mt-1.5 font-display text-base font-bold text-foreground">
                আপনার জন্য বিশেষভাবে বাছাই করা
              </h2>

              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setView("gallery")}
                  aria-label={`${product.title} এর ছবি বড় করে দেখুন`}
                  className="shrink-0"
                >
                  <ProductImage
                    title={product.title}
                    category={product.category}
                    colorFrom={product.colorFrom}
                    colorTo={product.colorTo}
                    imageUrl={product.coverImageUrl}
                    hideLabel
                    className="h-20 w-14 rounded-md"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setView("video")}
                  aria-label={`${product.title} এর ভিডিও দেখুন`}
                  className="group relative flex h-20 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md"
                  style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface/90 shadow-sm transition group-hover:scale-105">
                    <Play size={12} className="ml-0.5 text-foreground" fill="currentColor" />
                  </div>
                </button>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="inline-block rounded bg-primary-light px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-dark">
                      {offerCategoryLabel(product.category)}
                    </span>
                    {product.badge && (
                      <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold text-white ${badgeColorClass(product.badge)}`}>
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate font-display text-sm font-bold text-foreground">{product.title}</p>
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
              <p className="mt-2 text-xs leading-relaxed text-ink-soft">{product.shortDescription}</p>

              <div className="mt-3 rounded-md border border-sky-300 bg-sky-50 px-3 py-2">
                <p className="flex items-start gap-1.5 text-xs font-bold leading-relaxed text-sky-900">
                  <Users size={14} className="mt-0.5 shrink-0 text-sky-600" />
                  <span>{text}</span>
                </p>
                <p className="mt-1 flex items-center gap-1 pl-[21px] text-[11px] text-sky-800/80">
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

              <div className="mt-3 flex flex-col gap-2">
                <TableOfContentsToggle product={product} variant="light" />
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setView("preview")}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface-muted px-2 py-2.5 text-xs font-medium text-foreground"
                  >
                    <BookOpen size={14} /> ১৫ পৃষ্ঠা পড়ুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("reviews")}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface-muted px-2 py-2.5 text-xs font-medium text-foreground"
                  >
                    <MessageSquare size={14} /> রিভিউ দেখুন
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "preview" && (
          <div className="text-left">
            <button type="button" onClick={() => setView("offer")} className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary-light px-2.5 py-1.5 text-xs font-bold text-primary-dark hover:bg-primary-light/70">
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

        {view === "gallery" && (
          <div className="text-left">
            <button type="button" onClick={() => setView("offer")} className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary-light px-2.5 py-1.5 text-xs font-bold text-primary-dark hover:bg-primary-light/70">
              ← ফিরে যান
            </button>
            <div className="relative mt-3">
              <ProductImage
                title={product.title}
                category={product.category}
                colorFrom={product.colorFrom}
                colorTo={product.colorTo}
                imageUrl={product.coverImageUrl}
                iconSize={64}
                className="aspect-[3/4] w-full rounded-lg shadow-lg"
              />
              <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white">
                {ANGLE_LABELS[galleryActive]} · {toBengaliNumber(galleryActive + 1)}/{toBengaliNumber(ANGLE_LABELS.length)}
              </span>
              <button
                type="button"
                onClick={() => setGalleryActive((a) => (a - 1 + ANGLE_LABELS.length) % ANGLE_LABELS.length)}
                aria-label="আগের ছবি"
                className="absolute left-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setGalleryActive((a) => (a + 1) % ANGLE_LABELS.length)}
                aria-label="পরের ছবি"
                className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-center gap-1.5">
              {ANGLE_LABELS.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setGalleryActive(i)}
                  aria-label={label}
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: i === galleryActive ? "20px" : "6px", background: i === galleryActive ? "#16a34a" : "var(--color-border)" }}
                />
              ))}
            </div>
            <div className="mt-3">
              <p className="font-display text-sm font-bold text-foreground">{product.title}</p>
              <div className="mt-1 flex items-center gap-1">
                <Star size={12} className="text-star" fill="currentColor" strokeWidth={0} />
                <span className="text-xs font-medium text-ink-soft">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-ink-faint">({toBengaliNumber(product.reviewCount)}+ রিভিউ)</span>
              </div>
              <p className="mt-2 text-sm text-ink-soft">{product.shortDescription}</p>
            </div>
            <button
              type="button"
              onClick={() => setView("payment")}
              className="mt-3 w-full rounded-md bg-cta py-2.5 text-center text-sm font-semibold text-white hover:bg-cta-dark"
            >
              এখনই অর্ডারে যোগ করুন
            </button>
          </div>
        )}

        {view === "video" && (() => {
          const slots = getProductVideoSlots();
          const thumbSlots = slots.slice(1, 1 + SECOND_VIDEO_THUMB_COUNT);
          const activeSlot = slots[videoActive] ?? slots[0];
          return (
            <div className="text-left">
              <button type="button" onClick={() => setView("offer")} className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary-light px-2.5 py-1.5 text-xs font-bold text-primary-dark hover:bg-primary-light/70">
                ← ফিরে যান
              </button>
              <div
                className="mt-3 flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg"
                style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface/90 shadow-sm">
                  <Play size={28} className="ml-1 text-foreground" fill="currentColor" />
                </div>
              </div>
              <div className="mt-3">
                <p className="font-display text-sm font-bold text-foreground">{product.title}</p>
                <p className="mt-0.5 text-xs text-ink-faint">{activeSlot.caption} (শীঘ্রই যুক্ত হবে)</p>
                <div className="mt-1.5 flex items-center gap-1">
                  <Star size={12} className="text-star" fill="currentColor" strokeWidth={0} />
                  <span className="text-xs font-medium text-ink-soft">{product.rating.toFixed(1)}</span>
                  <span className="text-xs text-ink-faint">({toBengaliNumber(product.reviewCount)}+ রিভিউ)</span>
                </div>
                <p className="mt-2 text-sm text-ink-soft">{product.shortDescription}</p>
              </div>

              {thumbSlots.length > 0 && (
                <div className="-mx-1 mt-3 flex gap-2.5 overflow-x-auto border-t border-border px-1 pb-1 pt-3 scrollbar-none">
                  {thumbSlots.map((slot, i) => (
                    <button
                      key={`${slot.caption}-${i}`}
                      type="button"
                      onClick={() => setVideoActive(i + 1)}
                      aria-label={`${slot.caption} দেখুন`}
                      className="group flex w-16 shrink-0 flex-col gap-1 text-left"
                    >
                      <div
                        className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-md"
                        style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface/90 shadow-sm transition group-hover:scale-105">
                          <Play size={10} className="ml-0.5 text-foreground" fill="currentColor" />
                        </div>
                      </div>
                      <p className="w-full truncate text-[10px] font-medium text-foreground">{slot.caption}</p>
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setView("payment")}
                className="mt-3 w-full rounded-md bg-cta py-2.5 text-center text-sm font-semibold text-white hover:bg-cta-dark"
              >
                এখনই অর্ডারে যোগ করুন
              </button>
            </div>
          );
        })()}

        {view === "reviews" && (
          <div className="text-left">
            <button
              type="button"
              onClick={() => (expandedVideoReview ? setExpandedVideoReview(null) : setView("offer"))}
              className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary-light px-2.5 py-1.5 text-xs font-bold text-primary-dark hover:bg-primary-light/70"
            >
              ← ফিরে যান
            </button>

            {expandedVideoReview ? (
              <div className="mt-3">
                <div
                  className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg"
                  style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface/90 shadow-sm">
                    <Play size={28} className="ml-1 text-foreground" fill="currentColor" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-sm font-bold text-foreground">{expandedVideoReview.name}</span>
                    <Star size={12} className="text-star" fill="currentColor" strokeWidth={0} />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">&ldquo;{expandedVideoReview.quote}&rdquo;</p>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-emerald-700">
                  <MessageSquare size={13} /> গ্রাহকদের মতামত
                </p>
                <h2 className="mt-1.5 font-display text-base font-bold text-foreground">{product.title}</h2>

                <div className="mt-3 max-h-80 space-y-5 overflow-y-auto pr-1">
                  <div>
                    <p className="mb-2 text-xs font-semibold text-ink-soft">টেক্সট রিভিউ</p>
                    <div className="space-y-2.5">
                      {getExpertOpinions(product, 3).map((r, i) => (
                        <div key={i} className="flex gap-2.5 rounded-lg border border-border bg-surface-muted p-3">
                          {r.hasPhoto ? (
                            <div
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/80"
                              style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
                            >
                              <ImageIcon size={16} />
                            </div>
                          ) : (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary-dark">
                              {r.name.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-medium text-foreground">{r.name}</span>
                              <Star size={12} className="text-star" fill="currentColor" strokeWidth={0} />
                            </div>
                            <p className="mt-1 text-sm leading-relaxed text-ink-soft">&ldquo;{r.quote}&rdquo;</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold text-ink-soft">ভিডিও রিভিউ</p>
                    <div className="space-y-2.5">
                      {getExpertVideoOpinions(product, 3).map((r, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setExpandedVideoReview(r)}
                          aria-label={`${r.name} এর ভিডিও রিভিউ বড় করে দেখুন`}
                          className="group flex w-full items-center gap-3 rounded-lg border border-border bg-surface-muted p-3 text-left"
                        >
                          <div
                            className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md"
                            style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
                          >
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface/90 transition group-hover:scale-105">
                              <Play size={10} className="ml-0.5 text-foreground" fill="currentColor" />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <Star size={12} className="text-star" fill="currentColor" strokeWidth={0} />
                              <span className="text-xs font-medium text-foreground">{r.name}</span>
                            </div>
                            <p className="mt-0.5 line-clamp-2 text-xs text-ink-faint">&ldquo;{r.quote}&rdquo;</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            <button
              type="button"
              onClick={() => setView("payment")}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-md bg-cta py-2.5 text-center text-sm font-semibold text-white hover:bg-cta-dark"
            >
              এখনই অর্ডারে যোগ করুন
            </button>
          </div>
        )}

        {view === "payment" && (
          <div className="text-left">
            <button type="button" onClick={() => setView("offer")} className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary-light px-2.5 py-1.5 text-xs font-bold text-primary-dark hover:bg-primary-light/70">
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

            <div className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-surface-muted p-3">
              <ProductImage
                title={product.title}
                category={product.category}
                colorFrom={product.colorFrom}
                colorTo={product.colorTo}
                imageUrl={product.coverImageUrl}
                hideLabel
                className="h-14 w-10 shrink-0 rounded-md"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{product.title}</p>
                {product.badge && (
                  <span className={`mt-0.5 inline-block rounded px-1.5 py-0.5 text-[9px] font-bold text-white ${badgeColorClass(product.badge)}`}>
                    {product.badge}
                  </span>
                )}
                <p className="mt-0.5 text-xs text-ink-faint">পরিমাণ: ১</p>
              </div>
              <span className="shrink-0 text-sm font-bold text-foreground">{formatTaka(product.price)}</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <input
                value={orderName}
                onChange={(e) => setOrderName(e.target.value)}
                placeholder="নাম *"
                className="rounded border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                value={orderPhone}
                onChange={(e) => setOrderPhone(e.target.value)}
                placeholder="ফোন নম্বর *"
                className="rounded border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {!isEbook && (
              <div className="mt-2 flex flex-col gap-2">
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
              {product.title} ({categoryMeta[product.category].label}) {isEbook ? "অর্ডার হয়ে গেছে!" : "অর্ডারটি গ্রহণ করা হয়েছে!"}
            </p>
            <p className="mt-2 text-center text-sm text-ink-soft">
              {isEbook
                ? "ডাউনলোড লিংক আপনার প্রোফাইলে পাওয়া যাবে — যেকোনো সময় পড়তে পারবেন।"
                : "আমাদের একজন প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন। পণ্য হাতে পেয়ে টাকা পরিশোধ করুন।"}
            </p>
            <p className="mt-2 flex items-center justify-center gap-1 text-xs font-medium text-primary">
              <Sparkles size={12} className="shrink-0" /> আরেকটা দারুণ সিদ্ধান্ত! আপনি সত্যিই নিজের যত্ন নিচ্ছেন।
            </p>
            {isEbook ? (
              <Link
                href="/profile"
                onClick={handleClose}
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-md bg-cta py-2.5 text-center text-sm font-semibold text-white hover:bg-cta-dark"
              >
                আপনার প্রোফাইলে পড়ুন <ArrowRight size={14} />
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
              <div className="mt-5 rounded-lg border border-border bg-surface p-3 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-primary">আপনার জন্য আরও একটি সুযোগ</p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setView("secondGallery")}
                    aria-label={`${secondOffer.product.title} এর ছবি বড় করে দেখুন`}
                    className="shrink-0"
                  >
                    <ProductImage
                      title={secondOffer.product.title}
                      category={secondOffer.product.category}
                      colorFrom={secondOffer.product.colorFrom}
                      colorTo={secondOffer.product.colorTo}
                      imageUrl={secondOffer.product.coverImageUrl}
                      hideLabel
                      className="h-20 w-14 rounded-md"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("secondVideo")}
                    aria-label={`${secondOffer.product.title} এর ভিডিও দেখুন`}
                    className="group relative flex h-20 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md"
                    style={{ background: `linear-gradient(135deg, ${secondOffer.product.colorFrom}, ${secondOffer.product.colorTo})` }}
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface/90 shadow-sm transition group-hover:scale-105">
                      <Play size={12} className="ml-0.5 text-foreground" fill="currentColor" />
                    </div>
                  </button>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="inline-block rounded bg-primary-light px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-dark">
                        {offerCategoryLabel(secondOffer.category)}
                      </span>
                      {secondOffer.product.badge && (
                        <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold text-white ${badgeColorClass(secondOffer.product.badge)}`}>
                          {secondOffer.product.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 truncate font-display text-sm font-bold text-foreground">{secondOffer.product.title}</p>
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
                <p className="mt-2 text-xs leading-relaxed text-ink-soft">{secondOffer.product.shortDescription}</p>

                <div className="mt-3 rounded-md border border-sky-300 bg-sky-50 px-3 py-2">
                  <p className="flex items-start gap-1.5 text-xs font-bold leading-relaxed text-sky-900">
                    <Users size={14} className="mt-0.5 shrink-0 text-sky-600" />
                    <span>ইতিমধ্যে {toBengaliNumber(secondOffer.product.reviewCount)}+ জন এটি ব্যবহার করছেন — আজকের অর্ডারের সাথেই যোগ করে নিন।</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={goToSecondPayment}
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md bg-cta py-2.5 text-center text-sm font-semibold text-white hover:bg-cta-dark"
                >
                  এখনই কিনুন <ArrowRight size={14} />
                </button>

                {secondOffer.category === "book" ? (
                  <div className="mt-2 flex flex-col gap-2">
                    <TableOfContentsToggle product={secondOffer.product} variant="light" />
                    <button
                      type="button"
                      onClick={() => setView("secondPreview")}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface-muted px-3 py-2.5 text-xs font-medium text-foreground"
                    >
                      <BookOpen size={14} /> কেনার আগে ১৫ পৃষ্ঠা পড়ে নিন
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setView("secondReviews")}
                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-surface-muted px-3 py-2.5 text-xs font-medium text-foreground"
                  >
                    <MessageSquare size={14} /> রিভিউ দেখুন
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {view === "secondPreview" && secondOffer && (
          <div className="text-left">
            <button
              type="button"
              onClick={() => setView("success")}
              className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary-light px-2.5 py-1.5 text-xs font-bold text-primary-dark hover:bg-primary-light/70"
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
              <button
                type="button"
                onClick={goToSecondPayment}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md bg-cta py-2.5 text-center text-sm font-semibold text-white hover:bg-cta-dark"
              >
                এখনই কিনুন <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {view === "secondReviews" && secondOffer && (
          <div className="text-left">
            <button
              type="button"
              onClick={() => (secondExpandedVideoReview ? setSecondExpandedVideoReview(null) : setView("success"))}
              className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary-light px-2.5 py-1.5 text-xs font-bold text-primary-dark hover:bg-primary-light/70"
            >
              ← ফিরে যান
            </button>

            {secondExpandedVideoReview ? (
              <div className="mt-3">
                <div
                  className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg"
                  style={{ background: `linear-gradient(135deg, ${secondOffer.product.colorFrom}, ${secondOffer.product.colorTo})` }}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface/90 shadow-sm">
                    <Play size={28} className="ml-1 text-foreground" fill="currentColor" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-sm font-bold text-foreground">{secondExpandedVideoReview.name}</span>
                    <Star size={12} className="text-star" fill="currentColor" strokeWidth={0} />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">&ldquo;{secondExpandedVideoReview.quote}&rdquo;</p>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-emerald-700">
                  <MessageSquare size={13} /> গ্রাহকদের মতামত
                </p>
                <h2 className="mt-1.5 font-display text-base font-bold text-foreground">{secondOffer.product.title}</h2>

                <div className="mt-3 max-h-80 space-y-5 overflow-y-auto pr-1">
                  <div>
                    <p className="mb-2 text-xs font-semibold text-ink-soft">টেক্সট রিভিউ</p>
                    <div className="space-y-2.5">
                      {getExpertOpinions(secondOffer.product, 3).map((r, i) => (
                        <div key={i} className="flex gap-2.5 rounded-lg border border-border bg-surface-muted p-3">
                          {r.hasPhoto ? (
                            <div
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/80"
                              style={{ background: `linear-gradient(135deg, ${secondOffer.product.colorFrom}, ${secondOffer.product.colorTo})` }}
                            >
                              <ImageIcon size={16} />
                            </div>
                          ) : (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary-dark">
                              {r.name.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-medium text-foreground">{r.name}</span>
                              <Star size={12} className="text-star" fill="currentColor" strokeWidth={0} />
                            </div>
                            <p className="mt-1 text-sm leading-relaxed text-ink-soft">&ldquo;{r.quote}&rdquo;</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold text-ink-soft">ভিডিও রিভিউ</p>
                    <div className="space-y-2.5">
                      {getExpertVideoOpinions(secondOffer.product, 3).map((r, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSecondExpandedVideoReview(r)}
                          aria-label={`${r.name} এর ভিডিও রিভিউ বড় করে দেখুন`}
                          className="group flex w-full items-center gap-3 rounded-lg border border-border bg-surface-muted p-3 text-left"
                        >
                          <div
                            className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md"
                            style={{ background: `linear-gradient(135deg, ${secondOffer.product.colorFrom}, ${secondOffer.product.colorTo})` }}
                          >
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface/90 transition group-hover:scale-105">
                              <Play size={10} className="ml-0.5 text-foreground" fill="currentColor" />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <Star size={12} className="text-star" fill="currentColor" strokeWidth={0} />
                              <span className="text-xs font-medium text-foreground">{r.name}</span>
                            </div>
                            <p className="mt-0.5 line-clamp-2 text-xs text-ink-faint">&ldquo;{r.quote}&rdquo;</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            <button
              type="button"
              onClick={goToSecondPayment}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-md bg-cta py-2.5 text-center text-sm font-semibold text-white hover:bg-cta-dark"
            >
              এখনই কিনুন <ArrowRight size={14} />
            </button>
          </div>
        )}

        {view === "secondVideo" && secondOffer && (() => {
          const slots = getProductVideoSlots();
          const thumbSlots = slots.slice(1, 1 + SECOND_VIDEO_THUMB_COUNT);
          const activeSlot = slots[secondVideoActive] ?? slots[0];
          return (
            <div className="text-left">
              <button
                type="button"
                onClick={() => setView("success")}
                className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary-light px-2.5 py-1.5 text-xs font-bold text-primary-dark hover:bg-primary-light/70"
              >
                ← ফিরে যান
              </button>
              <div
                className="mt-3 flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg"
                style={{ background: `linear-gradient(135deg, ${secondOffer.product.colorFrom}, ${secondOffer.product.colorTo})` }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface/90 shadow-sm">
                  <Play size={28} className="ml-1 text-foreground" fill="currentColor" />
                </div>
              </div>
              <div className="mt-3">
                <p className="font-display text-sm font-bold text-foreground">{secondOffer.product.title}</p>
                <p className="mt-0.5 text-xs text-ink-faint">{activeSlot.caption} (শীঘ্রই যুক্ত হবে)</p>
                <div className="mt-1.5 flex items-center gap-1">
                  <Star size={12} className="text-star" fill="currentColor" strokeWidth={0} />
                  <span className="text-xs font-medium text-ink-soft">{secondOffer.product.rating.toFixed(1)}</span>
                  <span className="text-xs text-ink-faint">({toBengaliNumber(secondOffer.product.reviewCount)}+ রিভিউ)</span>
                </div>
                <p className="mt-2 text-sm text-ink-soft">{secondOffer.product.shortDescription}</p>
              </div>

              {thumbSlots.length > 0 && (
                <div className="-mx-1 mt-3 flex gap-2.5 overflow-x-auto border-t border-border px-1 pb-1 pt-3 scrollbar-none">
                  {thumbSlots.map((slot, i) => (
                    <button
                      key={`${slot.caption}-${i}`}
                      type="button"
                      onClick={() => setSecondVideoActive(i + 1)}
                      aria-label={`${slot.caption} দেখুন`}
                      className="group flex w-16 shrink-0 flex-col gap-1 text-left"
                    >
                      <div
                        className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-md"
                        style={{ background: `linear-gradient(135deg, ${secondOffer.product.colorFrom}, ${secondOffer.product.colorTo})` }}
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface/90 shadow-sm transition group-hover:scale-105">
                          <Play size={10} className="ml-0.5 text-foreground" fill="currentColor" />
                        </div>
                      </div>
                      <p className="w-full truncate text-[10px] font-medium text-foreground">{slot.caption}</p>
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={goToSecondPayment}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md bg-cta py-2.5 text-center text-sm font-semibold text-white hover:bg-cta-dark"
              >
                এখনই কিনুন <ArrowRight size={14} />
              </button>
            </div>
          );
        })()}

        {view === "secondGallery" && secondOffer && (
          <div className="text-left">
            <button
              type="button"
              onClick={() => setView("success")}
              className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary-light px-2.5 py-1.5 text-xs font-bold text-primary-dark hover:bg-primary-light/70"
            >
              ← ফিরে যান
            </button>
            <div className="relative mt-3">
              <ProductImage
                title={secondOffer.product.title}
                category={secondOffer.product.category}
                colorFrom={secondOffer.product.colorFrom}
                colorTo={secondOffer.product.colorTo}
                imageUrl={secondOffer.product.coverImageUrl}
                iconSize={64}
                className="aspect-[3/4] w-full rounded-lg shadow-lg"
              />
              <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white">
                {ANGLE_LABELS[secondGalleryActive]} · {toBengaliNumber(secondGalleryActive + 1)}/{toBengaliNumber(ANGLE_LABELS.length)}
              </span>
              <button
                type="button"
                onClick={() => setSecondGalleryActive((a) => (a - 1 + ANGLE_LABELS.length) % ANGLE_LABELS.length)}
                aria-label="আগের ছবি"
                className="absolute left-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setSecondGalleryActive((a) => (a + 1) % ANGLE_LABELS.length)}
                aria-label="পরের ছবি"
                className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-center gap-1.5">
              {ANGLE_LABELS.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setSecondGalleryActive(i)}
                  aria-label={label}
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: i === secondGalleryActive ? "20px" : "6px", background: i === secondGalleryActive ? "#16a34a" : "var(--color-border)" }}
                />
              ))}
            </div>
            <div className="mt-3">
              <p className="font-display text-sm font-bold text-foreground">{secondOffer.product.title}</p>
              <div className="mt-1 flex items-center gap-1">
                <Star size={12} className="text-star" fill="currentColor" strokeWidth={0} />
                <span className="text-xs font-medium text-ink-soft">{secondOffer.product.rating.toFixed(1)}</span>
                <span className="text-xs text-ink-faint">({toBengaliNumber(secondOffer.product.reviewCount)}+ রিভিউ)</span>
              </div>
              <p className="mt-2 text-sm text-ink-soft">{secondOffer.product.shortDescription}</p>
            </div>
            <button
              type="button"
              onClick={goToSecondPayment}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md bg-cta py-2.5 text-center text-sm font-semibold text-white hover:bg-cta-dark"
            >
              এখনই কিনুন <ArrowRight size={14} />
            </button>
          </div>
        )}

        {view === "secondPayment" && secondOffer && (
          <div className="text-left">
            <button
              type="button"
              onClick={() => setView("success")}
              className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary-light px-2.5 py-1.5 text-xs font-bold text-primary-dark hover:bg-primary-light/70"
            >
              ← ফিরে যান
            </button>
            <h2 className="mt-2 font-display text-base font-bold text-foreground">অর্ডার কনফার্ম করুন</h2>
            <p className="mt-1 text-xs text-ink-soft">আপনার ঠিকানায় পৌঁছে দেওয়া হবে — ক্যাশ অন ডেলিভারি অথবা অনলাইন পেমেন্ট বেছে নিন।</p>

            <div className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-surface-muted p-3">
              <ProductImage
                title={secondOffer.product.title}
                category={secondOffer.product.category}
                colorFrom={secondOffer.product.colorFrom}
                colorTo={secondOffer.product.colorTo}
                imageUrl={secondOffer.product.coverImageUrl}
                hideLabel
                className="h-14 w-10 shrink-0 rounded-md"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{secondOffer.product.title}</p>
                {secondOffer.product.badge && (
                  <span className={`mt-0.5 inline-block rounded px-1.5 py-0.5 text-[9px] font-bold text-white ${badgeColorClass(secondOffer.product.badge)}`}>
                    {secondOffer.product.badge}
                  </span>
                )}
                <p className="mt-0.5 text-xs text-ink-faint">পরিমাণ: ১</p>
              </div>
              <span className="shrink-0 text-sm font-bold text-foreground">{formatTaka(secondOffer.product.price)}</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <input
                value={orderName}
                onChange={(e) => setOrderName(e.target.value)}
                placeholder="নাম *"
                className="rounded border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                value={orderPhone}
                onChange={(e) => setOrderPhone(e.target.value)}
                placeholder="ফোন নম্বর *"
                className="rounded border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {customerAddress && !secondAddressEditing ? (
              <div className="mt-3 rounded-lg border border-border bg-surface-muted p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-ink-faint">আপনার দেওয়া ঠিকানায় পাঠানো হবে</p>
                    <p className="mt-1 text-sm text-foreground">{secondAddress}</p>
                    {secondArea && <p className="mt-0.5 text-xs text-ink-faint">{secondArea}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSecondAddressEditing(true)}
                    className="shrink-0 text-xs font-medium text-link hover:underline"
                  >
                    পরিবর্তন করুন
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3 flex flex-col gap-2">
                <textarea
                  value={secondAddress}
                  onChange={(e) => setSecondAddress(e.target.value)}
                  rows={2}
                  placeholder="সম্পূর্ণ ঠিকানা লিখুন *"
                  className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                />
                <AreaSelector zones={zones} value={secondArea} onChange={setSecondArea} />
              </div>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2">
              {secondMethods.map((m) => {
                const Icon = m.icon;
                const active = secondEffectiveMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSecondPaymentMethod(m.id)}
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

            {secondError && <p className="mt-3 text-xs text-price">{secondError}</p>}

            <button
              type="button"
              onClick={placeSecondOrder}
              disabled={secondSubmitting || !secondEffectiveMethod}
              className="mt-4 w-full rounded-md bg-cta py-2.5 text-center text-sm font-semibold text-white hover:bg-cta-dark disabled:opacity-60"
            >
              {secondSubmitting ? "প্রসেস হচ্ছে..." : `কনফার্ম করুন — ${formatTaka(secondTotal)}`}
            </button>
          </div>
        )}

        {view === "secondSuccess" && secondOffer && (
          <div className="py-2 text-center text-left">
            <p className="text-center font-display text-base font-bold text-foreground">
              {secondOffer.product.title} ({categoryMeta[secondOffer.category].label}) অর্ডারটি গ্রহণ করা হয়েছে!
            </p>
            <p className="mt-2 text-center text-sm text-ink-soft">
              আমাদের একজন প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন। পণ্য হাতে পেয়ে টাকা পরিশোধ করুন।
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-4 w-full rounded-md bg-cta py-2.5 text-center text-sm font-semibold text-white hover:bg-cta-dark"
            >
              ঠিক আছে
            </button>

            <div className="mt-5 rounded-lg border border-violet-300 bg-violet-50 p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                  <Trophy size={18} />
                </div>
                <h3 className="font-display text-sm font-bold leading-snug text-violet-900">
                  অভিনন্দন! আপনি টপ ১% মানুষের একজন!
                </h3>
              </div>
              <p className="mt-2 text-left text-xs leading-relaxed text-violet-800/80">
                পৃথিবীর বেশিরভাগ মানুষ নিজের উপর খরচ করাকে &quot;অপচয়&quot; মনে করেন। কিন্তু বাস্তবে এটাই সবচেয়ে ভালো বিনিয়োগ! আজ নিজের উপর করা এই <strong className="text-violet-900">INVESTMENT</strong> টিই ভবিষ্যতে অনেকগুলো <strong className="text-violet-900">INCOME</strong>-এর রাস্তা খুলে দিবে। এই সত্যিটা জানেন অনেকেই, কিন্তু কাজে লাগাতে পারেন টপ ১% মানুষ এবং তারাই জীবনে এগিয়ে থাকেন। অভিনন্দন, আপনিও তাঁদের একজন। আপনার এই সফলতার যাত্রায় পাশে থাকতে পেরে আমরা আনন্দিত এবং আপনার উত্তরোত্তর সাফল্যে কামনা করি।
              </p>
            </div>

            <div className="mt-4 rounded-lg border border-border bg-surface p-3 shadow-sm">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
                <ClipboardList size={14} /> আপনার অর্ডার সামারি
              </p>
              <div className="mt-2.5 divide-y divide-border">
                {orderProductTitle && orderProductCategory && typeof orderProductPrice === "number" && (
                  <div className="flex items-center justify-between gap-2 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-foreground">{orderProductTitle}</p>
                      <span className="mt-0.5 inline-block rounded bg-primary-light px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary-dark">
                        {categoryMeta[orderProductCategory].label}
                      </span>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-foreground">{formatTaka(orderProductPrice)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-2 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-foreground">{product.title}</p>
                    <span className="mt-0.5 inline-block rounded bg-primary-light px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary-dark">
                      {categoryMeta[product.category].label}
                    </span>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-foreground">{formatTaka(product.price)}</span>
                </div>
                <div className="flex items-center justify-between gap-2 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-foreground">{secondOffer.product.title}</p>
                    <span className="mt-0.5 inline-block rounded bg-primary-light px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary-dark">
                      {categoryMeta[secondOffer.product.category].label}
                    </span>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-foreground">{formatTaka(secondOffer.product.price)}</span>
                </div>
              </div>
              <div className="mt-1 flex items-center justify-between border-t border-border pt-2.5">
                <span className="text-xs font-bold uppercase tracking-wide text-ink-soft">সর্বমোট</span>
                <span className="text-base font-bold text-price">
                  {formatTaka((orderProductPrice ?? 0) + product.price + secondOffer.product.price)}
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-border bg-surface p-3 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-primary">আপনার জন্য একটা উপহার</p>
              <div className="mt-2 rounded-lg border border-sky-300 bg-sky-50 p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                    <Newspaper size={18} />
                  </div>
                  <h3 className="font-display text-sm font-bold leading-snug text-sky-900">
                    আপনার জন্য রাখা আছে হাই ভ্যালু রিসোর্স
                  </h3>
                </div>
                <p className="mt-2 text-left text-xs leading-relaxed text-sky-800/80">
                  ইতিমধ্যে <strong className="text-sky-900">১০ লক্ষেরও বেশি মানুষ</strong> এই লেখাগুলো পড়ে উপকৃত হয়েছেন। প্রোডাক্টিভিটি, ক্যারিয়ার এবং বিজনেস নিয়ে গবেষণাভিত্তিক এই লেখাগুলো আপনার চিন্তার দুয়ার খুলে দিবে। প্রতিটি লেখার শেষে দেয়া আছে একশন প্ল্যান যা আপনার গ্রোথের জন্য আজ থেকেই ব্যবহার করতে পারবেন। শেখার জার্নিতে স্বাগতম!
                </p>
              </div>
              <Link
                href="/blog"
                onClick={handleClose}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md bg-cta py-2.5 text-center text-sm font-semibold text-white hover:bg-cta-dark"
              >
                ফ্রি রিসোর্সটি এখনই দেখি <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </Modal>

      <ProfileAuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={handleAuthSuccess} />
    </>
  );
}
