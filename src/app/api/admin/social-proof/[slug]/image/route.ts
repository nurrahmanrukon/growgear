import { NextRequest, NextResponse } from "next/server";
import { handleImageUpload } from "@/lib/server/socialProofPosts";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await handleImageUpload(slug, req);
  if (!result.ok) return result.response;
  const url = `/api/media/social-proof/${slug}/${result.entry.id}?v=${encodeURIComponent(result.entry.uploadedAt)}`;
  return NextResponse.json({ ...result.entry, url });
}
