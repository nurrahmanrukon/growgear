"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, Lightbulb, ListChecks, Scale, Target, Timer } from "lucide-react";
import { toBengaliNumber } from "@/lib/format";

const FRAMEWORK_STEPS = [
  {
    icon: Target,
    title: "সমস্যাটা স্পষ্ট করুন",
    body: "ঠিক কোন সিদ্ধান্তটা নিতে হবে — সেটা এক বাক্যে লিখে ফেলুন। সমস্যাটা যত স্পষ্ট হবে, সিদ্ধান্তও তত সহজ হবে।",
  },
  {
    icon: ListChecks,
    title: "সব অপশন লিস্ট করুন",
    body: "কমপক্ষে ২-৩টা ভিন্ন অপশন বের করুন — শুধু 'হ্যাঁ' বা 'না' ছাড়াও মাঝামাঝি কোনো পথ থাকতে পারে।",
  },
  {
    icon: Scale,
    title: "ভালো-মন্দ যাচাই করুন",
    body: "প্রতিটা অপশনের সুবিধা ও অসুবিধা তুলনা করুন — শুধু আবেগ দিয়ে না, বাস্তব ফলাফল চিন্তা করে।",
  },
  {
    icon: Lightbulb,
    title: "দীর্ঘমেয়াদী প্রভাব ভাবুন",
    body: "১ বছর পর এই সিদ্ধান্তটা কেমন মনে হবে — নিজেকে এই প্রশ্নটা করুন।",
  },
  {
    icon: Timer,
    title: "ডেডলাইন দিয়ে সিদ্ধান্ত নিন",
    body: "একটা নির্দিষ্ট সময়সীমা ঠিক করুন এবং সেই সময়ের মধ্যেই সিদ্ধান্ত নিয়ে এগিয়ে যান — পারফেক্ট সময়ের অপেক্ষা করবেন না।",
  },
];

export function DecisionMasterTool() {
  const [problem, setProblem] = useState("");
  const [error, setError] = useState(false);
  const [submittedProblem, setSubmittedProblem] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!problem.trim()) {
      setError(true);
      return;
    }
    setError(false);
    setSubmittedProblem(problem.trim());
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-surface p-5">
        <label htmlFor="problemInput" className="text-sm font-semibold text-foreground">
          আপনার সমস্যা বা সিদ্ধান্তটা লিখুন
        </label>
        <textarea
          id="problemInput"
          value={problem}
          onChange={(e) => {
            setProblem(e.target.value);
            setError(false);
          }}
          rows={4}
          placeholder="যেমন: চাকরি বদলাবো নাকি বর্তমান জায়গায় থাকবো..."
          className={`mt-2 w-full rounded-md border bg-surface px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary ${
            error ? "border-price" : "border-border"
          }`}
        />
        {error && <p className="mt-1.5 text-xs text-price">সমস্যাটা লিখুন, তারপর সমাধান দেখুন</p>}
        <button
          type="submit"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-cta px-4 py-2.5 text-sm font-semibold text-white hover:bg-cta-dark sm:w-auto"
        >
          সমাধান দেখুন <ArrowRight size={15} />
        </button>
      </form>

      {submittedProblem && (
        <div className="mt-6">
          <div className="rounded-lg border border-primary-light bg-primary-light p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">আপনার সিদ্ধান্ত</p>
            <p className="mt-1 text-sm text-primary-dark">&ldquo;{submittedProblem}&rdquo;</p>
          </div>

          <h2 className="mt-6 font-display text-lg font-bold text-foreground">
            ডিসিশনমাস্টার ফ্রেমওয়ার্ক — এই ৫টি ধাপ অনুসরণ করুন
          </h2>
          <div className="mt-4 space-y-3">
            {FRAMEWORK_STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="flex gap-3 rounded-lg border border-border bg-surface p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary-dark">
                    <Icon size={17} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {toBengaliNumber(i + 1)}. {s.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-ink-soft">{s.body}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-lg border border-border bg-surface-muted p-4 text-center">
            <p className="text-sm text-ink-soft">এই ফ্রেমওয়ার্কটা আরও গভীরভাবে শিখতে চান?</p>
            <Link href="/books/book-1" className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">
              &ldquo;ডিসিশন কোড&rdquo; বইটি দেখুন →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
