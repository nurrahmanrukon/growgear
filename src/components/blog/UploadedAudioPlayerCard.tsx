"use client";

import { useRef, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";
import { toBengaliNumber } from "@/lib/format";

function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds < 0) return "০:০০";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${toBengaliNumber(m)}:${toBengaliNumber(String(s).padStart(2, "0"))}`;
}

export function UploadedAudioPlayerCard({ slug, title }: { slug: string; title: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.pause();
    else audio.play();
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio) return;
    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-surface-muted p-6 text-center">
      <audio
        ref={audioRef}
        src={`/api/blog-audio/${slug}`}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        className="hidden"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "থামান" : "শুনুন"}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-sm transition hover:bg-primary-dark"
      >
        {playing ? <Pause size={26} /> : <Play size={26} className="ml-0.5" fill="currentColor" />}
      </button>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
      </div>

      <div className="w-full max-w-xs">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={seek}
          className="w-full accent-primary"
        />
        <div className="mt-1 flex justify-between text-[11px] text-ink-faint">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <p className="flex items-center gap-1 text-[11px] text-ink-faint">
        <Volume2 size={12} /> রেকর্ড করা অডিও শোনানো হচ্ছে
      </p>
    </div>
  );
}
