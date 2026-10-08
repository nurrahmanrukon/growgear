import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/data/products";
import { createMultiImageStore, StoredImage } from "./multiImageStore";

export type AuthorPhoto = StoredImage;

export const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8MB
export const MAX_PHOTOS = 10;

function isReadableSlug(slug: string): boolean {
  const product = getProductBySlug(slug);
  return Boolean(product && (product.category === "book" || product.category === "ebook"));
}

const store = createMultiImageStore({
  storeFile: "author-photos.json",
  mediaDirName: "author-photos",
  urlPrefix: "/api/media/author-photos",
  maxBytes: MAX_PHOTO_BYTES,
  maxCount: MAX_PHOTOS,
  maxCountError: `সর্বোচ্চ ${MAX_PHOTOS}টি ছবি যোগ করা যাবে`,
  validateSlug: isReadableSlug,
  invalidSlugError: "শুধু বই/ইবুকের জন্য লেখকের ছবি যোগ করা যাবে",
});

export const getAuthorPhotos = store.getEntries;
export const getAuthorPhotoUrls = store.getEntryUrls;
export const addAuthorPhoto = store.addEntry;
export const removeAuthorPhoto = store.removeEntry;
export const reorderAuthorPhotos = store.reorderEntries;
export const getAllAuthorPhotoEntries = store.getAllEntries;

export function handleAuthorPhotoUpload(slug: string, req: NextRequest) {
  return store.handleUpload(slug, req);
}

export function serveAuthorPhotoFile(slug: string, id: string): NextResponse {
  return store.serveFile(slug, id);
}
