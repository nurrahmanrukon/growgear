import { Product } from "@/lib/types";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { VideoSection } from "@/components/product/VideoSection";
import { ReviewsSection } from "@/components/product/ReviewsSection";
import { CtaBanner } from "@/components/product/CtaBanner";
import { PainPointsSection } from "@/components/product/PainPointsSection";
import { AuthorBioSection } from "@/components/product/AuthorBioSection";
import { KeyIdeasSection } from "@/components/product/KeyIdeasSection";
import { TransformationSection } from "@/components/product/TransformationSection";
import { ExpertOpinionsSection } from "@/components/product/ExpertOpinionsSection";
import { EditorialVideoReviewSection } from "@/components/product/EditorialVideoReviewSection";
import { SocialProofScreenshotsSection } from "@/components/product/SocialProofScreenshotsSection";
import { FaqSection } from "@/components/product/FaqSection";
import { QuoteBanner } from "@/components/product/QuoteBanner";
import { FinalOrderSection } from "@/components/product/FinalOrderSection";
import { StickyMobileCta } from "@/components/product/StickyMobileCta";
import { ProductGrid } from "@/components/product/ProductGrid";
import { LandingHero } from "@/components/product/LandingHero";
import { LandingHeroTitleBar } from "@/components/product/LandingHeroTitleBar";
import { InlineCtaBar } from "@/components/product/InlineCtaBar";
import { categoryMeta } from "@/lib/data/products";

export function ProductDetailView({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const meta = categoryMeta[product.category];
  const isReadable = product.category === "book" || product.category === "ebook";

  return (
    <div className="pb-20 lg:pb-0">
      {/* Hero: dark landing banner (title, live-demand badges, cover, sample read) */}
      <div className="container-page pt-4">
        <Breadcrumb
          items={[
            { label: "হোম", href: "/" },
            { label: meta.label, href: meta.path },
            { label: product.title },
          ]}
        />
      </div>
      <LandingHero product={product} />
      <LandingHeroTitleBar product={product} />

      <VideoSection product={product} />
      <InlineCtaBar product={product} />

      <ExpertOpinionsSection product={product} />
      <InlineCtaBar product={product} />

      <SocialProofScreenshotsSection product={product} />
      <InlineCtaBar product={product} />
      <PainPointsSection product={product} />
      <InlineCtaBar product={product} />

      <CtaBanner
        product={product}
        heading={`"${product.title}" আপনার জন্যই তৈরি`}
        sub="এখনই অর্ডার করে আজকের সিদ্ধান্তটা বদলে ফেলুন"
      />

      {isReadable && (
        <>
          <AuthorBioSection product={product} />
          <InlineCtaBar product={product} />
        </>
      )}
      <KeyIdeasSection product={product} />
      <InlineCtaBar product={product} />

      <CtaBanner
        product={product}
        heading={isReadable ? "এই আইডিয়াগুলো নিজের জীবনে প্রয়োগ করতে চান?" : "প্রতিদিনের কাজে এই সহায়তাটা এখনই যোগ করতে চান?"}
        sub={isReadable ? "আজই সংগ্রহ করুন — পড়া শুরু করুন আজ থেকেই" : "আজই সংগ্রহ করুন — ব্যবহার শুরু করুন আজ থেকেই"}
      />

      <TransformationSection product={product} />
      <InlineCtaBar product={product} />
      <FaqSection product={product} />
      <InlineCtaBar product={product} />
      <QuoteBanner product={product} />
      <InlineCtaBar product={product} />
      <FinalOrderSection product={product} />
      <EditorialVideoReviewSection product={product} />
      <InlineCtaBar product={product} />
      <ReviewsSection product={product} />
      <InlineCtaBar product={product} />

      {related.length > 0 && (
        <section className="container-page border-t border-border py-10">
          <h2 className="mb-4 font-display text-lg font-bold text-foreground">আপনার পছন্দ হতে পারে</h2>
          <ProductGrid products={related} />
        </section>
      )}

      <StickyMobileCta product={product} />
    </div>
  );
}
