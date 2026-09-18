import fs from "fs";
import path from "path";
import { blogPosts } from "@/lib/data/blog";

export type AudioMode = "tts" | "file";

export interface BlogAudioEntry {
  mode: AudioMode;
  fileName: string | null;
  mimeType: string | null;
  ext: string | null;
  sizeBytes: number | null;
  uploadedAt: string | null;
}

const DEFAULT_ENTRY: BlogAudioEntry = {
  mode: "tts",
  fileName: null,
  mimeType: null,
  ext: null,
  sizeBytes: null,
  uploadedAt: null,
};

const DATA_DIR = path.join(process.cwd(), "data");
const AUDIO_DIR = path.join(DATA_DIR, "audio");
const STORE_PATH = path.join(DATA_DIR, "blog-audio.json");

// extension -> mime type. Also serves as the upload allow-list.
export const ALLOWED_AUDIO_TYPES: Record<string, string> = {
  mp3: "audio/mpeg",
  wav: "audio/wav",
  m4a: "audio/mp4",
  ogg: "audio/ogg",
  aac: "audio/aac",
  webm: "audio/webm",
};

export const MAX_AUDIO_BYTES = 25 * 1024 * 1024; // 25MB

function readStore(): Record<string, BlogAudioEntry> {
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, BlogAudioEntry>) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function audioFilePath(slug: string, ext: string) {
  return path.join(AUDIO_DIR, `${slug}.${ext}`);
}

export function getAudioEntry(slug: string): BlogAudioEntry {
  const store = readStore();
  return store[slug] ?? DEFAULT_ENTRY;
}

export function getAllAudioEntries(): { slug: string; title: string; entry: BlogAudioEntry }[] {
  const store = readStore();
  return blogPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    entry: store[post.slug] ?? DEFAULT_ENTRY,
  }));
}

/** Detects a whitelisted extension from an uploaded filename + mime type. Returns null if unsupported. */
export function resolveExtension(fileName: string, mimeType: string): string | null {
  const fromName = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (fromName in ALLOWED_AUDIO_TYPES) return fromName;
  const fromMime = Object.entries(ALLOWED_AUDIO_TYPES).find(([, m]) => m === mimeType)?.[0];
  return fromMime ?? null;
}

export function saveAudioFile(slug: string, fileName: string, ext: string, bytes: Buffer): BlogAudioEntry {
  if (!blogPosts.some((p) => p.slug === slug)) throw new Error("পোস্ট পাওয়া যায়নি");
  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  // remove any previously stored file for this slug (possibly a different extension)
  removeAudioFile(slug, { keepEntry: true });

  fs.writeFileSync(audioFilePath(slug, ext), bytes);

  const entry: BlogAudioEntry = {
    mode: "file",
    fileName,
    mimeType: ALLOWED_AUDIO_TYPES[ext],
    ext,
    sizeBytes: bytes.length,
    uploadedAt: new Date().toISOString(),
  };
  const store = readStore();
  store[slug] = entry;
  writeStore(store);
  return entry;
}

export function setAudioMode(slug: string, mode: AudioMode): BlogAudioEntry {
  if (!blogPosts.some((p) => p.slug === slug)) throw new Error("পোস্ট পাওয়া যায়নি");
  const store = readStore();
  const current = store[slug] ?? DEFAULT_ENTRY;
  if (mode === "file" && !current.ext) {
    throw new Error("আগে একটি অডিও ফাইল আপলোড করুন");
  }
  const entry = { ...current, mode };
  store[slug] = entry;
  writeStore(store);
  return entry;
}

export function removeAudioFile(slug: string, opts: { keepEntry?: boolean } = {}) {
  const store = readStore();
  const current = store[slug];
  if (current?.ext) {
    const filePath = audioFilePath(slug, current.ext);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  if (!opts.keepEntry) {
    delete store[slug];
    writeStore(store);
  }
}

export function getAudioFilePath(slug: string): { filePath: string; mimeType: string } | null {
  const entry = getAudioEntry(slug);
  if (!entry.ext || !entry.mimeType) return null;
  const filePath = audioFilePath(slug, entry.ext);
  if (!fs.existsSync(filePath)) return null;
  return { filePath, mimeType: entry.mimeType };
}
