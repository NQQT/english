// Vite config for the English distribution.
// `base` is set to "./" so all asset paths are relative — works on any GitHub Pages subpath
// e.g. https://NQQT.github.io/english/ without needing to hardcode the repo name.
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Compile-time app version (R4): read from THIS package's package.json so the
// UI can show "English Worksheets v{version}" without any hardcoded version
// string in source. `new URL(..., import.meta.url)` resolves relative to this
// config file, so it keeps working when the repo is checked out standalone
// (the same self-containment the tsconfig fix established). The sibling
// vitest.config.ts mirrors this define so tests see the same global, and
// src/vite-env.d.ts declares it for tsc (a global declaration avoids turning
// on resolveJsonModule across the package).
const pkg = JSON.parse(
    readFileSync(new URL('./package.json', import.meta.url), 'utf8')
) as { version: string };

export default defineConfig({
    plugins: [react()],
    // Injected as a compile-time string literal; replaced everywhere in src.
    define: {
        __APP_VERSION__: JSON.stringify(pkg.version)
    },
    // Relative base path so the build works on GitHub Pages subpaths
    base: './',
    server: {
        // Never watch the service's shared writable data root: chokidar
        // holding files under temporary/database while the underload service
        // writes them surfaces as sporadic EPERM failures on Windows.
        watch: {
            ignored: ['**/temporary/**']
        }
    },
    build: {
        outDir: 'dist',
    },
});