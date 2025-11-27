import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon-16.png", "favicon-32.png", "apple-touch-icon.png"],
      manifest: {
        name: "Minha To-Do List",
        short_name: "To-Do",
        description: "Uma to-do list moderna, rápida e responsiva.",
        theme_color: "#7B2FF7",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/logo-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logo-256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "/logo-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/logo-1024.png",
            sizes: "1024x1024",
            type: "image/png",
          }
        ],
      },
    }),
  ],
});
