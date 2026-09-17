"use client";

import { Product } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { OrderForm } from "@/components/product/OrderForm";

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
      <OrderForm product={product} onOrdered={onClose} />
    </Modal>
  );
}
