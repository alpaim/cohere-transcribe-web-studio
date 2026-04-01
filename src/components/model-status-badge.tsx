import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ModelStatusBadge() {
    const { modelStatus, modelProgress, setShowAISettings } = useAppStore();

    const config = {
        idle: {
            label: "Model not loaded",
            className: "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-300",
        },
        downloading: {
            label: `Downloading... ${modelProgress}%`,
            className: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300",
        },
        ready: {
            label: "Ready",
            className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-300",
        },
        error: {
            label: "Error",
            className: "bg-red-100 text-red-800 hover:bg-red-200 border-red-300",
        },
    }[modelStatus];

    return (
        <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => setShowAISettings(true)}
        >
            <span
                className={cn(
                    "size-2 rounded-full",
                    modelStatus === "ready" && "bg-emerald-500",
                    modelStatus === "downloading" && "bg-blue-500 animate-pulse",
                    modelStatus === "idle" && "bg-amber-500",
                    modelStatus === "error" && "bg-red-500",
                )}
            />
            <Badge variant="outline" className={cn("border px-2 py-0.5 text-xs font-medium", config.className)}>
                {config.label}
            </Badge>
        </Button>
    );
}
