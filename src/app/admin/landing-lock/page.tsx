import { Metadata } from "next";
import { getAllLandingLockEntries } from "@/lib/server/landingLock";
import { LandingLockAdmin } from "@/components/admin/LandingLockAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — ল্যান্ডিং পেজ লক" };
export const dynamic = "force-dynamic";

export default function AdminLandingLockPage() {
  const items = getAllLandingLockEntries();
  return <LandingLockAdmin initialItems={items} />;
}
