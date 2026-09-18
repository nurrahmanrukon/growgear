import { Metadata } from "next";
import { getAllAudioEntries } from "@/lib/server/blogAudio";
import { BlogAudioAdmin } from "@/components/admin/BlogAudioAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — ব্লগ অডিও" };
export const dynamic = "force-dynamic";

export default function AdminBlogAudioPage() {
  const posts = getAllAudioEntries();
  return <BlogAudioAdmin initialPosts={posts} />;
}
