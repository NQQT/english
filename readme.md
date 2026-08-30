# @distribution/english

English distribution — Vite + React app deployable to GitHub Pages.

## Architecture — plugin dashboard

The dashboard (`src/components/EnglishDashboard.tsx`) is a **thin plugin host**: it renders only the shell chrome (header bar, left rail, toolbar card frame, canvas frame) plus four mount points. Every exercise/worksheet is a **self-contained plugin** that fills those slots:

```
EnglishDashboard (host)
  └── DashboardContextProvider (framework/store.tsx — per-host reactive store)
      ├── header slot   ← active plugin's header
      ├── sidebar slot  ← ALL plugins' entries merged into one rail (list)
      ├── toolbar slot  ← active plugin's toolbar
      ├── page slot     ← active plugin's canvas (A4 preview stack)
      └── print slot    ← active plugin's .print-doc tree (outside .app-chrome)
```

### Plugin loading order

`PLUGINS` (`src/plugins/index.ts`) stores the plugin factories **uninvoked**. The dashboard renders first (shell + the first plugin — the default worksheet — in the initial paint), then loads the remaining plugins **one by one** after mount (`usePluginLoader`, `src/framework/loader.ts`), yielding to the browser between loads so the rail grows a plugin per frame. Nothing is constructed at module load time.

### Adding a plugin

1. Create `src/plugins/<Name>Worksheet.ts` exporting a factory function (see `SightWordsWorksheet.ts` for the reference implementation).
2. Add one line to `PLUGINS` in `src/plugins/index.ts`.

### Deleting a plugin

Delete its file and remove its line from `PLUGINS`. Nothing else references it: plugins own their generators, configs, styled components and store slice (namespaced under their id). The host falls back to the remaining plugins automatically — a deleted plugin leaves **no trace** in the store or the UI.

## Scripts

- `dev` — start Vite dev server
- `build` — production build to `dist/`
- `preview` — preview the production build
- `test` — run Vitest test suite
- `typecheck` — TypeScript type checking
- `deploy` — build and publish to GitHub Pages via `gh-pages`