import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "public",
  publicDir: false,
  plugins: [
    {
      name: "script-alias",
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url === "/script" || req.url === "/script.js") {
            req.url = "/@fs" + resolve(__dirname, "assets/main.ts");
          }
          next();
        });
      },
    },
  ],
  build: {
    outDir: resolve(__dirname, "public"),
    emptyOutDir: false,
    rollupOptions: {
      input: {
        script: resolve(__dirname, "assets/main.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "[name][extname]",
      },
    },
  },
  base: "./",
});
