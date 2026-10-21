import fs from "fs";
import path from "path";
import { cache } from "react";
import { decrementStockForItems, incrementStockForItems } from "@/lib/server/inventory";

export type OrderStatus = "pending" | "confirmed" | "rejected" | "delivered";

export interface OrderItem {
  productId: string;
  slug?: string;
  title: string;
  price: number;
  quantity: number;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  area?: string;
}

export interface OrderRecord {
  orderId: string;
  createdAt: string;
  status: OrderStatus;
  statusUpdatedAt: string;
  customer: OrderCustomer;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  promoCode?: string;
  total: number;
}

const STORE_PATH = path.join(process.cwd(), "data", "orders.json");

// Deduped per request — resolveProducts() calls getSalesCounts() for every product it
// resolves, and a single page render resolves the catalog many times over (see the
// matching note in contentText.ts), so without this every one of those calls would
// re-read and re-parse this file. Safe: every write path here reads once, mutates the
// in-memory object, writes it back, and returns that same object — nothing re-reads
// the store afterward expecting to see its own write.
const readStore = cache((): Record<string, OrderRecord> => {
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
  } catch {
    return {};
  }
});

function writeStore(store: Record<string, OrderRecord>) {
  fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function generateOrderId(existing: Record<string, OrderRecord>): string {
  let id = `GG${Date.now().toString().slice(-8)}`;
  while (existing[id]) {
    id = `GG${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 10)}`;
  }
  return id;
}

export function createOrder(input: {
  customer: OrderCustomer;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  promoCode?: string;
  total: number;
}): OrderRecord {
  const store = readStore();
  const now = new Date().toISOString();
  const orderId = generateOrderId(store);
  const order: OrderRecord = {
    orderId,
    createdAt: now,
    status: "pending",
    statusUpdatedAt: now,
    ...input,
  };
  store[orderId] = order;
  writeStore(store);
  // Stock is reserved the moment an order is placed, not just when an admin later confirms
  // it — otherwise two overlapping pending orders can both succeed against the same last
  // unit, and the admin only discovers the oversell when trying to confirm the second one.
  decrementStockForItems(order.items);
  return order;
}

export function getOrder(orderId: string): OrderRecord | undefined {
  return readStore()[orderId];
}

function normalizedPhoneTail(phone: string): string {
  return phone.replace(/\D/g, "").slice(-10);
}

/** Public order lookup for the customer-facing tracking page — requires the order ID AND a
 *  matching phone number so a guessed/leaked order ID alone can't pull up someone else's order. */
export function findOrderForTracking(orderId: string, phone: string): OrderRecord | undefined {
  const order = readStore()[orderId.trim().toUpperCase()];
  if (!order) return undefined;
  const tail = normalizedPhoneTail(phone);
  if (!tail || normalizedPhoneTail(order.customer.phone) !== tail) return undefined;
  return order;
}

/** Aggregate quantity sold per product across orders, so listings can surface real
 *  best-sellers instead of the seeded "bestSeller" flag. Rejected orders never happened,
 *  so they're excluded; pending/confirmed/delivered all reflect demonstrated demand. */
export const getSalesCounts = cache((): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const order of Object.values(readStore())) {
    if (order.status === "rejected") continue;
    for (const item of order.items) {
      counts[item.productId] = (counts[item.productId] ?? 0) + item.quantity;
    }
  }
  return counts;
});

export function getAllOrders(): OrderRecord[] {
  return Object.values(readStore()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export interface OrderFilters {
  status?: string | null;
  from?: string | null;
  to?: string | null;
  q?: string | null;
}

export function filterOrders(orders: OrderRecord[], params: OrderFilters): OrderRecord[] {
  let result = orders;
  if (params.status && params.status !== "all") {
    result = result.filter((o) => o.status === params.status);
  }
  if (params.from) {
    const fromTime = new Date(params.from + "T00:00:00").getTime();
    result = result.filter((o) => new Date(o.createdAt).getTime() >= fromTime);
  }
  if (params.to) {
    const toTime = new Date(params.to + "T23:59:59.999").getTime();
    result = result.filter((o) => new Date(o.createdAt).getTime() <= toTime);
  }
  if (params.q) {
    const q = params.q.trim().toLowerCase();
    result = result.filter(
      (o) =>
        o.orderId.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.toLowerCase().includes(q)
    );
  }
  return result;
}

export function updateOrderStatus(orderId: string, status: OrderStatus): OrderRecord {
  const store = readStore();
  const order = store[orderId];
  if (!order) throw new Error("অর্ডার পাওয়া যায়নি");
  // Stock is held for every order that isn't rejected (reserved up front at creation) and
  // released the moment it's rejected; re-confirming a previously rejected order re-reserves it.
  const wasHeld = order.status !== "rejected";
  const willBeHeld = status !== "rejected";
  order.status = status;
  order.statusUpdatedAt = new Date().toISOString();
  store[orderId] = order;
  writeStore(store);
  if (wasHeld && !willBeHeld) {
    incrementStockForItems(order.items);
  } else if (!wasHeld && willBeHeld) {
    decrementStockForItems(order.items);
  }
  return order;
}
