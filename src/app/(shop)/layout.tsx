import { headers } from "next/headers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PurchaseToast } from "@/components/layout/PurchaseToast";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { LockedNav } from "@/components/layout/LockedNav";
import { getVisibleOrderedKeys } from "@/lib/server/navMenu";
import { getLandingLockConfig, parseContentPath, resolveAllowedLinks } from "@/lib/server/landingLock";
import { allProductsResolved } from "@/lib/server/contentText";
import { getPurchaseToastSettings } from "@/lib/server/purchaseToastSettings";
import { getFooterSettings } from "@/lib/server/footerSettings";
import { getSiteTextSettings } from "@/lib/server/siteTextSettings";

export const dynamic = "force-dynamic";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const parsed = parseContentPath(pathname);
  const lock = parsed ? getLandingLockConfig(parsed.kind, parsed.slug) : null;
  const toastEnabled = getPurchaseToastSettings().enabled;
  const liveProducts = toastEnabled ? allProductsResolved().filter((p) => p.inStock) : [];
  const text = getSiteTextSettings();

  if (lock && lock.mode !== "off") {
    const links = lock.mode === "curated" ? resolveAllowedLinks(lock.allowed) : [];
    return (
      <>
        <LockedNav links={links} />
        <main className="flex-1">{children}</main>
        {toastEnabled && (
          <PurchaseToast
            products={liveProducts}
            boughtText={text.purchaseToastBoughtText}
            minutesAgoSuffix={text.purchaseToastMinutesAgoSuffix}
          />
        )}
        <WhatsAppButton />
      </>
    );
  }

  const visibleKeys = getVisibleOrderedKeys();
  const { hiddenGroups, groupOrder, linkOrder } = getFooterSettings();
  const groupTitles = {
    about: text.footerAboutTitle,
    shop: text.footerShopTitle,
    learn: text.footerLearnTitle,
    support: text.footerSupportTitle,
  };
  return (
    <>
      <Header visibleKeys={visibleKeys} />
      <main className="flex-1">{children}</main>
      <Footer
        hiddenGroups={hiddenGroups}
        groupOrder={groupOrder}
        linkOrder={linkOrder}
        groupTitles={groupTitles}
        copyright={text.footerCopyright}
      />
      {toastEnabled && (
        <PurchaseToast
          products={liveProducts}
          boughtText={text.purchaseToastBoughtText}
          minutesAgoSuffix={text.purchaseToastMinutesAgoSuffix}
        />
      )}
      <WhatsAppButton />
    </>
  );
}
