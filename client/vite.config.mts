import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import svgrPlugin from "vite-plugin-svgr";
import jsonConfig from "../config/config.json" with { type: "json" };

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgrPlugin(),
    // Injects the config data into the index.html
    createHtmlPlugin({
      inject: {
        data: {
          name: jsonConfig.name,
          themeColour: jsonConfig.colours.backgroundColour,
          description: jsonConfig.metaData.description,
          analyticsSrc: jsonConfig.metaData.analytics.analyticsSrc,
          websiteId: jsonConfig.metaData.analytics.websiteId,
        },
      },
    }),
  ],
  build: {
    outDir: "build",
  },
  resolve: {
    tsconfigPaths: true,
  },
});
