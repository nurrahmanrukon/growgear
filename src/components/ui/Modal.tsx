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
   *  (e.g. the quick-order popup) — every other modal keeps the default
   *  light/white card. */
  variant?: "light" | "dark";
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className={`relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-lg p-5 shadow-lg ${
          isDark ? "" : "bg-surface"
        }`}
        style={isDark ? { background: "#16294a" } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="বন্ধ করুন"
          className={`absolute right-3 top-3 rounded p-1 ${
            isDark
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
