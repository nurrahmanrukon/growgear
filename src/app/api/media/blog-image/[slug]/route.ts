import { NextRequest } from "next/server";
import { serveMediaFile } from "@/lib/server/mediaAssets";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return serveMediaFile("blog-image", slug, req);
}
