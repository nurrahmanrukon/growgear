import { NextRequest, NextResponse } from "next/server";
import { ContentFormat, setBlogFormats } from "@/lib/server/blogFormats";

const VALID_FORMATS: ContentFormat[] = ["text", "audio"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let body: { formats?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  const formats = body.formats;
  if (!Array.isArray(formats) || formats.length === 0 || !formats.every((f) => VALID_FORMATS.includes(f as ContentFormat))) {
    return NextResponse.json({ error: "অন্তত একটি বৈধ ফরম্যাট (text/audio) বেছে নিতে হবে" }, { status: 400 });
  }

  try {
    setBlogFormats(slug, formats as ContentFormat[]);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "আপডেট করা যায়নি" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
