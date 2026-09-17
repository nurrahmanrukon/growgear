import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "সেশন কতক্ষণ স্থায়ী হয়?",
    a: "প্রতিটি লাইভ ওয়েবিনার সাধারণত ৬০-৯০ মিনিট স্থায়ী হয়, যার মধ্যে প্রশ্নোত্তর পর্বও অন্তর্ভুক্ত।",
  },
  {
    q: "সেশনের রেকর্ডিং পাব কি?",
    a: "হ্যাঁ, লাইভে অংশ নিতে না পারলে পরে প্রাইভেট কমিউনিটি গ্রুপে রেকর্ডিং শেয়ার করা হয়।",
  },
  {
    q: "লাইভে সরাসরি প্রশ্ন করতে পারব?",
    a: "অবশ্যই — সেশন চলাকালীন সরাসরি প্রশ্ন করতে পারবেন, নূর রহমান নিজে উত্তর দেন।",
  },
  {
    q: "কোন প্ল্যাটফর্মে সেশন হয়?",
    a: "জুম বা গুগল মিট-এ লাইভ সেশন হয় — জয়েন করার পর সময়সূচি ও লিংক ইমেইলে পাঠানো হবে।",
  },
  {
    q: "এটা সম্পূর্ণ ফ্রি কেন?",
    a: "এটি নূর রহমানের ব্যক্তিগত কমিউনিটি গড়ে তোলা ও সমাজে অবদান রাখার একটা প্রচেষ্টা — কোনো লুকানো ফি নেই।",
  },
];

export function GrowGuideFaqSection() {
  return (
    <section className="container-page py-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">সাধারণ জিজ্ঞাসা</p>
        <h2 className="mt-1.5 font-display text-xl font-bold text-foreground sm:text-2xl">সেশন নিয়ে যা জানা দরকার</h2>
      </div>

      <div className="mx-auto mt-7 max-w-2xl space-y-2.5">
        {FAQS.map((f) => (
          <details key={f.q} className="group rounded-lg border border-border bg-surface open:border-primary">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-medium text-foreground">
              {f.q}
              <ChevronDown size={16} className="shrink-0 text-ink-faint transition group-open:rotate-180" />
            </summary>
            <p className="px-4 pb-4 text-sm leading-relaxed text-ink-soft">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
