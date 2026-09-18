import { NextResponse } from "next/server";
import { getAllAudioEntries } from "@/lib/server/blogAudio";

export async function GET() {
  return NextResponse.json({ posts: getAllAudioEntries() });
}
