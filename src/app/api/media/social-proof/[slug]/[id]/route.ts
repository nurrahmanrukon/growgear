import { NextRequest } from "next/server";
import { serveImageFile } from "@/lib/server/socialProofPosts";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  return serveImageFile(slug, id);
}
