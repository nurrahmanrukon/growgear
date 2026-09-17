import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <div className="container-page flex flex-col items-center gap-3 py-20 text-center">
      <CheckCircle2 size={56} className="text-success" />
      <h1 className="text-xl font-bold text-foreground">অর্ডার সফলভাবে সম্পন্ন হয়েছে!</h1>
      {orderId && (
        <p className="text-sm text-neutral-600">
          আপনার অর্ডার আইডি: <span className="font-semibold text-navy-light">{orderId}</span>
        </p>
      )}
      <p className="max-w-md text-sm text-neutral-500">
        আমাদের একজন প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন। পণ্য হাতে পেয়ে টাকা পরিশোধ করুন।
      </p>
      <Link href="/" className="mt-2">
        <Button variant="primary">কেনাকাটা চালিয়ে যান</Button>
      </Link>
    </div>
  );
}
