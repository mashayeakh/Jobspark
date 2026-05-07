import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/server.ts'],
    format: ['cjs'],
    platform: 'node',
    target: 'node20',
    outDir: 'dist',
    external: ['pg-native', 'puppeteer'],
    noExternal: ['iconv-lite', 'body-parser', 'raw-body', 'express'],
})