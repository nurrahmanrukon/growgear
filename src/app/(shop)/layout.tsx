import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PurchaseToast } from "@/components/layout/PurchaseToast";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { getVisibleOrderedKeys } from "@/lib/server/navMenu";

export const dynamic = "force-dynamic";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
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
