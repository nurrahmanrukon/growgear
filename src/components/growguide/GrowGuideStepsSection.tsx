const STEPS = [
  {
    title: "ফ্রি-তে সেগমেন্টে জয়েন করুন",
    body: "আপনার ইমেইল দিয়ে চলতি সেগমেন্টে যুক্ত হন — সম্পূর্ণ বিনামূল্যে, কোনো পেমেন্ট লাগবে না।",
  },
  {
    title: "৫০০ জন হলেই ওয়েবিনার শুরু",
    body: "প্রতিটি সেগমেন্টে ৫০০ জন যুক্ত হওয়ার সাথে সাথে সেই সেগমেন্টের জন্য লাইভ ওয়েবিনারের সময়সূচি ইমেইলে পাঠানো হবে।",
  },
  {
    title: "ওয়েবিনারে ফ্রি রিসোর্স পাবেন",
    body: "নূর রহমান নিজে লাইভ ওয়েবিনারে জীবনে গাইডেড ওয়েতে গ্রো করার বাস্তবসম্মত রিসোর্স ও ধাপে ধাপে পরিকল্পনা শেয়ার করবেন।",
  },
  {
    title: "প্রাইভেট কমিউনিটি গ্রুপে যুক্ত হন",
    body: "ওয়েবিনার শেষে একটি প্রাইভেট কমিউনিটি গ্রুপে যুক্ত হবেন, যেখানে সবাই মিলে একে অপরকে সাহায্য করবে।",
  },
];

export function GrowGuideStepsSection() {
  return (
    <section className="container-page py-10">
      <h2 className="text-center font-display text-xl font-bold text-foreground sm:text-2xl">যেভাবে কাজ করে</h2>
      <div className="mx-auto mt-7 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <div key={s.title} className="rounded-lg border border-border bg-surface p-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary-dark">
              {i + 1}
            </span>
            <h3 className="mt-3 text-sm font-bold text-foreground">{s.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
