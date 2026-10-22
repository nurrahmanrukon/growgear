import { Metadata } from "next";
import { getDecisionMasterSettings } from "@/lib/server/decisionMasterSettings";
import { allProductsResolved } from "@/lib/server/contentText";
import { DecisionMasterAdmin } from "@/components/admin/DecisionMasterAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — ডিসিশনমাস্টার" };
export const dynamic = "force-dynamic";

export default function AdminDecisionMasterPage() {
  const settings = getDecisionMasterSettings();
  const books = allProductsResolved()
    .filter((p) => p.category === "book")
    .map((p) => ({ slug: p.slug, title: p.title }));
  return <DecisionMasterAdmin initial={settings} books={books} />;
}
