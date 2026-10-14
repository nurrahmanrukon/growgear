import { Product } from "@/lib/types";
import { OrderForm } from "@/components/product/OrderForm";
import { UrgencyOrderCard } from "@/components/product/UrgencyOrderCard";

export function FinalOrderSection({ product }: { product: Product }) {
  return (
    <section className="bg-primary-dark py-12">
      <div className="container-page">
        <div className="mx-auto max-w-sm">
          <UrgencyOrderCard product={product} />
        </div>

        <div className="mx-auto mt-3 max-w-sm rounded-lg bg-surface p-5 text-left shadow-lg">
          <OrderForm product={product} />
        </div>
      </div>
    </section>
  );
}
