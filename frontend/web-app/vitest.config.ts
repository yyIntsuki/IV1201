import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
    plugins: [react()],
    resolve: { alias: { "@": path.resolve(__dirname, "src") } },
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "./tests/setup.ts",
        include: ["tests/**/*.test.{ts,tsx}"],
        exclude: ["node_modules", "dist"],
        coverage: { reporter: ["text", "json", "html"], exclude: ["node_modules", "dist", "tests"] },
    },
});
