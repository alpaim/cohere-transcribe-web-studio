import type { TranscriptionEntry } from "@/types";
import { useCallback, useEffect } from "react";
import { getFlagEmoji } from "@/components/language-selector";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function formatRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60)
        return "Just now";
    if (minutes < 60)
        return `${minutes}m ago`;
    if (hours < 24)
        return `${hours}h ago`;
    if (days <= 1)
        return "Yesterday";
    if (days <= 7)
        return `${days}d ago`;

    return new Date(timestamp).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
    });
}

function HistoryEntry({
    entry,
    isSelected,
    onSelect,
    onDelete,
}: {
    entry: TranscriptionEntry;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
}) {
    return (
        <div
            className={cn(
                "group flex flex-col gap-1 rounded-lg p-3 cursor-pointer transition-colors",
                isSelected
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted border border-transparent",
            )}
            onClick={() => onSelect(entry.id)}
        >
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium truncate flex-1">
                    {entry.title}
                </span>
                <div className="flex items-center gap-1.5 ml-2">
                    <span className="text-xs">{getFlagEmoji(entry.language)}</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(entry.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                    >
                        <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                    {entry.audioFileName}
                </span>
                <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(entry.createdAt)}
                </span>
            </div>
        </div>
    );
}

interface SidebarContentProps {
    onSelect: (entry: TranscriptionEntry) => void;
    onNew: () => void;
}

function SidebarContent({ onSelect, onNew }: SidebarContentProps) {
    const { history, selectedHistoryId, selectHistoryEntry, deleteFromHistory, loadHistory } = useAppStore();

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const handleSelect = useCallback(
        (id: string) => {
            const entry = history.find(e => e.id === id);
            if (entry) {
                selectHistoryEntry(id);
                onSelect(entry);
            }
        },
        [history, selectHistoryEntry, onSelect],
    );

    const handleDelete = useCallback(
        (id: string) => {
            deleteFromHistory(id);
        },
        [deleteFromHistory],
    );

    return (
        <div className="flex flex-col h-full">
            <div className="p-4">
                <Button onClick={onNew} className="w-full" size="sm">
                    <svg className="size-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    New Transcription
                </Button>
            </div>

            <ScrollArea className="flex-1 px-2">
                <div className="flex flex-col gap-1 pb-4">
                    {history.length === 0
                        ? (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    No transcriptions yet
                                </p>
                            )
                        : (
                                history.map(entry => (
                                    <HistoryEntry
                                        key={entry.id}
                                        entry={entry}
                                        isSelected={selectedHistoryId === entry.id}
                                        onSelect={handleSelect}
                                        onDelete={handleDelete}
                                    />
                                ))
                            )}
                </div>
            </ScrollArea>
        </div>
    );
}

interface SidebarProps {
    onSelect: (entry: TranscriptionEntry) => void;
    onNew: () => void;
    isMobile: boolean;
}

export function Sidebar({ onSelect, onNew, isMobile }: SidebarProps) {
    const { sidebarOpen, setSidebarOpen } = useAppStore();

    if (isMobile) {
        return (
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent side="left" className="w-72 p-0">
                    <SheetHeader className="p-4 pb-0">
                        <SheetTitle>History</SheetTitle>
                    </SheetHeader>
                    <SidebarContent onSelect={onSelect} onNew={onNew} />
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <aside className="w-72 border-r bg-muted/30 flex flex-col h-full">
            <div className="p-4 pb-2">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    History
                </h2>
            </div>
            <SidebarContent onSelect={onSelect} onNew={onNew} />
        </aside>
    );
}
