import { Metadata } from "next";
import { ebooks } from "@/lib/data/ebooks";
import { categoryMeta } from "@/lib/data/products";
import { ProductListing } from "@/components/product/ProductListing";

export const metadata: Metadata = { title: "ইবুক — GrowGear" };

export default function EbooksPage() {
  return (
    <ProductListing
      title={categoryMeta.ebook.label}
      description={categoryMeta.ebook.description}
      products={ebooks}
    />
  );
}
