import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
	react(),
  ],
  resolve: {
    alias: {
      "@/api": path.resolve(__dirname, "src/api"),
      "@/auth": path.resolve(__dirname, "src/auth"),
      "@/components": path.resolve(__dirname, "src/components"),
      "@/constants": path.resolve(__dirname, "src/constants"),
      "@/hooks": path.resolve(__dirname, "src/hooks"),
      "@/pages": path.resolve(__dirname, "src/pages"),
      "@/routes": path.resolve(__dirname, "src/routes"),
      "@/services": path.resolve(__dirname, "src/services"),
      "@/types": path.resolve(__dirname, "src/types"),
      "@/utils": path.resolve(__dirname, "src/utils"),
      "@/validation": path.resolve(__dirname, "src/validation"),
    },
  },
})
