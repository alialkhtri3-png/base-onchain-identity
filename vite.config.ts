import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/base-onchain-identity/',
  plugins: [react()],
})

