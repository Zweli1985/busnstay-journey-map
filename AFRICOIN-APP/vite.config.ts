import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      external: []
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
      supported: {
        bigint: true
      },
      target: 'esnext'
    }
  },
  resolve: {
    alias: {
      crypto: 'empty',
      stream: 'empty',
      util: 'empty'
    }
  },
  ssr: {
    noExternal: ['@solana/web3.js', '@solana/wallet-adapter-base', '@solana/wallet-adapter-react', '@solana/wallet-adapter-react-ui', '@solana/wallet-adapter-wallets']
  }
})
