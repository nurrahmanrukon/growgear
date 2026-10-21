"use client";

import { useEffect, useState } from "react";
import { Tag, Check, X } from "lucide-react";
import { toBengaliNumber } from "@/lib/format";

export interface AppliedCoupon {
  code: string;
  discountPercent: number;
}

/** Only renders when an admin has turned the coupon box on — most of the time it's
 *  completely absent from the order form, not just visually hidden. */
export function CouponBox({
  applied,
  onApplied,
}: {
  applied: AppliedCoupon | null;
  onApplied: (result: AppliedCoupon | null) => void;
}) {
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/coupon")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setEnabled(!!data.enabled);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!enabled) return null;

  async function apply() {
    if (!code.trim()) return;
    setChecking(true);
    setError(null);
    try {
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setError(data.error ?? "কুপন কোডটি সঠিক নয়");
        onApplied(null);
        return;
      }
      onApplied({ code: code.trim(), discountPercent: data.discountPercent });
    } catch {
      setError("নেটওয়ার্ক সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    } finally {
      setChecking(false);
    }
  }

  function clear() {
    setCode("");
    setError(null);
    setOpen(false);
    onApplied(null);
  }

  if (applied) {
    return (
      <div className="mt-2 flex items-center justify-between gap-2 rounded-md border border-success/30 bg-success/10 px-3 py-2 text-xs">
        <span className="flex items-center gap-1.5 font-medium text-success">
          <Check size={13} className="shrink-0" /> কুপন &ldquo;{applied.code}&rdquo; প্রয়োগ হয়েছে —{" "}
          {toBengaliNumber(applied.discountPercent)}% ছাড়
        </span>
        <button type="button" onClick={clear} aria-label="কুপন সরান" className="shrink-0 text-ink-faint hover:text-foreground">
          <X size={13} />
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-2 flex items-center gap-1.5 text-xs font-medium text-link hover:underline"
      >
        <Tag size={13} /> ডিসকাউন্ট কুপন আছে?
      </button>
    );
  }

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="কুপন কোড লিখুন"
          className="flex-1 rounded border border-border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="button"
          onClick={apply}
          disabled={checking || !code.trim()}
          className="shrink-0 rounded-md border border-primary px-3 py-2 text-xs font-semibold text-primary hover:bg-primary-light disabled:opacity-50"
        >
          {checking ? "যাচাই হচ্ছে..." : "প্রয়োগ করুন"}
        </button>
      </div>
      {error && <p className="text-xs text-price">{error}</p>}
    </div>
  );
}
