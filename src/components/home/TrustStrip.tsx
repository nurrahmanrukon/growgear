import { Banknote, RefreshCcw, Truck, Headset } from "lucide-react";
import { getSiteTextSettings } from "@/lib/server/siteTextSettings";

const ICONS = [Truck, Banknote, RefreshCcw, Headset];

export function TrustStrip() {
  const { trustStrip } = getSiteTextSettings();
  return (
    <section className="container-page py-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {trustStrip.map((item, i) => {
          const Icon = ICONS[i];
          return (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3"
            >
              <Icon size={26} className="shrink-0 text-navy-light" strokeWidth={1.5} />
              <div>
                <p className="text-xs font-semibold text-foreground">{item.label}</p>
                <p className="text-[11px] text-neutral-500">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
