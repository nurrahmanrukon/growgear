import { Metadata } from "next";
import { getCoursePageSettings } from "@/lib/server/coursePageSettings";
import { CoursePageAdmin } from "@/components/admin/CoursePageAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — কোর্স পেজ" };
export const dynamic = "force-dynamic";

export default function AdminCoursePagePage() {
  const settings = getCoursePageSettings();
  return <CoursePageAdmin initial={settings} />;
}
