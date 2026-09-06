"use client";

import { Gift } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export function PromoGiftModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary">
          <Gift size={22} />
        </span>
        <h2 className="mt-3 font-display text-lg font-bold text-foreground">আপনার জন্য একটি উপহার 🎁</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          আপনি নূর রহমান-এর পডকাস্ট, লেখা, কোর্স কিংবা টুলস বা গিয়ার ব্যবহার করে নিজেকে গ্রো করার চেষ্টা করছেন — এজন্য
          নূর রহমান ভাইয়ার পক্ষ থেকে আপনার জন্য ছোট্ট একটি উপহার: <span className="font-semibold text-foreground">১০% ডিসকাউন্ট</span>,
          শুধুমাত্র আপনার জন্য।
        </p>
        <Button variant="primary" onClick={onClose} className="mt-5">
          ধন্যবাদ, নূর রহমান!
        </Button>
      </div>
    </Modal>
  );
}
