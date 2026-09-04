import { Product, ProductCategory, ProductSpec } from "@/lib/types";
import { MUTED_GRADIENTS as gradients } from "./palette";

interface RawItem {
  title: string;
  author?: string;
  price: number;
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
  return items.map((item, i) => {
    const rating = Math.round((4.2 + ((i * 13) % 8) / 10) * 10) / 10;
    const reviewCount = 18 + ((i * 37) % 260);
    const hasDiscount = i % 3 !== 2;
    const oldPrice = hasDiscount ? Math.round((item.price * (100 + 10 + (i % 4) * 5)) / 100 / 10) * 10 : undefined;
    const [colorFrom, colorTo] = gradients[i % gradients.length];
    const bullets = [
      opts.bulletsPool[i % opts.bulletsPool.length],
      opts.bulletsPool[(i + 1) % opts.bulletsPool.length],
      opts.bulletsPool[(i + 2) % opts.bulletsPool.length],
    ];

    let badge: string | undefined;
    if (i % 11 === 0) badge = "বেস্ট সেলার";
    else if (i % 7 === 0) badge = "নতুন";
    else if (hasDiscount && i % 5 === 0) badge = "লিমিটেড অফার";

    return {
      id: `${category}-${i + 1}`,
      slug: `${category}-${i + 1}`,
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
      featured: i % 6 === 0,
      bestSeller: i % 11 === 0,
      inStock: i % 23 !== 22,
      colorFrom,
      colorTo,
    };
  });
}
