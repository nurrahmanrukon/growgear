import { Metadata } from "next";
import { getAllNavMenuEntries } from "@/lib/server/navMenu";
import { NavMenuAdmin } from "@/components/admin/NavMenuAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — মেনু নিয়ন্ত্রণ" };
export const dynamic = "force-dynamic";

export default function AdminNavMenuPage() {
  const items = getAllNavMenuEntries();
  return <NavMenuAdmin initialItems={items} />;
}
