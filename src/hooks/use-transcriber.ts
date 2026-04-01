import type { AutomaticSpeechRecognitionOutput, AutomaticSpeechRecognitionPipeline } from "@huggingface/transformers";
import type { TranscriptionOptions } from "@/types";
import {

    pipeline,
    TextStreamer,
} from "@huggingface/transformers";
import { useCallback, useRef } from "react";
import { useAppStore } from "@/lib/store";

const MODEL_ID = "onnx-community/cohere-transcribe-03-2026-ONNX";

export function useTranscriber() {
    const pipelineRef = useRef<AutomaticSpeechRecognitionPipeline | null>(null);
    const loadingRef = useRef<Promise<void> | null>(null);

    const {
        modelStatus,
        modelSettings,
        setModelStatus,
        setModelProgress,
        setModelStatusText,
        setModelError,
    } = useAppStore();

    const loadModel = useCallback(async () => {
        if (pipelineRef.current)
            return;
        if (loadingRef.current)
            return loadingRef.current;

        const loadPromise = (async () => {
            setModelStatus("downloading");
            setModelProgress(0);
            setModelStatusText("Downloading model...");

            try {
                const transcriber = await pipeline(
                    "automatic-speech-recognition",
                    MODEL_ID,
                    {
                        dtype: modelSettings.dtype,
                        device: modelSettings.device,
                        progress_callback: (info: { status: string; progress?: number }) => {
                            if (info.status === "progress_total") {
                                const pct = Math.round(info.progress ?? 0);
                                setModelProgress(pct);
                                setModelStatusText(`Loading model... ${pct}%`);
                            }
                        },
                    },
                );
                pipelineRef.current = transcriber;
                setModelProgress(100);
                setModelStatusText("Ready");
                setModelStatus("ready");
            }
            catch (err) {
                const message = err instanceof Error ? err.message : "Failed to load model";
                setModelStatus("error");
                setModelError(message);
                setModelStatusText(message);
            }
        })();

        loadingRef.current = loadPromise;
        return loadPromise;
    }, [modelSettings, setModelStatus, setModelProgress, setModelStatusText, setModelError]);

    const transcribe = useCallback(
        async (
            audio: Float32Array,
            options: TranscriptionOptions,
            onToken?: (token: string) => void,
        ): Promise<string> => {
            if (!pipelineRef.current) {
                throw new Error("Model not loaded");
            }

            const streamer = onToken
                ? new TextStreamer(pipelineRef.current.tokenizer, {
                        skip_prompt: true,
                        skip_special_tokens: true,
                        callback_function: onToken,
                    })
                : undefined;

            const result = (await pipelineRef.current(audio, {
                language: options.language,
                max_new_tokens: options.max_new_tokens,
                temperature: options.temperature,
                top_p: options.top_p,
                repetition_penalty: options.repetition_penalty,
                num_beams: options.num_beams,
                streamer,
            })) as AutomaticSpeechRecognitionOutput;

            return result.text;
        },
        [],
    );

    const isModelReady = modelStatus === "ready";

    return {
        loadModel,
        transcribe,
        isModelReady,
    };
}
