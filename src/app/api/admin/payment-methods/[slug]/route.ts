import { NextRequest, NextResponse } from "next/server";
import {
  getAllPaymentEntries,
  getHiddenPaymentMethods,
  isPaymentCustomized,
  resetPaymentMethods,
  setHiddenPaymentMethods,
} from "@/lib/server/paymentMethods";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getAllPaymentEntries().find((e) => e.slug === slug);
  if (!entry) {
    return NextResponse.json({ error: "আইটেম পাওয়া যায়নি" }, { status: 404 });
  }
  return NextResponse.json({
    offered: entry.offered,
    hidden: getHiddenPaymentMethods(slug),
    customized: isPaymentCustomized(slug),
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let body: { hidden?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  if (!Array.isArray(body.hidden)) {
    return NextResponse.json({ error: "hidden একটি array হতে হবে" }, { status: 400 });
  }

  try {
    setHiddenPaymentMethods(slug, body.hidden);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "আপডেট করা যায়নি" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  resetPaymentMethods(slug);
  return NextResponse.json({ ok: true });
}
