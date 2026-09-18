import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { NextRequest, NextResponse } from "next/server";
import { allProducts } from "@/lib/data/products";
import { blogPosts } from "@/lib/data/blog";

export type MediaKind = "product-image" | "product-video" | "blog-image";

export interface MediaEntry {
  fileName: string;
  mimeType: string;
  ext: string;
  sizeBytes: number;
  uploadedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(process.cwd(), "data", "media.json");

// Written as a switch with literal path.join() calls (not a dynamic Record lookup)
// so Next's file tracer can statically scope these to the data/ directory instead
// of bundling the whole project as a server dependency.
function dirFor(kind: MediaKind): string {
  switch (kind) {
    case "product-image":
      return path.join(process.cwd(), "data", "media", "product-images");
    case "product-video":
      return path.join(process.cwd(), "data", "media", "product-videos");
    case "blog-image":
      return path.join(process.cwd(), "data", "media", "blog-images");
  }
}

const IMAGE_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};
const VIDEO_TYPES: Record<string, string> = {
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
};

const ALLOWED_FOR: Record<MediaKind, Record<string, string>> = {
  "product-image": IMAGE_TYPES,
  "blog-image": IMAGE_TYPES,
  "product-video": VIDEO_TYPES,
};

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB
export const MAX_VIDEO_BYTES = 60 * 1024 * 1024; // 60MB

type Store = Partial<Record<MediaKind, Record<string, MediaEntry>>>;

function readStore(): Store {
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function writeStore(store: Store) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function validSlug(kind: MediaKind, slug: string): boolean {
  if (kind === "blog-image") return blogPosts.some((p) => p.slug === slug);
  return allProducts.some((p) => p.slug === slug);
}

function filePath(kind: MediaKind, slug: string, ext: string): string {
  const fname = `${slug}.${ext}`;
  switch (kind) {
    case "product-image":
      return path.join(process.cwd(), "data", "media", "product-images", fname);
    case "product-video":
      return path.join(process.cwd(), "data", "media", "product-videos", fname);
    case "blog-image":
      return path.join(process.cwd(), "data", "media", "blog-images", fname);
  }
}

export function resolveExtension(kind: MediaKind, fileName: string, mimeType: string): string | null {
  const allowed = ALLOWED_FOR[kind];
  const fromName = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (fromName in allowed) return fromName;
  const fromMime = Object.entries(allowed).find(([, m]) => m === mimeType)?.[0];
  return fromMime ?? null;
}

export function getMediaEntry(kind: MediaKind, slug: string): MediaEntry | null {
  return readStore()[kind]?.[slug] ?? null;
}

export function getMediaFilePath(kind: MediaKind, slug: string): { filePath: string; mimeType: string } | null {
  const entry = getMediaEntry(kind, slug);
  if (!entry) return null;
  const fp = filePath(kind, slug, entry.ext);
  // turbopackIgnore: fp is always scoped under data/media/<kind>/ (validSlug-checked, fixed extension list)
  if (!fs.existsSync(/*turbopackIgnore: true*/ fp)) return null;
  return { filePath: fp, mimeType: entry.mimeType };
}

export function saveMediaFile(kind: MediaKind, slug: string, fileName: string, ext: string, bytes: Buffer): MediaEntry {
  if (!validSlug(kind, slug)) throw new Error("আইটেম পাওয়া যায়নি");
  fs.mkdirSync(/*turbopackIgnore: true*/ dirFor(kind), { recursive: true });
  removeMediaFile(kind, slug, { keepEntry: true });
  fs.writeFileSync(/*turbopackIgnore: true*/ filePath(kind, slug, ext), bytes);

  const entry: MediaEntry = {
    fileName,
    mimeType: ALLOWED_FOR[kind][ext],
    ext,
    sizeBytes: bytes.length,
    uploadedAt: new Date().toISOString(),
  };
  const store = readStore();
  store[kind] = store[kind] ?? {};
  store[kind]![slug] = entry;
  writeStore(store);
  return entry;
}

export function removeMediaFile(kind: MediaKind, slug: string, opts: { keepEntry?: boolean } = {}) {
  const store = readStore();
  const entry = store[kind]?.[slug];
  if (entry) {
    const fp = filePath(kind, slug, entry.ext);
    if (fs.existsSync(/*turbopackIgnore: true*/ fp)) fs.unlinkSync(/*turbopackIgnore: true*/ fp);
  }
  if (!opts.keepEntry && store[kind]) {
    delete store[kind]![slug];
    writeStore(store);
  }
}

export function getAllProductMediaEntries() {
  const store = readStore();
  return allProducts.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    hasImage: Boolean(store["product-image"]?.[p.slug]),
    hasVideo: Boolean(store["product-video"]?.[p.slug]),
  }));
}

export function getAllBlogMediaEntries() {
  const store = readStore();
  return blogPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    hasImage: Boolean(store["blog-image"]?.[p.slug]),
  }));
}

function mediaUrl(kind: MediaKind, slug: string): string | undefined {
  const entry = getMediaEntry(kind, slug);
  if (!entry) return undefined;
  return `/api/media/${kind}/${slug}?v=${encodeURIComponent(entry.uploadedAt)}`;
}

export function getProductImageUrl(slug: string): string | undefined {
  return mediaUrl("product-image", slug);
}
export function getProductVideoUrl(slug: string): string | undefined {
  return mediaUrl("product-video", slug);
}
export function getBlogImageUrl(slug: string): string | undefined {
  return mediaUrl("blog-image", slug);
}

const MAX_BYTES_FOR: Record<MediaKind, number> = {
  "product-image": MAX_IMAGE_BYTES,
  "blog-image": MAX_IMAGE_BYTES,
  "product-video": MAX_VIDEO_BYTES,
};

/** Parses+validates an upload POST body for a given media kind. Returns either the saved entry or an error response. */
export async function handleMediaUpload(
  kind: MediaKind,
  slug: string,
  req: NextRequest
): Promise<{ ok: true; entry: MediaEntry } | { ok: false; response: NextResponse }> {
  if (!validSlug(kind, slug)) {
    return { ok: false, response: NextResponse.json({ error: "আইটেম পাওয়া যায়নি" }, { status: 404 }) };
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
  const maxBytes = MAX_BYTES_FOR[kind];
  if (file.size > maxBytes) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: `ফাইলের আকার ${Math.round(maxBytes / (1024 * 1024))} এমবি-র বেশি হতে পারবে না` },
        { status: 400 }
      ),
    };
  }

  const ext = resolveExtension(kind, file.name, file.type);
  if (!ext) {
    const allowedList = Object.keys(ALLOWED_FOR[kind]).join(", ");
    return {
      ok: false,
      response: NextResponse.json({ error: `শুধু ${allowedList} ফরম্যাট আপলোড করা যাবে` }, { status: 400 }),
    };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const entry = saveMediaFile(kind, slug, file.name, ext, bytes);
  return { ok: true, entry };
}

/** Public byte-serving response for a media file, with basic Range support for video seeking. */
export function serveMediaFile(kind: MediaKind, slug: string, req: NextRequest): NextResponse | Response {
  const found = getMediaFilePath(kind, slug);
  if (!found) {
    return NextResponse.json({ error: "মিডিয়া পাওয়া যায়নি" }, { status: 404 });
  }
  const { filePath: fp, mimeType } = found;
  // turbopackIgnore: fp always resolves under data/media/<kind>/ (see getMediaFilePath/filePath above)
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
        "Content-Type": mimeType,
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
      "Content-Type": mimeType,
      "Content-Length": String(size),
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
