export interface TranscriptionOptions {
    language: string;
    max_new_tokens: number;
    temperature: number;
    top_p: number;
    repetition_penalty: number;
    num_beams: number;
}

export interface TranscriptionEntry {
    id: string;
    title: string;
    audioFileName: string;
    transcript: string;
    language: string;
    options: TranscriptionOptions;
    createdAt: number;
}

export type ModelStatus = "idle" | "downloading" | "ready" | "error";

export interface ModelSettings {
    dtype: "q4" | "q8";
    device: "webgpu" | "wasm";
}

export interface Language {
    code: string;
    label: string;
    native: string;
}
