// Vitest config scoped to this English distribution.
// Uses jsdom environment for React component testing with global APIs.
//
// NOTE: vitest.config.ts REPLACES vite.config.ts (it is not merged with it),
// so the __APP_VERSION__ define from vite.config.ts must be mirrored here —
// tests assert the exact rendered title, which depends on that global.
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';

const pkg = JSON.parse(
    readFileSync(new URL('./package.json', import.meta.url), 'utf8')
) as { version: string };

export default defineConfig({
    // Same compile-time version injection as vite.config.ts (see notes there).
    define: {
        __APP_VERSION__: JSON.stringify(pkg.version)
    },
    test: {
        environment: 'jsdom',
        globals: true,
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        passWithNoTests: true,
        // The dashboard loads its ~21 worksheet plugins ONE BY ONE after mount
        // (chained macrotasks, framework/loader.ts), and the integration
        // suites (EnglishDashboard.test.tsx, plugins.test.tsx) sit on that
        // whole chain. When the monorepo test run goes wide (yarn runs every
        // workspace in parallel) the 5s default testTimeout is not enough
        // headroom. 15s keeps a margin without masking hangs.
        testTimeout: 15000,
    },
});