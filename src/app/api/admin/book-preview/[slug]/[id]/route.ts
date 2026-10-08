import { NextRequest, NextResponse } from "next/server";
import { removePreviewPage } from "@/lib/server/bookPreviewPages";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  try {
    removePreviewPage(slug, id);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "মুছে ফেলা যায়নি" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
