import { NextRequest, NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/data/blog";
import {
  MAX_AUDIO_BYTES,
  getAudioEntry,
  removeAudioFile,
  resolveExtension,
  saveAudioFile,
  setAudioMode,
} from "@/lib/server/blogAudio";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getBlogPostBySlug(slug)) {
    return NextResponse.json({ error: "পোস্ট পাওয়া যায়নি" }, { status: 404 });
  }
  return NextResponse.json(getAudioEntry(slug));
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getBlogPostBySlug(slug)) {
    return NextResponse.json({ error: "পোস্ট পাওয়া যায়নি" }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "অবৈধ আপলোড" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "কোনো ফাইল পাওয়া যায়নি" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "ফাইলটি খালি" }, { status: 400 });
  }
  if (file.size > MAX_AUDIO_BYTES) {
    return NextResponse.json({ error: "ফাইলের আকার ২৫ এমবি-র বেশি হতে পারবে না" }, { status: 400 });
  }

  const ext = resolveExtension(file.name, file.type);
  if (!ext) {
    return NextResponse.json(
      { error: "শুধু mp3, wav, m4a, ogg, aac বা webm ফরম্যাটের অডিও ফাইল আপলোড করা যাবে" },
      { status: 400 }
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const entry = saveAudioFile(slug, file.name, ext, bytes);
  return NextResponse.json(entry);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getBlogPostBySlug(slug)) {
    return NextResponse.json({ error: "পোস্ট পাওয়া যায়নি" }, { status: 404 });
  }

  let body: { mode?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }
  if (body.mode !== "tts" && body.mode !== "file") {
    return NextResponse.json({ error: "mode অবশ্যই tts অথবা file হতে হবে" }, { status: 400 });
  }

  try {
    const entry = setAudioMode(slug, body.mode);
    return NextResponse.json(entry);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "আপডেট করা যায়নি" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getBlogPostBySlug(slug)) {
    return NextResponse.json({ error: "পোস্ট পাওয়া যায়নি" }, { status: 404 });
  }
  removeAudioFile(slug);
  return NextResponse.json({ ok: true });
}
