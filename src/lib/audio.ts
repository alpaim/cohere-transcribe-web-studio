const AUDIO_SAMPLE_RATE = 16000;

export async function decodeAudio(file: File): Promise<Float32Array> {
    const audioCtx = new AudioContext({ sampleRate: AUDIO_SAMPLE_RATE });
    const arrayBuffer = await file.arrayBuffer();
    const decoded = await audioCtx.decodeAudioData(arrayBuffer);
    const float32 = decoded.getChannelData(0);
    await audioCtx.close();
    return float32;
}

export function formatDuration(seconds: number): string {
    if (seconds < 60)
        return `${seconds.toFixed(1)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs.toFixed(0)}s` : `${mins}m`;
}

export function getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
        const audioCtx = new AudioContext();
        const reader = new FileReader();
        reader.onload = () => {
            audioCtx.decodeAudioData(reader.result as ArrayBuffer).then((buffer) => {
                resolve(buffer.duration);
                audioCtx.close();
            }).catch(reject);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

export function formatFileSize(bytes: number): string {
    if (bytes < 1024)
        return `${bytes} B`;
    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
