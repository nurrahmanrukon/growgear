import { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = { title: "প্রাইভেসি পলিসি — GrowGear" };

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="container-page pt-4">
        <Breadcrumb items={[{ label: "হোম", href: "/" }, { label: "প্রাইভেসি পলিসি" }]} />
      </div>

      <section className="container-page py-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">প্রাইভেসি পলিসি</h1>
          <p className="mt-1.5 text-xs text-ink-faint">সর্বশেষ হালনাগাদ: ২০২৬</p>

          <div className="mt-6 space-y-5 text-sm leading-relaxed text-ink-soft">
            <p>
              GrowGear (&ldquo;আমরা&rdquo;, &ldquo;আমাদের&rdquo;) আপনার ব্যক্তিগত তথ্যের গোপনীয়তাকে গুরুত্ব সহকারে দেখে।
              এই পেজে আমরা জানাচ্ছি কী ধরনের তথ্য সংগ্রহ করি, কেন করি, এবং কীভাবে তা সুরক্ষিত রাখি।
            </p>

            <div>
              <h2 className="font-display text-base font-bold text-foreground">আমরা যে তথ্য সংগ্রহ করি</h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                <li>অর্ডার করার সময়: নাম, ফোন নম্বর, ঠিকানা, ইমেইল (প্রযোজ্য ক্ষেত্রে)</li>
                <li>প্রোফাইল তৈরি/ইবুক কেনার সময়: নাম, ইমেইল, হোয়াটসঅ্যাপ নম্বর</li>
                <li>ওয়েবসাইট ব্যবহারের সাধারণ তথ্য (যেমন কোন পেজ ভিজিট করা হয়েছে) — সেবার মান উন্নত করতে</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-base font-bold text-foreground">তথ্য কী কাজে ব্যবহার করা হয়</h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                <li>অর্ডার প্রসেস ও ডেলিভারি করতে</li>
                <li>ইমেইল ভেরিফিকেশন (OTP) ও অ্যাকাউন্ট সুরক্ষার জন্য</li>
                <li>কেনা ইবুক আপনার প্রোফাইলে সংরক্ষণ করতে, যাতে পরে যেকোনো সময় অ্যাক্সেস করতে পারেন</li>
                <li>অর্ডার সংক্রান্ত যোগাযোগ করতে (ডেলিভারি আপডেট, কনফার্মেশন ইত্যাদি)</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-base font-bold text-foreground">তথ্য কারো সাথে শেয়ার করা হয় কি</h2>
              <p className="mt-2">
                আপনার ব্যক্তিগত তথ্য তৃতীয় পক্ষের কাছে বিক্রি করা হয় না। শুধুমাত্র অর্ডার ডেলিভারি (কুরিয়ার সার্ভিস)
                এবং পেমেন্ট প্রসেসিং-এর জন্য প্রয়োজনীয় তথ্য সংশ্লিষ্ট সার্ভিস প্রোভাইডারের সাথে শেয়ার করা হয়।
              </p>
            </div>

            <div>
              <h2 className="font-display text-base font-bold text-foreground">তথ্যের সুরক্ষা</h2>
              <p className="mt-2">
                আপনার তথ্য সুরক্ষিতভাবে সংরক্ষণ করা হয় এবং পাসওয়ার্ড/সেশন এনক্রিপশন ব্যবহার করা হয়। তবে ইন্টারনেটের
                মাধ্যমে কোনো তথ্য আদান-প্রদান শতভাগ ঝুঁকিমুক্ত নয় — আমরা যথাসাধ্য সুরক্ষা নিশ্চিত করি।
              </p>
            </div>

            <div>
              <h2 className="font-display text-base font-bold text-foreground">আপনার অধিকার</h2>
              <p className="mt-2">
                আপনি যেকোনো সময় আপনার সংরক্ষিত তথ্য দেখতে, সংশোধন করতে বা মুছে ফেলতে অনুরোধ করতে পারেন — আমাদের সাথে
                যোগাযোগ করে।
              </p>
            </div>

            <div>
              <h2 className="font-display text-base font-bold text-foreground">যোগাযোগ</h2>
              <p className="mt-2">
                প্রাইভেসি সংক্রান্ত কোনো প্রশ্ন থাকলে আমাদের হোয়াটসঅ্যাপে বা ওয়েবসাইটে দেওয়া যোগাযোগ মাধ্যমে জানান।
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
