import { NextRequest, NextResponse } from "next/server";
import { allProducts } from "@/lib/data/products";
import { createOrder, OrderItem } from "@/lib/server/orders";
import { getStockOverride } from "@/lib/server/inventory";

interface CheckoutPayload {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  area?: string;
  paymentMethod: string;
  promoCode?: string | null;
  discount?: number;
  items: { productId: string; title: string; price: number; quantity: number }[];
}

const DELIVERY_FEES: Record<string, number> = { "ঢাকার ভিতরে": 70, "ঢাকার বাইরে": 130 };

export async function POST(req: NextRequest) {
  let body: Partial<CheckoutPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  const { name, phone, email, address, area, paymentMethod, items } = body;
  const hasDelivery = address?.trim() || email?.trim();
  if (!name?.trim() || !phone?.trim() || !hasDelivery || !items?.length) {
    return NextResponse.json(
      { error: "নাম, ফোন নম্বর, ঠিকানা/ইমেইল এবং কার্ট আইটেম আবশ্যক" },
      { status: 400 }
    );
  }

  // Re-price every item server-side against the live product catalog — never trust client-sent prices.
  const resolvedItems: OrderItem[] = [];
  for (const item of items) {
    const product = allProducts.find((p) => p.id === item.productId);
    if (!product) {
      return NextResponse.json({ error: "একটি প্রোডাক্ট পাওয়া যায়নি" }, { status: 400 });
    }
    const quantity = Math.max(1, Math.floor(item.quantity) || 1);
    resolvedItems.push({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity,
    });
  }

  // Block orders for products an admin has explicitly zeroed out in inventory.
  for (const item of resolvedItems) {
    const override = item.slug ? getStockOverride(item.slug) : null;
    if (override !== null && override <= 0) {
      return NextResponse.json({ error: `"${item.title}" এই মুহূর্তে স্টকে নেই` }, { status: 400 });
    }
  }

  const subtotal = resolvedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = address?.trim() ? DELIVERY_FEES[area ?? ""] ?? 130 : 0;
  const discount = Math.max(0, Math.min(Number(body.discount) || 0, subtotal));
  const total = Math.max(0, subtotal + deliveryFee - discount);

  const order = createOrder({
    customer: {
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || undefined,
      address: address?.trim() || undefined,
      area: area?.trim() || undefined,
    },
    paymentMethod: paymentMethod ?? "cod",
    items: resolvedItems,
    subtotal,
    deliveryFee,
    discount,
    promoCode: body.promoCode?.trim() || undefined,
    total,
  });

  return NextResponse.json({ orderId: order.orderId }, { status: 200 });
}
