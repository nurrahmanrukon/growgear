export type ProductCategory = "book" | "ebook" | "gear";

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  category: ProductCategory;
  title: string;
  author?: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  shortDescription: string;
  description: string;
  bullets: string[];
  specs: ProductSpec[];
  badge?: string;
  featured?: boolean;
  bestSeller?: boolean;
  inStock: boolean;
  colorFrom: string;
  colorTo: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  instructor: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  studentCount: string;
  shortDescription: string;
  bullets: string[];
  enrollUrl: string;
  colorFrom: string;
  colorTo: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  author: string;
  date: string;
  category: string;
  readMinutes: number;
  colorFrom: string;
  colorTo: string;
}
