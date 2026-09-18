import { NextResponse } from "next/server";
import { getAllProductTextEntries } from "@/lib/server/contentText";

export async function GET() {
  return NextResponse.json({ items: getAllProductTextEntries() });
}
