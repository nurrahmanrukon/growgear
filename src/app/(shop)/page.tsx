import { Fragment } from "react";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { ProductRail } from "@/components/home/ProductRail";
import { CourseTeaser } from "@/components/home/CourseTeaser";
import { BlogTeaser } from "@/components/home/BlogTeaser";
import { courses } from "@/lib/data/courses";
import { getBestSellersResolved, getProductsBySegmentResolved, blogPostsResolved } from "@/lib/server/contentText";
import { ALL_SEGMENTS } from "@/lib/data/segments";
import { getHomeSectionConfig } from "@/lib/server/homeSectionOrder";
import { getBlogTopicSettings } from "@/lib/server/blogTopicSettings";

export const dynamic = "force-dynamic";

export default function Home() {
  const { hiddenSegments, segmentLabelOverrides } = getBlogTopicSettings();
  const segmentRails = ALL_SEGMENTS.filter((segment) => !hiddenSegments.includes(segment.slug))
    .map((segment) => ({
      segment: { ...segment, label: segmentLabelOverrides[segment.slug] ?? segment.label },
      products: getProductsBySegmentResolved(segment.slug, 10),
    }))
    .filter((rail) => rail.products.length > 0);

  const sections: Record<string, React.ReactNode> = {
    hero: <Hero key="hero" />,
    trustStrip: <TrustStrip key="trustStrip" />,
    bestSellers: (
      <ProductRail key="bestSellers" title="বেস্ট সেলার" viewAllHref="/books" products={getBestSellersResolved(10)} />
    ),
    segmentRails: (
      <Fragment key="segmentRails">
        {segmentRails.map(({ segment, products }) => (
          <ProductRail
            key={segment.slug}
            title={segment.label}
            viewAllHref={`/search?segment=${segment.slug}`}
            products={products}
          />
        ))}
      </Fragment>
    ),
    courseTeaser: <CourseTeaser key="courseTeaser" courses={courses.slice(0, 6)} />,
    blogTeaser: <BlogTeaser key="blogTeaser" posts={blogPostsResolved().slice(0, 3)} />,
  };

  const { order, hidden } = getHomeSectionConfig();

  return <>{order.filter((key) => !hidden.includes(key)).map((key) => sections[key])}</>;
}
