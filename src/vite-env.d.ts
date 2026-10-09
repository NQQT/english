/// <reference types="vite/client" />

// Vite client types provide ambient module declarations for asset imports
// (e.g. `import './app.css'`), which the TypeScript compiler would otherwise
// reject during `tsc --noEmit`.

// Compile-time app version injected by vite.config.ts AND vitest.config.ts
// (`define`, read from this package's package.json). Ambient declaration so
// `tsc --noEmit` accepts the global without enabling resolveJsonModule
// (sibling convention).
declare const __APP_VERSION__: string;