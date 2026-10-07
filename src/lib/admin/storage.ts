import "server-only";
import { STORAGE_BUCKET } from "@/lib/supabase/config";
import type { AdminContext } from "./auth";

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
const MAX_BYTES = 10 * 1024 * 1024;

export class UploadError extends Error {}

/** Returns the file if one was chosen in a file input, otherwise null. */
export function pickFile(value: FormDataEntryValue | null): File | null {
  return value instanceof File && value.size > 0 ? value : null;
}

/** Uploads an image or PDF to the public "portfolio" bucket and returns its public URL. */
export async function uploadFile(
  { supabase }: AdminContext,
  file: File,
  folder: string,
  kind: "image" | "pdf" = "image",
): Promise<string> {
  if (file.size > MAX_BYTES) throw new UploadError(`${file.name} is larger than 10 MB.`);
  const ext = kind === "pdf" ? (file.type === "application/pdf" ? "pdf" : null) : IMAGE_TYPES[file.type];
  if (!ext) {
    throw new UploadError(
      kind === "pdf" ? `${file.name} is not a PDF.` : `${file.name} must be a JPG, PNG, WebP or AVIF image.`,
    );
  }
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
  if (error) throw new UploadError(`Upload failed: ${error.message}`);
  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Deletes a file previously uploaded to the bucket (ignores placeholders and other URLs). */
export async function removeUploaded({ supabase }: AdminContext, url: string | null | undefined) {
  if (!url) return;
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const at = url.indexOf(marker);
  if (at === -1) return;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([url.slice(at + marker.length)]);
  if (error) console.error("[admin] could not delete old file:", error.message);
}
