import { Play } from "lucide-react";

export function GrowGuideVideoSection() {
  return (
    <section className="border-b border-border py-10">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">মূল বার্তা</p>
          <h2 className="mt-1.5 font-display text-xl font-bold text-foreground sm:text-2xl">
            নূর রহমানের কাছ থেকে সরাসরি শুনুন
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            প্রতি মাসে একটি নির্দিষ্ট সময়ে সম্পূর্ণ ফ্রি লাইভ ওয়েবিনার — শিক্ষার্থী, প্রফেশনাল ও উদ্যোক্তাদের জন্য। এটা
            আমার কমিউনিটি গড়ে তোলা এবং সমাজে অবদান রাখার একটা প্রচেষ্টা।
          </p>
        </div>

        <div className="mx-auto mt-6 max-w-3xl">
          <div
            className="group relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-border"
            style={{ background: "linear-gradient(135deg, #2a4570, #16294a)" }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface/90 shadow-sm transition group-hover:scale-105 sm:h-20 sm:w-20">
              <Play size={28} className="ml-1 text-foreground" fill="currentColor" />
            </div>
            <span className="absolute bottom-3 left-4 text-xs font-medium text-white/85 sm:bottom-4 sm:left-5 sm:text-sm">
              নূর রহমানের বার্তা (শীঘ্রই যুক্ত হবে)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
