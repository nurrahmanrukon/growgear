import { Metadata } from "next";
import { Play } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { NewsletterSection } from "@/components/blog/NewsletterSection";

export const metadata: Metadata = { title: "লেখকের কথা — GrowGear ব্লগ" };

const NOTE_PARAGRAPHS = [
  "আমি নূর রহমান। GrowGear-এর ব্লগে যা কিছু লেখা হয় — ব্যবসা, প্রোডাক্টিভিটি, ক্যারিয়ার, নেতৃত্ব — এর প্রতিটা লেখার পেছনে একটাই কারণ কাজ করে: আমি নিজে যে ভুলগুলো করেছি, যে শিক্ষাগুলো কঠিন সময় পার করে পেয়েছি, সেগুলো যেন আর কাউকে নতুন করে শিখতে না হয়।",
  "১১+ বছর ধরে বিভিন্ন প্রতিষ্ঠানে কাজ করার সময় বারবার একটা জিনিস খেয়াল করেছি — আমাদের বেশিরভাগ সমস্যার সমাধান আসলে জটিল কোনো থিওরিতে নেই, বরং সহজ কিছু নীতি ধারাবাহিকভাবে মেনে চলার মধ্যে আছে। কিন্তু সেই সহজ নীতিগুলো বাংলা ভাষায়, বাস্তব প্রেক্ষাপটে, সহজবোধ্য করে লেখা জিনিস খুব কম পাওয়া যায়। এই ঘাটতিটা পূরণ করতেই GrowGear ব্লগের যাত্রা শুরু।",
  "আমি বিশ্বাস করি, একজন মানুষ যখন সঠিক তথ্য সঠিক সময়ে পায়, তখন তার সিদ্ধান্ত নেওয়ার ক্ষমতা আমূল বদলে যায়। এই ব্লগের প্রতিটা লেখা তাই কোনো একাডেমিক আলোচনা নয় — বরং বাস্তব অভিজ্ঞতা, প্র্যাক্টিক্যাল উদাহরণ আর সরাসরি প্রয়োগযোগ্য পরামর্শ দিয়ে সাজানো।",
  "যারা এই লেখাগুলো নিয়মিত পড়েন, তাদের কাছে আমার একটাই অনুরোধ — শুধু পড়ে থেমে যাবেন না। একটা করে আইডিয়া নিন, নিজের জীবনে প্রয়োগ করে দেখুন। পরিবর্তন একদিনে আসে না, কিন্তু প্রতিটা ছোট পদক্ষেপ আপনাকে সঠিক পথে এগিয়ে নেয়।",
  "GrowGear-এর বই, ইবুক আর কোর্সগুলোও এই একই দর্শন থেকে তৈরি। ব্লগ যদি হয় প্রথম পরিচয়, তাহলে বইগুলো সেই আলোচনার গভীরতা। আশা করি এই যাত্রায় আপনিও সাথে থাকবেন।",
];

export default function AuthorNotePage() {
  return (
    <>
      <div className="container-page pt-4">
        <Breadcrumb items={[{ label: "হোম", href: "/" }, { label: "ব্লগ", href: "/blog" }, { label: "লেখকের কথা" }]} />
      </div>

      <section className="container-page py-8">
        <div className="mx-auto max-w-2xl text-center">
          <span
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
            style={{ background: "linear-gradient(135deg, #3f6653, #2e4b3d)" }}
          >
            নূ
          </span>
          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-primary">লেখকের কথা</p>
          <h1 className="mt-1.5 font-display text-2xl font-bold text-foreground sm:text-3xl">
            আমি কেন এই ব্লগগুলো লিখি
          </h1>
          <p className="mt-2 text-sm text-ink-faint">নূর রহমান — প্রতিষ্ঠাতা, GrowGear</p>
        </div>

        <div className="mx-auto mt-7 max-w-3xl">
          <div
            className="group relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-border"
            style={{ background: "linear-gradient(135deg, #3f6653, #2e4b3d)" }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface/90 shadow-sm transition group-hover:scale-105 sm:h-20 sm:w-20">
              <Play size={28} className="ml-1 text-foreground" fill="currentColor" />
            </div>
            <span className="absolute bottom-3 left-4 text-xs font-medium text-white/85 sm:bottom-4 sm:left-5 sm:text-sm">
              লেখকের কথা — ভিডিওতে (শীঘ্রই যুক্ত হবে)
            </span>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-2xl space-y-4 text-sm leading-relaxed text-ink-soft sm:text-base">
          {NOTE_PARAGRAPHS.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}
