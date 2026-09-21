import { headers } from "next/headers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PurchaseToast } from "@/components/layout/PurchaseToast";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { LockedNav } from "@/components/layout/LockedNav";
import { getVisibleOrderedKeys } from "@/lib/server/navMenu";
import { getLandingLockConfig, parseContentPath, resolveAllowedLinks } from "@/lib/server/landingLock";

export const dynamic = "force-dynamic";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const parsed = parseContentPath(pathname);
  const lock = parsed ? getLandingLockConfig(parsed.kind, parsed.slug) : null;

  if (lock && lock.mode !== "off") {
    const links = lock.mode === "curated" ? resolveAllowedLinks(lock.allowed) : [];
    return (
      <>
        <LockedNav links={links} />
        <main className="flex-1">{children}</main>
        <PurchaseToast />
        <WhatsAppButton />
      </>
    );
  }

  const visibleKeys = getVisibleOrderedKeys();
  return (
    <>
      <Header visibleKeys={visibleKeys} />
      <main className="flex-1">{children}</main>
      <Footer />
      <PurchaseToast />
      <WhatsAppButton />
    </>
  );
}
