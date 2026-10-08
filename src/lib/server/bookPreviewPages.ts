import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/data/products";

export interface BookPreviewPage {
  id: string;
  fileName: string;
  mimeType: string;
  ext: string;
  sizeBytes: number;
  uploadedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(process.cwd(), "data", "book-preview-pages.json");
const FILES_DIR = path.join(process.cwd(), "data", "media", "book-preview-pages");

const IMAGE_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export const MAX_PAGE_BYTES = 8 * 1024 * 1024; // 8MB
export const MAX_PAGES = 30;

type Store = Record<string, BookPreviewPage[]>;

function readStore(): Store {
  try {
    const data = JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
    return data && typeof data === "object" && !Array.isArray(data) ? data : {};
  } catch {
    return {};
  }
}

function writeStore(store: Store) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function isBookSlug(slug: string): boolean {
  const product = getProductBySlug(slug);
  return Boolean(product && product.category === "book");
}

function slugDir(slug: string): string {
  return path.join(FILES_DIR, slug);
}

function pageFilePath(slug: string, id: string, ext: string): string {
  return path.join(FILES_DIR, slug, `${id}.${ext}`);
}

function resolveExtension(fileName: string, mimeType: string): string | null {
  const fromName = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (fromName in IMAGE_TYPES) return fromName;
  const fromMime = Object.entries(IMAGE_TYPES).find(([, m]) => m === mimeType)?.[0];
  return fromMime ?? null;
}

export function getPreviewPages(slug: string): BookPreviewPage[] {
  return readStore()[slug] ?? [];
}

export function getPreviewPageUrls(slug: string): string[] {
  return getPreviewPages(slug).map(
    (p) => `/api/media/book-preview/${slug}/${p.id}?v=${encodeURIComponent(p.uploadedAt)}`
  );
}

export function addPreviewPage(slug: string, fileName: string, mimeType: string, bytes: Buffer): BookPreviewPage {
  if (!isBookSlug(slug)) throw new Error("শুধু বই এর জন্য পাতা যোগ করা যাবে");
  const ext = resolveExtension(fileName, mimeType);
  if (!ext) throw new Error("শুধু jpg, png, webp ফরম্যাট আপলোড করা যাবে");
  if (bytes.length > MAX_PAGE_BYTES) throw new Error("ছবির আকার ৮ এমবি-র বেশি হতে পারবে না");

  const store = readStore();
  const pages = store[slug] ?? [];
  if (pages.length >= MAX_PAGES) throw new Error(`সর্বোচ্চ ${MAX_PAGES}টি পাতা যোগ করা যাবে`);

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  fs.mkdirSync(slugDir(slug), { recursive: true });
  fs.writeFileSync(pageFilePath(slug, id, ext), bytes);

  const entry: BookPreviewPage = {
    id,
    fileName,
    mimeType: IMAGE_TYPES[ext],
    ext,
    sizeBytes: bytes.length,
    uploadedAt: new Date().toISOString(),
  };
  store[slug] = [...pages, entry];
  writeStore(store);
  return entry;
}

export function removePreviewPage(slug: string, id: string) {
  const store = readStore();
  const pages = store[slug] ?? [];
  const entry = pages.find((p) => p.id === id);
  if (!entry) throw new Error("পাতা পাওয়া যায়নি");
  const fp = pageFilePath(slug, id, entry.ext);
  if (fs.existsSync(/*turbopackIgnore: true*/ fp)) fs.unlinkSync(/*turbopackIgnore: true*/ fp);
  store[slug] = pages.filter((p) => p.id !== id);
  writeStore(store);
}

export function reorderPreviewPages(slug: string, order: string[]) {
  const store = readStore();
  const pages = store[slug] ?? [];
  if (order.length !== pages.length || new Set(order).size !== order.length) {
    throw new Error("অবৈধ ক্রম");
  }
  const byId = new Map(pages.map((p) => [p.id, p]));
  const reordered: BookPreviewPage[] = [];
  for (const id of order) {
    const page = byId.get(id);
    if (!page) throw new Error("অবৈধ ক্রম");
    reordered.push(page);
  }
  store[slug] = reordered;
  writeStore(store);
}

export async function handlePreviewPageUpload(
  slug: string,
  req: NextRequest
): Promise<{ ok: true; entry: BookPreviewPage } | { ok: false; response: NextResponse }> {
  if (!isBookSlug(slug)) {
    return { ok: false, response: NextResponse.json({ error: "শুধু বই এর জন্য পাতা যোগ করা যাবে" }, { status: 400 }) };
  }
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return { ok: false, response: NextResponse.json({ error: "অবৈধ আপলোড" }, { status: 400 }) };
  }
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, response: NextResponse.json({ error: "কোনো ফাইল পাওয়া যায়নি" }, { status: 400 }) };
  }
  if (file.size === 0) {
    return { ok: false, response: NextResponse.json({ error: "ফাইলটি খালি" }, { status: 400 }) };
  }
  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const entry = addPreviewPage(slug, file.name, file.type, bytes);
    return { ok: true, entry };
  } catch (err) {
    return {
      ok: false,
      response: NextResponse.json({ error: err instanceof Error ? err.message : "আপলোড করা যায়নি" }, { status: 400 }),
    };
  }
}

export function servePreviewPageFile(slug: string, id: string, req: NextRequest): NextResponse | Response {
  const entry = getPreviewPages(slug).find((p) => p.id === id);
  const fp = entry ? pageFilePath(slug, id, entry.ext) : null;
  if (!entry || !fp || !fs.existsSync(/*turbopackIgnore: true*/ fp)) {
    return NextResponse.json({ error: "পাতা পাওয়া যায়নি" }, { status: 404 });
  }
  const { size } = fs.statSync(/*turbopackIgnore: true*/ fp);

  const range = req.headers.get("range");
  if (range) {
    const match = /bytes=(\d+)-(\d*)/.exec(range);
    const start = match ? Number(match[1]) : 0;
    const end = match && match[2] ? Number(match[2]) : size - 1;
    const stream = Readable.toWeb(fs.createReadStream(/*turbopackIgnore: true*/ fp, { start, end })) as ReadableStream;
    return new NextResponse(stream, {
      status: 206,
      headers: {
        "Content-Type": entry.mimeType,
        "Content-Length": String(end - start + 1),
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  const stream = Readable.toWeb(fs.createReadStream(/*turbopackIgnore: true*/ fp)) as ReadableStream;
  return new NextResponse(stream, {
    headers: {
      "Content-Type": entry.mimeType,
      "Content-Length": String(size),
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

export function getAllBookPreviewEntries() {
  const store = readStore();
  return Object.entries(store).map(([slug, pages]) => ({ slug, count: pages.length }));
}
