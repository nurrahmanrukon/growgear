import fs from "fs";
import path from "path";

export interface DecisionMasterStep {
  title: string;
  body: string;
}

export interface DecisionMasterSettings {
  heading: string;
  subheading: string;
  formLabel: string;
  formPlaceholder: string;
  formErrorText: string;
  submitButtonLabel: string;
  resultHeading: string;
  steps: DecisionMasterStep[];
  ctaText: string;
  ctaBookSlug: string;
  ctaLinkLabel: string;
}

const FILE_PATH = path.join(process.cwd(), "data", "decisionmaster-settings.json");
const STEP_COUNT = 5;

const DEFAULTS: DecisionMasterSettings = {
  heading: "সহজে সিদ্ধান্ত নিন — আপনার সমস্যা লিখুন, কাঠামোবদ্ধ সমাধান পান",
  subheading: "জীবনের যেকোনো কঠিন সিদ্ধান্তের জন্য একটা প্র্যাকটিক্যাল ফ্রেমওয়ার্ক — সম্পূর্ণ ফ্রি",
  formLabel: "আপনার সমস্যা বা সিদ্ধান্তটা লিখুন",
  formPlaceholder: "যেমন: চাকরি বদলাবো নাকি বর্তমান জায়গায় থাকবো...",
  formErrorText: "সমস্যাটা লিখুন, তারপর সমাধান দেখুন",
  submitButtonLabel: "সমাধান দেখুন",
  resultHeading: "ডিসিশনমাস্টার ফ্রেমওয়ার্ক — এই ৫টি ধাপ অনুসরণ করুন",
  steps: [
    {
      title: "সমস্যাটা স্পষ্ট করুন",
      body: "ঠিক কোন সিদ্ধান্তটা নিতে হবে — সেটা এক বাক্যে লিখে ফেলুন। সমস্যাটা যত স্পষ্ট হবে, সিদ্ধান্তও তত সহজ হবে।",
    },
    {
      title: "সব অপশন লিস্ট করুন",
      body: "কমপক্ষে ২-৩টা ভিন্ন অপশন বের করুন — শুধু 'হ্যাঁ' বা 'না' ছাড়াও মাঝামাঝি কোনো পথ থাকতে পারে।",
    },
    {
      title: "ভালো-মন্দ যাচাই করুন",
      body: "প্রতিটা অপশনের সুবিধা ও অসুবিধা তুলনা করুন — শুধু আবেগ দিয়ে না, বাস্তব ফলাফল চিন্তা করে।",
    },
    {
      title: "দীর্ঘমেয়াদী প্রভাব ভাবুন",
      body: "১ বছর পর এই সিদ্ধান্তটা কেমন মনে হবে — নিজেকে এই প্রশ্নটা করুন।",
    },
    {
      title: "ডেডলাইন দিয়ে সিদ্ধান্ত নিন",
      body: "একটা নির্দিষ্ট সময়সীমা ঠিক করুন এবং সেই সময়ের মধ্যেই সিদ্ধান্ত নিয়ে এগিয়ে যান — পারফেক্ট সময়ের অপেক্ষা করবেন না।",
    },
  ],
  ctaText: "এই ফ্রেমওয়ার্কটা আরও গভীরভাবে শিখতে চান?",
  ctaBookSlug: "book-1",
  ctaLinkLabel: '"ডিসিশন কোড" বইটি দেখুন →',
};

function cleanString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function cleanSteps(raw: unknown): DecisionMasterStep[] {
  if (!Array.isArray(raw) || raw.length !== STEP_COUNT) return DEFAULTS.steps;
  const cleaned = raw.map((s, i) => ({
    title: cleanString((s as Partial<DecisionMasterStep>)?.title, DEFAULTS.steps[i].title),
    body: cleanString((s as Partial<DecisionMasterStep>)?.body, DEFAULTS.steps[i].body),
  }));
  return cleaned;
}

export function getDecisionMasterSettings(): DecisionMasterSettings {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<DecisionMasterSettings>;
    return {
      heading: cleanString(parsed.heading, DEFAULTS.heading),
      subheading: cleanString(parsed.subheading, DEFAULTS.subheading),
      formLabel: cleanString(parsed.formLabel, DEFAULTS.formLabel),
      formPlaceholder: cleanString(parsed.formPlaceholder, DEFAULTS.formPlaceholder),
      formErrorText: cleanString(parsed.formErrorText, DEFAULTS.formErrorText),
      submitButtonLabel: cleanString(parsed.submitButtonLabel, DEFAULTS.submitButtonLabel),
      resultHeading: cleanString(parsed.resultHeading, DEFAULTS.resultHeading),
      steps: cleanSteps(parsed.steps),
      ctaText: cleanString(parsed.ctaText, DEFAULTS.ctaText),
      ctaBookSlug: cleanString(parsed.ctaBookSlug, DEFAULTS.ctaBookSlug),
      ctaLinkLabel: cleanString(parsed.ctaLinkLabel, DEFAULTS.ctaLinkLabel),
    };
  } catch {
    return DEFAULTS;
  }
}

export function setDecisionMasterSettings(update: Partial<DecisionMasterSettings>): DecisionMasterSettings {
  const current = getDecisionMasterSettings();
  const next: DecisionMasterSettings = {
    heading: update.heading !== undefined ? cleanString(update.heading, current.heading) : current.heading,
    subheading: update.subheading !== undefined ? cleanString(update.subheading, current.subheading) : current.subheading,
    formLabel: update.formLabel !== undefined ? cleanString(update.formLabel, current.formLabel) : current.formLabel,
    formPlaceholder:
      update.formPlaceholder !== undefined
        ? cleanString(update.formPlaceholder, current.formPlaceholder)
        : current.formPlaceholder,
    formErrorText:
      update.formErrorText !== undefined ? cleanString(update.formErrorText, current.formErrorText) : current.formErrorText,
    submitButtonLabel:
      update.submitButtonLabel !== undefined
        ? cleanString(update.submitButtonLabel, current.submitButtonLabel)
        : current.submitButtonLabel,
    resultHeading:
      update.resultHeading !== undefined ? cleanString(update.resultHeading, current.resultHeading) : current.resultHeading,
    steps: update.steps !== undefined ? cleanSteps(update.steps) : current.steps,
    ctaText: update.ctaText !== undefined ? cleanString(update.ctaText, current.ctaText) : current.ctaText,
    ctaBookSlug: update.ctaBookSlug !== undefined ? cleanString(update.ctaBookSlug, current.ctaBookSlug) : current.ctaBookSlug,
    ctaLinkLabel:
      update.ctaLinkLabel !== undefined ? cleanString(update.ctaLinkLabel, current.ctaLinkLabel) : current.ctaLinkLabel,
  };
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(next, null, 2));
  return next;
}
