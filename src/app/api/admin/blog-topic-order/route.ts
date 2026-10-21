import { NextRequest, NextResponse } from "next/server";
import {
  getBlogTopicOrderSettings,
  setBlogTopicOrderSettings,
  BlogTopicOrderSettings,
} from "@/lib/server/blogTopicOrderSettings";

export async function GET() {
  return NextResponse.json(getBlogTopicOrderSettings());
}

export async function PUT(req: NextRequest) {
  let body: Partial<BlogTopicOrderSettings>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }
  return NextResponse.json(setBlogTopicOrderSettings(body));
}
