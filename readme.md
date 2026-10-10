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
| 3 | Year 2 + intro grammar (conjunctions, apostrophes, commas, word building, compounds, speech, pronouns) + the literacy set (reading comprehension, crafting sentences, writing projects, editing & proofreading) — 29 types | 4 |
| 4 | Year 3 + figurative language, homographs — 31 types | 5 |
| 5 | Year 4 + idioms, advanced punctuation, verb agreement — full 34 | 6 |
| 6 | same 34-type catalogue as Year 5, but level-gated variants deepen inside families (embedded-clause combining, Greek/Latin root spotting, bias/register editing, adapted writing structures) and the caps deepen (10-word sentences) | 6 |

Every year keeps all earlier years' worksheets; higher grades deepen the word set and sentence length rather than adding new topics.

## Year 3–6 literacy families (T5)

Four substantive families carry the upper-primary progression, each routed by an **explicit year-level knob** (`caps.level` in `grades.ts`) — never inferred from word tier:

| Family | Source file | Year 3 → Year 6 progression |
|---|---|---|
| Reading Comprehension (one passage + 3 ruled questions per page) | `src/plugins/ComprehensionWorksheet.ts` | Y3 literal/infer/evidence on short narratives → Y6 analyse style, tone and bias across argument/source texts (6 original passages per year, disjoint banks) |
| Crafting Sentences | `src/plugins/CraftWorksheet.ts` | Y3 reorder/add detail/join with and-but-or → Y4 when/while/although + adverbial detail → Y5 complex sentences (reason, purpose, condition, concession) → Y6 embedded clauses, varied openers, formal objective tone |
| Writing Projects (plan scaffold + full page of ruled space) | `src/plugins/WritingWorksheet.ts` | Y3 recount/informative/persuasive paragraphs → Y4 text stages + tension → Y5 purpose-specific structures, dialogue, viewpoint → Y6 review, letter, technical and adapted structures |
| Editing & Proofreading | `src/plugins/EditingWorksheet.ts` | Y3 capitals + end punctuation → Y4 speech marks/confused words → Y5 required commas/apostrophes + subject–verb agreement (+ formal-register rewrites) → Y6 precision, bias and register |

Crafting prints **4 rows per A4 page** and Editing prints **5** (T12: with the teacher key on, 6 rows exceeded the printable grid height on Y4–Y6 pages and the bottom answer lines would clip; T15: a corrected analytical capacity model — per-line wrapping honouring forced newlines, plus inter-row gaps and key margins — showed 5 keyed Craft rows still clipped under the conservative stress metric, so Craft drops to 4 while Editing's worst page stays well inside the 915px budget at 5).

The existing sheets also progress by level: **Conjunctions** adds subordinate-conjunction blanks (Y4+), subordinate-clause joins (Y5+) and embedded relative clauses (Y6); **Prefixes & Suffixes** adds Greek/Latin root work (Y5+, word-spotting at Y6). Year 3 (and Year 4 for affixes) streams are byte-identical to before the gating was added.

**Curriculum basis (honest).** The scope and progression of the Year 3–6 families are informed by Australian Curriculum v9 English, and the specific content descriptions below were **verified against the official curriculum documents**:

- Learning-area downloads (HTML/PDF per year band): <https://v9.australiancurriculum.edu.au/downloads/learning-areas>
- English F–10 curriculum content, version 9 (authoritative document, DOCX): <https://v9.australiancurriculum.edu.au/content/dam/en/curriculum/ac-version-9/downloads/english/english-curriculum-content-f-6-v9.docx>

Verified code mapping (each code is `AC9E<year>` + the sub-strand number; only codes checked against the official content descriptions are listed — `—` means the year continues an earlier year's code line at greater depth rather than adding a newly verified code):

| Family | Year 3 | Year 4 | Year 5 | Year 6 |
|---|---|---|---|---|
| Reading Comprehension | AC9E3LE03 (responding to characters, setting and mood), AC9E3LE05 (creating literary characters, settings and storylines) | AC9E4LE03 (author's craft and tension) | — | AC9E6LE03 (author's style), AC9E6LE04 (sound devices and imagery in poetry) |
| Crafting Sentences | AC9E3LA06 (combining clauses/sentences), AC9E3LA04 (writing paragraphs) | AC9E4LA08 (adverbial and prepositional phrases) | — | AC9E6LA01 (formality and register), AC9E6LA09 (commas at clause boundaries) |
| Writing Projects | — | AC9E4LA03 (text structure and cohesive devices in composition) | AC9E5LA02 (attributing others' opinions in texts) | AC9E6LE05 (creating and adapting literary texts), AC9E6LA03 (adapting text structures) |
| Editing & Proofreading | AC9E3LA11 (sentence capitalisation and end punctuation) | AC9E4LY09 (spelling patterns, incl. unstressed syllables), AC9E4LY11 (homophones) | AC9E5LA09 (comma use) | AC9E6LA09 (comma use) |

Three honest limits:

1. **National baseline only.** These are generic Australian Curriculum v9 resources — no state or territory adaptation (e.g. WA/NSW/VIC variants) is claimed or applied.
2. **Partial written practice, not a complete curriculum.** The worksheets cover reading and written production only; speaking and listening, interaction, and creating and editing *digital* texts are part of the learning area but are not printable worksheet content, so this package is practice within the English curriculum, not the whole curriculum.
3. **Original resources, no endorsement.** All passages, sentences and items are original content written for this package; no ACARA endorsement is claimed, and no full content-description coverage is claimed.

## Teacher answer key

The toolbar has an **Answer key** toggle (off by default). When on, every printed and previewed question gains an `Answer: …` line — exact model answers for closed items, and marking guidance (`Example: … (any sensible … is accepted)` / `Success criteria: …`) for open-ended compose/writing tasks, so the key never pretends a single right answer. The setting lives in the shared dashboard session: it applies across worksheets and to the print output; student sheets print answer-free.

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