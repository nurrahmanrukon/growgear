import { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { DecisionMasterTool } from "@/components/decisionmaster/DecisionMasterTool";

export const metadata: Metadata = { title: "ডিসিশনমাস্টার — GrowGear" };

export default function DecisionMasterPage() {
  return (
    <>
      <div className="container-page pt-4">
        <Breadcrumb items={[{ label: "হোম", href: "/" }, { label: "ডিসিশনমাস্টার" }]} />
      </div>

      <section className="border-b border-border bg-surface-muted">
        <div className="container-page py-10 text-center sm:py-14">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">ডিসিশনমাস্টার</p>
          <h1 className="mx-auto mt-2 max-w-2xl font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            সহজে সিদ্ধান্ত নিন — আপনার সমস্যা লিখুন, কাঠামোবদ্ধ সমাধান পান
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft sm:text-base">
            জীবনের যেকোনো কঠিন সিদ্ধান্তের জন্য একটা প্র্যাকটিক্যাল ফ্রেমওয়ার্ক — সম্পূর্ণ ফ্রি
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        <DecisionMasterTool />
      </section>
    </>
  );
}
