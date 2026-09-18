import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { ProductRail } from "@/components/home/ProductRail";
import { CourseTeaser } from "@/components/home/CourseTeaser";
import { BlogTeaser } from "@/components/home/BlogTeaser";
import { courses } from "@/lib/data/courses";
import { booksResolved, ebooksResolved, gearResolved, getBestSellersResolved, blogPostsResolved } from "@/lib/server/contentText";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ProductRail title="বেস্ট সেলার" viewAllHref="/books" products={getBestSellersResolved(10)} />
      <ProductRail title="জনপ্রিয় হার্ডকভার বই" viewAllHref="/books" products={booksResolved().slice(0, 10)} />
      <ProductRail title="ইনস্ট্যান্ট ডাউনলোড ইবুক" viewAllHref="/ebooks" products={ebooksResolved().slice(0, 10)} />
      <ProductRail title="প্রোডাক্টিভিটি গিয়ার" viewAllHref="/gear" products={gearResolved().slice(0, 10)} />
      <CourseTeaser courses={courses.slice(0, 6)} />
      <BlogTeaser posts={blogPostsResolved().slice(0, 3)} />
    </>
  );
}
