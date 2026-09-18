import { Metadata } from "next";
import { getAllInventoryEntries } from "@/lib/server/inventory";
import { InventoryAdmin } from "@/components/admin/InventoryAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — ইনভেন্টরি" };
export const dynamic = "force-dynamic";

export default function AdminInventoryPage() {
  const items = getAllInventoryEntries();
  return <InventoryAdmin initialItems={items} />;
}
