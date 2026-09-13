import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export type PostStatus = "draft" | "published";

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown
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
  const q = query(collection(db, POSTS_COLLECTION), orderBy("createdAt", "desc"));
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

/** Uploads a cover image to Storage and returns its public download URL. */
export async function uploadCoverImage(postSlug: string, file: File): Promise<string> {
  const path = `blog-images/${postSlug}-${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteCoverImage(url: string): Promise<void> {
  try {
    await deleteObject(ref(storage, url));
  } catch {
    // Best-effort — an already-missing or externally-hosted image URL
    // shouldn't block deleting/editing the post itself.
  }
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
