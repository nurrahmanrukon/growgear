import { NextResponse } from "next/server";
import { getAllLandingLockEntries } from "@/lib/server/landingLock";

export async function GET() {
  return NextResponse.json({ items: getAllLandingLockEntries() });
}
