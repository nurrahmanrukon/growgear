import { NextRequest } from "next/server";
import { serveAuthorPhotoFile } from "@/lib/server/authorPhotos";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  return serveAuthorPhotoFile(slug, id);
}
