"use client";

import { FormEvent, useState } from "react";
import { CalendarClock, CheckCircle2, Users } from "lucide-react";
import { toBengaliNumber } from "@/lib/format";

const SEGMENT_LABEL = "চলতি সেগমেন্ট";
const SEGMENT_TARGET = 500;
const SEGMENT_JOINED = 342;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NEXT_SESSION_DATE = "৩ অক্টোবর";
const NEXT_SESSION_TIME = "রাত ৮:৩০";

export function GrowGuideJoinForm({
  audience,
}: {
  audience: { heroHeading: string; heroSubtitle: string; benefits: { title: string; body: string }[] };
}) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [joined, setJoined] = useState(false);
  const [count, setCount] = useState(SEGMENT_JOINED);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validEmail = EMAIL_PATTERN.test(email.trim());
    const validPhone = phone.trim().length >= 11;
    setEmailError(!validEmail);
    setPhoneError(!validPhone);
    if (!validEmail || !validPhone) return;
    setJoined(true);
    setCount((c) => Math.min(SEGMENT_TARGET, c + 1));
  }

  const pct = Math.min(100, Math.round((count / SEGMENT_TARGET) * 100));

  return (
    <section className="container-page py-10">
      <div className="mx-auto max-w-md rounded-lg border border-border bg-surface p-6 shadow-sm">
        <div className="text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-cta-light text-cta">
            <Users size={20} />
          </span>
          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-primary">ফ্রি লাইভ ওয়েবিনার</p>
          <h2 className="mt-1 font-display text-lg font-bold text-foreground">{audience.heroHeading}</h2>
          <p className="mt-1.5 text-sm text-ink-soft">{audience.heroSubtitle}</p>
        </div>

        <div className="mt-4 rounded-md bg-surface-muted p-3.5">
          <p className="text-xs font-bold text-foreground">এই ওয়েবিনারে যা থাকছে</p>
          <div className="mt-2 flex flex-col gap-1.5">
            {audience.benefits.map((b) => (
              <div key={b.title} className="flex items-start gap-1.5 text-left">
                <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-cta" />
                <span className="text-xs text-ink-soft">{b.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 rounded-md bg-cta px-4 py-2.5 text-white shadow-sm">
          <CalendarClock size={16} className="shrink-0" />
          <p className="text-sm font-bold">
            পরবর্তী সেশন: {NEXT_SESSION_DATE}, {NEXT_SESSION_TIME}
          </p>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-medium text-ink-soft">
            <span>{toBengaliNumber(count)} জন যুক্ত হয়েছেন</span>
            <span>{toBengaliNumber(SEGMENT_TARGET)} জন প্রয়োজন</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-muted">
            <div className="h-full rounded-full bg-cta transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1.5 text-center text-xs text-ink-soft">
            {SEGMENT_LABEL}-এ {toBengaliNumber(SEGMENT_TARGET)} জন হলেই ওয়েবিনার শুরু হবে
          </p>
        </div>

        {joined ? (
          <div className="mt-4 flex items-center justify-center gap-1.5 rounded-md bg-cta-light px-3 py-2.5 text-xs font-medium text-cta-dark">
            <CheckCircle2 size={14} /> আপনি সফলভাবে যুক্ত হয়েছেন — {toBengaliNumber(SEGMENT_TARGET)} জন পূর্ণ হলে ওয়েবিনারের লিংক ইমেইল ও মোবাইলে পাঠানো হবে
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
            <input
              type="text"
              inputMode="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(false);
              }}
              placeholder="আপনার ইমেইল ঠিকানা"
              className={`w-full rounded-md border bg-surface px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary ${
                emailError ? "border-price" : "border-border"
              }`}
            />
            {emailError && <p className="text-left text-[11px] text-price">সঠিক ইমেইল ঠিকানা দিন</p>}
            <input
              type="text"
              inputMode="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setPhoneError(false);
              }}
              placeholder="আপনার মোবাইল নম্বর"
              className={`w-full rounded-md border bg-surface px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary ${
                phoneError ? "border-price" : "border-border"
              }`}
            />
            {phoneError && <p className="text-left text-[11px] text-price">সঠিক মোবাইল নম্বর দিন</p>}
            <button
              type="submit"
              className="rounded-md bg-cta px-4 py-2.5 text-sm font-semibold text-white hover:bg-cta-dark"
            >
              ফ্রি-তে জয়েন করুন
            </button>
          </form>
        )}
        <p className="mt-3 text-center text-[11px] text-ink-faint">সম্পূর্ণ ফ্রি — কোনো পেমেন্ট লাগবে না</p>
      </div>
    </section>
  );
}
