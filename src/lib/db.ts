import type { DBSchema, IDBPDatabase } from "idb";
import type { TranscriptionEntry } from "@/types";
import { openDB } from "idb";

interface AppDB extends DBSchema {
    transcriptions: {
        key: string;
        value: TranscriptionEntry;
        indexes: { "by-date": number };
    };
}

const DB_NAME = "cohere-transcribe-studio";
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<AppDB> | null = null;

async function getDB(): Promise<IDBPDatabase<AppDB>> {
    if (dbInstance)
        return dbInstance;

    dbInstance = await openDB<AppDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            const store = db.createObjectStore("transcriptions", { keyPath: "id" });
            store.createIndex("by-date", "createdAt");
        },
    });

    return dbInstance;
}

export async function getAllTranscriptions(): Promise<TranscriptionEntry[]> {
    const db = await getDB();
    const entries = await db.getAllFromIndex("transcriptions", "by-date");
    return entries.reverse();
}

export async function getTranscription(id: string): Promise<TranscriptionEntry | undefined> {
    const db = await getDB();
    return db.get("transcriptions", id);
}

export async function saveTranscription(entry: TranscriptionEntry): Promise<void> {
    const db = await getDB();
    await db.put("transcriptions", entry);
}

export async function deleteTranscription(id: string): Promise<void> {
    const db = await getDB();
    await db.delete("transcriptions", id);
}

export async function clearAllTranscriptions(): Promise<void> {
    const db = await getDB();
    await db.clear("transcriptions");
}

export function generateId(): string {
    return crypto.randomUUID();
}
