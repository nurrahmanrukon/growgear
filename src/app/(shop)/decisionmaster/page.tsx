import { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { DecisionMasterTool } from "@/components/decisionmaster/DecisionMasterTool";
import { getDecisionMasterSettings } from "@/lib/server/decisionMasterSettings";

export const metadata: Metadata = { title: "ডিসিশনমাস্টার — GrowGear" };
export const dynamic = "force-dynamic";

export default function DecisionMasterPage() {
  const settings = getDecisionMasterSettings();
  return (
    <>
      <div className="container-page pt-4">
        <Breadcrumb items={[{ label: "হোম", href: "/" }, { label: "ডিসিশনমাস্টার" }]} />
      </div>

      <section className="border-b border-border bg-surface-muted">
        <div className="container-page py-10 text-center sm:py-14">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">ডিসিশনমাস্টার</p>
          <h1 className="mx-auto mt-2 max-w-2xl font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            {settings.heading}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft sm:text-base">{settings.subheading}</p>
        </div>
      </section>

      <section className="container-page py-10">
        <DecisionMasterTool settings={settings} />
      </section>
    </>
  );
}
