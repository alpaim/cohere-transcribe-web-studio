import type {
    ModelStatus,
    TranscriptionEntry,
    TranscriptionOptions,
} from "@/types";
import { create } from "zustand";
import {
    deleteTranscription,
    getAllTranscriptions,
    saveTranscription,
} from "@/lib/db";

interface AppState {
    // Model
    modelStatus: ModelStatus;
    modelProgress: number;
    modelStatusText: string;
    modelError: string | null;

    // Transcription
    isTranscribing: boolean;
    currentFile: File | null;
    streamedText: string;
    finalText: string;
    transcriptionOptions: TranscriptionOptions;

    // History
    history: TranscriptionEntry[];
    selectedHistoryId: string | null;

    // UI
    sidebarOpen: boolean;
    showAISettings: boolean;
}

interface AppActions {
    setModelStatus: (s: ModelStatus) => void;
    setModelProgress: (p: number) => void;
    setModelStatusText: (t: string) => void;
    setModelError: (e: string | null) => void;
    setTranscriptionOptions: (o: Partial<TranscriptionOptions>) => void;
    setCurrentFile: (f: File | null) => void;
    setStreamedText: (t: string) => void;
    setFinalText: (t: string) => void;
    setIsTranscribing: (v: boolean) => void;
    setSidebarOpen: (v: boolean) => void;
    setShowAISettings: (v: boolean) => void;
    selectHistoryEntry: (id: string | null) => void;
    loadHistory: () => Promise<void>;
    saveToHistory: (entry: TranscriptionEntry) => Promise<void>;
    deleteFromHistory: (id: string) => Promise<void>;
    resetTranscription: () => void;
}

const DEFAULT_OPTIONS: TranscriptionOptions = {
    language: "en",
    max_new_tokens: 1024,
    temperature: 1.0,
    top_p: 1.0,
    repetition_penalty: 1.0,
    num_beams: 1,
};

export const useAppStore = create<AppState & AppActions>((set, get) => ({
    // Model state
    modelStatus: "idle",
    modelProgress: 0,
    modelStatusText: "",
    modelError: null,

    // Transcription state
    isTranscribing: false,
    currentFile: null,
    streamedText: "",
    finalText: "",
    transcriptionOptions: DEFAULT_OPTIONS,

    // History
    history: [],
    selectedHistoryId: null,

    // UI
    sidebarOpen: false,
    showAISettings: false,

    // Actions
    setModelStatus: s => set({ modelStatus: s }),
    setModelProgress: p => set({ modelProgress: p }),
    setModelStatusText: t => set({ modelStatusText: t }),
    setModelError: e => set({ modelError: e }),
    setTranscriptionOptions: o => set(state => ({
        transcriptionOptions: { ...state.transcriptionOptions, ...o },
    })),
    setCurrentFile: f => set({ currentFile: f }),
    setStreamedText: t => set({ streamedText: t }),
    setFinalText: t => set({ finalText: t }),
    setIsTranscribing: v => set({ isTranscribing: v }),
    setSidebarOpen: v => set({ sidebarOpen: v }),
    setShowAISettings: v => set({ showAISettings: v }),
    selectHistoryEntry: id => set({ selectedHistoryId: id }),

    loadHistory: async () => {
        const entries = await getAllTranscriptions();
        set({ history: entries });
    },

    saveToHistory: async (entry) => {
        await saveTranscription(entry);
        const entries = await getAllTranscriptions();
        set({ history: entries });
    },

    deleteFromHistory: async (id) => {
        await deleteTranscription(id);
        const entries = await getAllTranscriptions();
        set({
            history: entries,
            selectedHistoryId: get().selectedHistoryId === id ? null : get().selectedHistoryId,
        });
    },

    resetTranscription: () => set({
        currentFile: null,
        streamedText: "",
        finalText: "",
        isTranscribing: false,
        selectedHistoryId: null,
    }),
}));
