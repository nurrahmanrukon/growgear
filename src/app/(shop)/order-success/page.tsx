import Link from "next/link";
import { cookies } from "next/headers";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getOrder } from "@/lib/server/orders";
import { allProducts } from "@/lib/data/products";
import { getCrossSellSettings, crossSellRotation } from "@/lib/server/crossSellSettings";
import { getProductBySlugResolved } from "@/lib/server/contentText";
import { OrderSuccessCrossSell } from "@/components/product/OrderSuccessCrossSell";
import { CrossSellCopy, SecondOffer } from "@/components/product/CrossSellModal";
import { ORDER_ACCESS_COOKIE, tokenGrantsAccess } from "@/lib/server/orderAccess";
import { getWhatsAppSettings } from "@/lib/server/whatsappSettings";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  // The order ID alone (visible in the URL) never unlocks another customer's details —
  // only the browser that just placed this order carries the matching access cookie.
  const accessToken = (await cookies()).get(ORDER_ACCESS_COOKIE)?.value;
  const authorized = Boolean(orderId && tokenGrantsAccess(accessToken, orderId));
  const order = authorized && orderId ? getOrder(orderId) : undefined;
  const orderCategories = order?.items.map((item) => allProducts.find((p) => p.id === item.productId)?.category) ?? [];
  const hasEbook = orderCategories.includes("ebook");

  const whatsapp = getWhatsAppSettings();
  const crossSell = getCrossSellSettings();
  const originalCategory = orderCategories[0];
  const rotation = originalCategory ? crossSellRotation(originalCategory) : undefined;

  const firstOfferSlug = rotation ? (rotation.first === "ebook" ? crossSell.ebookSlug : crossSell.bookSlug) : "";
  const firstOfferProduct =
    crossSell.enabled && rotation && firstOfferSlug ? getProductBySlugResolved(firstOfferSlug) : undefined;
  const alreadyBoughtFirst = order?.items.some(
    (item) => item.slug === firstOfferSlug || item.productId === firstOfferProduct?.id
  );
  const showCrossSell = rotation && firstOfferProduct && !alreadyBoughtFirst;

  const crossSellCopy: CrossSellCopy = {
    offerAppreciation: crossSell.offerAppreciation,
    offerEyebrow: crossSell.offerEyebrow,
    offerHeading: crossSell.offerHeading,
    secondOfferEyebrow: crossSell.secondOfferEyebrow,
    secondOfferSocialProof: crossSell.secondOfferSocialProof,
    successAppreciation: crossSell.successAppreciation,
    top1PctHeading: crossSell.top1PctHeading,
    top1PctBody: crossSell.top1PctBody,
    giftEyebrow: crossSell.giftEyebrow,
    giftHeading: crossSell.giftHeading,
    giftBody: crossSell.giftBody,
    giftCta: crossSell.giftCta,
  };

  let secondOffer: SecondOffer | undefined;
  if (crossSell.secondOfferEnabled && rotation) {
    const secondOfferSlug = rotation.second === "book" ? crossSell.bookSlug : crossSell.gearSlug;
    if (secondOfferSlug) {
      const secondProduct = getProductBySlugResolved(secondOfferSlug);
      const alreadyBoughtSecond = order?.items.some(
        (item) => item.slug === secondOfferSlug || item.productId === secondProduct?.id
      );
      if (secondProduct && !alreadyBoughtSecond) {
        secondOffer = { category: rotation.second, product: secondProduct };
      }
    }
  }

  return (
    <div className="container-page flex flex-col items-center gap-3 py-20 text-center">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-sm">
        <CheckCircle2 size={56} className="mx-auto text-success" />
        <h1 className="mt-3 text-xl font-bold text-foreground">অর্ডার সফলভাবে সম্পন্ন হয়েছে!</h1>
        {orderId && (
          <p className="mt-1.5 text-sm text-neutral-600">
            আপনার অর্ডার আইডি: <span className="font-semibold text-navy-light">{orderId}</span>
          </p>
        )}
        <p className="mt-2 text-sm text-neutral-500">
          আমাদের একজন প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন। পণ্য হাতে পেয়ে টাকা পরিশোধ করুন।
        </p>
        {hasEbook && (
          <p className="mt-2 text-sm text-primary">
            আপনার কেনা ইবুক এখন আপনার প্রোফাইলে পাওয়া যাবে — পড়তে{" "}
            <Link href="/profile" className="font-semibold underline hover:no-underline">
              আমার প্রোফাইল
            </Link>{" "}
            থেকে যান।
          </p>
        )}
        {orderId && (
          <p className="mt-3 border-t border-border pt-3 text-xs text-ink-faint">
            পরে যেকোনো সময় অর্ডারের অবস্থা দেখতে চাইলে{" "}
            <Link
              href={`/track-order?orderId=${encodeURIComponent(orderId)}`}
              className="font-medium text-primary underline hover:no-underline"
            >
              অর্ডার ট্র্যাক করুন
            </Link>
            {whatsapp.enabled && (
              <>
                {" "}অথবা{" "}
                <a
                  href={`https://wa.me/${whatsapp.number}?text=${encodeURIComponent(
                    `আসসালামু আলাইকুম, আমি অর্ডার ${orderId} নিয়ে জানতে চাইছি।`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline hover:no-underline"
                >
                  হোয়াটসঅ্যাপে জিজ্ঞেস করুন
                </a>
              </>
            )}
            ।
          </p>
        )}
      </div>

      {showCrossSell && firstOfferProduct && order && rotation && (
        <OrderSuccessCrossSell
          product={firstOfferProduct}
          category={rotation.first}
          message={crossSell.message}
          soldCount={crossSell.soldCount}
          customerName={order.customer.name}
          customerPhone={order.customer.phone}
          customerAddress={order.customer.address}
          customerArea={order.customer.area}
          orderId={orderId}
          orderProductTitle={order.items[0]?.title}
          orderProductCategory={originalCategory}
          orderProductPrice={order.items[0]?.price}
          orderDiscount={order.discount}
          secondOffer={secondOffer}
          copy={crossSellCopy}
        />
      )}

      <Link href="/" className="mt-2">
        <Button variant="primary">কেনাকাটা চালিয়ে যান</Button>
      </Link>
    </div>
  );
}
