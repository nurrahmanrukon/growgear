import { ImagePlus, Video } from "lucide-react";
import { Product } from "@/lib/types";
import { ProductImage } from "@/components/ui/ProductImage";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { BuyBox } from "@/components/product/BuyBox";
import { VideoSection } from "@/components/product/VideoSection";
import { ReviewsSection } from "@/components/product/ReviewsSection";
import { StorySection } from "@/components/product/StorySection";
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
import { categoryMeta } from "@/lib/data/products";

function SpecsSection({ product }: { product: Product }) {
  return (
    <section className="container-page py-10">
      <h2 className="font-display text-lg font-bold text-foreground">স্পেসিফিকেশন</h2>
      <div className="mt-4 flex flex-col gap-6 lg:flex-row">
        <table className="w-full max-w-xl text-sm lg:flex-1">
          <tbody>
            {product.specs.map((spec) => (
              <tr key={spec.label} className="border-b border-border">
                <td className="w-40 py-2.5 font-medium text-ink-soft">{spec.label}</td>
                <td className="py-2.5 text-foreground">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex w-full gap-3 lg:w-72 lg:shrink-0">
          <div className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-border bg-surface-muted p-4 text-center text-ink-faint">
            <ImagePlus size={20} />
            <span className="text-[11px]">প্রোডাক্টের আসল ছবি যোগ করুন</span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-border bg-surface-muted p-4 text-center text-ink-faint">
            <Video size={20} />
            <span className="text-[11px]">প্রোডাক্ট ভিডিও যোগ করুন</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductDetailView({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const meta = categoryMeta[product.category];
  const isLongForm = product.category === "book" || product.category === "ebook";

  return (
    <div className="pb-20 lg:pb-0">
      {isLongForm ? (
        <>
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

          <ExpertOpinionsSection product={product} />

          <SocialProofScreenshotsSection product={product} />
          <PainPointsSection product={product} />

          <CtaBanner
            product={product}
            heading={`"${product.title}" আপনার জন্যই তৈরি`}
            sub="এখনই অর্ডার করে আজকের সিদ্ধান্তটা বদলে ফেলুন"
          />

          <AuthorBioSection product={product} />
          <KeyIdeasSection product={product} />

          <CtaBanner
            product={product}
            heading="এই আইডিয়াগুলো নিজের জীবনে প্রয়োগ করতে চান?"
            sub="আজই সংগ্রহ করুন — পড়া শুরু করুন আজ থেকেই"
          />

          <TransformationSection product={product} />
          <FaqSection product={product} />
          <QuoteBanner product={product} />
          <FinalOrderSection product={product} />
          <EditorialVideoReviewSection product={product} />
          <ReviewsSection product={product} />
        </>
      ) : (
        <>
          <section className="container-page pt-4">
            <Breadcrumb
              items={[
                { label: "হোম", href: "/" },
                { label: meta.label, href: meta.path },
                { label: product.title },
              ]}
            />

            <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start">
              <div className="lg:flex-1">
                <ProductImage
                  title={product.title}
                  category={product.category}
                  colorFrom={product.colorFrom}
                  colorTo={product.colorTo}
                  iconSize={72}
                  className="aspect-square w-full"
                />
              </div>
              <BuyBox product={product} />
            </div>
          </section>

          <VideoSection product={product} />
          <ReviewsSection product={product} />
          <StorySection product={product} />
          <SpecsSection product={product} />
        </>
      )}

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
