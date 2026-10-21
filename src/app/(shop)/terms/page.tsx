import { Metadata } from "next";
import { getLegalPage } from "@/lib/server/legalPages";
import { LegalPageView } from "@/components/legal/LegalPageView";

export const metadata: Metadata = { title: "ব্যবহারের শর্তাবলী — GrowGear" };

export default function TermsPage() {
  const content = getLegalPage("terms");
  return <LegalPageView content={content} />;
}
