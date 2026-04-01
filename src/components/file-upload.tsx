import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    disabled?: boolean;
}

export function FileUpload({ onFileSelect, disabled }: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragCounterRef = useRef(0);
    const { isTranscribing } = useAppStore();

    const isDisabled = disabled || isTranscribing;

    const handleFile = useCallback(
        (file: File) => {
            if (!file)
                return;
            onFileSelect(file);
        },
        [onFileSelect],
    );

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (isDisabled)
            return;
        dragCounterRef.current++;
        if (dragCounterRef.current === 1)
            setIsDragging(true);
    }, [isDisabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        dragCounterRef.current--;
        if (dragCounterRef.current === 0)
            setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            dragCounterRef.current = 0;
            setIsDragging(false);
            if (isDisabled)
                return;
            const file = e.dataTransfer.files?.[0];
            if (file)
                handleFile(file);
        },
        [isDisabled, handleFile],
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file)
                handleFile(file);
            if (inputRef.current)
                inputRef.current.value = "";
        },
        [handleFile],
    );

    return (
        <div
            className={cn(
                "relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-12 transition-colors",
                isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50",
                isDisabled && "opacity-50 pointer-events-none",
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="flex flex-col items-center gap-2 text-center">
                <svg
                    className="size-10 text-muted-foreground"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <div>
                    <p className="text-sm font-medium text-foreground">
                        Drop audio or video file here
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        or click to browse
                    </p>
                </div>
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={isDisabled}
            >
                Choose File
            </Button>

            <input
                ref={inputRef}
                type="file"
                accept="audio/*,video/*"
                className="hidden"
                onChange={handleChange}
            />
        </div>
    );
}
