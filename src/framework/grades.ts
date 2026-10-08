// ─────────────────────────────────────────────────────────────────────────────
// FRAMEWORK — grade catalogue (the dashboard's configuration).
//
// Part of the DASHBOARD FRAMEWORK, not of any worksheet plugin: the grades
// define the word-set caps every plugin's generator consumes and which
// worksheet ids each grade offers (`available`). Plugins read this
// configuration through the DashboardFramework they receive at load time.
//
// Grades run 0..12 where 0 = Prep and 1..12 = Year 1..Year 12 (AU/UK labelling).
// Prep..Year 6 have real content. The primary catalogue is a STAGED,
// CUMULATIVE progression (it is curated to mirror the Australian Curriculum
// F–6 scope, but the dashboard makes no claim of externally verified
// alignment with any official curriculum):
//   - Prep = letter awareness/beginning sounds plus handwriting tracing;
//   - Y1  = the early-reading set (blending, sight words, opposites, rhymes,
//     first spelling & sentence work);
//   - Y2  = adds syllables, noun/verb recognition, past tense and tricky
//     spellings;
//   - Y3  = adds the INTRODUCTORY grammar set: conjunctions, apostrophes
//     (possessives + contractions), comma lists, prefixes/suffixes, compound
//     words, direct speech and pronouns;
//   - Y4  = adds the first advanced vocabulary types: figurative language and
//     homographs;
//   - Y5  = adds the remaining advanced set: idioms, dialogue punctuation and
//     subject–verb agreement;
//   - Y6  = the full cumulative catalogue (every Y3-advanced type plus the
//     deepest word set before high school).
// No type is ever removed from a later year's list — each year keeps every
// earlier year's types (cumulative), so a Y6 sheet offers everything a Y3
// sheet offers. Grades 7..12 render a "coming soon" placeholder.
//
// `caps` drives the generators in the worksheet plugins. English worksheets
// are driven by WORD SETS rather than number ranges, so the caps are
// set-size knobs:
//   - wordTier:    which word bank the word-based generators draw from
//                  (1 = Prep starter set, 2 = Year 1 common set, 3 = Year 2
//                  extended set, 4 = Year 3, 5 = Year 4, 6 = Years 5–6;
//                  higher tiers SUPERSEDE lower ones, i.e. a tier-6 sheet may
//                  also contain tier-1 words)
//   - sentenceLen: max number of words in a sentence-building line
//   - tricky:      Year 2+ forms — irregular plurals, tricky long words and
//                  extended homophone pairs become available
// ─────────────────────────────────────────────────────────────────────────────

export type GradeId = number;

// ── Learning-visual cue band ─────────────────────────────────────────────────
// Years 1–3 (word tiers 2..4) are the documented band for the picture cues
// (and tile scaffolds) printed beside early-years words. Tier 1 is Prep — its
// NON-TRACING sheets stay plain (the Prep word-tracing sheet keeps its word
// pictures by design: the picture tells the child WHICH word they trace).
// Tiers 5..6 (Years 4–6) never carry cue metadata, so their printed markup
// is unchanged. Every generator that may attach a cue/uses tile scaffolding
// funnels through this one band check.
export function isEarlyCueBand(caps: Caps): boolean {
    return caps.wordTier >= 2 && caps.wordTier <= 4;
}

export type GradeConfig = {
    id: GradeId;
    // Short pill label shown in the top-right grade selector (P, 1..12).
    short: string;
    // Full label used in titles ("Prep", "Year 1", ...).
    label: string;
    // Whether any sheet content is implemented for this grade at all.
    implemented: boolean;
    // Which worksheet plugin ids are selectable in the left rail for this grade.
    available: string[];
    // Word-set knobs consumed by the problem generators.
    caps: {
        // Word bank tier: 1 = Prep starter set, 2 = Year 1 set, 3 = Year 2 set,
        // 4 = Year 3 set, 5 = Year 4 set, 6 = Years 5–6 set.
        wordTier: number;
        // Max words in a sentence-building line.
        sentenceLen: number;
        // Unlocks Year 2+ tricky forms (irregular plurals, tricky spelling,
        // extended homophone pairs).
        tricky: boolean;
    };
};

// The generator-facing slice of a grade config (consumed by plugin generators).
export type Caps = GradeConfig['caps'];

// The catalogue order for the early-reading types (shared by Y1/Y2 lists).
const EARLY_READING = [
    'sight', 'blend', 'sounds', 'vowel', 'opposite', 'rhyme', 'sentence',
    'letters', 'capital', 'punct', 'homophone', 'plural', 'similar', 'wordgap', 'spelling'
] as const;

// The Year-2-only extensions of the early-reading set (in rail order).
const Y2_EXTRA = ['syllable', 'grammar', 'tense'] as const;

// The STAGED upper-primary ladder (see plugins/index.ts for the id ↔
// worksheet mapping). Each rung adds a small, coherent batch of types on top
// of every earlier rung — cumulative, so Y6 offers the whole catalogue and
// no type ever disappears from a later year:
const Y3_INTRO = [
    // Introductory Year-3 grammar: clause joiners, apostrophes, comma lists,
    // word building (prefixes/suffixes + compounds), quoted speech, pronouns.
    'conjunction', 'apostrophe', 'comma', 'affix', 'compound', 'speech', 'pronoun'
] as const;
const Y4_ADVANCED = [
    // First advanced vocabulary types (Y4–6 material): figurative language +
    // same-spelling/different-meaning words.
    'figurative', 'homograph'
] as const;
const Y5_ADVANCED = [
    // The remaining advanced set (Y5–6 material): idioms, dialogue
    // punctuation and subject–verb agreement.
    'idiom', 'advpunct', 'agreement'
] as const;

// The full Year-3 catalogue: early-reading + Y2 extensions + Y3 intro set.
const YEAR_3 = [...EARLY_READING, ...Y2_EXTRA, ...Y3_INTRO] as const;
// Year 4 adds the first advanced vocabulary types on top of the Y3 set.
const YEAR_4 = [...YEAR_3, ...Y4_ADVANCED] as const;
// Year 5 adds the remaining advanced set; Year 6 = the complete catalogue.
const YEAR_5 = [...YEAR_4, ...Y5_ADVANCED] as const;
const UPPER_PRIMARY: readonly string[] = YEAR_5;

// Grade 0 (Prep) through 6 are fully covered; grades 7..12 are listed so the
// selector is complete but flagged `implemented: false`.
const CONFIGS: GradeConfig[] = [
    {
        id: 0,
        short: 'P',
        label: 'Prep',
        implemented: true,
        // Prep keeps the narrow letter-awareness scope: alphabet order,
        // beginning sounds, vowels in short words, real-word recognition —
        // plus the handwriting-tracing set (letter/word/number shape
        // practice). Tracing is a Prep skill: Y1+ get reading/writing
        // tasks instead, so the trace types are NOT listed for them.
        available: ['letters', 'sounds', 'vowel', 'sight', 'letterTrace', 'wordTrace', 'numberTrace'],
        caps: {
            wordTier: 1,
            sentenceLen: 2,
            tricky: false
        },
    },
    {
        id: 1,
        short: '1',
        label: 'Year 1',
        implemented: true,
        // Year 1 gets the full early-reading catalogue (common word set):
        // sight & real words, blending, beginning sounds, vowels, opposites,
        // rhymes, two-to-four word sentences, alphabet order, capitals,
        // punctuation, basic twin words, regular plurals, similar words,
        // word gaps and short-word spelling.
        available: [...EARLY_READING],
        caps: {
            wordTier: 2,
            sentenceLen: 4,
            tricky: false
        },
    },
    {
        id: 2,
        short: '2',
        label: 'Year 2',
        implemented: true,
        // Year 2 adds the extended set: syllables, noun/verb recognition,
        // past tense and tricky spelling, plus irregular plurals and the
        // extended homophone pairs (its/it's, her/here, are/our, they/their,
        // wear/where, whose/who's).
        available: [...EARLY_READING, ...Y2_EXTRA],
        caps: {
            wordTier: 3,
            sentenceLen: 5,
            tricky: true
        },
    },
    {
        id: 3,
        short: '3',
        label: 'Year 3',
        implemented: true,
        // Year 3 (word set 4, sentences up to 7 words) introduces the
        // INTRODUCTORY grammar set — conjunctions, apostrophes of
        // possession/contraction, comma lists, prefixes/suffixes, compound
        // words, direct speech and pronouns — on top of the Y1–Y2 types.
        // The advanced Y4–Y6 vocabulary types (figurative, idioms, ...) are
        // NOT yet offered here.
        available: [...YEAR_3],
        caps: {
            wordTier: 4,
            sentenceLen: 7,
            tricky: true
        },
    },
    {
        id: 4,
        short: '4',
        label: 'Year 4',
        implemented: true,
        // Year 4 keeps everything Y3 offers and adds the first advanced
        // vocabulary types — figurative language and homographs — on the
        // harder word set 5 (tricky spellings: favourite, neighbour, realise).
        available: [...YEAR_4],
        caps: {
            wordTier: 5,
            sentenceLen: 8,
            tricky: true
        },
    },
    {
        id: 5,
        short: '5',
        label: 'Year 5',
        implemented: true,
        // Year 5 completes the catalogue: idioms, dialogue punctuation and
        // subject–verb agreement join the rotation at word set 6.
        available: [...YEAR_5],
        caps: {
            wordTier: 6,
            sentenceLen: 9,
            tricky: true
        },
    },
    {
        id: 6,
        short: '6',
        label: 'Year 6',
        implemented: true,
        // Year 6 — the full cumulative catalogue (all 30 types) at its
        // deepest (tier 6, 10-word sentences): the culmination before high
        // school. Same list as Year 5; only the caps deepen.
        available: [...UPPER_PRIMARY],
        caps: {
            wordTier: 6,
            sentenceLen: 10,
            tricky: true
        },
    },
    // Grades 7..12 — selector entries only; no content generated yet.
    { id: 7, short: '7', label: 'Year 7', implemented: false, available: [], caps: { wordTier: 0, sentenceLen: 0, tricky: false } },
    { id: 8, short: '8', label: 'Year 8', implemented: false, available: [], caps: { wordTier: 0, sentenceLen: 0, tricky: false } },
    { id: 9, short: '9', label: 'Year 9', implemented: false, available: [], caps: { wordTier: 0, sentenceLen: 0, tricky: false } },
    { id: 10, short: '10', label: 'Year 10', implemented: false, available: [], caps: { wordTier: 0, sentenceLen: 0, tricky: false } },
    { id: 11, short: '11', label: 'Year 11', implemented: false, available: [], caps: { wordTier: 0, sentenceLen: 0, tricky: false } },
    { id: 12, short: '12', label: 'Year 12', implemented: false, available: [], caps: { wordTier: 0, sentenceLen: 0, tricky: false } },
];

export const GRADES: readonly GradeConfig[] = CONFIGS;

// Look up a grade config by id. Falls back to grade 1 for unknown ids so a bad
// selection can never crash the dashboard.
export function getGradeConfig(id: number): GradeConfig {
    return CONFIGS.find((g) => g.id === id) ?? CONFIGS[1];
}
