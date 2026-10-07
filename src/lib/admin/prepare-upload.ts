/**
 * Browser-side upload preparation for the admin.
 *
 * Phone photos are often 3-8 MB, but a request to a Vercel Function may carry at most
 * 4.5 MB. Images are scaled down to a web-friendly size before they are sent, and each
 * request is kept under MAX_REQUEST_BYTES so the same code works on Vercel and the VPS.
 */

export const MAX_REQUEST_BYTES = 4 * 1024 * 1024;
const MAX_EDGE = 2560;
const QUALITY = 0.85;
const SKIP_BELOW_BYTES = 1.5 * 1024 * 1024;

const RESIZABLE = ["image/jpeg", "image/png", "image/webp"];

const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

/** Scales a photo so its longest edge is at most 2560px and re-encodes it as JPEG. */
export async function downscaleImage(file: File): Promise<File> {
  if (!RESIZABLE.includes(file.type)) return file;
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return file; // Unreadable in this browser: let the server validate it as-is.
  }
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size <= SKIP_BELOW_BYTES) {
    bitmap.close();
    return file;
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", QUALITY));
  if (!blob || blob.size >= file.size) return file;
  return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg", lastModified: file.lastModified });
}

/** Shrinks every image file in the form data and checks the request stays under the limit. */
export async function prepareFormData(data: FormData): Promise<{ data: FormData } | { error: string }> {
  const out = new FormData();
  let total = 0;
  for (const [key, value] of data.entries()) {
    if (value instanceof File && value.size > 0) {
      const file = await downscaleImage(value);
      total += file.size;
      out.append(key, file, file.name);
    } else {
      out.append(key, value);
    }
  }
  if (total > MAX_REQUEST_BYTES) {
    return {
      error: `These files add up to ${mb(total)}, over the ${mb(MAX_REQUEST_BYTES)} limit. Upload them one at a time, or use a smaller PDF.`,
    };
  }
  return { data: out };
}
