import { NextRequest, NextResponse } from "next/server";
import { getBlogSearchSettings, setBlogSearchSettings } from "@/lib/server/blogSearchSettings";

export async function GET() {
  return NextResponse.json(getBlogSearchSettings());
}

export async function PUT(req: NextRequest) {
  let body: { enabled?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  const updated = setBlogSearchSettings(body);
  return NextResponse.json(updated);
}
