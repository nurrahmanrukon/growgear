import { ImageIcon } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";

const SESSION_PHOTOS = [
  { colorFrom: "#2a4570", colorTo: "#16294a" },
  { colorFrom: "#3d5a80", colorTo: "#1b2740" },
  { colorFrom: "#16a34a", colorTo: "#113023" },
  { colorFrom: "#a2512f", colorTo: "#5c2c19" },
  { colorFrom: "#2a4570", colorTo: "#8fa8d6" },
  { colorFrom: "#6b85b8", colorTo: "#16294a" },
];

const SESSION_REVIEWS = [
  {
    name: "তানভীর আহমেদ",
    role: "শিক্ষার্থী",
    quote: "সেশনটা এতটাই বাস্তবসম্মত ছিল যে সাথে সাথে নিজের রুটিনে প্রয়োগ করতে পেরেছি।",
    rating: 5,
  },
  {
    name: "নুসরাত জাহান",
    role: "প্রফেশনাল",
    quote: "নূর রহমান নিজেই প্রশ্নের উত্তর দিয়েছেন, একদমই কমার্শিয়াল মনে হয়নি।",
    rating: 5,
  },
  {
    name: "রাকিবুল হাসান",
    role: "উদ্যোক্তা",
    quote: "ব্যবসার সিদ্ধান্ত নেওয়ার একটা স্পষ্ট ফ্রেমওয়ার্ক পেয়েছি, একদম ফ্রি-তে।",
    rating: 4.5,
  },
  {
    name: "সাদিয়া ইসলাম",
    role: "শিক্ষার্থী",
    quote: "কমিউনিটি গ্রুপে যুক্ত হয়ে অনেক নতুন মানুষের সাথে পরিচয় হয়েছে।",
    rating: 5,
  },
];

export function GrowGuidePastSessionsSection() {
  return (
    <section className="border-b border-border bg-surface-muted py-10">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">কমিউনিটি হাইলাইটস</p>
          <h2 className="mt-1.5 font-display text-xl font-bold text-foreground sm:text-2xl">
            আগের সেশনের কিছু মুহূর্ত
          </h2>
        </div>

        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
          {SESSION_PHOTOS.map((p, i) => (
            <div
              key={i}
              className="flex aspect-video items-center justify-center rounded-lg text-white/85"
              style={{ background: `linear-gradient(135deg, ${p.colorFrom}, ${p.colorTo})` }}
            >
              <ImageIcon size={20} />
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
          {SESSION_REVIEWS.map((r) => (
            <div key={r.name} className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary-dark">
                  {r.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{r.name}</p>
                  <p className="text-[11px] text-ink-faint">{r.role}</p>
                </div>
              </div>
              <div className="mt-2">
                <StarRating rating={r.rating} size={13} />
              </div>
              <p className="mt-2 text-sm text-ink-soft">&ldquo;{r.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
