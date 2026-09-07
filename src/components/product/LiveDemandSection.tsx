import { Eye, Flame } from "lucide-react";
import { Product } from "@/lib/types";
import { toBengaliNumber } from "@/lib/format";
import { getLiveDemand } from "@/lib/data/landingContent";

export function LiveDemandSection({ product }: { product: Product }) {
  const demand = getLiveDemand(product);

  return (
    <section className="container-page py-6">
      <div className="mx-auto max-w-3xl rounded-lg border border-border bg-surface p-5">
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium sm:justify-between">
          <span className="flex items-center gap-1.5 rounded-full bg-price/10 px-3 py-1.5 text-price">
            <Flame size={13} /> মাত্র {toBengaliNumber(demand.copiesLeft)}টি কপি বাকি
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1.5 text-primary-dark">
            <Eye size={13} /> এখন {toBengaliNumber(demand.viewers)} জন এই পেজটি দেখছেন
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-ink-soft">
            <span>আজকের স্টক দ্রুত শেষ হচ্ছে</span>
            <span className="text-ink-faint">{toBengaliNumber(demand.stockSoldPercent)}% বিক্রি হয়ে গেছে</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-price"
              style={{ width: `${demand.stockSoldPercent}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-3 border-t border-border pt-4 sm:justify-start">
          <div className="flex -space-x-2">
            {demand.recentOrderInitials.map((initial, i) => (
              <div
                key={i}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-primary-light text-[11px] font-semibold text-primary-dark"
              >
                {initial}
              </div>
            ))}
          </div>
          <p className="text-xs text-ink-soft">
            গত ২৪ ঘণ্টায় <span className="font-semibold text-foreground">{toBengaliNumber(demand.ordersLast24h)}</span> জন অর্ডার করেছেন
          </p>
        </div>
      </div>
    </section>
  );
}
