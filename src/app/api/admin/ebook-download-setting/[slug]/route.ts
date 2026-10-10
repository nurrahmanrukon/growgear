import { NextRequest, NextResponse } from "next/server";
import { isDownloadEnabled, setDownloadEnabled } from "@/lib/server/ebookDownloadSettings";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return NextResponse.json({ enabled: isDownloadEnabled(slug) });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let body: { enabled?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }
  try {
    setDownloadEnabled(slug, Boolean(body.enabled));
    return NextResponse.json({ ok: true, enabled: Boolean(body.enabled) });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "পরিবর্তন করা যায়নি" }, { status: 400 });
  }
}
