import { getFlagEmoji, LANGUAGES } from "@/components/language-selector";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";

export function LanguageSelector() {
    const { transcriptionOptions, setTranscriptionOptions } = useAppStore();

    const currentLang = LANGUAGES.find(l => l.code === transcriptionOptions.language);

    return (
        <Select
            value={transcriptionOptions.language}
            onValueChange={v => setTranscriptionOptions({ language: v })}
        >
            <SelectTrigger className="w-full">
                <SelectValue>
                    {currentLang && (
                        <span className="flex items-center gap-2">
                            <span>{getFlagEmoji(currentLang.code)}</span>
                            <span>{currentLang.label}</span>
                            {currentLang.label !== currentLang.native && (
                                <span className="text-muted-foreground">
                                    /
                                    {" "}
                                    {currentLang.native}
                                </span>
                            )}
                        </span>
                    )}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                            <span>{getFlagEmoji(lang.code)}</span>
                            <span>{lang.label}</span>
                            {lang.label !== lang.native && (
                                <span className="text-muted-foreground">
                                    /
                                    {" "}
                                    {lang.native}
                                </span>
                            )}
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
