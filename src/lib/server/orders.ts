import fs from "fs";
import path from "path";
import { decrementStockForItems } from "@/lib/server/inventory";

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

function readStore(): Record<string, OrderRecord> {
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
  } catch {
    return {};
  }
}

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
  return order;
}

export function getOrder(orderId: string): OrderRecord | undefined {
  return readStore()[orderId];
}

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
  const wasConfirmed = order.status === "confirmed";
  order.status = status;
  order.statusUpdatedAt = new Date().toISOString();
  store[orderId] = order;
  writeStore(store);
  // Decrement inventory exactly once, the moment an order first becomes confirmed.
  if (status === "confirmed" && !wasConfirmed) {
    decrementStockForItems(order.items);
  }
  return order;
}
