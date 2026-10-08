import { ImageIcon } from "lucide-react";
import { Product } from "@/lib/types";
import { getAuthorProfile } from "@/lib/data/landingContent";
import { getAuthorPhotoUrls } from "@/lib/server/authorPhotos";
import { AuthorPhotoCarousel } from "@/components/product/AuthorPhotoCarousel";

export function AuthorBioSection({ product }: { product: Product }) {
  const author = getAuthorProfile(product);
  const photoUrls = getAuthorPhotoUrls(product.slug);

  return (
    <section className="border-y border-border bg-surface-muted py-12">
      <div className="container-page">
        <div className="mx-auto max-w-md text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">যিনি লিখেছেন</p>

          {photoUrls.length > 0 ? (
            <AuthorPhotoCarousel photoUrls={photoUrls} authorName={author.name} />
          ) : (
            <div
              className="mx-auto mt-4 flex aspect-[4/5] w-full max-w-[220px] flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-star p-1.5 text-white/85"
              style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
            >
              <ImageIcon size={22} />
              <span className="text-xs">{author.name}</span>
            </div>
          )}

          <h2 className="mt-4 font-display text-lg font-bold text-foreground">{author.name}</h2>
          <p className="text-sm text-ink-faint">{author.title}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{author.bio}</p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {author.stats.map((s) => (
              <div key={s.label} className="rounded-lg border-b-4 border-star bg-surface p-3">
                <p className="font-display text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-ink-faint">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
