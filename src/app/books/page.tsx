import { Metadata } from "next";
import { books } from "@/lib/data/books";
import { categoryMeta } from "@/lib/data/products";
import { ProductListing } from "@/components/product/ProductListing";

export const metadata: Metadata = { title: "বই — GrowGear" };

export default function BooksPage() {
  return (
    <ProductListing
      title={categoryMeta.book.label}
      description={categoryMeta.book.description}
      products={books}
    />
  );
}
