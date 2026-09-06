"use client";

import { FormEvent, useState } from "react";
import { Briefcase, TrendingUp, Zap } from "lucide-react";

const NEWSLETTERS = [
  { icon: Briefcase, title: "সাপ্তাহিক বিজনেস ইনসাইট", desc: "ব্যবসা ও উদ্যোক্তা হওয়ার বাস্তব শিক্ষা" },
  { icon: Zap, title: "প্রোডাক্টিভিটি টিপস", desc: "প্রতি সপ্তাহে একটি করে কার্যকর কৌশল" },
  { icon: TrendingUp, title: "মার্কেটিং ও সেলস আপডেট", desc: "গ্রোথ, ব্র্যান্ডিং ও বিক্রি বাড়ানোর কৌশল" },
];

export function NewsletterSection() {
  const [selected, setSelected] = useState<number[]>([0]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function toggle(i: number) {
    setSelected((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || selected.length === 0) return;
    setSubscribed(true);
  }

  return (
    <section className="container-page py-10">
      <h2 className="text-center font-display text-xl font-bold text-foreground sm:text-2xl">
        GrowGear নিউজলেটার সাবস্ক্রাইব করুন
      </h2>
      <p className="mt-1.5 text-center text-sm text-ink-soft">যা পড়তে চান, বেছে নিন — সরাসরি আপনার ইনবক্সে পাবেন।</p>

      <form onSubmit={handleSubmit} className="mx-auto mt-6 max-w-2xl">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {NEWSLETTERS.map((nl, i) => {
            const Icon = nl.icon;
            const active = selected.includes(i);
            return (
              <button
                type="button"
                key={nl.title}
                onClick={() => toggle(i)}
                className={`flex flex-col items-start gap-1.5 rounded-lg border p-3.5 text-left transition ${
                  active ? "border-primary bg-primary-light" : "border-border bg-surface hover:border-primary/50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon size={16} className="text-primary" />
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border text-[10px] ${
                      active ? "border-primary bg-primary text-white" : "border-border"
                    }`}
                  >
                    {active ? "✓" : ""}
                  </span>
                </span>
                <span className="text-xs font-semibold text-foreground">{nl.title}</span>
                <span className="text-[11px] text-ink-faint">{nl.desc}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="আপনার ইমেইল ঠিকানা"
            className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            {subscribed ? "সাবস্ক্রাইব হয়েছে ✓" : "সাবস্ক্রাইব করুন"}
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-ink-faint">
          সাবস্ক্রাইব করার মাধ্যমে আপনি আমাদের প্রাইভেসি নীতিতে সম্মত হচ্ছেন। যেকোনো সময় unsubscribe করা যাবে।
        </p>
      </form>
    </section>
  );
}
