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
    <Modal open={open} onClose={onClose}>
      <div className="mb-4">
        <UrgencyOrderCard product={product} />
      </div>
      <OrderForm product={product} onOrdered={onClose} />
    </Modal>
  );
}
