import { db } from "@/lib/firebase";
import { uploadImage } from "@/lib/imageUpload";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

export type PostStatus = "draft" | "published";

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML, produced by the admin rich text editor
  coverImage: string | null;
  status: PostStatus;
  createdAt: number; // epoch ms, for easy sorting/serializing to Client Components
  updatedAt: number;
};

const POSTS_COLLECTION = "posts";

type PostDoc = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  status: PostStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

function fromDoc(id: string, data: PostDoc): Post {
  return {
    id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    coverImage: data.coverImage ?? null,
    status: data.status,
    createdAt: data.createdAt?.toMillis?.() ?? 0,
    updatedAt: data.updatedAt?.toMillis?.() ?? 0,
  };
}

/**
 * All posts, newest first. Filtering by status happens in JS rather than
 * a Firestore `where` clause so this never needs a composite index — fine
 * at personal-blog scale. Firestore security rules are the real gate on
 * writes; this file has no auth checks of its own, both admin and public
 * reads go through the same functions.
 */
export async function getAllPosts(): Promise<Post[]> {
  const q = query(
    collection(db, POSTS_COLLECTION),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc(d.id, d.data() as PostDoc));
}

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.status === "published");
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getPostById(id: string): Promise<Post | null> {
  const snap = await getDoc(doc(db, POSTS_COLLECTION, id));
  if (!snap.exists()) return null;
  return fromDoc(snap.id, snap.data() as PostDoc);
}

export type PostInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  status: PostStatus;
};

export async function createPost(input: PostInput): Promise<string> {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
    ...input,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function updatePost(id: string, input: PostInput): Promise<void> {
  await updateDoc(doc(db, POSTS_COLLECTION, id), {
    ...input,
    updatedAt: Timestamp.now(),
  });
}

export async function deletePost(id: string): Promise<void> {
  await deleteDoc(doc(db, POSTS_COLLECTION, id));
}

/** Uploads a cover image via ImageKit (see /api/upload-image) and returns its public URL. */
export async function uploadCoverImage(
  postSlug: string,
  file: File,
): Promise<string> {
  return uploadImage(
    file,
    `${postSlug}-${Date.now()}-${file.name}`,
    "blog-images",
  );
}

export async function deleteCoverImage(_url: string): Promise<void> {
  // Best-effort no-op: ImageKit's delete API needs the file's ImageKit
  // fileId, which isn't stored alongside the plain URL saved on the post
  // document (same as before, when an externally-hosted image URL
  // couldn't be deleted from Firebase Storage either). Stray uploads can
  // be cleaned up from the ImageKit Media Library directly; ask if you'd
  // like fileId tracked going forward so this can delete for real.
}

/**
 * Uploads an image inserted inline into the post body (via the rich text
 * editor's image button) and returns its public URL. Shares the same
 * `blog-images/` ImageKit folder as cover images; only distinguished by a
 * "-content-" marker in the name.
 */
export async function uploadPostImage(
  postSlug: string,
  file: File,
): Promise<string> {
  return uploadImage(
    file,
    `${postSlug}-content-${Date.now()}-${file.name}`,
    "blog-images",
  );
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
