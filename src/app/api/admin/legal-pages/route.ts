import { NextResponse } from "next/server";
import { getLegalPagesSettings } from "@/lib/server/legalPages";

export async function GET() {
  return NextResponse.json(getLegalPagesSettings());
}
