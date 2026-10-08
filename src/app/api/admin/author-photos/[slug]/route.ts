import { NextRequest, NextResponse } from "next/server";
import {
  getAuthorPhotos,
  handleAuthorPhotoUpload,
  reorderAuthorPhotos,
} from "@/lib/server/authorPhotos";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return NextResponse.json({ photos: getAuthorPhotos(slug) });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await handleAuthorPhotoUpload(slug, req);
  if (!result.ok) return result.response;
  return NextResponse.json(result.entry);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let body: { order?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }
  if (!Array.isArray(body.order)) {
    return NextResponse.json({ error: "order একটি array হতে হবে" }, { status: 400 });
  }
  try {
    reorderAuthorPhotos(slug, body.order);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "আপডেট করা যায়নি" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
