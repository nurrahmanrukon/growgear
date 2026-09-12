"use client";

import { FormEvent, useState } from "react";
import { Briefcase, Gift, Mail, TrendingUp, Zap } from "lucide-react";

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
    <section className="relative overflow-hidden py-14" style={{ background: "linear-gradient(135deg, #1c2f26 0%, #24402f 55%, #1c2f26 100%)" }}>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #febd69 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 70%)" }}
      />

      <div className="container-page relative">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="flex items-center gap-2 rounded-full bg-amber-400 px-4 py-1.5 text-xs font-bold text-slate-900 shadow-sm">
            <Gift size={14} /> সাবস্ক্রাইব করলেই একটি প্রিমিয়াম ব্লগ সম্পূর্ণ ফ্রি
          </span>

          <span className="mt-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
            <Mail size={26} className="text-white" />
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">
            মিস করবেন না — GrowGear নিউজলেটারে যুক্ত হন
          </h2>
          <p className="mt-2 max-w-lg text-sm text-white/80 sm:text-base">
            প্রতি সপ্তাহে ব্যবসা, প্রোডাক্টিভিটি ও গ্রোথ নিয়ে সেরা লেখাগুলো সরাসরি আপনার ইনবক্সে — বিনামূল্যে।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-2xl">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {NEWSLETTERS.map((nl, i) => {
              const Icon = nl.icon;
              const active = selected.includes(i);
              return (
                <button
                  type="button"
                  key={nl.title}
                  onClick={() => toggle(i)}
                  className={`flex flex-col items-start gap-1.5 rounded-lg border p-3.5 text-left backdrop-blur transition ${
                    active ? "border-amber-400 bg-white/15" : "border-white/15 bg-white/5 hover:border-white/40"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon size={16} className="text-amber-400" />
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full border text-[10px] ${
                        active ? "border-amber-400 bg-amber-400 text-slate-900" : "border-white/40 text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                  </span>
                  <span className="text-xs font-semibold text-white">{nl.title}</span>
                  <span className="text-[11px] text-white/70">{nl.desc}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="আপনার ইমেইল ঠিকানা লিখুন"
              className="flex-1 rounded-md border border-white/20 bg-white/95 px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="submit"
              className="shrink-0 rounded-md bg-amber-400 px-7 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-amber-300"
            >
              {subscribed ? "সাবস্ক্রাইব হয়েছে ✓" : "সাবস্ক্রাইব করুন — ফ্রি"}
            </button>
          </div>
          <p className="mt-3 text-center text-[11px] text-white/60">
            সাবস্ক্রাইব করার মাধ্যমে আপনি আমাদের প্রাইভেসি নীতিতে সম্মত হচ্ছেন। যেকোনো সময় unsubscribe করা যাবে।
          </p>
        </form>
      </div>
    </section>
  );
}
