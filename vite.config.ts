import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": "/src",
        },
    },
    server: {
        // Needed only for local dev behind private HTTPS reverse proxy.
        // WebGPU requires a secure context, and we access Vite through a private domain
        // served by my homelab nginx. Using `true` avoids hardcoding that private host in git.
        // Do not copy this to production; prefer explicit hosts when possible.
        allowedHosts: true,
    },
});
