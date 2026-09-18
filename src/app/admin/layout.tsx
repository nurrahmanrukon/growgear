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
        <div className="container-page flex items-center gap-4 border-t border-white/10 py-2 text-xs font-medium text-white/70">
          <Link href="/admin/blog" className="hover:text-white">
            ব্লগ ফরম্যাট
          </Link>
          <Link href="/admin/product-sections" className="hover:text-white">
            প্রোডাক্ট পেজ সেকশন
          </Link>
          <Link href="/admin/payment-methods" className="hover:text-white">
            পেমেন্ট পদ্ধতি
          </Link>
        </div>
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
