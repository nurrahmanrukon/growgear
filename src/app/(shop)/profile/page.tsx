import { cookies } from "next/headers";
import { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { verifyProfileSessionToken, PROFILE_COOKIE } from "@/lib/server/profileAuth";
import { getProfile } from "@/lib/server/profiles";
import { getBlogPostBySlugResolved, getProductBySlugResolved } from "@/lib/server/contentText";
import { ProfilePageClient, PurchasedEbookView, PurchasedPostView } from "@/components/profile/ProfilePageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "আমার প্রোফাইল — GrowGear" };

export default async function ProfilePage() {
  const token = (await cookies()).get(PROFILE_COOKIE)?.value;
  const email = verifyProfileSessionToken(token);
  const profile = email ? getProfile(email) : undefined;

  const purchasedPosts: PurchasedPostView[] = (profile?.purchases ?? [])
    .map((purchase) => {
      const post = getBlogPostBySlugResolved(purchase.slug);
      if (!post) return null;
      return { slug: purchase.slug, title: post.title, tier: purchase.tier, unlockedAt: purchase.unlockedAt };
    })
    .filter((x): x is PurchasedPostView => x !== null);

  const purchasedEbooks: PurchasedEbookView[] = (profile?.ebooks ?? []).map((purchase) => ({
    slug: purchase.slug,
    title: getProductBySlugResolved(purchase.slug)?.title ?? purchase.title,
    purchasedAt: purchase.purchasedAt,
  }));

  return (
    <div className="container-page max-w-2xl py-8">
      <Breadcrumb items={[{ label: "হোম", href: "/" }, { label: "আমার প্রোফাইল" }]} />
      <ProfilePageClient
        initialProfile={profile ? { email: profile.email, name: profile.name, whatsapp: profile.whatsapp } : null}
        purchasedPosts={purchasedPosts}
        purchasedEbooks={purchasedEbooks}
      />
    </div>
  );
}
