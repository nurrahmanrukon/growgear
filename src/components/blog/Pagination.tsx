import Link from "next/link";
import { toBengaliNumber } from "@/lib/format";

export function Pagination({
  totalPages,
  currentPage,
  hrefFor,
}: {
  totalPages: number;
  currentPage: number;
  hrefFor: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={hrefFor(page)}
          className={`flex h-8 w-8 items-center justify-center rounded-md text-sm ${
            page === currentPage
              ? "bg-primary font-semibold text-white"
              : "text-ink-soft hover:bg-surface-muted"
          }`}
        >
          {toBengaliNumber(page)}
        </Link>
      ))}
    </nav>
  );
}
