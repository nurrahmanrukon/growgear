import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { ProductRail } from "@/components/home/ProductRail";
import { CourseTeaser } from "@/components/home/CourseTeaser";
import { BlogTeaser } from "@/components/home/BlogTeaser";
import { courses } from "@/lib/data/courses";
import { getBestSellersResolved, getProductsBySegmentResolved, blogPostsResolved } from "@/lib/server/contentText";
import { ALL_SEGMENTS } from "@/lib/data/segments";

export const dynamic = "force-dynamic";

export default function Home() {
  const segmentRails = ALL_SEGMENTS.map((segment) => ({
    segment,
    products: getProductsBySegmentResolved(segment.slug, 10),
  })).filter((rail) => rail.products.length > 0);

  return (
    <>
      <Hero />
      <TrustStrip />
      <ProductRail title="বেস্ট সেলার" viewAllHref="/books" products={getBestSellersResolved(10)} />
      {segmentRails.map(({ segment, products }) => (
        <ProductRail
          key={segment.slug}
          title={segment.label}
          viewAllHref={`/search?segment=${segment.slug}`}
          products={products}
        />
      ))}
      <CourseTeaser courses={courses.slice(0, 6)} />
      <BlogTeaser posts={blogPostsResolved().slice(0, 3)} />
    </>
  );
}
