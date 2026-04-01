import type { TranscriptionEntry } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { AISettings } from "@/components/ai-settings";
import { FileUpload } from "@/components/file-upload";
import { Header } from "@/components/header";
import { LanguageSelector } from "@/components/language-selector-full";
import { Sidebar } from "@/components/sidebar";
import { TranscriptionOptions as TranscriptionOptionsPanel } from "@/components/transcription-options";
import { TranscriptionView } from "@/components/transcription-view";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTranscriber } from "@/hooks/use-transcriber";
import { decodeAudio } from "@/lib/audio";
import { generateId } from "@/lib/db";
import { useAppStore } from "@/lib/store";

const EXTENSION_REGEX = /\.[^/.]+$/;

function App() {
    const {
        isTranscribing,
        currentFile,
        finalText,
        transcriptionOptions,
        setSidebarOpen,
        setCurrentFile,
        setStreamedText,
        setFinalText,
        setIsTranscribing,
        saveToHistory,
        resetTranscription,
    } = useAppStore();

    const { loadModel, transcribe, isModelReady } = useTranscriber();
    const [stats, setStats] = useState<{ audioDuration: number; elapsed: number } | null>(null);
    const isMobileRef = useRef(window.innerWidth < 768);
    // eslint-disable-next-line react/use-state
    const [_unused, setMobileTrigger] = useState(0);
    const streamedTextRef = useRef("");

    useEffect(() => {
        const mql = window.matchMedia("(max-width: 767px)");
        const handler = (e: MediaQueryListEvent) => {
            isMobileRef.current = e.matches;
            setMobileTrigger(n => n + 1);
        };
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    const isMobile = isMobileRef.current;

    const handleFileSelect = useCallback(
        async (file: File) => {
            if (!isModelReady) {
                await loadModel();
            }

            setCurrentFile(file);
            setStreamedText("");
            setFinalText("");
            setStats(null);
            streamedTextRef.current = "";
            setIsTranscribing(true);

            try {
                const audioData = await decodeAudio(file);
                const audioDuration = audioData.length / 16000;
                const startTime = performance.now();

                const onToken = (token: string) => {
                    streamedTextRef.current += token;
                    setStreamedText(streamedTextRef.current);
                };

                const text = await transcribe(audioData, transcriptionOptions, onToken);
                const elapsed = (performance.now() - startTime) / 1000;

                setFinalText(text);
                setStats({ audioDuration, elapsed });

                const entry: TranscriptionEntry = {
                    id: generateId(),
                    title: file.name.replace(EXTENSION_REGEX, ""),
                    audioFileName: file.name,
                    transcript: text,
                    language: transcriptionOptions.language,
                    options: { ...transcriptionOptions },
                    createdAt: Date.now(),
                };
                await saveToHistory(entry);
            }
            catch (err) {
                const message = err instanceof Error ? err.message : "Transcription failed";
                setFinalText(`Error: ${message}`);
            }
            finally {
                setIsTranscribing(false);
            }
        },
        [isModelReady, loadModel, transcribe, transcriptionOptions, setCurrentFile, setStreamedText, setFinalText, setIsTranscribing, saveToHistory],
    );

    const handleHistorySelect = useCallback(
        (entry: TranscriptionEntry) => {
            setCurrentFile(new File([], entry.audioFileName));
            setFinalText(entry.transcript);
            setStreamedText("");
            setIsTranscribing(false);
            setStats(null);
            streamedTextRef.current = "";
        },
        [setCurrentFile, setFinalText, setStreamedText, setIsTranscribing],
    );

    const handleNew = useCallback(() => {
        resetTranscription();
        setStats(null);
        streamedTextRef.current = "";
    }, [resetTranscription]);

    const showTranscriptionView = currentFile && (isTranscribing || finalText);

    return (
        <div className="flex flex-col h-screen">
            <Header
                onMenuClick={() => setSidebarOpen(true)}
                isMobile={isMobile}
            />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    onSelect={handleHistorySelect}
                    onNew={handleNew}
                    isMobile={isMobile}
                />

                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-3xl mx-auto p-6">
                        {showTranscriptionView
                            ? (
                                    <div className="flex flex-col gap-4">
                                        <TranscriptionView stats={stats} />
                                        <Button variant="outline" onClick={handleNew}>
                                            New Transcription
                                        </Button>
                                    </div>
                                )
                            : (
                                    <div className="flex flex-col gap-8">
                                        {/* Language selector */}
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-3">
                                                Language
                                            </h3>
                                            <LanguageSelector />
                                        </div>

                                        {/* Transcription options */}
                                        <Accordion type="single" collapsible>
                                            <AccordionItem value="options">
                                                <AccordionTrigger>
                                                    <span className="text-sm font-medium text-muted-foreground">
                                                        Transcription Options
                                                    </span>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <TranscriptionOptionsPanel />
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        <Separator />

                                        {/* File upload */}
                                        <FileUpload onFileSelect={handleFileSelect} />
                                    </div>
                                )}
                    </div>
                </main>
            </div>

            <AISettings />
        </div>
    );
}

export default App;
