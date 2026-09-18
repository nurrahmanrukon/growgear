import { NextResponse } from "next/server";
import { getAllProductMediaEntries } from "@/lib/server/mediaAssets";

export async function GET() {
  return NextResponse.json({ items: getAllProductMediaEntries() });
}
