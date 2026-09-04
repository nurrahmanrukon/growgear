import Link from "next/link";
import { BookOpen, FileDown, Wrench } from "lucide-react";

const tiles = [
  { label: "হার্ডকভার বই", href: "/books", icon: BookOpen, cta: "এখনই দেখুন" },
  { label: "ইনস্ট্যান্ট ইবুক", href: "/ebooks", icon: FileDown, cta: "ডাউনলোড করুন" },
  { label: "প্রোডাক্টিভিটি গিয়ার", href: "/gear", icon: Wrench, cta: "অর্ডার করুন" },
];

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

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {tiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <Link
                key={tile.href}
                href={tile.href}
                className="group flex items-center justify-between rounded-lg border border-border bg-surface p-5 transition hover:border-primary hover:shadow-sm"
              >
                <div>
                  <p className="text-base font-semibold text-foreground">{tile.label}</p>
                  <span className="mt-1 inline-block text-xs font-medium text-primary group-hover:underline">
                    {tile.cta} →
                  </span>
                </div>
                <Icon size={30} className="text-primary" strokeWidth={1.5} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
