import { defineConfig } from 'vite';
import jsonConfig from '../config/config.json';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import { createHtmlPlugin } from 'vite-plugin-html';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgrPlugin(),
    // Injects the config data into the index.html
    createHtmlPlugin({
      inject: {
        data: {
          'name': jsonConfig.name,
          'themeColour': jsonConfig.colours.backgroundColour,
          'description': jsonConfig.metaData.description,
          'dataDomain': jsonConfig.metaData.analytics.dataDomain,
          'analyticsSrc': jsonConfig.metaData.analytics.analyticsSrc
        }
      }
    })
  ],
  build: {
    outDir: 'build',
  },
});
