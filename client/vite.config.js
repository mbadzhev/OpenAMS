import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return defineConfig({
    plugins: [react()],
    server: {
      port: env.CLIENT_PORT,
      proxy: {
        "/api": {
          target: env.SERVER_URI,
          changeOrigin: true,
          cors: true,
        },
      },
    },
  });
};
