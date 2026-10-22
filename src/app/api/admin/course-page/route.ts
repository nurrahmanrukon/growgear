import { NextRequest, NextResponse } from "next/server";
import { getCoursePageSettings, setCoursePageSettings, CoursePageSettings } from "@/lib/server/coursePageSettings";

export async function GET() {
  return NextResponse.json(getCoursePageSettings());
}

export async function PUT(req: NextRequest) {
  let body: Partial<CoursePageSettings>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }
  return NextResponse.json(setCoursePageSettings(body));
}
