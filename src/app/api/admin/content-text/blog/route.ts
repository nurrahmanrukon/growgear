import { NextResponse } from "next/server";
import { getAllBlogTextEntries } from "@/lib/server/contentText";

export async function GET() {
  return NextResponse.json({ items: getAllBlogTextEntries() });
}
