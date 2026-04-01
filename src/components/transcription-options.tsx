import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useAppStore } from "@/lib/store";

interface OptionConfig {
    key: keyof Pick<
        import("@/types").TranscriptionOptions,
        "max_new_tokens" | "temperature" | "top_p" | "repetition_penalty" | "num_beams"
    >;
    label: string;
    min: number;
    max: number;
    step: number;
    format: (v: number) => string;
}

const OPTIONS: OptionConfig[] = [
    {
        key: "max_new_tokens",
        label: "Max Tokens",
        min: 128,
        max: 2048,
        step: 128,
        format: v => v.toString(),
    },
    {
        key: "temperature",
        label: "Temperature",
        min: 0,
        max: 2,
        step: 0.1,
        format: v => v.toFixed(1),
    },
    {
        key: "top_p",
        label: "Top P",
        min: 0,
        max: 1,
        step: 0.05,
        format: v => v.toFixed(2),
    },
    {
        key: "repetition_penalty",
        label: "Repetition Penalty",
        min: 1,
        max: 2,
        step: 0.1,
        format: v => v.toFixed(1),
    },
    {
        key: "num_beams",
        label: "Beams",
        min: 1,
        max: 8,
        step: 1,
        format: v => v.toString(),
    },
];

export function TranscriptionOptions() {
    const { transcriptionOptions, setTranscriptionOptions } = useAppStore();

    return (
        <div className="grid gap-4">
            {OPTIONS.map(opt => (
                <div key={opt.key} className="grid gap-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm text-muted-foreground">
                            {opt.label}
                        </Label>
                        <span className="text-sm font-mono text-foreground tabular-nums">
                            {opt.format(transcriptionOptions[opt.key])}
                        </span>
                    </div>
                    <Slider
                        value={[transcriptionOptions[opt.key]]}
                        min={opt.min}
                        max={opt.max}
                        step={opt.step}
                        onValueChange={([value]) =>
                            setTranscriptionOptions({ [opt.key]: value })}
                    />
                </div>
            ))}
        </div>
    );
}
