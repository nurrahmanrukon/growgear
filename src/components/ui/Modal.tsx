"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  children,
  variant = "light",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** "dark" gives the modal card the same fixed dark-navy look as the product
   *  page's bottom order section, for modals that continue that design
   *  (e.g. the quick-order popup). "offer" is a fixed warm terracotta look
   *  reserved for promotional/cross-sell offers, kept visually distinct from
   *  the navy "dark" variant so offers don't blend into ordinary order UI —
   *  every other modal keeps the default light/white card. */
  variant?: "light" | "dark" | "offer";
}) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const isDark = variant === "dark";
  const isOffer = variant === "offer";
  const hasDarkText = isDark || isOffer;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className={`relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-lg p-5 shadow-lg ${
          hasDarkText ? "" : "bg-surface"
        }`}
        style={
          isDark
            ? { background: "#16294a" }
            : isOffer
              ? { background: "linear-gradient(160deg, #6b2f14 0%, #2b1206 100%)" }
              : undefined
        }
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="বন্ধ করুন"
          className={`absolute right-3 top-3 rounded p-1 ${
            hasDarkText
              ? "text-white/60 hover:bg-white/10 hover:text-white"
              : "text-ink-faint hover:bg-surface-muted hover:text-foreground"
          }`}
        >
          <X size={16} />
        </button>
        {children}
      </div>
    </div>
  );
}
