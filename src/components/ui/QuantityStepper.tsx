import { Minus, Plus } from "lucide-react";
import { toBengaliNumber } from "@/lib/format";

export function QuantityStepper({
  quantity,
  onChange,
  min = 1,
  max = 10,
}: {
  quantity: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-surface-muted">
      <button
        type="button"
        aria-label="কমান"
        className="flex h-8 w-8 items-center justify-center text-navy-light hover:bg-border/60 disabled:opacity-40 cursor-pointer"
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
      >
        <Minus size={14} />
      </button>
      <span className="w-8 text-center text-sm font-medium">
        {toBengaliNumber(quantity)}
      </span>
      <button
        type="button"
        aria-label="বাড়ান"
        className="flex h-8 w-8 items-center justify-center text-navy-light hover:bg-border/60 disabled:opacity-40 cursor-pointer"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
