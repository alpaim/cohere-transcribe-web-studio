import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTranscriber } from "@/hooks/use-transcriber";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AISettings() {
    const {
        modelStatus,
        modelProgress,
        modelStatusText,
        modelError,
        modelSettings,
        showAISettings,
        setShowAISettings,
        setModelSettings,
    } = useAppStore();

    const { loadModel } = useTranscriber();

    const handleDownload = async () => {
        await loadModel();
    };

    return (
        <Dialog open={showAISettings} onOpenChange={setShowAISettings}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>AI Settings</DialogTitle>
                    <DialogDescription>
                        Manage the transcription model and its settings.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Model Status */}
                    <div className="grid gap-3">
                        <h4 className="text-sm font-medium">Model Status</h4>
                        <div className="flex items-center gap-3">
                            <span
                                className={cn(
                                    "size-2.5 rounded-full",
                                    modelStatus === "ready" && "bg-emerald-500",
                                    modelStatus === "downloading" && "bg-blue-500 animate-pulse",
                                    modelStatus === "idle" && "bg-amber-500",
                                    modelStatus === "error" && "bg-red-500",
                                )}
                            />
                            <span className="text-sm text-muted-foreground">
                                {modelStatusText || "Not loaded"}
                            </span>
                        </div>

                        {modelStatus === "downloading" && (
                            <Progress value={modelProgress} className="h-2" />
                        )}

                        {modelError && (
                            <p className="text-sm text-destructive">{modelError}</p>
                        )}
                    </div>

                    <Separator />

                    {/* Model Settings */}
                    <div className="grid gap-3">
                        <h4 className="text-sm font-medium">Model Configuration</h4>

                        <div className="grid gap-2">
                            <label className="text-sm text-muted-foreground">
                                Quantization
                            </label>
                            <Select
                                value={modelSettings.dtype}
                                onValueChange={v =>
                                    setModelSettings({ dtype: v as "q4" | "q8" })}
                                disabled={modelStatus === "downloading" || modelStatus === "ready"}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="q4">
                                        <div className="flex items-center gap-2">
                                            <span>q4</span>
                                            <Badge variant="outline" className="text-xs">
                                                Smaller, faster
                                            </Badge>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="q8">
                                        <div className="flex items-center gap-2">
                                            <span>q8</span>
                                            <Badge variant="outline" className="text-xs">
                                                Larger, more accurate
                                            </Badge>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm text-muted-foreground">
                                Device
                            </label>
                            <Select
                                value={modelSettings.device}
                                onValueChange={v =>
                                    setModelSettings({ device: v as "webgpu" | "wasm" })}
                                disabled={modelStatus === "downloading" || modelStatus === "ready"}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="webgpu">
                                        <div className="flex items-center gap-2">
                                            <span>WebGPU</span>
                                            <Badge variant="outline" className="text-xs">
                                                Recommended
                                            </Badge>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="wasm">
                                        <span>CPU (fallback)</span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Separator />

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                        {modelStatus !== "ready" && modelStatus !== "downloading" && (
                            <Button onClick={handleDownload}>
                                Download Model
                            </Button>
                        )}

                        {modelStatus === "ready" && (
                            <p className="text-sm text-muted-foreground text-center">
                                Model is loaded and ready to use.
                            </p>
                        )}

                        {modelStatus === "downloading" && (
                            <Button disabled>
                                Downloading...
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
