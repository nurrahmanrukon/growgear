import { Metadata } from "next";
import { getAllOrders } from "@/lib/server/orders";
import { OrdersAdmin } from "@/components/admin/OrdersAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — অর্ডার" };
export const dynamic = "force-dynamic";

export default function AdminOrdersPage() {
  const orders = getAllOrders();
  return <OrdersAdmin initialOrders={orders} />;
}
