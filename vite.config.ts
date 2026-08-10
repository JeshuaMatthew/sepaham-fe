import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // React Compiler dijalankan lewat pass babel terpisah (Vite 8 / rolldown).
    babel({ presets: [reactCompilerPreset()] }),
    // Tailwind v4 sebagai plugin Vite tersendiri — BUKAN babel preset.
    tailwindcss(),
  ],
})
