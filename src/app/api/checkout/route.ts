import { NextRequest, NextResponse } from "next/server";

interface CheckoutPayload {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  area?: string;
  paymentMethod: string;
  items: { productId: string; title: string; price: number; quantity: number }[];
}

export async function POST(req: NextRequest) {
  let body: Partial<CheckoutPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  const { name, phone, email, address, items } = body;
  const hasDelivery = address?.trim() || email?.trim();
  if (!name?.trim() || !phone?.trim() || !hasDelivery || !items?.length) {
    return NextResponse.json(
      { error: "নাম, ফোন নম্বর, ঠিকানা/ইমেইল এবং কার্ট আইটেম আবশ্যক" },
      { status: 400 }
    );
  }

  const orderId = `GG${Date.now().toString().slice(-8)}`;

  return NextResponse.json({ orderId }, { status: 200 });
}
