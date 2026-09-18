import { NextRequest, NextResponse } from "next/server";
import { getAllOrders, filterOrders } from "@/lib/server/orders";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = getAllOrders();
  const filtered = filterOrders(all, {
    status: searchParams.get("status"),
    from: searchParams.get("from"),
    to: searchParams.get("to"),
    q: searchParams.get("q"),
  });

  const header = [
    "অর্ডার আইডি",
    "তারিখ ও সময়",
    "নাম",
    "ফোন",
    "ঠিকানা",
    "এলাকা",
    "প্রোডাক্ট",
    "পেমেন্ট পদ্ধতি",
    "মোট টাকা",
    "স্ট্যাটাস",
  ];

  const statusLabel: Record<string, string> = {
    pending: "অপেক্ষমাণ",
    confirmed: "কনফার্ম",
    rejected: "বাতিল",
    delivered: "ডেলিভারি সম্পন্ন",
  };

  const rows = filtered.map((o) => [
    o.orderId,
    new Date(o.createdAt).toLocaleString("bn-BD", { dateStyle: "medium", timeStyle: "short" }),
    o.customer.name,
    o.customer.phone,
    o.customer.address ?? "",
    o.customer.area ?? "",
    o.items.map((i) => `${i.title} × ${i.quantity}`).join("; "),
    o.paymentMethod,
    String(o.total),
    statusLabel[o.status] ?? o.status,
  ]);

  const csv = [header, ...rows].map((row) => row.map((cell) => csvEscape(String(cell))).join(",")).join("\n");
  const withBom = "﻿" + csv;

  return new NextResponse(withBom, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
