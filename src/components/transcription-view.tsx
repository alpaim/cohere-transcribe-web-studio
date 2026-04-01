import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/audio";
import { useAppStore } from "@/lib/store";

interface TranscriptionViewProps {
    stats: { audioDuration: number; elapsed: number } | null;
}

export function TranscriptionView({ stats }: TranscriptionViewProps) {
    const { isTranscribing, streamedText, finalText, currentFile } = useAppStore();
    const outputRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState(false);

    const displayText = isTranscribing ? streamedText : finalText;

    useEffect(() => {
        if (isTranscribing && outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [streamedText, isTranscribing]);

    const copyToClipboard = useCallback(() => {
        navigator.clipboard.writeText(finalText).then(() => {
            setCopied(true);
            setTimeout(setCopied, 2000, false);
        });
    }, [finalText]);

    const downloadText = useCallback(() => {
        const blob = new Blob([finalText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "transcription.txt";
        a.click();
        URL.revokeObjectURL(url);
    }, [finalText]);

    const isDone = !isTranscribing && !!finalText;

    return (
        <div className="flex flex-col gap-4">
            {/* Source info */}
            <div className="flex items-center gap-3">
                <svg
                    className="size-5 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="text-sm text-foreground truncate">
                    {currentFile?.name}
                </span>

                {isTranscribing && (
                    <span className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                        <svg
                            className="animate-spin size-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Transcribing...
                    </span>
                )}

                {isDone && stats && (
                    <span className="ml-auto flex items-center gap-2 text-sm text-emerald-600">
                        <svg
                            className="size-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Transcribed
                        {" "}
                        {formatDuration(stats.audioDuration)}
                        {" "}
                        in
                        {" "}
                        {formatDuration(stats.elapsed)}
                    </span>
                )}
            </div>

            {/* Transcription output */}
            <div
                ref={outputRef}
                className="bg-muted/50 rounded-xl p-6 min-h-[280px] max-h-[500px] overflow-y-auto border"
            >
                {displayText
                    ? (
                            <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">
                                {displayText.trim()}
                            </p>
                        )
                    : isTranscribing
                        ? (
                                <div className="space-y-3">
                                    <div className="h-4 w-full rounded bg-muted animate-pulse" />
                                    <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
                                    <div className="h-4 w-4/6 rounded bg-muted animate-pulse" />
                                </div>
                            )
                        : null}
            </div>

            {/* Actions */}
            {isDone && (
                <div className="flex items-center justify-center gap-3">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        {copied
                            ? (
                                    <svg className="size-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                                )
                            : (
                                    <svg className="size-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="9" y="9" width="13" height="13" rx="2" />
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                    </svg>
                                )}
                        {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadText}>
                        <svg className="size-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download
                    </Button>
                </div>
            )}
        </div>
    );
}
