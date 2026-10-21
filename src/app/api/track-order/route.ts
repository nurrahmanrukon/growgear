import { NextRequest, NextResponse } from "next/server";
import { findOrderForTracking } from "@/lib/server/orders";
import { checkRateLimit, clientIp, RATE_LIMIT_MESSAGE } from "@/lib/server/rateLimit";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_IP = 20;

export async function POST(req: NextRequest) {
  const rate = checkRateLimit(`track-order:ip:${clientIp(req)}`, MAX_PER_IP, WINDOW_MS);
  if (!rate.allowed) {
    return NextResponse.json({ error: RATE_LIMIT_MESSAGE }, { status: 429 });
  }

  let body: { orderId?: string; phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  const orderId = body.orderId?.trim();
  const phone = body.phone?.trim();
  if (!orderId || !phone) {
    return NextResponse.json({ error: "অর্ডার আইডি এবং ফোন নম্বর দুটোই দিতে হবে" }, { status: 400 });
  }

  const order = findOrderForTracking(orderId, phone);
  if (!order) {
    return NextResponse.json(
      { error: "এই অর্ডার আইডি ও ফোন নম্বরে কোনো অর্ডার পাওয়া যায়নি — দুটো আবার চেক করে দেখুন" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    orderId: order.orderId,
    status: order.status,
    createdAt: order.createdAt,
    statusUpdatedAt: order.statusUpdatedAt,
    items: order.items.map((i) => ({ title: i.title, quantity: i.quantity, price: i.price })),
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    discount: order.discount,
    total: order.total,
    paymentMethod: order.paymentMethod,
    address: order.customer.address,
    area: order.customer.area,
  });
}
