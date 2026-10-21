import Image from "next/image";
import { Book, FileText, Package } from "lucide-react";
import clsx from "clsx";
import { ProductCategory } from "@/lib/types";

const categoryIcon: Record<ProductCategory, typeof Book> = {
  book: Book,
  ebook: FileText,
  gear: Package,
};

export function ProductImage({
  title,
  category,
  colorFrom,
  colorTo,
  className,
  iconSize = 40,
  hideLabel = false,
  imageUrl,
  priority = false,
}: {
  title: string;
  category: ProductCategory;
  colorFrom: string;
  colorTo: string;
  className?: string;
  iconSize?: number;
  hideLabel?: boolean;
  imageUrl?: string;
  /** Set for the single above-the-fold hero image on a page (e.g. the main product photo)
   *  so it skips lazy-loading — everywhere else (cards, thumbnails) should leave this off. */
  priority?: boolean;
}) {
  const Icon = categoryIcon[category];

  if (imageUrl) {
    return (
      <div className={clsx("relative overflow-hidden rounded-md", className)}>
        <Image
          src={imageUrl}
          alt={title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 45vw, 240px"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-2 rounded-md p-4 text-center",
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})`,
      }}
    >
      <Icon size={iconSize} className="text-white/90" strokeWidth={1.5} />
      {!hideLabel && (
        <span className="line-clamp-2 text-xs font-medium text-white/90">{title}</span>
      )}
    </div>
  );
}
