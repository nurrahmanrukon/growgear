import { Briefcase, Zap, Wallet, Sparkles, Megaphone, TrendingUp, Users, Compass } from "lucide-react";
import { BlogTopicSlug } from "@/lib/types";

export const TOPIC_ICONS: Record<BlogTopicSlug, typeof Briefcase> = {
  business: Briefcase,
  productivity: Zap,
  finance: Wallet,
  branding: Sparkles,
  marketing: Megaphone,
  sales: TrendingUp,
  leadership: Users,
  career: Compass,
};
