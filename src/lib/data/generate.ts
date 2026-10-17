import { Product, ProductCategory, ProductSpec } from "@/lib/types";
import { MUTED_GRADIENTS as gradients } from "./palette";
import { hashString } from "./social";
import { ALL_SEGMENTS } from "./segments";

interface RawItem {
  title: string;
  author?: string;
  price: number;
  subcategorySlug?: string;
}

export function buildCatalog(
  category: ProductCategory,
  items: RawItem[],
  opts: {
    bulletsPool: string[];
    specsBase: ProductSpec[];
    descriptionFor: (title: string, author?: string) => string;
    shortDescriptionFor: (title: string) => string;
  }
): Product[] {
  // reviewCount is our best available "how well has this sold" proxy in the absence of
  // real order history, so badges are ranked by it instead of arbitrary index parity —
  // products that look genuinely popular get "বেস্ট সেলার", the least-reviewed get "নতুন".
  const reviewCounts = items.map((_, i) => 18 + ((i * 37) % 260));
  const rankedByReviews = items.map((_, i) => i).sort((a, b) => reviewCounts[b] - reviewCounts[a]);
  const bestSellerCount = Math.max(1, Math.round(items.length * 0.2));
  const newCount = Math.max(1, Math.round(items.length * 0.25));
  const bestSellerIndices = new Set(rankedByReviews.slice(0, bestSellerCount));
  const newIndices = new Set(rankedByReviews.slice(-newCount));

  return items.map((item, i) => {
    const rating = Math.round((4.2 + ((i * 13) % 8) / 10) * 10) / 10;
    const reviewCount = reviewCounts[i];
    const hasDiscount = i % 3 !== 2;
    const oldPrice = hasDiscount ? Math.round((item.price * (100 + 10 + (i % 4) * 5)) / 100 / 10) * 10 : undefined;
    const [colorFrom, colorTo] = gradients[i % gradients.length];
    const bullets = [
      opts.bulletsPool[i % opts.bulletsPool.length],
      opts.bulletsPool[(i + 1) % opts.bulletsPool.length],
      opts.bulletsPool[(i + 2) % opts.bulletsPool.length],
    ];

    let badge: string | undefined;
    if (bestSellerIndices.has(i)) badge = "বেস্ট সেলার";
    else if (newIndices.has(i)) badge = "নতুন";
    else if (hasDiscount && i % 5 === 0) badge = "লিমিটেড অফার";

    const id = `${category}-${i + 1}`;
    const segmentSlug = ALL_SEGMENTS[hashString(`${id}:segment`) % ALL_SEGMENTS.length].slug;

    return {
      id,
      slug: id,
      category,
      title: item.title,
      author: item.author,
      price: item.price,
      oldPrice,
      rating,
      reviewCount,
      shortDescription: opts.shortDescriptionFor(item.title),
      description: opts.descriptionFor(item.title, item.author),
      bullets,
      specs: opts.specsBase,
      badge,
      subcategorySlug: item.subcategorySlug,
      segmentSlug,
      featured: i % 6 === 0,
      bestSeller: bestSellerIndices.has(i),
      inStock: i % 23 !== 22,
      colorFrom,
      colorTo,
    };
  });
}
