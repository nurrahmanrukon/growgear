import { Lock, Newspaper } from "lucide-react";
import clsx from "clsx";
import { BlogTopicSlug } from "@/lib/types";
import { TOPIC_ICONS } from "./topicIcons";

export function ArticleThumb({
  topicSlug,
  colorFrom,
  colorTo,
  className,
  iconSize = 22,
  premium = false,
}: {
  topicSlug: BlogTopicSlug;
  colorFrom: string;
  colorTo: string;
  className?: string;
  iconSize?: number;
  premium?: boolean;
}) {
  const Icon = TOPIC_ICONS[topicSlug] ?? Newspaper;
  return (
    <div
      className={clsx("relative flex shrink-0 items-center justify-center rounded-md", className)}
      style={{ background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})` }}
    >
      <Icon size={iconSize} className="text-white/85" strokeWidth={1.5} />
      {premium && (
        <span className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded-full bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          <Lock size={10} /> প্রিমিয়াম
        </span>
      )}
    </div>
  );
}
