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
import { fallbackProjects, type Project, type ProjectLinks } from "@/data/site";

const PROJECTS_COLLECTION = "projects";

// Firestore-backed projects mirror the shape of the old hardcoded
// `fallbackProjects` array almost exactly (see src/data/site.ts), plus the
// admin-only bookkeeping fields below. `published` lets a project be
// drafted/hidden without deleting it; `order` drives manual sort order in
// the admin list and on the public portfolio grid (lower first).
export type ProjectDoc = Project & {
  id: string;
  published: boolean;
  order: number;
  createdAt: number;
  updatedAt: number;
};

type ProjectFirestoreDoc = {
  slug: string;
  title: string;
  description: string;
  links: ProjectLinks;
  image: string;
  tech: string[];
  status: string;
  currentlyWorkingOn?: boolean;
  published: boolean;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

function fromDoc(id: string, data: ProjectFirestoreDoc): ProjectDoc {
  return {
    id,
    slug: data.slug,
    title: data.title,
    description: data.description,
    links: data.links ?? {},
    image: data.image,
    tech: data.tech ?? [],
    status: data.status,
    currentlyWorkingOn: data.currentlyWorkingOn ?? false,
    published: data.published ?? true,
    order: data.order ?? 0,
    createdAt: data.createdAt?.toMillis?.() ?? 0,
    updatedAt: data.updatedAt?.toMillis?.() ?? 0,
  };
}

/**
 * All projects — admin view, published and drafts alike, sorted by the
 * manual `order` field. Filtering to just the public set happens in JS
 * (see getPublishedProjects), same reasoning as posts.ts: avoids needing
 * a composite Firestore index, fine at this scale.
 */
export async function getAllProjects(): Promise<ProjectDoc[]> {
  const q = query(collection(db, PROJECTS_COLLECTION), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc(d.id, d.data() as ProjectFirestoreDoc));
}

export async function getPublishedProjects(): Promise<ProjectDoc[]> {
  const projects = await getAllProjects();
  return projects.filter((p) => p.published);
}

/**
 * Public-page helper: published projects from Firestore, falling back to
 * the original hardcoded `fallbackProjects` list (as plain Project shapes,
 * given a synthetic id/order/published so callers can treat both the same
 * way) whenever Firestore can't be reached — at build time in sandboxed
 * environments, or before the admin has imported/added anything yet.
 */
export async function getProjectsForBuild(): Promise<ProjectDoc[]> {
  try {
    const projects = await getPublishedProjects();
    if (projects.length > 0) return projects;
    return fallbackProjects.map((project, index) => ({
      ...project,
      id: project.slug,
      published: true,
      order: index,
      createdAt: 0,
      updatedAt: 0,
    }));
  } catch {
    return fallbackProjects.map((project, index) => ({
      ...project,
      id: project.slug,
      published: true,
      order: index,
      createdAt: 0,
      updatedAt: 0,
    }));
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectDoc | null> {
  const projects = await getAllProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}

export async function getProjectById(id: string): Promise<ProjectDoc | null> {
  const snap = await getDoc(doc(db, PROJECTS_COLLECTION, id));
  if (!snap.exists()) return null;
  return fromDoc(snap.id, snap.data() as ProjectFirestoreDoc);
}

export type ProjectInput = {
  slug: string;
  title: string;
  description: string;
  links: ProjectLinks;
  image: string;
  tech: string[];
  status: string;
  currentlyWorkingOn: boolean;
  published: boolean;
  order: number;
};

export async function createProject(input: ProjectInput): Promise<string> {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
    ...input,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function updateProject(id: string, input: ProjectInput): Promise<void> {
  await updateDoc(doc(db, PROJECTS_COLLECTION, id), {
    ...input,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, PROJECTS_COLLECTION, id));
}

/** Rebuilds a full ProjectInput from an already-fetched ProjectDoc, with
 * any fields to change layered on top — for writing back a project whose
 * only change is e.g. its `order` or `currentlyWorkingOn`, without
 * retyping every other field at each call site. */
export function projectDocToInput(
  p: ProjectDoc,
  overrides: Partial<ProjectInput> = {}
): ProjectInput {
  return {
    slug: p.slug,
    title: p.title,
    description: p.description,
    links: p.links,
    image: p.image,
    tech: p.tech,
    status: p.status,
    currentlyWorkingOn: p.currentlyWorkingOn ?? false,
    published: p.published,
    order: p.order,
    ...overrides,
  };
}

/**
 * Turns a human-friendly 1-indexed "position" (1 = top, N = last, where N
 * is the total project count) into the 0-indexed `order` value to save on
 * the project being placed, and pushes a one-slot gap through
 * `otherProjects` to make room for it — so the admin picks a spot in the
 * list instead of having to invent or remember raw order numbers.
 * `otherProjects` must already be sorted by their current `order` and
 * must NOT include the project being saved. Only projects whose `order`
 * (or, when `makeCurrent` is set, `currentlyWorkingOn`) actually changes
 * get written — everyone else is left untouched. Returns the `order` to
 * save on the moved project itself.
 */
export async function resolvePositionAndReorder(
  otherProjects: ProjectDoc[],
  position: number,
  makeCurrent: boolean
): Promise<number> {
  const zeroIndex = Math.max(0, Math.min(Math.round(position) - 1, otherProjects.length));

  await Promise.all(
    otherProjects.map((p, i) => {
      const newOrder = i < zeroIndex ? i : i + 1;
      const shouldClearCurrent = makeCurrent && p.currentlyWorkingOn;
      if (newOrder === p.order && !shouldClearCurrent) return Promise.resolve();
      return updateProject(
        p.id,
        projectDocToInput(p, {
          order: newOrder,
          ...(shouldClearCurrent ? { currentlyWorkingOn: false } : {}),
        })
      );
    })
  );

  return zeroIndex;
}

/** Uploads a project cover image to Storage and returns its public download URL. */
export async function uploadProjectImage(projectSlug: string, file: File): Promise<string> {
  const path = `project-images/${projectSlug}-${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteProjectImage(url: string): Promise<void> {
  try {
    await deleteObject(ref(storage, url));
  } catch {
    // Best-effort — a missing or externally-hosted (e.g. one of the
    // original /projects/mockN.png static assets) URL shouldn't block
    // editing or deleting the project itself.
  }
}

/**
 * One-time convenience for turning on the admin Projects tab for the
 * first time: bulk-imports the original hardcoded project list (from
 * src/data/site.ts, still used as the build-time fallback whenever
 * Firestore is unreachable) into Firestore so they become editable
 * without retyping everything. Safe to call more than once — skips
 * import entirely if any projects already exist.
 */
export async function importFallbackProjectsIfEmpty(): Promise<number> {
  const existing = await getAllProjects();
  if (existing.length > 0) return 0;

  const now = Timestamp.now();
  await Promise.all(
    fallbackProjects.map((project, index) =>
      addDoc(collection(db, PROJECTS_COLLECTION), {
        slug: project.slug,
        title: project.title,
        description: project.description,
        links: project.links,
        image: project.image,
        tech: project.tech,
        status: project.status,
        currentlyWorkingOn: project.currentlyWorkingOn ?? false,
        published: true,
        order: index,
        createdAt: now,
        updatedAt: now,
      } satisfies ProjectFirestoreDoc)
    )
  );
  return fallbackProjects.length;
}

export function slugifyProject(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
