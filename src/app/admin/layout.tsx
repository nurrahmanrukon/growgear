import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <div style={{ background: "#131921" }} className="text-white">
        <div className="container-page flex items-center justify-between py-3">
          <Link href="/admin" className="font-display text-base font-bold">
            Grow<span className="text-primary-light">Gear</span> অ্যাডমিন
          </Link>
          <Link href="/" className="text-xs text-white/70 hover:text-white">
            ← মূল সাইটে ফিরুন
          </Link>
        </div>
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
