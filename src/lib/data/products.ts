import { Product, ProductCategory } from "@/lib/types";
import { books } from "./books";
import { ebooks } from "./ebooks";
import { gear } from "./gear";

export const allProducts: Product[] = [...books, ...ebooks, ...gear];

export const catalogByCategory: Record<ProductCategory, Product[]> = {
  book: books,
  ebook: ebooks,
  gear: gear,
};

export const categoryMeta: Record<
  ProductCategory,
  { label: string; path: string; description: string }
> = {
  book: {
    label: "বই",
    path: "/books",
    description: "হার্ডকভার বই — জীবন ও ক্যারিয়ার বদলে দেওয়ার মতো কনটেন্ট",
  },
  ebook: {
    label: "ইবুক",
    path: "/ebooks",
    description: "ইনস্ট্যান্ট ডাউনলোড ডিজিটাল গাইড ও ওয়ার্কবুক",
  },
  gear: {
    label: "গিয়ার",
    path: "/gear",
    description: "প্রোডাক্টিভিটি বাড়ানোর জন্য দরকারি ডেস্ক এক্সেসরি",
  },
};

export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return catalogByCategory[category];
}

export function getFeaturedProducts(limit = 8): Product[] {
  return allProducts.filter((p) => p.featured).slice(0, limit);
}

export function getBestSellers(limit = 8): Product[] {
  return allProducts.filter((p) => p.bestSeller).slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 6): Product[] {
  return catalogByCategory[product.category]
    .filter((p) => p.id !== product.id)
    .slice(0, limit);
}
