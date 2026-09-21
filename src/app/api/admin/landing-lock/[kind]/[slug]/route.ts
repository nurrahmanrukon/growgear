import { NextRequest, NextResponse } from "next/server";
import {
  AllowedItemRef,
  LandingLockMode,
  LockableKind,
  getLandingLockConfig,
  resetLandingLockConfig,
  setLandingLockConfig,
} from "@/lib/server/landingLock";

const VALID_KINDS: LockableKind[] = ["book", "ebook", "gear", "blog"];
const VALID_MODES: LandingLockMode[] = ["off", "full", "curated"];

export async function GET(_req: NextRequest, { params }: { params: Promise<{ kind: string; slug: string }> }) {
  const { kind, slug } = await params;
  if (!VALID_KINDS.includes(kind as LockableKind)) {
    return NextResponse.json({ error: "অজানা ধরন" }, { status: 400 });
  }
  return NextResponse.json(getLandingLockConfig(kind as LockableKind, slug));
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ kind: string; slug: string }> }) {
  const { kind, slug } = await params;
  if (!VALID_KINDS.includes(kind as LockableKind)) {
    return NextResponse.json({ error: "অজানা ধরন" }, { status: 400 });
  }

  let body: { mode?: string; allowed?: AllowedItemRef[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  if (!body.mode || !VALID_MODES.includes(body.mode as LandingLockMode)) {
    return NextResponse.json({ error: "mode এর মান সঠিক নয়" }, { status: 400 });
  }
  const allowed = Array.isArray(body.allowed) ? body.allowed : [];
  const validAllowed = allowed.every(
    (item) => item && VALID_KINDS.includes(item.kind) && typeof item.slug === "string"
  );
  if (!validAllowed) {
    return NextResponse.json({ error: "allowed তালিকা সঠিক নয়" }, { status: 400 });
  }

  setLandingLockConfig(kind as LockableKind, slug, { mode: body.mode as LandingLockMode, allowed });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ kind: string; slug: string }> }) {
  const { kind, slug } = await params;
  if (!VALID_KINDS.includes(kind as LockableKind)) {
    return NextResponse.json({ error: "অজানা ধরন" }, { status: 400 });
  }
  resetLandingLockConfig(kind as LockableKind, slug);
  return NextResponse.json({ ok: true });
}
