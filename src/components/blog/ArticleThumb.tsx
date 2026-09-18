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
  imageUrl,
}: {
  topicSlug: BlogTopicSlug;
  colorFrom: string;
  colorTo: string;
  className?: string;
  iconSize?: number;
  premium?: boolean;
  imageUrl?: string;
}) {
  const Icon = TOPIC_ICONS[topicSlug] ?? Newspaper;
  return (
    <div
      className={clsx("relative flex shrink-0 items-center justify-center overflow-hidden rounded-md", className)}
      style={imageUrl ? undefined : { background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})` }}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- uploaded via admin, served dynamically
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <Icon size={iconSize} className="text-white/85" strokeWidth={1.5} />
      )}
      {premium && (
        <span className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded-full bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          <Lock size={10} /> প্রিমিয়াম
        </span>
      )}
    </div>
  );
}
