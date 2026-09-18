import { NextResponse } from "next/server";
import { FORMAT_CATALOG, getAllBlogFormats } from "@/lib/server/blogFormats";

export async function GET() {
  return NextResponse.json({ catalog: FORMAT_CATALOG, posts: getAllBlogFormats() });
}
