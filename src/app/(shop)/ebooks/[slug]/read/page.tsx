import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Metadata } from "next";
import Link from "next/link";
import { Download, FileText, Lock } from "lucide-react";
import { getProductBySlugResolved } from "@/lib/server/contentText";
import { verifyProfileSessionToken, PROFILE_COOKIE } from "@/lib/server/profileAuth";
import { hasEbookPurchase } from "@/lib/server/profiles";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlugResolved(slug);
  return { title: product ? `${product.title} — পড়ুন — GrowGear` : "ইবুক — GrowGear" };
}

export default async function EbookReadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlugResolved(slug);
  if (!product || product.category !== "ebook") notFound();

  const token = (await cookies()).get(PROFILE_COOKIE)?.value;
  const email = verifyProfileSessionToken(token);
  const owned = email ? hasEbookPurchase(email, slug) : false;

  if (!owned) {
    return (
      <div className="container-page max-w-xl py-16 text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary-light text-primary">
          <Lock size={20} />
        </span>
        <h1 className="mt-3 font-display text-lg font-bold text-foreground">এই ইবুকটি আপনার কেনা নেই</h1>
        <p className="mt-1.5 text-sm text-ink-soft">
          পড়তে হলে আগে এই ইবুকটি কিনতে হবে এবং যে প্রোফাইল দিয়ে কেনা হয়েছে, সেই প্রোফাইলে লগইন থাকতে হবে।
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Link href={`/ebooks/${slug}`}>
            <Button variant="primary">ইবুকটি দেখুন</Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline">আমার প্রোফাইল</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page max-w-2xl py-8">
      <Breadcrumb
        items={[{ label: "হোম", href: "/" }, { label: "আমার প্রোফাইল", href: "/profile" }, { label: product.title }]}
      />
      <h1 className="mt-4 font-display text-xl font-bold text-foreground sm:text-2xl">{product.title}</h1>
      {product.author && <p className="mt-1 text-sm text-ink-faint">{product.author}</p>}

      <div className="mt-5 rounded-lg border border-border bg-surface p-5">
        <p className="text-sm leading-relaxed text-ink-soft">{product.description}</p>
        <ul className="mt-4 space-y-1.5">
          {product.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-ink-soft">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /> {b}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-surface-muted p-6 text-center">
        <FileText size={28} className="text-ink-faint" />
        <p className="text-sm font-medium text-foreground">সম্পূর্ণ PDF ডাউনলোড শীঘ্রই আসছে</p>
        <p className="text-xs text-ink-soft">ইবুকটি আপনার কেনা — অ্যাডমিন PDF আপলোড করলেই এখান থেকে ডাউনলোড করতে পারবেন।</p>
        <Button variant="outline" disabled className="mt-1">
          <Download size={14} /> ডাউনলোড (শীঘ্রই)
        </Button>
      </div>
    </div>
  );
}
