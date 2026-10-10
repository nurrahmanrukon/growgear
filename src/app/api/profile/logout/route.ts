import { NextResponse } from "next/server";
import { PROFILE_COOKIE } from "@/lib/server/profileAuth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(PROFILE_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
