import { MessageCircle } from "lucide-react";

export function GrowGuideCommunitySection() {
  return (
    <section className="container-page py-10">
      <div className="mx-auto max-w-2xl rounded-lg border border-border bg-surface p-6 text-center">
        <MessageCircle className="mx-auto text-primary" size={26} />
        <h2 className="mt-3 font-display text-lg font-bold text-foreground">প্রাইভেট কমিউনিটি গ্রুপ</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          ওয়েবিনার শেষে আপনাকে একটি প্রাইভেট কমিউনিটি গ্রুপে যুক্ত করা হবে — সম্পূর্ণ ফ্রি। এখানে নূর রহমানসহ সবাই একে
          অপরকে সাহায্য করে, অভিজ্ঞতা শেয়ার করে এবং একসাথে জীবনে গ্রো করার পথে এগিয়ে যায়।
        </p>
      </div>
    </section>
  );
}
