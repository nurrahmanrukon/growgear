"use client";

import { Product } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { OrderForm } from "@/components/product/OrderForm";
import { UrgencyOrderCard } from "@/components/product/UrgencyOrderCard";

export function QuickOrderModal({
  product,
  open,
  onClose,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} variant="dark">
      <UrgencyOrderCard product={product} />
      <div className="mt-3 rounded-lg bg-surface p-5 text-left shadow-lg">
        <OrderForm product={product} onOrdered={onClose} />
      </div>
    </Modal>
  );
}
