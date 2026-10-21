import fs from "fs";
import path from "path";

export interface NewsletterSubscriber {
  email: string;
  topics: string[];
  subscribedAt: string;
}

const STORE_PATH = path.join(process.cwd(), "data", "newsletter-subscribers.json");

function readStore(): Record<string, NewsletterSubscriber> {
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, NewsletterSubscriber>) {
  fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

/** Upserts by email (case-insensitive) — re-subscribing just refreshes the chosen topics. */
export function addNewsletterSubscriber(email: string, topics: string[]): NewsletterSubscriber {
  const key = email.trim().toLowerCase();
  const store = readStore();
  const entry: NewsletterSubscriber = {
    email: email.trim(),
    topics,
    subscribedAt: store[key]?.subscribedAt ?? new Date().toISOString(),
  };
  store[key] = entry;
  writeStore(store);
  return entry;
}
