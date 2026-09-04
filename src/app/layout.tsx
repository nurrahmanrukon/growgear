import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "GrowGear — বই, ইবুক ও প্রোডাক্টিভিটি গিয়ার",
  description:
    "GrowGear থেকে কিনুন হার্ডকভার বই, ইবুক ও প্রোডাক্টিভিটি গিয়ার — সারাদেশে দ্রুত ডেলিভারি।",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bn" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@600;700&family=Hind+Siliguri:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`:root{--font-display:'Baloo Da 2';--font-body:'Hind Siliguri';}`}</style>
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
