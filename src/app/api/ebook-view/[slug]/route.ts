import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import { verifyProfileSessionToken, PROFILE_COOKIE } from "@/lib/server/profileAuth";
import { hasEbookPurchase } from "@/lib/server/profiles";
import { getMediaEntry, getMediaFilePath } from "@/lib/server/mediaAssets";

/** Serves the PDF inline (for the in-page reader), never as a download — distinct from
 *  /api/ebook-download, which is the only route gated by the admin's download toggle. */
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const email = verifyProfileSessionToken(req.cookies.get(PROFILE_COOKIE)?.value);
  if (!email || !hasEbookPurchase(email, slug)) {
    return NextResponse.json({ error: "এই ইবুকটি আপনার কেনা নেই" }, { status: 403 });
  }

  const entry = getMediaEntry("ebook-pdf", slug);
  const found = getMediaFilePath("ebook-pdf", slug);
  if (!entry || !found) {
    return NextResponse.json({ error: "PDF এখনো আপলোড করা হয়নি" }, { status: 404 });
  }

  const bytes = fs.readFileSync(/*turbopackIgnore: true*/ found.filePath);
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": found.mimeType,
      "Content-Length": String(bytes.length),
      "Content-Disposition": `inline; filename="${entry.fileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
