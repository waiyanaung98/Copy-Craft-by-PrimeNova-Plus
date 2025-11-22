import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve((process as any).cwd(), './'),
      },
    },
    define: {
      // This maps the 'VITE_API_KEY' from Vercel settings to 'process.env.API_KEY' in your code
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY),
      // Prevents "ReferenceError: process is not defined" in the browser
      'process.env': {},
    },
  };
});