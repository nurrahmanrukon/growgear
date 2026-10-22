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

interface SlideVisual {
  icon: LucideIcon;
  from: string;
  to: string;
}
interface SlideText {
  title: string;
  body: string;
}

const SLIDE_VISUALS: SlideVisual[] = [
  { icon: Sparkles, from: "#2a4570", to: "#16294a" },
  { icon: PlayCircle, from: "#16a34a", to: "#113023" },
  { icon: GraduationCap, from: "#3d5a80", to: "#1b2740" },
  { icon: Briefcase, from: "#a2512f", to: "#5c2c19" },
  { icon: Rocket, from: "#6b85b8", to: "#16294a" },
  { icon: Mic, from: "#2a4570", to: "#16294a" },
  { icon: HelpCircle, from: "#16a34a", to: "#113023" },
  { icon: Users, from: "#3d5a80", to: "#1b2740" },
  { icon: Gift, from: "#a2512f", to: "#5c2c19" },
  { icon: Heart, from: "#6b85b8", to: "#16294a" },
  { icon: Send, from: "#2a4570", to: "#16294a" },
];

export function GrowGuideHeroCarousel({ slides }: { slides: SlideText[] }) {
  const [index, setIndex] = useState(0);
  const count = Math.min(slides.length, SLIDE_VISUALS.length);
  const slide = { ...SLIDE_VISUALS[index % count], ...slides[index % count] };
  const Icon = slide.icon;

  function go(delta: number) {
    setIndex((i) => (i + delta + count) % count);
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
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
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
