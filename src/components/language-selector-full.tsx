import { getFlagEmoji, LANGUAGES } from "@/components/language-selector";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function LanguageSelector() {
    const { transcriptionOptions, setTranscriptionOptions } = useAppStore();

    return (
        <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(lang => (
                <button
                    key={lang.code}
                    onClick={() => setTranscriptionOptions({ language: lang.code })}
                    className={cn(
                        "px-3 py-1.5 rounded-full text-sm transition-colors border cursor-pointer",
                        transcriptionOptions.language === lang.code
                            ? "bg-primary text-primary-foreground border-transparent"
                            : "bg-muted text-muted-foreground border-border hover:border-primary/50 hover:text-foreground",
                    )}
                >
                    <span className="mr-1.5">{getFlagEmoji(lang.code)}</span>
                    {lang.label}
                    {lang.label !== lang.native && (
                        <span className={cn(
                            "ml-1 text-xs",
                            transcriptionOptions.language === lang.code
                                ? "text-primary-foreground/60"
                                : "text-muted-foreground/60",
                        )}
                        >
                            /
                            {" "}
                            {lang.native}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}
