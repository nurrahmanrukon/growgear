import { NextRequest } from "next/server";
import { servePreviewPageFile } from "@/lib/server/bookPreviewPages";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  return servePreviewPageFile(slug, id, req);
}
