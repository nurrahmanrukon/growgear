import { Fragment } from "react";
import { Product } from "@/lib/types";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { VideoSection } from "@/components/product/VideoSection";
import { ReviewsSection } from "@/components/product/ReviewsSection";
import { CtaBanner } from "@/components/product/CtaBanner";
import { PainPointsSection } from "@/components/product/PainPointsSection";
import { AuthorBioSection } from "@/components/product/AuthorBioSection";
import { ReaderOpinionsSection } from "@/components/product/ReaderOpinionsSection";
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
import { getDefaultSectionOrder } from "@/lib/server/sectionOrder";

export function ProductDetailView({
  product,
  related,
  sectionOrder,
  hiddenSections,
}: {
  product: Product;
  related: Product[];
  sectionOrder?: string[];
  hiddenSections?: string[];
}) {
  const meta = categoryMeta[product.category];
  const isReadable = product.category === "book" || product.category === "ebook";

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    video: () => (
      <>
        <VideoSection product={product} />
        <InlineCtaBar product={product} />
      </>
    ),
    socialProof: () => (
      <>
        <SocialProofScreenshotsSection product={product} />
        <InlineCtaBar product={product} />
      </>
    ),
    expertOpinions: () => (
      <>
        <ExpertOpinionsSection product={product} />
        <InlineCtaBar product={product} />
      </>
    ),
    painPoints: () => (
      <>
        <PainPointsSection product={product} />
        <InlineCtaBar product={product} />
      </>
    ),
    transformation: () => (
      <>
        <TransformationSection product={product} />
        <InlineCtaBar product={product} />
      </>
    ),
    ctaBanner1: () => (
      <CtaBanner
        product={product}
        heading={`"${product.title}" আপনার জন্যই তৈরি`}
        sub="এখনই অর্ডার করে আজকের সিদ্ধান্তটা বদলে ফেলুন"
      />
    ),
    authorBio: () =>
      isReadable ? (
        <>
          <AuthorBioSection product={product} />
          <ReaderOpinionsSection product={product} />
          <InlineCtaBar product={product} />
        </>
      ) : null,
    keyIdeas: () => (
      <>
        <KeyIdeasSection product={product} />
        <InlineCtaBar product={product} />
      </>
    ),
    ctaBanner2: () => (
      <CtaBanner
        product={product}
        heading={isReadable ? "এই আইডিয়াগুলো নিজের জীবনে প্রয়োগ করতে চান?" : "প্রতিদিনের কাজে এই সহায়তাটা এখনই যোগ করতে চান?"}
        sub={isReadable ? "আজই সংগ্রহ করুন — পড়া শুরু করুন আজ থেকেই" : "আজই সংগ্রহ করুন — ব্যবহার শুরু করুন আজ থেকেই"}
      />
    ),
    faq: () => (
      <>
        <FaqSection product={product} />
        <InlineCtaBar product={product} />
      </>
    ),
    quoteBanner: () => (
      <>
        <QuoteBanner product={product} />
        <InlineCtaBar product={product} />
      </>
    ),
    finalOrder: () => (
      <>
        <FinalOrderSection product={product} />
        <EditorialVideoReviewSection product={product} />
        <InlineCtaBar product={product} />
      </>
    ),
    reviews: () => (
      <>
        <ReviewsSection product={product} />
        <InlineCtaBar product={product} />
      </>
    ),
  };

  const order = sectionOrder ?? getDefaultSectionOrder();
  const hidden = new Set(hiddenSections ?? []);

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

      {order
        .filter((key) => !hidden.has(key))
        .map((key) => (
          <Fragment key={key}>{sectionRenderers[key]?.()}</Fragment>
        ))}

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
