import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"


const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@app": path.resolve(__dirname, "./src/App")
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @use "@app/styles/variables" as *;
        @use "@app/styles/mixins" as *;
      `
      }, 
      sass: {
        additionalData:
         '@import "@app/styles/variables"\n@import "@app/styles/mixins"\n'
      }
    }
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
//   clearScreen: false,
//   // 2. tauri expects a fixed port, fail if that port is not available
//   server: {
//     port: 1420,
//     strictPort: true,
//     host: host || false,
//     hmr: host
//       ? {
//           protocol: "ws",
//           host,
//           port: 1420,
//         }
//       : undefined,
//     watch: {
//       // 3. tell Vite to ignore watching `src-tauri`
//       ignored: ["**/src-tauri/**"],
//     },
//   },
// }));


clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    // Изменяем здесь: если TAURI_DEV_HOST равен "localhost" или пустой, 
    // принудительно ставим "127.0.0.1" для обхода VPN
    host: (!host || host === "localhost") ? "127.0.0.1" : host,
    hmr: {
      protocol: "ws",
      host: (!host || host === "localhost") ? "127.0.0.1" : host,
      port: 1430, // Вынесем порт HMR на отдельный, чтобы они не дрались с основным портом
    },
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  }
}));