import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Course } from "@/lib/types";
import { formatTaka } from "@/lib/format";
import { StarRating } from "@/components/ui/StarRating";

export function CourseTeaser({ courses }: { courses: Course[] }) {
  return (
    <section className="container-page py-6">
      <div className="rounded-lg border border-border bg-surface p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-[#0f1111]">
            <GraduationCap size={20} className="text-navy-light" /> অনলাইন কোর্স
          </h2>
          <Link href="/course" className="text-sm text-link hover:text-link-hover hover:underline">
            সব কোর্স দেখুন →
          </Link>
        </div>
        <p className="mb-4 text-xs text-neutral-600">
          কোর্স এনরোলমেন্ট সম্পন্ন হয় আমাদের পার্টনার প্ল্যাটফর্ম{" "}
          <span className="font-semibold text-navy-light">enrich.com.bd</span>-তে।
        </p>
        <div className="-mx-1 flex gap-3 overflow-x-auto pb-1 scrollbar-none sm:mx-0">
          {courses.map((course) => (
            <a
              key={course.id}
              href={course.enrollUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-56 shrink-0 rounded-lg border border-border p-3 transition hover:shadow-md"
            >
              <div
                className="flex h-24 items-center justify-center rounded-md text-white/90"
                style={{ background: `linear-gradient(135deg, ${course.colorFrom}, ${course.colorTo})` }}
              >
                <GraduationCap size={32} strokeWidth={1.5} />
              </div>
              <p className="mt-2 line-clamp-2 text-sm font-medium text-[#0f1111]">{course.title}</p>
              <p className="text-xs text-neutral-500">{course.instructor}</p>
              <div className="mt-1">
                <StarRating rating={course.rating} reviewCount={course.reviewCount} size={12} />
              </div>
              <p className="mt-1 text-sm font-bold text-price">{formatTaka(course.price)}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
