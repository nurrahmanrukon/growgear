import { NextRequest, NextResponse } from "next/server";
import { getAudioEntry } from "@/lib/server/blogAudio";

// Public, read-only — tells the blog page whether to play the uploaded
// audio file or fall back to browser text-to-speech for this post.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getAudioEntry(slug);
  return NextResponse.json({ mode: entry.mode, available: Boolean(entry.ext) });
}
