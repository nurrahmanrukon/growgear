import Link from "next/link";
import { BookOpen, FileDown, Wrench } from "lucide-react";

const tiles = [
  {
    label: "হার্ডকভার বই",
    href: "/books",
    icon: BookOpen,
    from: "#1f3a5c",
    to: "#2f5a8a",
    cta: "এখনই দেখুন",
  },
  {
    label: "ইনস্ট্যান্ট ইবুক",
    href: "/ebooks",
    icon: FileDown,
    from: "#0f4c5c",
    to: "#146b7e",
    cta: "ডাউনলোড করুন",
  },
  {
    label: "প্রোডাক্টিভিটি গিয়ার",
    href: "/gear",
    icon: Wrench,
    from: "#5c1f0f",
    to: "#8a3b1f",
    cta: "অর্ডার করুন",
  },
];

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-navy-light to-navy">
      <div className="container-page py-8 sm:py-10">
        <h1 className="max-w-2xl text-2xl font-extrabold leading-tight text-white sm:text-3xl">
          ভালো বই, স্মার্ট টুলস — <span className="text-orange">আপনার গ্রোথের</span> জন্য সব একসাথে
        </h1>
        <p className="mt-2 max-w-xl text-sm text-neutral-300 sm:text-base">
          ৯০+ বই, ইবুক ও প্রোডাক্টিভিটি গিয়ার, সারাদেশে ক্যাশ অন ডেলিভারিতে
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {tiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <Link
                key={tile.href}
                href={tile.href}
                className="group flex items-center justify-between overflow-hidden rounded-xl p-5 shadow-lg transition hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${tile.from}, ${tile.to})` }}
              >
                <div>
                  <p className="text-base font-bold text-white">{tile.label}</p>
                  <span className="mt-1 inline-block text-xs font-medium text-orange-light group-hover:underline">
                    {tile.cta} →
                  </span>
                </div>
                <Icon size={38} className="text-white/80" strokeWidth={1.5} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
