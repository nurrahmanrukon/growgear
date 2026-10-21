import { Metadata } from "next";
import { getLegalPage } from "@/lib/server/legalPages";
import { LegalPageView } from "@/components/legal/LegalPageView";

export const metadata: Metadata = { title: "প্রাইভেসি পলিসি — GrowGear" };

export default function PrivacyPolicyPage() {
  const content = getLegalPage("privacy");
  return <LegalPageView content={content} />;
}
