import { NextRequest, NextResponse } from "next/server";
import {
  getDecisionMasterSettings,
  setDecisionMasterSettings,
  DecisionMasterSettings,
} from "@/lib/server/decisionMasterSettings";

export async function GET() {
  return NextResponse.json(getDecisionMasterSettings());
}

export async function PUT(req: NextRequest) {
  let body: Partial<DecisionMasterSettings>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }
  return NextResponse.json(setDecisionMasterSettings(body));
}
