import { Metadata } from "next";
import { getLegalPage } from "@/lib/server/legalPages";
import { LegalPageView } from "@/components/legal/LegalPageView";

export const metadata: Metadata = { title: "রিটার্ন ও রিফান্ড পলিসি — GrowGear" };

export default function RefundPolicyPage() {
  const content = getLegalPage("refund");
  return <LegalPageView content={content} />;
}
