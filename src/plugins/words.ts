// ─────────────────────────────────────────────────────────────────────────────
// SHARED WORD BANKS — the worksheet plugins' common vocabulary.
//
// This is DATA, not behaviour: the tiered word sets the word-based worksheet
// generators draw from, the full "dictionary" of every word that may ever
// appear on a sheet (KNOWN_WORD_SET), and two tiny deterministic helpers
// (Fisher-Yates shuffle + the non-word inventor) shared by the
// multiple-choice generators.
//
// Plugin isolation still holds: a plugin's SPEC, generator and factory live
// in its own file; this module only supplies the vocabulary. Tiering: higher
// tiers SUPERSEDE lower ones — a tier-3 sheet may contain tier-1 words.
//
// All printed words are lowercase (except the `capital` worksheet, whose
// ANSWER is capitalised) so sheet bodies read consistently.
// ─────────────────────────────────────────────────────────────────────────────

import type { Rng } from '../framework';

// Tier 1 (Prep starter set): short one-syllable words whose letters are all
// single-sound (no silent letters), so vowel counts & blends are unambiguous.
export const TIER1_WORDS = [
    'sun', 'moon', 'cat', 'dog', 'bus', 'hat', 'cup', 'map', 'pen', 'pig',
    'red', 'bed', 'bag', 'box', 'fan', 'jam', 'leg', 'log', 'net', 'pin',
    'pot', 'rat', 'sip', 'top', 'wig'
] as const;

// Tier 2 (Year 1 common set): adds longer / two-syllable everyday words.
export const TIER2_EXTRA = [
    'fish', 'bird', 'tree', 'apple', 'water', 'bread', 'chair', 'green',
    'light', 'night', 'shirt', 'table', 'tiger', 'train', 'plane', 'grass',
    'house', 'lemon', 'purple', 'rabbit'
] as const;

// Tier 3 (Year 2 extended set): adds longer trickier words.
export const TIER3_EXTRA = [
    'school', 'teacher', 'family', 'banana', 'butterfly', 'beautiful',
    'chocolate', 'elephant', 'computer', 'window', 'garden', 'button',
    'pumpkin', 'dinosaur', 'dolphin', 'chicken'
] as const;

// The word set available at a tier (tiers supersede: 3 => 1+2+3).
// Unknown tiers fall back to tier 1 so a generator can never run dry.
export function wordSet(tier: number): readonly string[] {
    if (tier >= 3) return [...TIER1_WORDS, ...TIER2_EXTRA, ...TIER3_EXTRA];
    if (tier >= 2) return [...TIER1_WORDS, ...TIER2_EXTRA];
    return TIER1_WORDS;
}

// Every word that can ever appear on a sheet (all banks across the plugins),
// lower-case. The `sight` generator refuses to "invent" non-words that collide
// with any of these, so its distractors are genuinely fake words; the
// `wordTrace` generator checks its A–Z words are real. Exported so tests can
// verify the "exactly one real word" contract.
export const KNOWN_WORD_SET: ReadonlySet<string> = new Set([
    ...TIER1_WORDS,
    ...TIER2_EXTRA,
    ...TIER3_EXTRA,
    // rhyme friends & distractors
    'hat', 'bat', 'mat', 'sat', 'log', 'hog', 'fun', 'run', 'up', 'hen',
    'ten', 'men', 'big', 'dig', 'wig', 'fed', 'led', 'pan', 'can', 'man',
    'hop', 'mop', 'lop', 'got', 'cot', 'tin', 'fin', 'bin', 'sight',
    'flight', 'hair', 'pair', 'clean', 'mean', 'screen', 'fish', 'tree',
    'bird', 'milk', 'king', 'star', 'door', 'duck', 'leaf', 'rock',
    // sentence-template words
    'the', 'kicks', 'ball', 'eats', 'an', 'apple', 'cat', 'chases', 'mouse',
    'dog', 'barks', 'sees', 'bird', 'reads', 'book', 'sun', 'shines', 'has',
    'two', 'cats', 'runs', 'sings', 'skips', 'paints', 'draws', 'teacher',
    'story', 'brother', 'sleeps',
    // opposites / similars
    'hot', 'cold', 'big', 'small', 'up', 'down', 'fast', 'slow', 'happy',
    'sad', 'long', 'short', 'in', 'out', 'open', 'shut', 'new', 'old',
    'heavy', 'light', 'early', 'late', 'easy', 'hard', 'glad', 'angry',
    'large', 'tiny', 'quick', 'chilly', 'warm', 'cool', 'good', 'nice',
    'bad', 'cheerful', 'tired', 'cross', 'calm', 'sleepy', 'awake',
    'quiet', 'silent', 'loud', 'noisy', 'scared', 'afraid', 'brave',
    'strong', 'mighty', 'weak', 'simple', 'tricky',
    // homophones
    'there', 'their', 'to', 'too', 'your', "you're", 'two', 'its', "it's",
    'her', 'here', 'are', 'our', 'they',
    // plurals
    'kid', 'birds', 'cups', 'maps', 'pens', 'pigs', 'boat', 'boats',
    'ball', 'balls', 'stars', 'doors', 'buses', 'boxes', 'watch',
    'watches', 'child', 'children', 'man', 'men', 'woman', 'women', 'foot',
    'feet', 'tooth', 'teeth', 'mouse', 'mice', 'goose', 'geese', 'ox',
    'oxen', 'people',
    // word gaps
    'milk', 'book', 'desk', 'hair', 'sky', 'water', 'boots', 'bread',
    'breakfast', 'teeth',
    // spelling (correct + the printed misspellings are NOT words, so the
    // correct ones are the only collisions to guard)
    'frog', 'doog', 'doge', 'fissh', 'fush', 'brid', 'bired', 'hous',
    'huse', 'syun', 'suun', 'applee', 'appple', 'scool', 'scoool', 'techer',
    'tocher', 'familly', 'familie', 'bananna', 'bannana', 'buterfly',
    'butrefly', 'beutiful', 'beauitful', 'chocolote', 'choclate', 'elphant',
    'elephent',
    // syllables / grammar / tense
    'banana', 'water', 'butter', 'window', 'garden', 'button', 'rabbit',
    'elephant', 'computer', 'pumpkin', 'dinosaur', 'helmet', 'tree',
    'jump', 'eat', 'read', 'sleep', 'sing', 'kick', 'draw', 'walk',
    'walked', 'played', 'jumped', 'kicked', 'sat', 'ran', 'ate', 'saw',
    'went', 'swam', 'took', 'made', 'drove', 'wrote', 'drive', 'write',
    // tracing words — the A–Z one-word-per-letter bank (see
    // WordTracingWorksheet); mostly already in the banks above, so only the
    // few with no home here (G, Q, V, X, Y, Z) are added.
    'go', 'queen', 'van', 'xylophone', 'yellow', 'zoo'
]);

// Fisher-Yates using the shared Rng, plus a determinism guard so a scrambled
// sentence can never print in its original (already-correct) order: if the
// shuffle happens to reproduce the input, the last two words are swapped.
export function shuffleWords(rng: Rng, words: readonly string[]): string[] {
    const out = [...words];
    for (let i = out.length - 1; i > 0; i--) {
        const j = rng.int(0, i);
        [out[i], out[j]] = [out[j], out[i]];
    }
    if (out.length > 1 && out.every((w, i) => w === words[i])) {
        [out[out.length - 1], out[out.length - 2]] = [out[out.length - 2], out[out.length - 1]];
    }
    return out;
}

// Invent a plausible non-word by mutating a real word: the first letter
// position (in order) with a substitution letter (a..z, in order) that is
// neither the original letter nor any word in KNOWN_WORD_SET wins.
// Deterministic on the input word, so no Rng is needed. Used by the sight
// generator to build its fake-word distractors.
export function inventNonWord(real: string): string {
    let acc = '';
    for (let i = 0; i < real.length; i++) {
        const ch = real[i];
        for (let l = 0; l < 26; l++) {
            const sub = String.fromCharCode(97 + l);
            if (sub === ch) continue;
            const candidate = real.slice(0, i) + sub + real.slice(i + 1);
            if (!KNOWN_WORD_SET.has(candidate) && !acc.includes(candidate)) {
                acc = candidate;
                break;
            }
        }
    }
    // A word every one of whose positions only ever mutates into a known
    // word (practically impossible for 3+ letters) falls back to a rotation,
    // which is never a word for these banks.
    if (acc.length < real.length - 1) acc = real.slice(1) + real[0];
    return acc;
}
