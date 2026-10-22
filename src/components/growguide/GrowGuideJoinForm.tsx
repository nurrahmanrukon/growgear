"use client";

import { FormEvent, useState } from "react";
import { CalendarClock, CheckCircle2, Users } from "lucide-react";
import { toBengaliNumber } from "@/lib/format";
import { fillTemplate } from "@/lib/templateFill";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface GrowGuideJoinFormText {
  eyebrow: string;
  whatsIncludedLabel: string;
  nextSessionTemplate: string;
  nextSessionDate: string;
  nextSessionTime: string;
  segmentLabel: string;
  segmentTarget: number;
  segmentJoined: number;
  joinedCountTemplate: string;
  targetCountTemplate: string;
  progressCaptionTemplate: string;
  emailPlaceholder: string;
  emailErrorText: string;
  phonePlaceholder: string;
  phoneErrorText: string;
  submitButtonLabel: string;
  joinedConfirmationTemplate: string;
  footerNote: string;
}

export function GrowGuideJoinForm({
  audience,
  text,
}: {
  audience: { heroHeading: string; heroSubtitle: string; benefits: { title: string; body: string }[] };
  text: GrowGuideJoinFormText;
}) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [joined, setJoined] = useState(false);
  const [count, setCount] = useState(text.segmentJoined);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validEmail = EMAIL_PATTERN.test(email.trim());
    const validPhone = phone.trim().length >= 11;
    setEmailError(!validEmail);
    setPhoneError(!validPhone);
    if (!validEmail || !validPhone) return;
    setJoined(true);
    setCount((c) => Math.min(text.segmentTarget, c + 1));
  }

  const pct = Math.min(100, Math.round((count / text.segmentTarget) * 100));
  const targetBn = toBengaliNumber(text.segmentTarget);

  return (
    <section className="container-page py-10">
      <div className="mx-auto max-w-md rounded-lg border border-border bg-surface p-6 shadow-sm">
        <div className="text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-cta-light text-cta">
            <Users size={20} />
          </span>
          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-primary">{text.eyebrow}</p>
          <h2 className="mt-1 font-display text-lg font-bold text-foreground">{audience.heroHeading}</h2>
          <p className="mt-1.5 text-sm text-ink-soft">{audience.heroSubtitle}</p>
        </div>

        <div className="mt-4 rounded-md bg-surface-muted p-3.5">
          <p className="text-xs font-bold text-foreground">{text.whatsIncludedLabel}</p>
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
            {fillTemplate(text.nextSessionTemplate, { date: text.nextSessionDate, time: text.nextSessionTime })}
          </p>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-medium text-ink-soft">
            <span>{fillTemplate(text.joinedCountTemplate, { count: toBengaliNumber(count) })}</span>
            <span>{fillTemplate(text.targetCountTemplate, { count: targetBn })}</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-muted">
            <div className="h-full rounded-full bg-cta transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1.5 text-center text-xs text-ink-soft">
            {fillTemplate(text.progressCaptionTemplate, { segmentLabel: text.segmentLabel, target: targetBn })}
          </p>
        </div>

        {joined ? (
          <div className="mt-4 flex items-center justify-center gap-1.5 rounded-md bg-cta-light px-3 py-2.5 text-xs font-medium text-cta-dark">
            <CheckCircle2 size={14} /> {fillTemplate(text.joinedConfirmationTemplate, { target: targetBn })}
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
              placeholder={text.emailPlaceholder}
              className={`w-full rounded-md border bg-surface px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary ${
                emailError ? "border-price" : "border-border"
              }`}
            />
            {emailError && <p className="text-left text-[11px] text-price">{text.emailErrorText}</p>}
            <input
              type="text"
              inputMode="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setPhoneError(false);
              }}
              placeholder={text.phonePlaceholder}
              className={`w-full rounded-md border bg-surface px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary ${
                phoneError ? "border-price" : "border-border"
              }`}
            />
            {phoneError && <p className="text-left text-[11px] text-price">{text.phoneErrorText}</p>}
            <button
              type="submit"
              className="rounded-md bg-cta px-4 py-2.5 text-sm font-semibold text-white hover:bg-cta-dark"
            >
              {text.submitButtonLabel}
            </button>
          </form>
        )}
        <p className="mt-3 text-center text-[11px] text-ink-faint">{text.footerNote}</p>
      </div>
    </section>
  );
}
