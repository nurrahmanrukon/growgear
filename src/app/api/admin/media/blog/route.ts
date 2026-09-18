import { NextResponse } from "next/server";
import { getAllBlogMediaEntries } from "@/lib/server/mediaAssets";

export async function GET() {
  return NextResponse.json({ items: getAllBlogMediaEntries() });
}
