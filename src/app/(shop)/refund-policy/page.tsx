import { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = { title: "রিটার্ন ও রিফান্ড পলিসি — GrowGear" };

export default function RefundPolicyPage() {
  return (
    <>
      <div className="container-page pt-4">
        <Breadcrumb items={[{ label: "হোম", href: "/" }, { label: "রিটার্ন ও রিফান্ড পলিসি" }]} />
      </div>

      <section className="container-page py-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">রিটার্ন ও রিফান্ড পলিসি</h1>
          <p className="mt-1.5 text-xs text-ink-faint">সর্বশেষ হালনাগাদ: ২০২৬</p>

          <div className="mt-6 space-y-5 text-sm leading-relaxed text-ink-soft">
            <div>
              <h2 className="font-display text-base font-bold text-foreground">বই ও গিয়ার (শারীরিক পণ্য)</h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                <li>
                  পণ্য ড্যামেজড বা ভুল অবস্থায় পেলে, <strong className="text-foreground">ডেলিভারির ২৪ ঘণ্টার মধ্যে</strong>{" "}
                  আমাদের জানালে বিনামূল্যে রিপ্লেসমেন্ট ব্যবস্থা করা হবে।
                </li>
                <li>প্রোডাক্টিভিটি গিয়ারের ক্ষেত্রে অতিরিক্তভাবে ৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি প্রযোজ্য — ম্যানুফ্যাকচারিং ত্রুটি থাকলে।</li>
                <li>রিপ্লেসমেন্টের জন্য প্যাকেজিং, পণ্যের অবস্থা অপরিবর্তিত থাকতে হবে।</li>
                <li>
                  ক্যাশ অন ডেলিভারিতে কেনা পণ্যের ক্ষেত্রে, ডেলিভারির সময় পণ্য যাচাই করে না নিলে কোনো পেমেন্ট করতে হয়
                  না — এক্ষেত্রে আলাদা রিফান্ডের প্রয়োজন হয় না।
                </li>
                <li>অনলাইন পেমেন্টে (বিকাশ/কার্ড) করা অর্ডার বাতিল বা প্রত্যাখ্যাত হলে, যাচাই সাপেক্ষে ৫-৭ কার্যদিবসের মধ্যে রিফান্ড প্রসেস করা হবে।</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-base font-bold text-foreground">ইবুক (ডিজিটাল পণ্য)</h2>
              <p className="mt-2">
                ইবুক কেনার সাথে সাথে তাৎক্ষণিকভাবে আপনার প্রোফাইলে অ্যাক্সেস দেওয়া হয় বলে, সাধারণত{" "}
                <strong className="text-foreground">ডাউনলোড/অ্যাক্সেসের পর রিফান্ড প্রযোজ্য নয়</strong> — এটা
                ডিজিটাল পণ্যের ক্ষেত্রে সাধারণ নিয়ম। তবে টেকনিক্যাল সমস্যার কারণে (যেমন ফাইল ওপেন না হওয়া, ভুল
                প্রোডাক্ট ডেলিভারি) আমাদের সাথে যোগাযোগ করলে সমাধান বা প্রযোজ্য ক্ষেত্রে রিফান্ড বিবেচনা করা হবে।
              </p>
            </div>

            <div>
              <h2 className="font-display text-base font-bold text-foreground">রিফান্ড কীভাবে পাবেন</h2>
              <p className="mt-2">
                রিফান্ড অনুমোদিত হলে, যে মাধ্যমে পেমেন্ট করা হয়েছিল সেই একই মাধ্যমে (বিকাশ/কার্ড) ফেরত পাঠানো হবে।
                প্রসেসিং সময় পেমেন্ট মাধ্যমের উপর নির্ভর করে কিছুটা ভিন্ন হতে পারে।
              </p>
            </div>

            <div>
              <h2 className="font-display text-base font-bold text-foreground">কীভাবে যোগাযোগ করবেন</h2>
              <p className="mt-2">
                রিটার্ন/রিপ্লেসমেন্ট/রিফান্ড সংক্রান্ত যেকোনো অনুরোধের জন্য আপনার অর্ডার আইডি সহ আমাদের হোয়াটসঅ্যাপে
                যোগাযোগ করুন — যত দ্রুত সম্ভব সমাধান করার চেষ্টা করা হবে।
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
