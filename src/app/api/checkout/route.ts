import { NextRequest, NextResponse } from "next/server";
import { allProducts } from "@/lib/data/products";
import { createOrder, OrderItem } from "@/lib/server/orders";
import { getStockOverride } from "@/lib/server/inventory";
import { verifyProfileSessionToken, PROFILE_COOKIE } from "@/lib/server/profileAuth";
import { addEbookPurchase } from "@/lib/server/profiles";
import { getDeliveryFeeMap } from "@/lib/server/orderFormSettings";
import { validateCoupon } from "@/lib/server/couponSettings";
import { validatePromoCode } from "@/lib/data/promo";

interface CheckoutPayload {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  area?: string;
  paymentMethod: string;
  promoCode?: string | null;
  items: { productId: string; title: string; price: number; quantity: number }[];
}

/** Never trust a client-sent discount amount — re-derive it here from the submitted
 *  code, checking the admin-controlled single coupon first, then the existing fixed
 *  marketing promo codes (NUR10 etc.). Anything else resolves to no discount. */
function resolveDiscount(subtotal: number, promoCodeRaw: string | null | undefined): { discount: number; promoCode?: string } {
  const code = promoCodeRaw?.trim();
  if (!code) return { discount: 0 };

  const coupon = validateCoupon(code);
  if (coupon.valid) {
    return { discount: Math.round((subtotal * coupon.discountPercent) / 100), promoCode: code };
  }

  const promo = validatePromoCode(code);
  if (promo) {
    return { discount: Math.round((subtotal * promo.discountPercent) / 100), promoCode: promo.code };
  }

  return { discount: 0 };
}

export async function POST(req: NextRequest) {
  let body: Partial<CheckoutPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  const { name, phone, email, address, area, paymentMethod, items } = body;
  if (!name?.trim() || !phone?.trim() || !items?.length) {
    return NextResponse.json({ error: "নাম, ফোন নম্বর এবং কার্ট আইটেম আবশ্যক" }, { status: 400 });
  }

  // Re-price every item server-side against the live product catalog — never trust client-sent prices.
  const resolvedItems: OrderItem[] = [];
  const resolvedProducts: (typeof allProducts)[number][] = [];
  for (const item of items) {
    const product = allProducts.find((p) => p.id === item.productId);
    if (!product) {
      return NextResponse.json({ error: "একটি প্রোডাক্ট পাওয়া যায়নি" }, { status: 400 });
    }
    const quantity = Math.max(1, Math.floor(item.quantity) || 1);
    resolvedProducts.push(product);
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

  // Ebooks have no physical delivery — instead they're attached to the buyer's profile
  // for anytime access, so an ebook purchase requires being logged into a profile.
  const hasEbookItem = resolvedProducts.some((p) => p.category === "ebook");
  const hasPhysicalItem = resolvedProducts.some((p) => p.category !== "ebook");

  let profileEmail: string | null = null;
  if (hasEbookItem) {
    profileEmail = verifyProfileSessionToken(req.cookies.get(PROFILE_COOKIE)?.value);
    if (!profileEmail) {
      return NextResponse.json({ error: "ইবুক কিনতে আগে প্রোফাইলে লগইন করতে হবে" }, { status: 401 });
    }
  }

  if (hasPhysicalItem && !address?.trim()) {
    return NextResponse.json({ error: "ঠিকানা আবশ্যক" }, { status: 400 });
  }

  const subtotal = resolvedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFeeMap = getDeliveryFeeMap();
  const fallbackFee = Math.max(0, ...Object.values(deliveryFeeMap));
  const deliveryFee = address?.trim() ? deliveryFeeMap[area ?? ""] ?? fallbackFee : 0;
  const { discount, promoCode } = resolveDiscount(subtotal, body.promoCode);
  const total = Math.max(0, subtotal + deliveryFee - discount);

  const order = createOrder({
    customer: {
      name: name.trim(),
      phone: phone.trim(),
      email: profileEmail || email?.trim() || undefined,
      address: address?.trim() || undefined,
      area: area?.trim() || undefined,
    },
    paymentMethod: paymentMethod ?? "cod",
    items: resolvedItems,
    subtotal,
    deliveryFee,
    discount,
    promoCode,
    total,
  });

  if (profileEmail) {
    for (const product of resolvedProducts) {
      if (product.category === "ebook") {
        addEbookPurchase(profileEmail, { slug: product.slug, title: product.title, orderId: order.orderId });
      }
    }
  }

  return NextResponse.json({ orderId: order.orderId }, { status: 200 });
}
