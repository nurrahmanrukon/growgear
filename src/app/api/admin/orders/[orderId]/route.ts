import { NextRequest, NextResponse } from "next/server";
import { getOrder, updateOrderStatus, OrderStatus } from "@/lib/server/orders";

const VALID_STATUSES: OrderStatus[] = ["pending", "confirmed", "rejected", "delivered"];

export async function GET(_req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const order = getOrder(orderId);
  if (!order) {
    return NextResponse.json({ error: "অর্ডার পাওয়া যায়নি" }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;

  let body: { status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  if (!body.status || !VALID_STATUSES.includes(body.status as OrderStatus)) {
    return NextResponse.json({ error: "অবৈধ স্ট্যাটাস" }, { status: 400 });
  }

  try {
    const order = updateOrderStatus(orderId, body.status as OrderStatus);
    return NextResponse.json(order);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "আপডেট করা যায়নি" }, { status: 400 });
  }
}
