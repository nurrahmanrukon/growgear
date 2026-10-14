import { Metadata } from "next";
import { getCategoryIntroSettings } from "@/lib/server/categoryIntro";
import { CategoryIntroAdmin } from "@/components/admin/CategoryIntroAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — ক্যাটাগরি পেজের লেখা" };
export const dynamic = "force-dynamic";

export default function AdminCategoryIntroPage() {
  const settings = getCategoryIntroSettings();
  return <CategoryIntroAdmin initial={settings} />;
}
