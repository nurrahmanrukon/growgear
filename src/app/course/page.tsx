import { Metadata } from "next";
import { GraduationCap, ExternalLink } from "lucide-react";
import { courses } from "@/lib/data/courses";
import { formatTaka, discountPercent, toBengaliNumber } from "@/lib/format";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "অনলাইন কোর্স — GrowGear" };

export default function CoursePage() {
  return (
    <div className="container-page py-6">
      <div className="rounded-lg border border-border bg-surface-muted p-5 sm:p-6">
        <h1 className="flex items-center gap-2 font-display text-xl font-bold text-foreground sm:text-2xl">
          <GraduationCap size={26} className="text-primary" /> অনলাইন কোর্স
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          GrowGear-এর সব কোর্স পরিচালিত ও এনরোলমেন্ট সম্পন্ন হয় আমাদের পার্টনার লার্নিং
          প্ল্যাটফর্ম{" "}
          <a
            href="https://enrich.com.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:underline"
          >
            enrich.com.bd
          </a>{" "}
          এ। নিচের কোনো কোর্সে &ldquo;এনরোল করুন&rdquo; চাপলে আপনি enrich.com.bd তে চলে যাবেন।
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const discount = discountPercent(course.price, course.oldPrice);
          return (
            <div
              key={course.id}
              className="flex flex-col rounded-lg border border-border bg-surface p-4"
            >
              <div
                className="flex h-32 items-center justify-center rounded-md text-white/90"
                style={{
                  background: `linear-gradient(135deg, ${course.colorFrom}, ${course.colorTo})`,
                }}
              >
                <GraduationCap size={40} strokeWidth={1.5} />
              </div>

              <h2 className="mt-3 text-sm font-semibold text-foreground">{course.title}</h2>
              <p className="text-xs text-neutral-500">{course.instructor}</p>

              <div className="mt-1.5">
                <StarRating rating={course.rating} reviewCount={course.reviewCount} size={13} />
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                {toBengaliNumber(course.studentCount)} শিক্ষার্থী
              </p>

              <p className="mt-2 line-clamp-2 text-xs text-neutral-600">{course.shortDescription}</p>

              <ul className="mt-2 space-y-1">
                {course.bullets.map((b) => (
                  <li key={b} className="text-[11px] text-neutral-500">
                    • {b}
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-lg font-bold text-price">{formatTaka(course.price)}</span>
                {course.oldPrice && (
                  <span className="text-xs text-neutral-500 line-through">
                    {formatTaka(course.oldPrice)}
                  </span>
                )}
                {discount && <span className="text-xs font-semibold text-success">-{discount}%</span>}
              </div>

              <a href={course.enrollUrl} target="_blank" rel="noopener noreferrer" className="mt-3">
                <Button variant="primary" fullWidth>
                  এনরোল করুন <ExternalLink size={14} />
                </Button>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
