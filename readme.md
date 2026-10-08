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

## Syllabus — staged progression

Which worksheets a grade can use is **staged and cumulative** (see `src/framework/grades.ts`):

| Year | Catalogue | Word tier |
|---|---|---|
| Prep | starter set: alphabet order, beginning sounds, vowels, sight words + letter/word/number tracing | 1 |
| 1 | the early-reading set (sight, blending, beginning sounds, vowels, opposites, rhymes, sentences, alphabet order, capitals, punctuation, twin words, plurals, similar words, word gaps, spelling) | 2 |
| 2 | Year 1 + syllables, nouns/verbs, past tense | 3 |
| 3 | Year 2 + intro grammar (conjunctions, apostrophes, commas, word building, compounds, speech, pronouns) | 4 |
| 4 | Year 3 + figurative language, homographs | 5 |
| 5 | Year 4 + idioms, advanced punctuation, verb agreement (full 30) | 6 |
| 6 | same catalogue as Year 5; only the caps deepen (10-word sentences) | 6 |

Every year keeps all earlier years' worksheets; higher grades deepen the word set and sentence length rather than adding new topics.

## Learning aids (picture cues + tile scaffolds)

Years 1–3 sheets print two kinds of learning aids (and Prep word tracing its word pictures); Years 4–6 print exactly as before:

**Picture cues** — small inline-SVG pictograms beside the words they teach (animals, foods, objects, concepts, colour swatches — see `src/framework/visuals.tsx`): a "pen" row prints a pen pictogram, "the plural of cat" ONE cat, "the singular of dogs" THREE. The quantity is announced to screen readers as a single accessible image ("Picture of a cat, 3 copies").

**Tile scaffolds** (Years 1–3 only, `src/framework/tiles.tsx`): the missing-letter slot in an Alphabet Order sequence prints as a bordered **write-box** the child writes into, and Sentence Building prints the scrambled word bank as a run of bordered **word tiles** (word-card style) with word-sized write-boxes.

Rules:

- **Cue/tile-only**: a picture or tile is a learning aid, never the answer — generators attach a picture only where it cannot reveal what the child must produce (sight/spelling/word-gap rows, multiple-choice options, and the scrambled sentence tiles — which stay in their scrambled display order — never give the answer away).
- **Early years only**: the generators gate cues on the Year 1–3 band (word tiers 2–4, `isEarlyCueBand` in `grades.ts`), and Prep keeps picture cues only on word tracing. Year 4–6 sheets print exactly as before.
- **Offline + print-safe**: cues are deterministic inline SVG (no emoji, no image files, no network) and tiles are 2px ink borders, both rendered in the on-screen preview and the hidden print tree in a greyscale-safe palette.
- Adding a cue for a new bank word = adding one SVG entry to the `PICS` registry in `visuals.tsx`; a bank word with no entry simply prints without a cue.

## Scripts

- `dev` — start Vite dev server
- `build` — production build to `dist/`
- `preview` — preview the production build
- `test` — run Vitest test suite
- `typecheck` — TypeScript type checking
- `deploy` — build and publish to GitHub Pages via `gh-pages`