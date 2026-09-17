import { NextResponse } from "next/server";
import { getAllBlogFormats } from "@/lib/server/blogFormats";

export async function GET() {
  return NextResponse.json({ posts: getAllBlogFormats() });
}
