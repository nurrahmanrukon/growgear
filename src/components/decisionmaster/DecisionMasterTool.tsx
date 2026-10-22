"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, Lightbulb, ListChecks, Scale, Target, Timer } from "lucide-react";
import { toBengaliNumber } from "@/lib/format";
import type { DecisionMasterSettings } from "@/lib/server/decisionMasterSettings";

const STEP_ICONS = [Target, ListChecks, Scale, Lightbulb, Timer];

export function DecisionMasterTool({ settings }: { settings: DecisionMasterSettings }) {
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
          {settings.formLabel}
        </label>
        <textarea
          id="problemInput"
          value={problem}
          onChange={(e) => {
            setProblem(e.target.value);
            setError(false);
          }}
          rows={4}
          placeholder={settings.formPlaceholder}
          className={`mt-2 w-full rounded-md border bg-surface px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary ${
            error ? "border-price" : "border-border"
          }`}
        />
        {error && <p className="mt-1.5 text-xs text-price">{settings.formErrorText}</p>}
        <button
          type="submit"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-cta px-4 py-2.5 text-sm font-semibold text-white hover:bg-cta-dark sm:w-auto"
        >
          {settings.submitButtonLabel} <ArrowRight size={15} />
        </button>
      </form>

      {submittedProblem && (
        <div className="mt-6">
          <div className="rounded-lg border border-primary-light bg-primary-light p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">আপনার সিদ্ধান্ত</p>
            <p className="mt-1 text-sm text-primary-dark">&ldquo;{submittedProblem}&rdquo;</p>
          </div>

          <h2 className="mt-6 font-display text-lg font-bold text-foreground">{settings.resultHeading}</h2>
          <div className="mt-4 space-y-3">
            {settings.steps.map((s, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <div key={i} className="flex gap-3 rounded-lg border border-border bg-surface p-4">
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
            <p className="text-sm text-ink-soft">{settings.ctaText}</p>
            <Link
              href={`/books/${settings.ctaBookSlug}`}
              className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
            >
              {settings.ctaLinkLabel}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
