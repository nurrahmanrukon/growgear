export interface SubNavItem {
  href: string;
  label: string;
}

/** Static sub-nav items shown under the header's layer-2 bar for each top-level menu —
 *  everything except the gear dropdown's dynamically-spliced subcategory list (see
 *  gearSubcategorySettings.ts), which is managed separately. */
export const HEADER_SUBNAV_CATALOG: Record<string, SubNavItem[]> = {
  home: [
    { href: "/", label: "সব প্রোডাক্ট" },
    { href: `/search?badge=${encodeURIComponent("বেস্ট সেলার")}`, label: "বেস্ট সেলার" },
    { href: `/search?badge=${encodeURIComponent("নতুন")}`, label: "নতুন" },
    { href: `/search?badge=${encodeURIComponent("লিমিটেড অফার")}`, label: "অফার" },
  ],
  book: [
    { href: "/books", label: "সব বই" },
    { href: `/books?badge=${encodeURIComponent("বেস্ট সেলার")}`, label: "বেস্ট সেলার" },
    { href: `/books?badge=${encodeURIComponent("নতুন")}`, label: "নতুন" },
    { href: `/books?badge=${encodeURIComponent("লিমিটেড অফার")}`, label: "অফার" },
  ],
  ebook: [
    { href: "/ebooks", label: "সব ইবুক" },
    { href: `/ebooks?badge=${encodeURIComponent("বেস্ট সেলার")}`, label: "বেস্ট সেলার" },
    { href: `/ebooks?badge=${encodeURIComponent("নতুন")}`, label: "নতুন" },
    { href: `/ebooks?badge=${encodeURIComponent("লিমিটেড অফার")}`, label: "অফার" },
  ],
  gear: [
    { href: "/gear", label: "সব গিয়ার" },
    { href: `/gear?badge=${encodeURIComponent("বেস্ট সেলার")}`, label: "বেস্ট সেলার" },
    { href: `/gear?badge=${encodeURIComponent("নতুন")}`, label: "নতুন" },
    { href: `/gear?badge=${encodeURIComponent("লিমিটেড অফার")}`, label: "অফার" },
  ],
  course: [{ href: "/course", label: "সব কোর্স" }],
  growguide: [
    { href: "/growguide/student", label: "শিক্ষার্থী" },
    { href: "/growguide/professional", label: "প্রফেশনাল" },
    { href: "/growguide/entrepreneur", label: "উদ্যোক্তা" },
  ],
};

export const HEADER_SUBNAV_GROUP_LABELS: Record<string, string> = {
  home: "হোম",
  book: "বই",
  ebook: "ইবুক",
  gear: "গিয়ার",
  course: "কোর্স",
  growguide: "GrowGuide",
};
