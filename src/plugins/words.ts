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

// Common real English words (kid-level vocabulary, 2–6 letters) that are NOT
// part of any tier bank. Two jobs:
//   1. BLOCKLIST — the spelling generator's invented misspellings and the
//      sight generator's non-words must never be a real word; every word here
//      is excluded from those fake options.
//   2. POOL — the capital-letters worksheet draws its "write it with a
//      capital" words from the tier banks plus this set, multiplying its
//      non-repeating question space.
// (Duplicates with the tier banks are harmless — everything lands in a Set.)
// ── data, space-separated string split at load: compact to read/edit. ──
export const COMMON_WORDS: readonly string[] =
    (
        'act add and ant arm art ask ate bad ban bar bat bay bee beg bet bid bin bit bow boy bud bug bun ' +
        'but buy cab can cap car cod cog cop cot cow cub cut dab dad dam day den dew did die dig dim din ' +
        'dip doe dot dry due dug ear eel egg elf elk end far fat fax fed fee few fig fin fir fit fix fly ' +
        'foe fog for fox fun fur gap gas gem get got gum gun gut guy had ham has hay hem hen her hid him ' +
        'hip his hit hoe how hub hue hug hum hut ice ill ink inn jab jar jaw jay jet job jog joy jug keg ' +
        'key kid kin kit lab lad lag lap law lay led let lid lie lip lit lot low lug mad man mar mat max ' +
        'may men met mid mix mob mow mud mug mum nab nap net new nil nip nit nod nor not now nun nut oak ' +
        'oar oat odd off oil old one opt orb ore out owe owl own pad pal pan par pat paw pay pea peg pep ' +
        'per pet pie pit pod pop pub pug pun pup put rag ram ran rap raw ray rib rid rig rim rip rob rod ' +
        'roe rot row rub rug rum run rut sad sag sap sat saw say sea see set sew she shy sin sir sit six ' +
        'ski sky sly sob son sow soy spa spy sub sue sum tab tag tan tap tar tax tea ten the tie tin tip ' +
        'toe ton tot tow toy try tub tug two urn use van vet vex via vie wag war was wax way web wed wee ' +
        'wet who why win wit woe won wow yes yet you zap zip bang rant chub shun stun spun tee snip meet ' +
        'meat able pane widow ' +
        'band bank bath bend best bill bite blow bold bolt bond book boot born both bowl burn bush came ' +
        'camp card cart case cash cast chat chip chop clam clap club coal coat coin comb cook cool cord ' +
        'cork corn cost crib crop dark date dawn debt deck deep deer desk dime dine dish dive dock doll ' +
        'dome done dose dove down drag drew drop drum dune dusk dust each earn ease east edge else even ' +
        'ever evil face fact fail fair fall farm fate fear feed feel fell felt fern file fill film find ' +
        'fine fire firm five flag flat flew flip flow fold folk fond food foot fork form fort four free ' +
        'from fuel full fund gain game gate gave gear gift girl give glad glow glue goal goat gold golf ' +
        'gone gown grab gray grew grin grip grow hair half hall hand hang hard harm hate have hawk head ' +
        'hear heat held herd hide high hike hill hint hire hive hold hole home hope horn hose host hour ' +
        'huge hunt hurt idea inch into iron item jazz jeep jerk join joke jump jury just keen keep kept ' +
        'kick kind king kiss kite knee knew knit know lace lack lady laid lake lamp land lane last late ' +
        'lawn lazy lead lean left lend lens less lift like limb lime line link lion list live load loan ' +
        'lock loft lone long look lord lose loss lost loud love luck lump lung made mail main make male ' +
        'mall many mask mass mate math meal mean meat melt mend menu mess mile milk mind mine mint miss ' +
        'mold moon more most moth move much must name near neat neck need nest news next nice nine none ' +
        'noon nose note noun obey once only onto open oval oven over pace pack page paid pail pain pair ' +
        'pale palm pant park part pass past path peak pear peel pest pick pile pine pink pipe play plot ' +
        'plug plum plus poem poet pole poll pond pool pork port pose post pour pray prey pull pump pure ' +
        'push quit quiz race rack raft rage raid rail rain rake ramp rank rare rate real rear reed rest ' +
        'rice rich ride ring rise risk road roar robe rock role roll roof room root rope rose ruin rule ' +
        'rush rust safe said sail sale salt same sand save scar seal seat seed seek seem seen self sell ' +
        'send sent shed ship shoe shop shot show shut side sign silk sing sink site size skin skip slam ' +
        'slap sled slim slip slot slow snap soap sock sofa soft soil sold sole some song soon sore sort ' +
        'soul soup spin spot star stay stem step stir stop such suit sure swam swan swap swim tail take ' +
        'tale talk tall tank tape task team tear tell tend tent term test text than that them then they ' +
        'thin this tick tide tidy tied tile time tiny tire told tone took tool torn toss tour town tray ' +
        'trim trip tube tuck tune turn twin type ugly unit upon urge vast verb very vest vine vote wade ' +
        'wage wait wake walk wall want ward warm warn wash wave wear weed week well went were west what ' +
        'when wide wife wild will wind wine wing wipe wire wise wish with wolf wood wool word wore work ' +
        'worm worn wrap yard yarn year yell zero zone'
    ).split(' ');

// Every word that can ever appear on a sheet (all banks across the plugins),
// lower-case. The `sight` generator refuses to "invent" non-words that collide
// with any of these, so its distractors are genuinely fake words; the
// `wordTrace` generator checks its A–Z words are real. Exported so tests can
// verify the "exactly one real word" contract.
export const KNOWN_WORD_SET: ReadonlySet<string> = new Set([
    ...TIER1_WORDS,
    ...TIER2_EXTRA,
    ...TIER3_EXTRA,
    // Common real words a careless single-letter edit of a bank word can
    // wander into (chat/cart from "cat", stun/spun from "sun", bend/bred from
    // "bed", lane/pane from "plane", widow from "window", ...). The spelling
    // generator filters its procedurally invented misspellings against this
    // set, so a "which word is spelled correctly?" option never contains two
    // real English words; the sight generator benefits the same way.
    ...COMMON_WORDS,
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
