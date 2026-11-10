import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    fs: {
      deny: [
        '.env',
        '.env.*',
        '*.{crt,pem}',
        'serviceAccountKey*.json',
        '*.cjs',
        'seed.cjs',
      ],
    },
  },
});
