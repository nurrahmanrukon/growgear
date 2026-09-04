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
}: {
  title: string;
  category: ProductCategory;
  colorFrom: string;
  colorTo: string;
  className?: string;
  iconSize?: number;
}) {
  const Icon = categoryIcon[category];
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
      <span className="line-clamp-2 text-xs font-medium text-white/90">
        {title}
      </span>
    </div>
  );
}
