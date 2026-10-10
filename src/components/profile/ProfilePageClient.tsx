"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { BookOpen, Download, Headphones, LogOut, Mail, Phone, User, Layers } from "lucide-react";
import { ProfileAuthModal, AuthedProfile } from "@/components/profile/ProfileAuthModal";
import { Button } from "@/components/ui/Button";

export interface PurchasedPostView {
  slug: string;
  title: string;
  tier: "text" | "audio" | "both";
  unlockedAt: string;
}

export interface PurchasedEbookView {
  slug: string;
  title: string;
  purchasedAt: string;
}

const TIER_LABEL: Record<PurchasedPostView["tier"], string> = {
  text: "টেক্সট",
  audio: "অডিও",
  both: "টেক্সট + অডিও",
};

const TIER_ICON: Record<PurchasedPostView["tier"], typeof BookOpen> = {
  text: BookOpen,
  audio: Headphones,
  both: Layers,
};

export function ProfilePageClient({
  initialProfile,
  purchasedPosts,
  purchasedEbooks,
}: {
  initialProfile: AuthedProfile | null;
  purchasedPosts: PurchasedPostView[];
  purchasedEbooks: PurchasedEbookView[];
}) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  function handleAuthSuccess(authed: AuthedProfile) {
    setProfile(authed);
    setAuthModalOpen(false);
    router.refresh();
  }

  async function handleLogout() {
    await fetch("/api/profile/logout", { method: "POST" }).catch(() => {});
    setProfile(null);
    router.refresh();
  }

  if (!profile) {
    return (
      <div className="mt-6 rounded-lg border border-border bg-surface p-6 text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary-light text-primary">
          <User size={20} />
        </span>
        <h1 className="mt-3 font-display text-lg font-bold text-foreground">আপনার প্রোফাইল</h1>
        <p className="mt-1.5 text-sm text-ink-soft">
          লগইন করে প্রিমিয়াম ব্লগ কিনুন — পরে যেকোনো সময় এখান থেকেই আবার পড়তে/শুনতে পারবেন।
        </p>
        <Button className="mt-4" onClick={() => setAuthModalOpen(true)}>
          লগইন / প্রোফাইল তৈরি করুন
        </Button>

        <ProfileAuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} onSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-5">
      <div className="rounded-lg border border-border bg-surface p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary-dark">
              {profile.name.charAt(0)}
            </span>
            <div>
              <p className="font-display text-base font-bold text-foreground">{profile.name}</p>
              <p className="flex items-center gap-1 text-xs text-ink-soft">
                <Mail size={12} /> {profile.email}
              </p>
              <p className="flex items-center gap-1 text-xs text-ink-soft">
                <Phone size={12} /> {profile.whatsapp}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-ink-soft hover:border-price hover:text-price"
          >
            <LogOut size={13} /> লগআউট
          </button>
        </div>
      </div>

      <div>
        <h2 className="font-display text-sm font-bold text-foreground">আপনার কেনা প্রিমিয়াম লেখা</h2>
        {purchasedPosts.length === 0 ? (
          <p className="mt-2 text-sm text-ink-soft">এখনো কোনো প্রিমিয়াম লেখা কেনা হয়নি।</p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {purchasedPosts.map((p) => {
              const Icon = TIER_ICON[p.tier];
              return (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="flex items-center gap-3 rounded-md border border-border bg-surface p-3 transition hover:border-primary"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{p.title}</p>
                    <p className="text-xs text-ink-faint">{TIER_LABEL[p.tier]}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-display text-sm font-bold text-foreground">আপনার কেনা ইবুক</h2>
        {purchasedEbooks.length === 0 ? (
          <p className="mt-2 text-sm text-ink-soft">এখনো কোনো ইবুক কেনা হয়নি।</p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {purchasedEbooks.map((e) => (
              <Link
                key={e.slug}
                href={`/ebooks/${e.slug}/read`}
                className="flex items-center gap-3 rounded-md border border-border bg-surface p-3 transition hover:border-primary"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                  <Download size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{e.title}</p>
                  <p className="text-xs text-ink-faint">পড়ুন / ডাউনলোড</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
