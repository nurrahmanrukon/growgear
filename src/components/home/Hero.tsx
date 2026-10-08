import Link from "next/link";
import { COLLECTIONS } from "@/lib/data/collections";
import { getProductCountByTopic } from "@/lib/data/products";
import { toBengaliNumber } from "@/lib/format";

export function Hero() {
  return (
    <section className="border-b border-border bg-surface-muted">
      <div className="container-page py-10 sm:py-14">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">GrowGear</p>
        <h1 className="mt-2 max-w-2xl font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          ভালো বই, স্মার্ট টুলস — আপনার গ্রোথের জন্য সব একসাথে
        </h1>
        <p className="mt-3 max-w-xl text-sm text-ink-soft sm:text-base">
          ৯০+ বই, ইবুক ও প্রোডাক্টিভিটি গিয়ার, সারাদেশে ক্যাশ অন ডেলিভারিতে
        </p>
        <p className="mt-3 max-w-xl border-l-2 border-primary pl-3 text-sm font-medium text-primary-dark sm:text-base">
          আমাদের লক্ষ্য — প্রতিটি মানুষকে সঠিক দিকনির্দেশনার মাধ্যমে (guided way) নিজের জীবনে এগিয়ে যেতে সাহায্য করা।
        </p>

        <p className="mt-8 text-xs font-medium uppercase tracking-wide text-ink-faint">আপনার দরকার অনুযায়ী কিনুন</p>
        <div className="-mx-1 mt-3 flex gap-3 overflow-x-auto px-1 pb-1 scrollbar-none">
          {COLLECTIONS.map((c) => {
            const Icon = c.icon;
            const count = getProductCountByTopic(c.slug);
            return (
              <Link
                key={c.slug}
                href={`/search?topic=${c.slug}`}
                className="flex w-32 shrink-0 flex-col justify-between gap-5 rounded-xl p-4 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:w-36"
                style={{ background: `linear-gradient(135deg, ${c.colorFrom}, ${c.colorTo})` }}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold leading-snug">{c.label}</p>
                  <p className="mt-1 text-[11px] text-white/75">{toBengaliNumber(count)} টি প্রোডাক্ট</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
