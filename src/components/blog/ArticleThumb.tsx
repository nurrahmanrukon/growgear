import { Newspaper } from "lucide-react";
import clsx from "clsx";
import { BlogTopicSlug } from "@/lib/types";
import { TOPIC_ICONS } from "./topicIcons";

export function ArticleThumb({
  topicSlug,
  colorFrom,
  colorTo,
  className,
  iconSize = 22,
}: {
  topicSlug: BlogTopicSlug;
  colorFrom: string;
  colorTo: string;
  className?: string;
  iconSize?: number;
}) {
  const Icon = TOPIC_ICONS[topicSlug] ?? Newspaper;
  return (
    <div
      className={clsx("flex shrink-0 items-center justify-center rounded-md", className)}
      style={{ background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})` }}
    >
      <Icon size={iconSize} className="text-white/85" strokeWidth={1.5} />
    </div>
  );
}
