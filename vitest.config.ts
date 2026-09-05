// Vitest config scoped to this English distribution.
// Uses jsdom environment for React component testing with global APIs.
import { defineConfig } from 'vitest/config';

export default defineConfig({
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