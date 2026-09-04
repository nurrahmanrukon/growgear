import { Star, StarHalf } from "lucide-react";
import { toBengaliNumber } from "@/lib/format";

export function StarRating({
  rating,
  reviewCount,
  size = 14,
}: {
  rating: number;
  reviewCount?: number;
  size?: number;
}) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-star">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`f-${i}`} size={size} fill="currentColor" strokeWidth={0} />
        ))}
        {half && <StarHalf size={size} fill="currentColor" strokeWidth={0} />}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e-${i}`} size={size} className="text-border" fill="currentColor" strokeWidth={0} />
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="text-xs text-link">
          {toBengaliNumber(reviewCount)}
        </span>
      )}
    </div>
  );
}
