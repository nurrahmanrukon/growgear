import { NextResponse } from "next/server";
import { getAllInventoryEntries } from "@/lib/server/inventory";

export async function GET() {
  return NextResponse.json({ items: getAllInventoryEntries() });
}
