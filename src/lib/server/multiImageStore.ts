import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export interface StoredImage {
  id: string;
  fileName: string;
  mimeType: string;
  ext: string;
  sizeBytes: number;
  uploadedAt: string;
}

const IMAGE_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export interface MultiImageStoreConfig {
  storeFile: string;
  mediaDirName: string;
  urlPrefix: string;
  maxBytes: number;
  maxCount: number;
  maxCountError: string;
  validateSlug: (slug: string) => boolean;
  invalidSlugError: string;
}

export function createMultiImageStore(config: MultiImageStoreConfig) {
  const DATA_DIR = path.join(process.cwd(), "data");
  const STORE_PATH = path.join(DATA_DIR, config.storeFile);
  const FILES_DIR = path.join(DATA_DIR, "media", config.mediaDirName);

  type Store = Record<string, StoredImage[]>;

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

  function slugDir(slug: string): string {
    return path.join(FILES_DIR, slug);
  }

  function filePath(slug: string, id: string, ext: string): string {
    return path.join(FILES_DIR, slug, `${id}.${ext}`);
  }

  function resolveExtension(fileName: string, mimeType: string): string | null {
    const fromName = fileName.split(".").pop()?.toLowerCase() ?? "";
    if (fromName in IMAGE_TYPES) return fromName;
    const fromMime = Object.entries(IMAGE_TYPES).find(([, m]) => m === mimeType)?.[0];
    return fromMime ?? null;
  }

  function getEntries(slug: string): StoredImage[] {
    return readStore()[slug] ?? [];
  }

  function getEntryUrls(slug: string): string[] {
    return getEntries(slug).map(
      (e) => `${config.urlPrefix}/${slug}/${e.id}?v=${encodeURIComponent(e.uploadedAt)}`
    );
  }

  function addEntry(slug: string, fileName: string, mimeType: string, bytes: Buffer): StoredImage {
    if (!config.validateSlug(slug)) throw new Error(config.invalidSlugError);
    const ext = resolveExtension(fileName, mimeType);
    if (!ext) throw new Error("শুধু jpg, png, webp ফরম্যাট আপলোড করা যাবে");
    if (bytes.length > config.maxBytes) throw new Error("ছবির আকার সীমার বেশি হয়ে গেছে");

    const store = readStore();
    const entries = store[slug] ?? [];
    if (entries.length >= config.maxCount) throw new Error(config.maxCountError);

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    fs.mkdirSync(slugDir(slug), { recursive: true });
    fs.writeFileSync(filePath(slug, id, ext), bytes);

    const entry: StoredImage = {
      id,
      fileName,
      mimeType: IMAGE_TYPES[ext],
      ext,
      sizeBytes: bytes.length,
      uploadedAt: new Date().toISOString(),
    };
    store[slug] = [...entries, entry];
    writeStore(store);
    return entry;
  }

  function removeEntry(slug: string, id: string) {
    const store = readStore();
    const entries = store[slug] ?? [];
    const entry = entries.find((e) => e.id === id);
    if (!entry) throw new Error("ছবি পাওয়া যায়নি");
    const fp = filePath(slug, id, entry.ext);
    if (fs.existsSync(/*turbopackIgnore: true*/ fp)) fs.unlinkSync(/*turbopackIgnore: true*/ fp);
    store[slug] = entries.filter((e) => e.id !== id);
    writeStore(store);
  }

  function reorderEntries(slug: string, order: string[]) {
    const store = readStore();
    const entries = store[slug] ?? [];
    if (order.length !== entries.length || new Set(order).size !== order.length) {
      throw new Error("অবৈধ ক্রম");
    }
    const byId = new Map(entries.map((e) => [e.id, e]));
    const reordered: StoredImage[] = [];
    for (const id of order) {
      const entry = byId.get(id);
      if (!entry) throw new Error("অবৈধ ক্রম");
      reordered.push(entry);
    }
    store[slug] = reordered;
    writeStore(store);
  }

  async function handleUpload(
    slug: string,
    req: NextRequest
  ): Promise<{ ok: true; entry: StoredImage } | { ok: false; response: NextResponse }> {
    if (!config.validateSlug(slug)) {
      return { ok: false, response: NextResponse.json({ error: config.invalidSlugError }, { status: 400 }) };
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
      const entry = addEntry(slug, file.name, file.type, bytes);
      return { ok: true, entry };
    } catch (err) {
      return {
        ok: false,
        response: NextResponse.json({ error: err instanceof Error ? err.message : "আপলোড করা যায়নি" }, { status: 400 }),
      };
    }
  }

  function serveFile(slug: string, id: string): NextResponse {
    const entry = getEntries(slug).find((e) => e.id === id);
    const fp = entry ? filePath(slug, id, entry.ext) : null;
    if (!entry || !fp || !fs.existsSync(/*turbopackIgnore: true*/ fp)) {
      return NextResponse.json({ error: "ছবি পাওয়া যায়নি" }, { status: 404 });
    }
    const bytes = fs.readFileSync(/*turbopackIgnore: true*/ fp);
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": entry.mimeType,
        "Content-Length": String(bytes.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  function getAllEntries() {
    const store = readStore();
    return Object.entries(store).map(([slug, entries]) => ({ slug, count: entries.length }));
  }

  return { getEntries, getEntryUrls, addEntry, removeEntry, reorderEntries, handleUpload, serveFile, getAllEntries };
}
