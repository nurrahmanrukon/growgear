import { NextRequest } from "next/server";
import { serveMediaFile } from "@/lib/server/mediaAssets";

// The optional [[...version]] segment is never read — it only exists so each upload
// gets a distinct URL (see mediaUrl() in mediaAssets.ts), since these responses are
// sent with a one-year immutable Cache-Control and a fixed slug-only URL would keep
// serving a browser's (or Next's own image-optimizer's) cached copy of the old file
// forever after a re-upload. A query-string cache-buster doesn't work here — Next's
// built-in image optimizer rejects an embedded "?" inside the ?url= parameter it's
// given — so the version lives in the path instead.
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return serveMediaFile("product-image", slug, req);
}
