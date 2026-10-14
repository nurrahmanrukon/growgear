"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { toBengaliNumber, formatTaka } from "@/lib/format";

export interface QuantityTier {
  quantity: number;
  description: string;
  badge?: string;
}

export interface BulkInfo {
  label: string;
  subtext: string;
  cta: string;
  href: string | null;
}

export function QuantitySelector({
  tiers,
  bulk,
  value,
  onChange,
  savingsPerUnit,
}: {
  tiers: QuantityTier[];
  bulk: BulkInfo | null;
  value: number;
  onChange: (quantity: number) => void;
  savingsPerUnit: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const selectedSavings = savingsPerUnit * value;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-1.5 rounded border border-border px-2.5 py-2 text-left text-sm outline-none"
      >
        <span className="truncate font-medium text-foreground">
          {toBengaliNumber(value)} কপি
          {selectedSavings > 0 && <span className="text-success"> - {formatTaka(selectedSavings)} সাশ্রয়</span>}
        </span>
        <ChevronDown size={15} className={`shrink-0 text-ink-faint transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-border bg-surface shadow-lg">
          {tiers.map((tier) => {
            const tierSavings = savingsPerUnit * tier.quantity;
            return (
              <button
                key={tier.quantity}
                type="button"
                onClick={() => {
                  onChange(tier.quantity);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3 border-b border-border px-3 py-2.5 text-left text-sm last:border-b-0 hover:bg-surface-muted ${
                  value === tier.quantity ? "bg-primary-light/40" : ""
                }`}
              >
                <span className="min-w-0">
                  <span className="block font-medium text-foreground">{toBengaliNumber(tier.quantity)} কপি</span>
                  {tier.description && <span className="block text-xs text-ink-faint">{tier.description}</span>}
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  {tier.badge && (
                    <span className="rounded-full bg-cta-light px-1.5 py-0.5 text-[9px] font-bold text-cta-dark">
                      {tier.badge}
                    </span>
                  )}
                  {tierSavings > 0 && (
                    <span className="text-xs font-semibold text-success">{formatTaka(tierSavings)} সাশ্রয়</span>
                  )}
                </span>
              </button>
            );
          })}
          {bulk && (
            <a
              href={bulk.href ?? undefined}
              target={bulk.href ? "_blank" : undefined}
              rel={bulk.href ? "noopener noreferrer" : undefined}
              onClick={(e) => {
                if (!bulk.href) e.preventDefault();
                setOpen(false);
              }}
              className="flex items-center justify-between gap-3 border-t-2 border-border bg-surface-muted px-3 py-2.5 text-left text-sm hover:bg-surface"
            >
              <span className="min-w-0">
                <span className="block font-medium text-foreground">{bulk.label}</span>
                <span className="block text-xs text-ink-faint">{bulk.subtext}</span>
              </span>
              <span className="shrink-0 text-xs font-semibold text-link">{bulk.cta}</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
