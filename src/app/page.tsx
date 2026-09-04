import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { ProductRail } from "@/components/home/ProductRail";
import { CourseTeaser } from "@/components/home/CourseTeaser";
import { BlogTeaser } from "@/components/home/BlogTeaser";
import { books } from "@/lib/data/books";
import { ebooks } from "@/lib/data/ebooks";
import { gear } from "@/lib/data/gear";
import { getBestSellers } from "@/lib/data/products";
import { courses } from "@/lib/data/courses";
import { blogPosts } from "@/lib/data/blog";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ProductRail title="বেস্ট সেলার" viewAllHref="/books" products={getBestSellers(10)} />
      <ProductRail title="জনপ্রিয় হার্ডকভার বই" viewAllHref="/books" products={books.slice(0, 10)} />
      <ProductRail title="ইনস্ট্যান্ট ডাউনলোড ইবুক" viewAllHref="/ebooks" products={ebooks.slice(0, 10)} />
      <ProductRail title="প্রোডাক্টিভিটি গিয়ার" viewAllHref="/gear" products={gear.slice(0, 10)} />
      <CourseTeaser courses={courses.slice(0, 6)} />
      <BlogTeaser posts={blogPosts.slice(0, 3)} />
    </>
  );
}
