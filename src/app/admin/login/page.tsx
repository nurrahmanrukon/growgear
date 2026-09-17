"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "লগইন করা যায়নি");
        return;
      }
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("নেটওয়ার্ক সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-sm">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary">
          <Lock size={18} />
        </div>
        <h1 className="mt-3 text-center font-display text-lg font-bold text-foreground">অ্যাডমিন লগইন</h1>
        <p className="mt-1 text-center text-xs text-ink-faint">শুধুমাত্র অনুমোদিত কর্মীদের জন্য</p>

        <div className="mt-5">
          <input
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="পাসওয়ার্ড"
            className="w-full rounded border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          {error && <p className="mt-2 text-xs text-price">{error}</p>}
        </div>

        <Button type="submit" variant="primary" fullWidth disabled={submitting} className="mt-4">
          {submitting ? "লগইন হচ্ছে..." : "লগইন করুন"}
        </Button>
      </form>
    </div>
  );
}
