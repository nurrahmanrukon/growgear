import { NextRequest, NextResponse } from "next/server";
import { getAllOrders, filterOrders } from "@/lib/server/orders";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = getAllOrders();
  const filtered = filterOrders(all, {
    status: searchParams.get("status"),
    from: searchParams.get("from"),
    to: searchParams.get("to"),
    q: searchParams.get("q"),
  });

  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysOrders = all.filter((o) => o.createdAt.slice(0, 10) === todayStr);
  const stats = {
    totalOrders: all.length,
    pending: all.filter((o) => o.status === "pending").length,
    confirmed: all.filter((o) => o.status === "confirmed").length,
    todayCount: todaysOrders.length,
    todayRevenue: todaysOrders
      .filter((o) => o.status !== "rejected")
      .reduce((sum, o) => sum + o.total, 0),
  };

  return NextResponse.json({ orders: filtered, stats });
}
