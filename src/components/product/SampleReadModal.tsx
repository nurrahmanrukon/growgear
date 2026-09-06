"use client";

import { BookOpen } from "lucide-react";
import { Product } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export function SampleReadModal({
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
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-primary">
        <BookOpen size={14} /> নমুনা পাতা
      </div>
      <h2 className="mt-1.5 font-display text-lg font-bold text-foreground">{product.title}</h2>
      {product.author && <p className="mt-0.5 text-sm text-ink-soft">{product.author}</p>}

      <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
        <p>{product.description}</p>
        <ul className="space-y-1.5">
          {product.bullets.slice(0, 2).map((b) => (
            <li key={b}>• {b}</li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-md border border-dashed border-border bg-surface-muted p-3 text-center">
        <p className="text-xs text-ink-faint">এটি একটি সংক্ষিপ্ত নমুনা — সম্পূর্ণ কনটেন্ট পড়তে অর্ডার করুন।</p>
        <Button variant="primary" onClick={onClose} className="mt-3">
          এখনই অর্ডার করুন
        </Button>
      </div>
    </Modal>
  );
}
