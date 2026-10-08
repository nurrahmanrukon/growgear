import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/data/products";
import { createMultiImageStore, StoredImage } from "./multiImageStore";

export type BookPreviewPage = StoredImage;

export const MAX_PAGE_BYTES = 8 * 1024 * 1024; // 8MB
export const MAX_PAGES = 30;

function isBookSlug(slug: string): boolean {
  const product = getProductBySlug(slug);
  return Boolean(product && product.category === "book");
}

const store = createMultiImageStore({
  storeFile: "book-preview-pages.json",
  mediaDirName: "book-preview-pages",
  urlPrefix: "/api/media/book-preview",
  maxBytes: MAX_PAGE_BYTES,
  maxCount: MAX_PAGES,
  maxCountError: `সর্বোচ্চ ${MAX_PAGES}টি পাতা যোগ করা যাবে`,
  validateSlug: isBookSlug,
  invalidSlugError: "শুধু বই এর জন্য পাতা যোগ করা যাবে",
});

export const getPreviewPages = store.getEntries;
export const getPreviewPageUrls = store.getEntryUrls;
export const addPreviewPage = store.addEntry;
export const removePreviewPage = store.removeEntry;
export const reorderPreviewPages = store.reorderEntries;
export const getAllBookPreviewEntries = store.getAllEntries;

export function handlePreviewPageUpload(slug: string, req: NextRequest) {
  return store.handleUpload(slug, req);
}

export function servePreviewPageFile(slug: string, id: string): NextResponse {
  return store.serveFile(slug, id);
}
