import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
  createdAt: number; // epoch ms
};

const MESSAGES_COLLECTION = "messages";

type ContactMessageDoc = {
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
  createdAt: Timestamp;
};

function fromDoc(id: string, data: ContactMessageDoc): ContactMessage {
  return {
    id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    read: data.read ?? false,
    createdAt: data.createdAt?.toMillis?.() ?? 0,
  };
}

export type ContactMessageInput = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

/**
 * Called from the public "Get in touch" form (no auth) — this is the one
 * write path Firestore Security Rules let an unauthenticated visitor take
 * on this collection (see firestore.rules: create-only, and only with
 * read:false and matching field types). Everything else — listing,
 * marking read, deleting — is admin-only and goes through the functions
 * below.
 */
export async function submitContactMessage(input: ContactMessageInput): Promise<void> {
  await addDoc(collection(db, MESSAGES_COLLECTION), {
    ...input,
    read: false,
    createdAt: Timestamp.now(),
  });
}

/** Admin-only: every message, newest first. */
export async function getAllMessages(): Promise<ContactMessage[]> {
  const q = query(collection(db, MESSAGES_COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc(d.id, d.data() as ContactMessageDoc));
}

export async function setMessageRead(id: string, read: boolean): Promise<void> {
  await updateDoc(doc(db, MESSAGES_COLLECTION, id), { read });
}

export async function deleteMessage(id: string): Promise<void> {
  await deleteDoc(doc(db, MESSAGES_COLLECTION, id));
}
