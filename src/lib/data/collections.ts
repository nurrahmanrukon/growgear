import { Briefcase, Zap, Wallet, Sparkles, Megaphone, TrendingUp, Users, Compass, MessageCircle, Brain } from "lucide-react";
import { BlogTopicSlug } from "@/lib/types";
import { MUTED_GRADIENTS } from "./palette";

export interface CollectionMeta {
  slug: BlogTopicSlug;
  label: string;
  icon: typeof Briefcase;
  colorFrom: string;
  colorTo: string;
}

/** Shop-facing collection names for the home page entry tiles — written as product
 *  collections ("কিনুন এই দরকারে"), not reused from the blog's topic-article labels,
 *  even though they map to the same BlogTopicSlug for filtering /search?topic=. */
const RAW: { slug: BlogTopicSlug; label: string; icon: typeof Briefcase }[] = [
  { slug: "business", label: "ব্যবসা গড়ার গাইড", icon: Briefcase },
  { slug: "productivity", label: "সময় ও ফোকাস", icon: Zap },
  { slug: "finance", label: "অর্থনৈতিক স্বাধীনতা", icon: Wallet },
  { slug: "branding", label: "ব্র্যান্ড তৈরি করুন", icon: Sparkles },
  { slug: "marketing", label: "মার্কেটিং গ্রোথ", icon: Megaphone },
  { slug: "sales", label: "বিক্রয় দক্ষতা", icon: TrendingUp },
  { slug: "leadership", label: "নেতৃত্বের পথে", icon: Users },
  { slug: "career", label: "ক্যারিয়ার বুস্ট", icon: Compass },
  { slug: "communication", label: "কথা বলার শিল্প", icon: MessageCircle },
  { slug: "mindset", label: "মানসিকতা আপগ্রেড", icon: Brain },
];

export const COLLECTIONS: CollectionMeta[] = RAW.map((c, i) => {
  const [colorFrom, colorTo] = MUTED_GRADIENTS[i % MUTED_GRADIENTS.length];
  return { ...c, colorFrom, colorTo };
});

export function getCollectionMeta(topicSlug: BlogTopicSlug): CollectionMeta | undefined {
  return COLLECTIONS.find((c) => c.slug === topicSlug);
}
