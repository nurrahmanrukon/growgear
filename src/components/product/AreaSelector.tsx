"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { formatTaka } from "@/lib/format";

export interface DeliveryZone {
  key: string;
  label: string;
  days: string;
  fee: number;
}

export function AreaSelector({
  zones,
  value,
  onChange,
}: {
  zones: DeliveryZone[];
  value: string;
  onChange: (label: string) => void;
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

  const selected = zones.find((z) => z.label === value) ?? zones[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-1.5 rounded border border-border px-2.5 py-2 text-left text-sm outline-none"
      >
        <span className="truncate font-medium text-foreground">
          {selected ? (
            <>
              {selected.label} — {formatTaka(selected.fee)}
              {selected.days && <span className="text-ink-faint">, {selected.days}</span>}
            </>
          ) : (
            <span className="text-ink-faint">এরিয়া সিলেক্ট করুন</span>
          )}
        </span>
        <ChevronDown size={15} className={`shrink-0 text-ink-faint transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-border bg-surface shadow-lg">
          {zones.map((zone) => (
            <button
              key={zone.key}
              type="button"
              onClick={() => {
                onChange(zone.label);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between gap-3 border-b border-border px-3 py-2.5 text-left text-sm last:border-b-0 hover:bg-surface-muted ${
                value === zone.label ? "bg-primary-light/40" : ""
              }`}
            >
              <span className="min-w-0">
                <span className="block font-medium text-foreground">{zone.label}</span>
                {zone.days && <span className="block text-xs text-ink-faint">{zone.days}</span>}
              </span>
              <span className="shrink-0 text-sm font-semibold text-primary">{formatTaka(zone.fee)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
