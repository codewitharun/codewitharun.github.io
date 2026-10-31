// Data layer for /board, Arun's private wallpaper board (Plash on the Mac,
// Safari on iPad/iPhone). Lives in the portfolio's Firestore under
// board/main/** and syncs live on every device (onSnapshot). Only the admin
// account can read or write it (firestore.rules).
//
//   board/main                 settings: { habits: Habit[], reminders: string[] }
//   board/main/tasks/{id}      { title, done, createdAt, doneAt }
//   board/main/days/{y-m-d}    { [habitId]: true }  (local date, one doc per day)
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  documentId,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Habit = { id: string; label: string };
export type BoardSettings = { habits: Habit[]; reminders: string[] };
export type BoardTask = {
  id: string;
  title: string;
  done: boolean;
  createdAt: Date | null;
  doneAt: Date | null;
};
/** day key (yyyy-mm-dd) -> habit ids ticked that day */
export type BoardDays = Record<string, Set<string>>;

export const DEFAULT_SETTINGS: BoardSettings = {
  habits: [
    { id: "learn", label: "Learn 30 min" },
    { id: "move", label: "Workout" },
    { id: "ship", label: "Ship one thing" },
  ],
  reminders: [
    "Start ugly. Start now.",
    "One thing at a time. Finish it, then the next.",
    "New ideas go in Notion Ideas, not into today.",
    "10 minutes of JS Gym beats zero minutes of perfect plans.",
    "Done is a feature.",
  ],
};

const root = () => doc(db, "board", "main");
const tasksCol = () => collection(root(), "tasks");
const daysCol = () => collection(root(), "days");
const toDate = (t: unknown) => (t && typeof (t as Timestamp).toDate === "function" ? (t as Timestamp).toDate() : null);

export function watchSettings(cb: (s: BoardSettings) => void, onError: (e: Error) => void) {
  return onSnapshot(
    root(),
    (snap) => {
      const d = snap.data() as Partial<BoardSettings> | undefined;
      cb({
        habits: d?.habits?.length ? d.habits : DEFAULT_SETTINGS.habits,
        reminders: d?.reminders?.length ? d.reminders : DEFAULT_SETTINGS.reminders,
      });
    },
    onError,
  );
}

export const saveSettings = (s: BoardSettings) =>
  setDoc(root(), { ...s, updatedAt: serverTimestamp() }, { merge: true });

export function watchTasks(cb: (t: BoardTask[]) => void, onError: (e: Error) => void) {
  return onSnapshot(
    query(tasksCol(), orderBy("createdAt", "asc")),
    (snap) =>
      cb(
        snap.docs.map((d) => {
          const x = d.data({ serverTimestamps: "estimate" });
          return {
            id: d.id,
            title: String(x.title ?? ""),
            done: !!x.done,
            createdAt: toDate(x.createdAt),
            doneAt: toDate(x.doneAt),
          };
        }),
      ),
    onError,
  );
}

export const addTask = (title: string) =>
  addDoc(tasksCol(), { title: title.trim().slice(0, 200), done: false, createdAt: serverTimestamp(), doneAt: null });

export const setTaskDone = (id: string, done: boolean) =>
  updateDoc(doc(tasksCol(), id), { done, doneAt: done ? serverTimestamp() : null });

export const renameTask = (id: string, title: string) =>
  updateDoc(doc(tasksCol(), id), { title: title.trim().slice(0, 200) });

export const deleteTask = (id: string) => deleteDoc(doc(tasksCol(), id));

export function watchDays(fromKey: string, cb: (d: BoardDays) => void, onError: (e: Error) => void) {
  return onSnapshot(
    query(daysCol(), where(documentId(), ">=", fromKey)),
    (snap) => {
      const out: BoardDays = {};
      snap.docs.forEach((d) => {
        const data = d.data();
        out[d.id] = new Set(Object.keys(data).filter((k) => data[k] === true));
      });
      cb(out);
    },
    onError,
  );
}

export const setHabit = (dayKey: string, habitId: string, on: boolean) =>
  setDoc(doc(daysCol(), dayKey), { [habitId]: on ? true : deleteField() }, { merge: true });
