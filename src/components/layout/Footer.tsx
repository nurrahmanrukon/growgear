"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { FOOTER_GROUP_CATALOG, FOOTER_LINK_CATALOG } from "@/lib/data/footerLinks";

export function Footer({
  hiddenGroups = [],
  groupOrder,
  linkOrder,
  groupTitles,
  copyright,
}: {
  hiddenGroups?: string[];
  groupOrder?: string[];
  linkOrder?: Record<string, number[]>;
  groupTitles: Record<string, string>;
  copyright: string;
}) {
  const orderedKeys =
    groupOrder && groupOrder.length === FOOTER_GROUP_CATALOG.length
      ? groupOrder
      : FOOTER_GROUP_CATALOG.map((g) => g.key);
  const columns = orderedKeys.map((key) => {
    const baseLinks = FOOTER_LINK_CATALOG[key] ?? [];
    const order = linkOrder?.[key];
    const links =
      order && order.length === baseLinks.length ? order.map((i) => baseLinks[i]).filter(Boolean) : baseLinks;
    return { key, links };
  });
  const visibleColumns = columns.filter((col) => !hiddenGroups.includes(col.key));
  return (
    <footer className="mt-16 bg-foreground text-background/90">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex w-full items-center justify-center gap-2 border-b border-background/10 py-3 text-xs text-background/70 hover:text-background"
      >
        <ArrowUp size={14} /> উপরে যান
      </button>

      <div className="container-page grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
        {visibleColumns.map((col) => (
          <div key={col.key}>
            <h3 className="mb-3 text-sm font-semibold text-background">{groupTitles[col.key]}</h3>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-background/60 hover:text-background hover:underline"
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-background/10">
        <div className="container-page flex flex-col items-center gap-1 py-5 text-center">
          <span className="font-display text-lg font-bold text-background">
            Grow<span className="text-primary">Gear</span>
          </span>
          <p className="text-xs text-background/50">{copyright}</p>
          <Link href="/admin" className="mt-1 text-[11px] text-background/30 hover:text-background/60 hover:underline">
            অ্যাডমিন
          </Link>
        </div>
      </div>
    </footer>
  );
}
