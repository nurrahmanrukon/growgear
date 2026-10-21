import { Metadata } from "next";
import { getCouponSettings } from "@/lib/server/couponSettings";
import { CouponAdmin } from "@/components/admin/CouponAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — ডিসকাউন্ট কুপন" };
export const dynamic = "force-dynamic";

export default function AdminCouponPage() {
  const settings = getCouponSettings();
  return <CouponAdmin initial={settings} />;
}
