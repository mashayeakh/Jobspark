import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/server.ts'],
    format: ['esm'],
    platform: 'node',
    target: 'node20',
    outDir: 'dist',
    clean: true,
    minify: true,
    shims: true,
    external: ['pg-native'],
    noExternal: ['prisma/generated'],
})