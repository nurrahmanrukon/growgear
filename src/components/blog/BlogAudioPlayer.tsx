"use client";

import { useEffect, useState } from "react";
import { AudioPlayerCard } from "@/components/blog/AudioPlayerCard";
import { UploadedAudioPlayerCard } from "@/components/blog/UploadedAudioPlayerCard";

export function BlogAudioPlayer({ slug, title, paragraphs }: { slug: string; title: string; paragraphs: string[] }) {
  const [useFile, setUseFile] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/blog-audio-meta/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setUseFile(data.mode === "file" && data.available);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (useFile) {
    return <UploadedAudioPlayerCard slug={slug} title={title} />;
  }
  return <AudioPlayerCard title={title} paragraphs={paragraphs} />;
}
