import { NextRequest, NextResponse } from "next/server";
import { setLegalPage, LegalPageContent } from "@/lib/server/legalPages";

const VALID_PAGES = new Set(["privacy", "terms", "refund"]);

export async function PUT(req: NextRequest, { params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  if (!VALID_PAGES.has(page)) {
    return NextResponse.json({ error: "অবৈধ পেজ" }, { status: 400 });
  }

  let body: LegalPageContent;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  const updated = setLegalPage(page as "privacy" | "terms" | "refund", body);
  return NextResponse.json(updated);
}
