import { NextRequest, NextResponse } from "next/server";
import { getBlogTopicSettings, setBlogTopicSettings, BlogTopicSettings } from "@/lib/server/blogTopicSettings";

export async function GET() {
  return NextResponse.json(getBlogTopicSettings());
}

export async function PUT(req: NextRequest) {
  let body: Partial<BlogTopicSettings>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }
  return NextResponse.json(setBlogTopicSettings(body));
}
