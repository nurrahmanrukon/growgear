"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  PlayCircle,
  GraduationCap,
  Briefcase,
  Rocket,
  Mic,
  HelpCircle,
  Users,
  Gift,
  Heart,
  Send,
  LucideIcon,
} from "lucide-react";

interface Slide {
  icon: LucideIcon;
  title: string;
  body: string;
  from: string;
  to: string;
}

const SLIDES: Slide[] = [
  {
    icon: Sparkles,
    title: "GrowGuide কী?",
    body: "শিক্ষার্থী, প্রফেশনাল ও উদ্যোক্তাদের গাইডেড ওয়েতে গ্রো করতে সাহায্য করার একটি উদ্যোগ।",
    from: "#2a4570",
    to: "#16294a",
  },
  {
    icon: PlayCircle,
    title: "মাসে একটি ফ্রি লাইভ ওয়েবিনার",
    body: "প্রতি মাসে একটি নির্দিষ্ট সময়ে সম্পূর্ণ ফ্রি লাইভ সেশন আয়োজন করা হয়।",
    from: "#16a34a",
    to: "#113023",
  },
  {
    icon: GraduationCap,
    title: "শিক্ষার্থীদের জন্য",
    body: "পড়াশোনার পাশাপাশি ক্যারিয়ার প্রস্তুতি ও ব্যক্তিগত গ্রোথের গাইডেড রোডম্যাপ।",
    from: "#3d5a80",
    to: "#1b2740",
  },
  {
    icon: Briefcase,
    title: "প্রফেশনালদের জন্য",
    body: "কর্মক্ষেত্রে প্রোডাক্টিভিটি বাড়ানো ও সঠিক সিদ্ধান্ত নেওয়ার বাস্তবসম্মত কৌশল।",
    from: "#a2512f",
    to: "#5c2c19",
  },
  {
    icon: Rocket,
    title: "উদ্যোক্তাদের জন্য",
    body: "ব্যবসা বড় করা ও ঝুঁকি কমিয়ে দ্রুত সিদ্ধান্ত নেওয়ার দিকনির্দেশনা।",
    from: "#6b85b8",
    to: "#16294a",
  },
  {
    icon: Mic,
    title: "নূর রহমান সরাসরি হোস্ট করেন",
    body: "প্রতিটি সেশনে নূর রহমান নিজে সরাসরি অংশগ্রহণকারীদের সাথে কথা বলেন।",
    from: "#2a4570",
    to: "#16294a",
  },
  {
    icon: HelpCircle,
    title: "লাইভ প্রশ্নোত্তর",
    body: "সেশন চলাকালীন সরাসরি প্রশ্ন করার সুযোগ পাবেন, নূর রহমান নিজে উত্তর দেন।",
    from: "#16a34a",
    to: "#113023",
  },
  {
    icon: Users,
    title: "প্রাইভেট কমিউনিটি গ্রুপ",
    body: "সেশন শেষে একটি প্রাইভেট গ্রুপে যুক্ত হবেন, যেখানে সবাই একে অপরকে সাহায্য করে।",
    from: "#3d5a80",
    to: "#1b2740",
  },
  {
    icon: Gift,
    title: "সম্পূর্ণ ফ্রি",
    body: "কোনো লুকানো ফি নেই — নিবন্ধন থেকে সেশন পর্যন্ত সবকিছুই বিনামূল্যে।",
    from: "#a2512f",
    to: "#5c2c19",
  },
  {
    icon: Heart,
    title: "কমিউনিটি গড়ে তোলার উদ্যোগ",
    body: "এটি নূর রহমানের ব্যক্তিগত কমিউনিটি গড়ে তোলা ও সমাজে অবদান রাখার একটা প্রচেষ্টা।",
    from: "#6b85b8",
    to: "#16294a",
  },
  {
    icon: Send,
    title: "এখনই জয়েন করুন",
    body: "নিচে ইমেইল দিয়ে ফ্রি-তে জয়েন করুন — পরবর্তী সেশনের সময়সূচি ইমেইলে পেয়ে যাবেন।",
    from: "#2a4570",
    to: "#16294a",
  },
];

export function GrowGuideHeroCarousel() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const Icon = slide.icon;

  function go(delta: number) {
    setIndex((i) => (i + delta + SLIDES.length) % SLIDES.length);
  }

  return (
    <div className="mx-auto mt-5 max-w-2xl">
      <div className="relative">
        <div
          className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-lg px-8 text-center sm:aspect-[21/9]"
          style={{ background: `linear-gradient(135deg, ${slide.from}, ${slide.to})` }}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white">
            <Icon size={24} />
          </span>
          <h2 className="font-display text-lg font-bold text-white sm:text-xl">{slide.title}</h2>
          <p className="max-w-md text-xs leading-relaxed text-white/85 sm:text-sm">{slide.body}</p>
        </div>
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="আগের তথ্য"
          className="absolute left-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition hover:bg-black/50 sm:h-9 sm:w-9"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="পরের তথ্য"
          className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition hover:bg-black/50 sm:h-9 sm:w-9"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {SLIDES.map((s, i) => (
          <button
            key={s.title}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`স্লাইড ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-primary" : "w-1.5 bg-border"}`}
          />
        ))}
      </div>
    </div>
  );
}
