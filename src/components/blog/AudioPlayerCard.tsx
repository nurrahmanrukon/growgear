"use client";

import { useEffect, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";
import { toBengaliNumber } from "@/lib/format";

const WORDS_PER_MINUTE = 130;

function estimateMinutes(paragraphs: string[]) {
  const words = paragraphs.join(" ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function AudioPlayerCard({ title, paragraphs }: { title: string; paragraphs: string[] }) {
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount check to bridge SSR/client Web Speech API availability
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  function handleToggle() {
    if (!supported) return;
    const synth = window.speechSynthesis;
    if (playing) {
      synth.cancel();
      setPlaying(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(paragraphs.join(" "));
    utterance.lang = "bn-BD";
    utterance.rate = 0.95;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    synth.cancel();
    synth.speak(utterance);
    setPlaying(true);
  }

  const minutes = estimateMinutes(paragraphs);

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-surface-muted p-6 text-center">
      <button
        type="button"
        onClick={handleToggle}
        disabled={!supported}
        aria-label={playing ? "থামান" : "শুনুন"}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-sm transition hover:bg-primary-dark disabled:opacity-50"
      >
        {playing ? <Pause size={26} /> : <Play size={26} className="ml-0.5" fill="currentColor" />}
      </button>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-ink-faint">আনুমানিক {toBengaliNumber(minutes)} মিনিট অডিও</p>
      </div>
      <div className="flex h-6 items-end gap-1" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`w-1 rounded-full bg-primary transition-all ${playing ? "animate-pulse" : ""}`}
            style={{ height: playing ? `${8 + (i % 3) * 6}px` : "4px" }}
          />
        ))}
      </div>
      {!supported && <p className="text-[11px] text-ink-faint">আপনার ব্রাউজারে অডিও শোনার সুবিধাটি সমর্থিত নয়।</p>}
      <p className="flex items-center gap-1 text-[11px] text-ink-faint">
        <Volume2 size={12} /> ব্রাউজার টেক্সট-টু-স্পিচ ব্যবহার করে শোনানো হচ্ছে
      </p>
    </div>
  );
}
