"use client";

import { FormEvent, useState } from "react";
import { KeyRound, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface AuthedProfile {
  email: string;
  name: string;
  whatsapp: string;
}

export function ProfileAuthModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: (profile: AuthedProfile) => void;
}) {
  const [step, setStep] = useState<"details" | "otp">("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [code, setCode] = useState("");
  const [challenge, setChallenge] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function reset() {
    setStep("details");
    setCode("");
    setChallenge("");
    setDevCode(null);
    setError("");
    setLoading(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleRequestOtp(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("নাম আবশ্যক");
    if (!EMAIL_PATTERN.test(email.trim())) return setError("সঠিক ইমেইল ঠিকানা দিন");
    if (whatsapp.trim().length < 11) return setError("সঠিক হোয়াটসঅ্যাপ নম্বর দিন");

    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/profile/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), whatsapp: whatsapp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "কিছু ভুল হয়েছে, আবার চেষ্টা করুন");
        return;
      }
      setChallenge(data.challenge);
      setDevCode(data.devCode ?? null);
      setStep("otp");
    } catch {
      setError("নেটওয়ার্ক সমস্যা, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    if (code.trim().length !== 6) return setError("৬ ডিজিটের কোড দিন");

    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/profile/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challenge, code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "কোড সঠিক নয়");
        return;
      }
      onSuccess(data.profile);
      reset();
    } catch {
      setError("নেটওয়ার্ক সমস্যা, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose}>
      {step === "details" ? (
        <>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-primary">
            <User size={14} /> প্রোফাইল তৈরি করুন
          </div>
          <h2 className="mt-1.5 font-display text-lg font-bold text-foreground">আপনার তথ্য দিন</h2>
          <p className="mt-1 text-xs text-ink-soft">
            একবার তথ্য দিলে আপনার প্রোফাইল থেকে কেনা সব প্রিমিয়াম লেখা যেকোনো সময় পড়তে পারবেন।
          </p>

          <form onSubmit={handleRequestOtp} className="mt-4 flex flex-col gap-2.5">
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম"
                className="w-full rounded-md border border-border bg-surface px-3 py-2.5 pl-8 text-sm outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ইমেইল ঠিকানা"
                className="w-full rounded-md border border-border bg-surface px-3 py-2.5 pl-8 text-sm outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                inputMode="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="হোয়াটসঅ্যাপ নম্বর"
                className="w-full rounded-md border border-border bg-surface px-3 py-2.5 pl-8 text-sm outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            {error && <p className="text-xs text-price">{error}</p>}
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? "পাঠানো হচ্ছে..." : "ভেরিফিকেশন কোড পাঠান"}
            </Button>
          </form>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-primary">
            <ShieldCheck size={14} /> কোড ভেরিফাই করুন
          </div>
          <h2 className="mt-1.5 font-display text-lg font-bold text-foreground">আপনার ইমেইল দেখুন</h2>
          <p className="mt-1 text-xs text-ink-soft">
            {email} ঠিকানায় ৬ ডিজিটের একটি কোড পাঠানো হয়েছে। কোডটি নিচে লিখুন।
          </p>
          {devCode && (
            <p className="mt-2 rounded-md bg-surface-muted px-3 py-2 text-xs text-ink-soft">
              ডেভ মোড (ইমেইল সার্ভিস কনফিগার করা নেই) — টেস্ট কোড: <strong>{devCode}</strong>
            </p>
          )}

          <form onSubmit={handleVerifyOtp} className="mt-4 flex flex-col gap-2.5">
            <div className="relative">
              <KeyRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="৬ ডিজিটের কোড"
                className="w-full rounded-md border border-border bg-surface px-3 py-2.5 pl-8 text-center text-lg font-semibold tracking-widest outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            {error && <p className="text-xs text-price">{error}</p>}
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? "যাচাই হচ্ছে..." : "ভেরিফাই করুন"}
            </Button>
            <button
              type="button"
              onClick={() => setStep("details")}
              className="text-center text-xs text-link hover:text-link-hover hover:underline"
            >
              তথ্য ঠিক করুন
            </button>
          </form>
        </>
      )}
    </Modal>
  );
}
