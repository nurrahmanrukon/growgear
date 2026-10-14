import { NextRequest, NextResponse } from "next/server";
import { getCategoryIntroSettings, setCategoryIntroSettings, CategoryIntroSettings } from "@/lib/server/categoryIntro";

export async function GET() {
  return NextResponse.json(getCategoryIntroSettings());
}

export async function PUT(req: NextRequest) {
  let body: Partial<CategoryIntroSettings>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  try {
    const updated = setCategoryIntroSettings(body);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "সংরক্ষণ করা যায়নি" }, { status: 400 });
  }
}
