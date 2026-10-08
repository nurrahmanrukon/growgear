import { COLLECTIONS } from "@/lib/data/collections";
import { getProductCountByTopicResolved } from "@/lib/server/contentText";
import { CollectionsRail } from "@/components/home/CollectionsRail";

export function Hero() {
  const collections = COLLECTIONS.map((c) => {
    const Icon = c.icon;
    return { ...c, icon: <Icon size={18} />, count: getProductCountByTopicResolved(c.slug) };
  });

  return (
    <section className="border-b border-border bg-surface-muted">
      <div className="container-page pb-12 pt-10 sm:pb-16 sm:pt-14">
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
        <div className="mt-3">
          <CollectionsRail collections={collections} />
        </div>
      </div>
    </section>
  );
}
