import { NextRequest, NextResponse } from "next/server";
import { getNewsletterSettings, setNewsletterSettings, NewsletterSettings } from "@/lib/server/newsletterSettings";

export async function GET() {
  return NextResponse.json(getNewsletterSettings());
}

export async function PUT(req: NextRequest) {
  let body: Partial<NewsletterSettings>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  try {
    const updated = setNewsletterSettings(body);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "সংরক্ষণ করা যায়নি" }, { status: 400 });
  }
}
