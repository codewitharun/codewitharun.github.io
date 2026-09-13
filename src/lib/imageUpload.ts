// Client-safe helper used by the admin editors to upload an image. Posts
// the file to our own /api/upload-image route (see that file) rather
// than talking to ImageKit directly — this file never touches an
// ImageKit key, so it's safe to import from Client Components.

import imageCompression from "browser-image-compression";

const TARGET_MAX_BYTES = 800 * 1024; // 800KB — a phone screenshot/photo can be 4-5MB raw

/**
 * Compresses a photo before it's uploaded, so a 4-5MB iPhone screenshot or
 * photo doesn't get stored (and served to every visitor) at full size.
 * Skips files that are already small enough, and skips formats where
 * recompressing would do more harm than good (GIFs would lose animation;
 * SVGs are already tiny vector text). Falls back to the original file if
 * compression fails for any reason — never blocks the upload over this.
 */
async function compressImage(file: File): Promise<File> {
  if (file.size <= TARGET_MAX_BYTES) return file;
  if (file.type === "image/gif" || file.type === "image/svg+xml") return file;

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: TARGET_MAX_BYTES / (1024 * 1024),
      maxWidthOrHeight: 2000, // plenty for a full-width blog image, even on retina
      useWebWorker: true,
      initialQuality: 0.82,
    });
    // browser-image-compression can occasionally return a file larger than
    // the original for already-efficient images — only use the result if it
    // actually helped.
    return compressed.size < file.size ? compressed : file;
  } catch {
    return file;
  }
}

export async function uploadImage(file: File, fileName: string, folder: string): Promise<string> {
  const toUpload = await compressImage(file);

  const formData = new FormData();
  formData.append("file", toUpload);
  formData.append("fileName", fileName);
  formData.append("folder", folder);

  const res = await fetch("/api/upload-image", { method: "POST", body: formData });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Image upload failed.");
  }

  return data.url as string;
}
