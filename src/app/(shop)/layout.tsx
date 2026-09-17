import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PurchaseToast } from "@/components/layout/PurchaseToast";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <PurchaseToast />
      <WhatsAppButton />
    </>
  );
}
