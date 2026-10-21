export interface FooterGroupMeta {
  key: string;
  label: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export const FOOTER_GROUP_CATALOG: FooterGroupMeta[] = [
  { key: "about", label: "GrowGear সম্পর্কে" },
  { key: "shop", label: "কিনুন" },
  { key: "learn", label: "শিখুন" },
  { key: "support", label: "গ্রাহক সেবা" },
];

export const FOOTER_LINK_CATALOG: Record<string, FooterLink[]> = {
  about: [
    { label: "আমাদের সম্পর্কে", href: "/" },
    { label: "ব্লগ", href: "/blog" },
    { label: "যোগাযোগ", href: "/" },
  ],
  shop: [
    { label: "বই", href: "/books" },
    { label: "ইবুক", href: "/ebooks" },
    { label: "প্রোডাক্টিভিটি গিয়ার", href: "/gear" },
  ],
  learn: [
    { label: "সব কোর্স", href: "/course" },
    { label: "enrich.com.bd", href: "https://enrich.com.bd" },
  ],
  support: [
    { label: "কার্ট", href: "/cart" },
    { label: "চেকআউট", href: "/checkout" },
    { label: "রিটার্ন ও রিফান্ড পলিসি", href: "/refund-policy" },
    { label: "ব্যবহারের শর্তাবলী", href: "/terms" },
    { label: "প্রাইভেসি পলিসি", href: "/privacy" },
  ],
};
