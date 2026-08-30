// ─────────────────────────────────────────────────────────────────────────────
// FRAMEWORK — grade catalogue (the dashboard's configuration).
//
// Part of the DASHBOARD FRAMEWORK, not of any worksheet plugin: the grades
// define the word-set caps every plugin's generator consumes and which
// worksheet ids each grade offers (`available`). Plugins read this
// configuration through the DashboardFramework they receive at load time.
//
// Grades run 0..12 where 0 = Prep and 1..12 = Year 1..Year 12 (AU/UK labelling).
// Prep, Year 1 and Year 2 have real content (Australian primary English scope,
// ACARA-aligned: Prep = letter awareness/beginning sounds plus handwriting
// tracing (letters A–Z, beginning words, numbers 0–9); Y1 = blending,
// sight words, opposites, rhymes, first spelling & sentence work; Y2 adds
// syllables, nouns/verbs, past tense and tricky spellings); grades 3..12
// render a "coming soon" placeholder.
//
// `caps` drives the generators in the worksheet plugins. English worksheets
// are driven by WORD SETS rather than number ranges, so the caps are
// set-size knobs:
//   - wordTier:    which word bank the word-based generators draw from
//                  (1 = Prep starter set, 2 = Year 1 common set, 3 = Year 2
//                  extended set; higher tiers SUPERSEDE lower ones, i.e. a
//                  tier-3 sheet may also contain tier-1 words)
//   - sentenceLen: max number of words in a sentence-building line
//   - tricky:      Year 2 forms — irregular plurals, tricky long words and
//                  extended homophone pairs become available
// ─────────────────────────────────────────────────────────────────────────────

export type GradeId = number;

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
        // Word bank tier: 1 = Prep starter set, 2 = Year 1 set, 3 = Year 2 set.
        wordTier: number;
        // Max words in a sentence-building line.
        sentenceLen: number;
        // Unlocks Year 2 tricky forms (irregular plurals, tricky spelling,
        // extended homophone pairs).
        tricky: boolean;
    };
};

// The generator-facing slice of a grade config (consumed by plugin generators).
export type Caps = GradeConfig['caps'];

// Grade 0 (Prep) and 1 are fully covered; grade 2 extends the word banks to
// the extended sets and adds syllables, nouns/verbs and past tense. Grades
// 3..12 are listed so the selector is complete but flagged `implemented: false`.
const CONFIGS: GradeConfig[] = [
    {
        id: 0,
        short: 'P',
        label: 'Prep',
        implemented: true,
        // Prep keeps the narrow letter-awareness scope: alphabet order,
        // beginning sounds, vowels in short words, real-word recognition —
        // plus the handwriting-tracing set (letter/word/number shape
        // practice). Tracing is a Prep skill: Y1/Y2 get reading/writing
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
        available: [
            'sight',
            'blend',
            'sounds',
            'vowel',
            'opposite',
            'rhyme',
            'sentence',
            'letters',
            'capital',
            'punct',
            'homophone',
            'plural',
            'similar',
            'wordgap',
            'spelling'
        ],
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
        // extended homophone pairs (its/it's, her/here, are/our, they/their).
        available: [
            'sight',
            'blend',
            'sounds',
            'vowel',
            'opposite',
            'rhyme',
            'sentence',
            'letters',
            'capital',
            'punct',
            'homophone',
            'plural',
            'similar',
            'wordgap',
            'spelling',
            'syllable',
            'grammar',
            'tense'
        ],
        caps: {
            wordTier: 3,
            sentenceLen: 5,
            tricky: true
        },
    },
    // Grades 3..12 — selector entries only; no content generated yet.
    { id: 3, short: '3', label: 'Year 3', implemented: false, available: [], caps: { wordTier: 0, sentenceLen: 0, tricky: false } },
    { id: 4, short: '4', label: 'Year 4', implemented: false, available: [], caps: { wordTier: 0, sentenceLen: 0, tricky: false } },
    { id: 5, short: '5', label: 'Year 5', implemented: false, available: [], caps: { wordTier: 0, sentenceLen: 0, tricky: false } },
    { id: 6, short: '6', label: 'Year 6', implemented: false, available: [], caps: { wordTier: 0, sentenceLen: 0, tricky: false } },
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
