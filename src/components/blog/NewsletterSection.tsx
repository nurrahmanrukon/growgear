"use client";

import { FormEvent, useState } from "react";
import { Briefcase, CheckCircle2, Gift, Mail, TrendingUp, Zap } from "lucide-react";

const TOPIC_ICONS = [Briefcase, Zap, TrendingUp];
const TOPIC_KEYS = ["business", "productivity", "marketing"];

export interface NewsletterCopy {
  badge: string;
  headline: string;
  description: string;
  topics: { title: string; desc: string }[];
}

export function NewsletterSection({ copy }: { copy: NewsletterCopy }) {
  const topics = copy.topics.map((t, i) => ({ ...t, key: TOPIC_KEYS[i], icon: TOPIC_ICONS[i] }));
  const [selected, setSelected] = useState<number[]>([0]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [blogSent, setBlogSent] = useState(false);
  const [blogTitle, setBlogTitle] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function toggle(i: number) {
    setSelected((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || selected.length === 0 || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), topics: selected.map((i) => topics[i].key) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "সাবস্ক্রাইব করা যায়নি, আবার চেষ্টা করুন।");
        return;
      }
      setSubscribed(true);
      setBlogSent(!!data.blogSent);
      setBlogTitle(data.blogTitle ?? null);
    } catch {
      setError("নেটওয়ার্ক সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
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
            <Gift size={14} /> {copy.badge}
          </span>

          <span className="mt-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
            <Mail size={26} className="text-white" />
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">{copy.headline}</h2>
          <p className="mt-2 max-w-lg text-sm text-white/80 sm:text-base">{copy.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-2xl">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {topics.map((nl, i) => {
              const Icon = nl.icon;
              const active = selected.includes(i);
              return (
                <button
                  type="button"
                  key={nl.key}
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
              disabled={subscribed}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="আপনার ইমেইল ঠিকানা লিখুন"
              className="flex-1 rounded-md border border-white/20 bg-white/95 px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-70"
            />
            <button
              type="submit"
              disabled={submitting || subscribed}
              className="shrink-0 rounded-md bg-amber-400 px-7 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-amber-300 disabled:opacity-70"
            >
              {subscribed ? "সাবস্ক্রাইব হয়েছে ✓" : submitting ? "প্রসেস হচ্ছে..." : "সাবস্ক্রাইব করুন — ফ্রি"}
            </button>
          </div>

          {subscribed && (
            <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-3">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-amber-400" />
              <p className="text-sm text-white">
                {blogSent ? (
                  <>
                    সাবস্ক্রাইব সফল হয়েছে! আপনার প্রিমিয়াম ব্লগ <strong>&ldquo;{blogTitle}&rdquo;</strong> আপনার ইমেইলে
                    পাঠিয়ে দেওয়া হয়েছে — চেক করুন।
                  </>
                ) : (
                  "সাবস্ক্রাইব সফল হয়েছে! নিউজলেটারের লেখাগুলো এখন থেকে আপনার ইনবক্সে পাবেন।"
                )}
              </p>
            </div>
          )}
          {error && <p className="mt-3 text-center text-xs text-amber-300">{error}</p>}

          <p className="mt-3 text-center text-[11px] text-white/60">
            সাবস্ক্রাইব করার মাধ্যমে আপনি আমাদের প্রাইভেসি নীতিতে সম্মত হচ্ছেন। যেকোনো সময় unsubscribe করা যাবে।
          </p>
        </form>
      </div>
    </section>
  );
}
