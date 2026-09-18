"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  LogOut,
  Search,
  Download,
  Check,
  X,
  Truck,
  RotateCcw,
  Package,
  Phone,
  MapPin,
  Mail,
  CreditCard,
} from "lucide-react";
import { formatTaka, toBengaliNumber } from "@/lib/format";

type OrderStatus = "pending" | "confirmed" | "rejected" | "delivered";

interface OrderItem {
  productId: string;
  slug?: string;
  title: string;
  price: number;
  quantity: number;
}
interface OrderRecord {
  orderId: string;
  createdAt: string;
  status: OrderStatus;
  statusUpdatedAt: string;
  customer: { name: string; phone: string; email?: string; address?: string; area?: string };
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  promoCode?: string;
  total: number;
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "অপেক্ষমাণ",
  confirmed: "কনফার্ম",
  rejected: "বাতিল",
  delivered: "ডেলিভারি সম্পন্ন",
};
const STATUS_COLOR: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-primary-light text-primary-dark",
  rejected: "bg-price/10 text-price",
  delivered: "bg-success/15 text-success",
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function daysAgoStr(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export function OrdersAdmin({ initialOrders }: { initialOrders: OrderRecord[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      if (search.trim()) params.set("q", search.trim());
      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await res.json();
      setOrders(data.orders ?? []);
    } catch {
      // keep whatever was already shown
    } finally {
      setLoading(false);
    }
  }

  function applyQuickRange(range: "today" | "yesterday" | "week" | "all") {
    if (range === "today") {
      setFrom(todayStr());
      setTo(todayStr());
    } else if (range === "yesterday") {
      setFrom(daysAgoStr(1));
      setTo(daysAgoStr(1));
    } else if (range === "week") {
      setFrom(daysAgoStr(6));
      setTo(todayStr());
    } else {
      setFrom("");
      setTo("");
    }
    setTimeout(refresh, 0);
  }

  const stats = useMemo(() => {
    const today = todayStr();
    const todays = orders.filter((o) => o.createdAt.slice(0, 10) === today);
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      todayCount: todays.length,
      todayRevenue: todays.filter((o) => o.status !== "rejected").reduce((s, o) => s + o.total, 0),
    };
  }, [orders]);

  const selectedOrder = orders.find((o) => o.orderId === selected) ?? null;

  async function changeStatus(orderId: string, status: OrderStatus) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) return;
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.orderId === orderId ? updated : o)));
    } finally {
      setSaving(false);
    }
  }

  function exportUrl() {
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (search.trim()) params.set("q", search.trim());
    return `/api/admin/orders/export?${params.toString()}`;
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">অর্ডার ট্র্যাকিং</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            তারিখ/সময় অনুযায়ী সব অর্ডার দেখুন, কাস্টমারের বিস্তারিত তথ্য দেখুন, অর্ডার কনফার্ম বা বাতিল করুন, আর
            ডেলিভারি টিমের সাথে শেয়ার করার জন্য CSV ফাইল ডাউনলোড করুন।
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:bg-surface-muted"
        >
          <LogOut size={14} /> লগআউট
        </button>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-lg border border-border bg-surface p-3">
          <p className="text-[11px] text-ink-faint">মোট অর্ডার</p>
          <p className="mt-0.5 text-lg font-bold text-foreground">{toBengaliNumber(stats.total)}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-3">
          <p className="text-[11px] text-ink-faint">আজকের অর্ডার</p>
          <p className="mt-0.5 text-lg font-bold text-foreground">{toBengaliNumber(stats.todayCount)}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-3">
          <p className="text-[11px] text-ink-faint">আজকের আয়</p>
          <p className="mt-0.5 text-lg font-bold text-price">{formatTaka(stats.todayRevenue)}</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-[11px] text-amber-700">অপেক্ষমাণ</p>
          <p className="mt-0.5 text-lg font-bold text-amber-700">{toBengaliNumber(stats.pending)}</p>
        </div>
        <div className="rounded-lg border border-border bg-primary-light p-3">
          <p className="text-[11px] text-primary-dark">কনফার্ম</p>
          <p className="mt-0.5 text-lg font-bold text-primary-dark">{toBengaliNumber(stats.confirmed)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-5 flex flex-wrap items-end gap-2 rounded-lg border border-border bg-surface p-3">
        <div className="relative">
          <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && refresh()}
            placeholder="নাম, ফোন বা অর্ডার আইডি দিয়ে খুঁজুন..."
            className="w-56 rounded-md border border-border py-1.5 pl-8 pr-2.5 text-xs outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <label className="text-xs text-ink-soft">
          থেকে
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="ml-1.5 rounded-md border border-border px-2 py-1.5 text-xs outline-none"
          />
        </label>
        <label className="text-xs text-ink-soft">
          পর্যন্ত
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="ml-1.5 rounded-md border border-border px-2 py-1.5 text-xs outline-none"
          />
        </label>
        <div className="flex gap-1.5">
          {(["today", "yesterday", "week", "all"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => applyQuickRange(r)}
              className="rounded-md border border-border px-2.5 py-1.5 text-[11px] font-medium text-ink-soft hover:border-primary hover:text-primary"
            >
              {r === "today" ? "আজ" : r === "yesterday" ? "গতকাল" : r === "week" ? "এই সপ্তাহ" : "সব সময়"}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["all", "pending", "confirmed", "rejected", "delivered"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`rounded-md border px-2.5 py-1.5 text-[11px] font-medium ${
                statusFilter === s
                  ? "border-primary bg-primary-light text-primary-dark"
                  : "border-border text-ink-soft hover:border-primary/50"
              }`}
            >
              {s === "all" ? "সব স্ট্যাটাস" : STATUS_LABEL[s]}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? "লোড হচ্ছে..." : "ফিল্টার করুন"}
        </button>
        <a
          href={exportUrl()}
          className="ml-auto flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-primary hover:border-primary"
        >
          <Download size={13} /> ডেলিভারির জন্য CSV ডাউনলোড
        </a>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* Orders table */}
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-muted text-[11px] text-ink-faint">
              <tr>
                <th className="px-3 py-2.5 font-medium">অর্ডার আইডি</th>
                <th className="px-3 py-2.5 font-medium">তারিখ/সময়</th>
                <th className="px-3 py-2.5 font-medium">কাস্টমার</th>
                <th className="px-3 py-2.5 font-medium">মোট</th>
                <th className="px-3 py-2.5 font-medium">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-ink-faint">
                    কোনো অর্ডার পাওয়া যায়নি
                  </td>
                </tr>
              )}
              {orders.map((o) => (
                <tr
                  key={o.orderId}
                  onClick={() => setSelected(o.orderId)}
                  className={`cursor-pointer border-t border-border transition hover:bg-surface-muted ${
                    selected === o.orderId ? "bg-primary-light/50" : ""
                  }`}
                >
                  <td className="px-3 py-2.5 font-medium text-foreground">{o.orderId}</td>
                  <td className="px-3 py-2.5 text-ink-soft">
                    {new Date(o.createdAt).toLocaleString("bn-BD", { dateStyle: "medium", timeStyle: "short" })}
                  </td>
                  <td className="px-3 py-2.5 text-ink-soft">
                    <p className="font-medium text-foreground">{o.customer.name}</p>
                    <p className="text-[11px]">{o.customer.phone}</p>
                  </td>
                  <td className="px-3 py-2.5 font-semibold text-price">{formatTaka(o.total)}</td>
                  <td className="px-3 py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_COLOR[o.status]}`}>
                      {STATUS_LABEL[o.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        <div>
          {!selectedOrder && (
            <div className="flex h-full min-h-[300px] items-center justify-center rounded-lg border border-dashed border-border text-sm text-ink-faint">
              বিস্তারিত দেখতে একটা অর্ডারে ক্লিক করুন
            </div>
          )}

          {selectedOrder && (
            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center justify-between">
                <p className="font-display text-sm font-bold text-foreground">{selectedOrder.orderId}</p>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_COLOR[selectedOrder.status]}`}>
                  {STATUS_LABEL[selectedOrder.status]}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-ink-faint">
                {new Date(selectedOrder.createdAt).toLocaleString("bn-BD", { dateStyle: "full", timeStyle: "short" })}
              </p>

              <div className="mt-3 space-y-1.5 border-t border-border pt-3 text-xs">
                <p className="flex items-center gap-1.5 font-medium text-foreground">{selectedOrder.customer.name}</p>
                <p className="flex items-center gap-1.5 text-ink-soft">
                  <Phone size={12} /> {selectedOrder.customer.phone}
                </p>
                {selectedOrder.customer.email && (
                  <p className="flex items-center gap-1.5 text-ink-soft">
                    <Mail size={12} /> {selectedOrder.customer.email}
                  </p>
                )}
                {selectedOrder.customer.address && (
                  <p className="flex items-start gap-1.5 text-ink-soft">
                    <MapPin size={12} className="mt-0.5 shrink-0" />
                    <span>
                      {selectedOrder.customer.address}
                      {selectedOrder.customer.area && ` — ${selectedOrder.customer.area}`}
                    </span>
                  </p>
                )}
                <p className="flex items-center gap-1.5 text-ink-soft">
                  <CreditCard size={12} /> {selectedOrder.paymentMethod}
                </p>
              </div>

              <div className="mt-3 space-y-1.5 border-t border-border pt-3">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 text-xs">
                    <span className="flex items-center gap-1.5 text-ink-soft">
                      <Package size={12} className="shrink-0" />
                      {item.title} × {toBengaliNumber(item.quantity)}
                    </span>
                    <span className="shrink-0 font-medium text-foreground">{formatTaka(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 space-y-1 border-t border-border pt-3 text-xs">
                <div className="flex justify-between text-ink-soft">
                  <span>সাবটোটাল</span>
                  <span>{formatTaka(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>ছাড় {selectedOrder.promoCode ? `(${selectedOrder.promoCode})` : ""}</span>
                    <span>-{formatTaka(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-ink-soft">
                  <span>ডেলিভারি চার্জ</span>
                  <span>{formatTaka(selectedOrder.deliveryFee)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-1.5 text-sm font-bold text-price">
                  <span>মোট</span>
                  <span>{formatTaka(selectedOrder.total)}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={saving || selectedOrder.status === "confirmed"}
                  onClick={() => changeStatus(selectedOrder.orderId, "confirmed")}
                  className="flex items-center justify-center gap-1.5 rounded-md bg-cta px-3 py-2 text-xs font-semibold text-white hover:bg-cta-dark disabled:opacity-50"
                >
                  <Check size={14} /> কনফার্ম করুন
                </button>
                <button
                  type="button"
                  disabled={saving || selectedOrder.status === "rejected"}
                  onClick={() => changeStatus(selectedOrder.orderId, "rejected")}
                  className="flex items-center justify-center gap-1.5 rounded-md border border-price/40 bg-price/10 px-3 py-2 text-xs font-semibold text-price hover:bg-price/20 disabled:opacity-50"
                >
                  <X size={14} /> বাতিল করুন
                </button>
                <button
                  type="button"
                  disabled={saving || selectedOrder.status !== "confirmed"}
                  onClick={() => changeStatus(selectedOrder.orderId, "delivered")}
                  className="flex items-center justify-center gap-1.5 rounded-md border border-success/40 bg-success/10 px-3 py-2 text-xs font-semibold text-success hover:bg-success/20 disabled:opacity-50"
                >
                  <Truck size={14} /> ডেলিভারি সম্পন্ন
                </button>
                <button
                  type="button"
                  disabled={saving || selectedOrder.status === "pending"}
                  onClick={() => changeStatus(selectedOrder.orderId, "pending")}
                  className="flex items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:bg-surface-muted disabled:opacity-50"
                >
                  <RotateCcw size={14} /> অপেক্ষমাণে ফিরান
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
