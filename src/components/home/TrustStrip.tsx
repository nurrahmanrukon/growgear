import { Banknote, RefreshCcw, Truck, Headset } from "lucide-react";

const items = [
  { icon: Truck, label: "সারাদেশে ডেলিভারি", desc: "২৪-৭২ ঘণ্টায়" },
  { icon: Banknote, label: "ক্যাশ অন ডেলিভারি", desc: "হাতে পেয়ে টাকা দিন" },
  { icon: RefreshCcw, label: "৭ দিনের রিপ্লেসমেন্ট", desc: "সমস্যা হলে পরিবর্তন" },
  { icon: Headset, label: "কাস্টমার সাপোর্ট", desc: "প্রতিদিন সকাল ৯টা - রাত ১০টা" },
];

export function TrustStrip() {
  return (
    <section className="container-page py-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3"
            >
              <Icon size={26} className="shrink-0 text-navy-light" strokeWidth={1.5} />
              <div>
                <p className="text-xs font-semibold text-[#0f1111]">{item.label}</p>
                <p className="text-[11px] text-neutral-500">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
