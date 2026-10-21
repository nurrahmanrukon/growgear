import { NextRequest, NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/data/blog";
import { addNewsletterSubscriber } from "@/lib/server/newsletterSubscribers";
import { getNewsletterSettings } from "@/lib/server/newsletterSettings";
import { sendTransactionalEmail } from "@/lib/server/mailer";
import { checkRateLimit, clientIp, RATE_LIMIT_MESSAGE } from "@/lib/server/rateLimit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://growgear.example.com").replace(/\/$/, "");

export async function POST(req: NextRequest) {
  const rate = checkRateLimit(`newsletter-subscribe:${clientIp(req)}`, 8, 10 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json({ error: RATE_LIMIT_MESSAGE }, { status: 429 });
  }

  let body: { email?: string; topics?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  const email = body.email?.trim();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "সঠিক ইমেইল ঠিকানা দিন" }, { status: 400 });
  }
  const topics = Array.isArray(body.topics) ? body.topics.filter((t): t is string => typeof t === "string") : [];

  addNewsletterSubscriber(email, topics);

  const { premiumBlogSlug } = getNewsletterSettings();
  const post = premiumBlogSlug ? getBlogPostBySlug(premiumBlogSlug) : undefined;
  if (!post) {
    return NextResponse.json({ ok: true, blogSent: false });
  }

  const subject = `আপনার ফ্রি প্রিমিয়াম ব্লগ: ${post.title}`;
  const text = [
    `নিউজলেটারে যুক্ত হওয়ার জন্য ধন্যবাদ! প্রতিশ্রুতি অনুযায়ী আমাদের একটি প্রিমিয়াম ব্লগ সম্পূর্ণ ফ্রি আপনার জন্য।`,
    ``,
    `${post.title}`,
    ``,
    ...post.content,
    ``,
    `অনলাইনে পড়তে: ${SITE_URL}/blog/${post.slug}`,
  ].join("\n");

  const blogSent = await sendTransactionalEmail(email, subject, text);
  return NextResponse.json({ ok: true, blogSent, blogTitle: blogSent ? post.title : undefined });
}
