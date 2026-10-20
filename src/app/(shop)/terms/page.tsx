import { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = { title: "ব্যবহারের শর্তাবলী — GrowGear" };

export default function TermsPage() {
  return (
    <>
      <div className="container-page pt-4">
        <Breadcrumb items={[{ label: "হোম", href: "/" }, { label: "ব্যবহারের শর্তাবলী" }]} />
      </div>

      <section className="container-page py-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">ব্যবহারের শর্তাবলী</h1>
          <p className="mt-1.5 text-xs text-ink-faint">সর্বশেষ হালনাগাদ: ২০২৬</p>

          <div className="mt-6 space-y-5 text-sm leading-relaxed text-ink-soft">
            <p>
              GrowGear ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি নিচের শর্তাবলীতে সম্মত হচ্ছেন। অনুগ্রহ করে অর্ডার করার আগে
              এগুলো পড়ে নিন।
            </p>

            <div>
              <h2 className="font-display text-base font-bold text-foreground">অর্ডার ও মূল্য</h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                <li>ওয়েবসাইটে দেখানো মূল্য সঠিক রাখার চেষ্টা করা হয়, তবে কোনো ত্রুটি হলে অর্ডার কনফার্ম করার আগে জানানো হবে</li>
                <li>স্টক সীমিত থাকলে অর্ডার প্রত্যাখ্যান বা বিলম্বিত হতে পারে — এক্ষেত্রে আপনাকে জানানো হবে</li>
                <li>প্রোমো কোড/ছাড় নির্দিষ্ট শর্তসাপেক্ষে প্রযোজ্য, এবং যেকোনো সময় পরিবর্তন বা বাতিল করার অধিকার সংরক্ষিত</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-base font-bold text-foreground">পেমেন্ট</h2>
              <p className="mt-2">
                ক্যাশ অন ডেলিভারি, বিকাশ এবং কার্ড পেমেন্ট গ্রহণ করা হয়। অনলাইন পেমেন্টের ক্ষেত্রে লেনদেন সুরক্ষিত
                পেমেন্ট গেটওয়ের মাধ্যমে প্রসেস করা হয়।
              </p>
            </div>

            <div>
              <h2 className="font-display text-base font-bold text-foreground">ডেলিভারি</h2>
              <p className="mt-2">
                শারীরিক পণ্যের (বই, গিয়ার) ক্ষেত্রে ডেলিভারি চার্জ ও সময় এলাকাভেদে পরিবর্তিত হয় — চেকআউটের সময়
                স্পষ্টভাবে দেখানো হয়। ইবুকের ক্ষেত্রে অর্ডার সম্পন্ন হওয়ার সাথে সাথেই আপনার প্রোফাইলে অ্যাক্সেস পাওয়া
                যায়, কোনো শিপিং প্রয়োজন নেই।
              </p>
            </div>

            <div>
              <h2 className="font-display text-base font-bold text-foreground">মেধাস্বত্ব</h2>
              <p className="mt-2">
                ওয়েবসাইটের সব কনটেন্ট (লেখা, ডিজাইন, ইবুক, কোর্স কনটেন্ট) GrowGear-এর মেধাস্বত্বের অন্তর্ভুক্ত।
                কেনা ইবুক/কনটেন্ট শুধুমাত্র ব্যক্তিগত ব্যবহারের জন্য — পুনর্বিতরণ বা পুনর্বিক্রয় নিষিদ্ধ।
              </p>
            </div>

            <div>
              <h2 className="font-display text-base font-bold text-foreground">অ্যাকাউন্ট ও নিরাপত্তা</h2>
              <p className="mt-2">
                প্রোফাইল লগইন তথ্য গোপন রাখার দায়িত্ব আপনার। সন্দেহজনক কোনো কার্যকলাপ দেখলে সাথে সাথে আমাদের জানান।
              </p>
            </div>

            <div>
              <h2 className="font-display text-base font-bold text-foreground">শর্তাবলীর পরিবর্তন</h2>
              <p className="mt-2">
                সময়ে সময়ে এই শর্তাবলী হালনাগাদ করা হতে পারে। বড় কোনো পরিবর্তন হলে ওয়েবসাইটে জানিয়ে দেওয়া হবে।
              </p>
            </div>

            <div>
              <h2 className="font-display text-base font-bold text-foreground">যোগাযোগ</h2>
              <p className="mt-2">কোনো প্রশ্ন থাকলে আমাদের হোয়াটসঅ্যাপে যোগাযোগ করুন।</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
