import { MessageCircle } from "lucide-react";
import { getGrowGuidePageSettings } from "@/lib/server/growguidePageSettings";

export function GrowGuideCommunitySection() {
  const text = getGrowGuidePageSettings();
  return (
    <section className="container-page py-10">
      <div className="mx-auto max-w-2xl rounded-lg border border-border bg-surface p-6 text-center">
        <MessageCircle className="mx-auto text-primary" size={26} />
        <h2 className="mt-3 font-display text-lg font-bold text-foreground">{text.communityHeading}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text.communityBody}</p>
      </div>
    </section>
  );
}
