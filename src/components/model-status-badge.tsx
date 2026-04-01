import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ModelStatusBadge() {
    const { modelStatus, modelProgress, setShowAISettings } = useAppStore();

    const getStatusLabel = () => {
        switch (modelStatus) {
            case "idle":
                return "Model not loaded";
            case "downloading":
                return `Downloading... ${modelProgress}%`;
            case "ready":
                return null;
            case "error":
                return "Error";
        }
    };

    const label = getStatusLabel();

    return (
        <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => setShowAISettings(true)}
        >
            <span
                className={cn(
                    "size-2 rounded-full shrink-0",
                    modelStatus === "ready" && "bg-emerald-500",
                    modelStatus === "downloading" && "bg-blue-500 animate-pulse",
                    modelStatus === "idle" && "bg-amber-500",
                    modelStatus === "error" && "bg-red-500",
                )}
            />
            {label && (
                <span className={cn(
                    "text-xs font-medium hidden sm:inline",
                    modelStatus === "idle" && "text-amber-700",
                    modelStatus === "downloading" && "text-blue-700",
                    modelStatus === "error" && "text-red-700",
                )}
                >
                    {label}
                </span>
            )}
        </Button>
    );
}
