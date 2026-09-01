// NON-REPEATING SAMPLING — capacity contract for every sampling worksheet.
//
// Every generator collects its questions through the framework's sampleUnique
// (keyed on the printed prompt) over deck-dealt pools, so a worksheet never
// repeats a question until its whole question space has been dealt. This
// suite pins that contract:
//
//   - for each plugin x grade: the exact UNIQUE-QUESTION CAPACITY measured by
//     generating 100 PAGES of questions (seed seedFrom([grade.id, spec.id, 0]);
//     the ask is spec.perPage x 100);
//   - the FIRST `capacity` questions are all distinct (duplicates may only
//     appear in the fallback tail once the space is exhausted);
//   - twenty worksheet types clear the 100-PAGE BAR — their whole document
//     (100 pages) prints without a single repeated question: sight, blend,
//     sounds, vowel, opposite, rhyme, sentence, letters, capital, plural,
//     similar, spelling, syllable, grammar and tense (the early-reading set)
//     plus conjunction, affix, compound, homograph and figurative (the Y3–6
//     senior set).
//     The nine exceptions are finite-fact-space types: punct (line slots x
//     2 prompt forms), wordgap (sentences x drawn option pairs), homophone
//     and apostrophe (hand-curated item banks), comma (themed list subsets),
//     speech (line x reporter cross-product), idiom (curated idiom bank),
//     advpunct (line x reporter x 2 prompt forms) and agreement (subject x
//     verb-pair bank).
//
// If a pool or variant changes, these exact capacities move — which is what
// we want: a silent shrink of a worksheet's question space can't slip through.
//
// REGENERATION: run `scripts/measure-capacities.ts` (vite-node) to reprint
// the full table after changing any generator or bank.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, createRng, type WorksheetSpec } from '../framework';
import { sightSpec } from './SightWordsWorksheet';
import { blendSpec } from './BlendingWorksheet';
import { soundsSpec } from './BeginningSoundsWorksheet';
import { vowelSpec } from './VowelsWorksheet';
import { oppositeSpec } from './OppositeWordsWorksheet';
import { rhymeSpec } from './RhymingWordsWorksheet';
import { sentenceSpec } from './SentenceBuildingWorksheet';
import { lettersSpec } from './AlphabetOrderWorksheet';
import { capitalSpec } from './CapitalLettersWorksheet';
import { punctSpec } from './PunctuationWorksheet';
import { homophoneSpec } from './TwinWordsWorksheet';
import { pluralSpec } from './PluralsWorksheet';
import { similarSpec } from './SimilarWordsWorksheet';
import { wordgapSpec } from './WordGapsWorksheet';
import { spellingSpec } from './SpellingWorksheet';
import { syllableSpec } from './SyllablesWorksheet';
import { grammarSpec } from './NounsVerbsWorksheet';
import { tenseSpec } from './PastTenseWorksheet';
import { conjunctionSpec } from './ConjunctionWorksheet';
import { apostropheSpec } from './ApostropheWorksheet';
import { commaSpec } from './CommaListWorksheet';
import { affixSpec } from './AffixWorksheet';
import { compoundSpec } from './CompoundWorksheet';
import { speechSpec } from './SpeechWorksheet';
import { homographSpec } from './HomographWorksheet';
import { pronounSpec } from './PronounWorksheet';
import { figurativeSpec } from './FigurativeWorksheet';
import { idiomSpec } from './IdiomWorksheet';
import { advpunctSpec } from './AdvancedPunctuationWorksheet';
import { agreementSpec } from './AgreementWorksheet';

// Pinned capacities, measured by scripts/measure-capacities.ts at the
// 100-page ask (spec.perPage x 100 questions). A capacity EQUAL to the ask
// means the whole 100-page document is repeat-free.
const CAPACITIES: { spec: WorksheetSpec; gradeId: number; capacity: number }[] = [
    { spec: sightSpec, gradeId: 0, capacity: 1800 },
    { spec: sightSpec, gradeId: 1, capacity: 1800 },
    { spec: sightSpec, gradeId: 2, capacity: 1800 },
    { spec: sightSpec, gradeId: 3, capacity: 1800 },
    { spec: sightSpec, gradeId: 4, capacity: 1800 },
    { spec: sightSpec, gradeId: 5, capacity: 1800 },
    { spec: sightSpec, gradeId: 6, capacity: 1800 },
    { spec: blendSpec, gradeId: 1, capacity: 2400 },
    { spec: blendSpec, gradeId: 2, capacity: 2400 },
    { spec: blendSpec, gradeId: 3, capacity: 2400 },
    { spec: blendSpec, gradeId: 4, capacity: 2400 },
    { spec: blendSpec, gradeId: 5, capacity: 2400 },
    { spec: blendSpec, gradeId: 6, capacity: 2400 },
    { spec: soundsSpec, gradeId: 0, capacity: 2400 },
    { spec: soundsSpec, gradeId: 1, capacity: 2400 },
    { spec: soundsSpec, gradeId: 2, capacity: 2400 },
    { spec: soundsSpec, gradeId: 3, capacity: 2400 },
    { spec: soundsSpec, gradeId: 4, capacity: 2400 },
    { spec: soundsSpec, gradeId: 5, capacity: 2400 },
    { spec: soundsSpec, gradeId: 6, capacity: 2400 },
    { spec: vowelSpec, gradeId: 0, capacity: 2400 },
    { spec: vowelSpec, gradeId: 1, capacity: 2400 },
    { spec: vowelSpec, gradeId: 2, capacity: 2400 },
    { spec: vowelSpec, gradeId: 3, capacity: 2400 },
    { spec: vowelSpec, gradeId: 4, capacity: 2400 },
    { spec: vowelSpec, gradeId: 5, capacity: 2400 },
    { spec: vowelSpec, gradeId: 6, capacity: 2400 },
    { spec: oppositeSpec, gradeId: 1, capacity: 2400 },
    { spec: oppositeSpec, gradeId: 2, capacity: 2400 },
    { spec: oppositeSpec, gradeId: 3, capacity: 2400 },
    { spec: oppositeSpec, gradeId: 4, capacity: 2400 },
    { spec: oppositeSpec, gradeId: 5, capacity: 2400 },
    { spec: oppositeSpec, gradeId: 6, capacity: 2400 },
    { spec: rhymeSpec, gradeId: 1, capacity: 1800 },
    { spec: rhymeSpec, gradeId: 2, capacity: 1800 },
    { spec: rhymeSpec, gradeId: 3, capacity: 1800 },
    { spec: rhymeSpec, gradeId: 4, capacity: 1800 },
    { spec: rhymeSpec, gradeId: 5, capacity: 1800 },
    { spec: rhymeSpec, gradeId: 6, capacity: 1800 },
    { spec: sentenceSpec, gradeId: 1, capacity: 1200 },
    { spec: sentenceSpec, gradeId: 2, capacity: 1200 },
    { spec: sentenceSpec, gradeId: 3, capacity: 1200 },
    { spec: sentenceSpec, gradeId: 4, capacity: 1200 },
    { spec: sentenceSpec, gradeId: 5, capacity: 1200 },
    { spec: sentenceSpec, gradeId: 6, capacity: 1200 },
    { spec: lettersSpec, gradeId: 0, capacity: 2400 },
    { spec: lettersSpec, gradeId: 1, capacity: 2400 },
    { spec: lettersSpec, gradeId: 2, capacity: 2400 },
    { spec: lettersSpec, gradeId: 3, capacity: 2400 },
    { spec: lettersSpec, gradeId: 4, capacity: 2400 },
    { spec: lettersSpec, gradeId: 5, capacity: 2400 },
    { spec: lettersSpec, gradeId: 6, capacity: 2400 },
    { spec: capitalSpec, gradeId: 1, capacity: 2400 },
    { spec: capitalSpec, gradeId: 2, capacity: 2400 },
    { spec: capitalSpec, gradeId: 3, capacity: 2400 },
    { spec: capitalSpec, gradeId: 4, capacity: 2400 },
    { spec: capitalSpec, gradeId: 5, capacity: 2400 },
    { spec: capitalSpec, gradeId: 6, capacity: 2400 },
    { spec: punctSpec, gradeId: 1, capacity: 1076 },
    { spec: punctSpec, gradeId: 2, capacity: 1076 },
    { spec: punctSpec, gradeId: 3, capacity: 1076 },
    { spec: punctSpec, gradeId: 4, capacity: 1076 },
    { spec: punctSpec, gradeId: 5, capacity: 1076 },
    { spec: punctSpec, gradeId: 6, capacity: 1076 },
    { spec: homophoneSpec, gradeId: 1, capacity: 40 },
    { spec: homophoneSpec, gradeId: 2, capacity: 52 },
    { spec: homophoneSpec, gradeId: 3, capacity: 74 },
    { spec: homophoneSpec, gradeId: 4, capacity: 74 },
    { spec: homophoneSpec, gradeId: 5, capacity: 74 },
    { spec: homophoneSpec, gradeId: 6, capacity: 74 },
    { spec: pluralSpec, gradeId: 1, capacity: 2400 },
    { spec: pluralSpec, gradeId: 2, capacity: 2400 },
    { spec: pluralSpec, gradeId: 3, capacity: 2400 },
    { spec: pluralSpec, gradeId: 4, capacity: 2400 },
    { spec: pluralSpec, gradeId: 5, capacity: 2400 },
    { spec: pluralSpec, gradeId: 6, capacity: 2400 },
    { spec: similarSpec, gradeId: 1, capacity: 1800 },
    { spec: similarSpec, gradeId: 2, capacity: 1800 },
    { spec: similarSpec, gradeId: 3, capacity: 1800 },
    { spec: similarSpec, gradeId: 4, capacity: 1800 },
    { spec: similarSpec, gradeId: 5, capacity: 1800 },
    { spec: similarSpec, gradeId: 6, capacity: 1800 },
    { spec: wordgapSpec, gradeId: 1, capacity: 1080 },
    { spec: wordgapSpec, gradeId: 2, capacity: 1440 },
    { spec: wordgapSpec, gradeId: 3, capacity: 1440 },
    { spec: wordgapSpec, gradeId: 4, capacity: 1440 },
    { spec: wordgapSpec, gradeId: 5, capacity: 1440 },
    { spec: wordgapSpec, gradeId: 6, capacity: 1440 },
    { spec: spellingSpec, gradeId: 1, capacity: 1800 },
    { spec: spellingSpec, gradeId: 2, capacity: 1800 },
    { spec: spellingSpec, gradeId: 3, capacity: 1800 },
    { spec: spellingSpec, gradeId: 4, capacity: 1800 },
    { spec: spellingSpec, gradeId: 5, capacity: 1800 },
    { spec: spellingSpec, gradeId: 6, capacity: 1800 },
    { spec: syllableSpec, gradeId: 2, capacity: 1800 },
    { spec: syllableSpec, gradeId: 3, capacity: 1800 },
    { spec: syllableSpec, gradeId: 4, capacity: 1800 },
    { spec: syllableSpec, gradeId: 5, capacity: 1800 },
    { spec: syllableSpec, gradeId: 6, capacity: 1800 },
    { spec: grammarSpec, gradeId: 2, capacity: 2400 },
    { spec: grammarSpec, gradeId: 3, capacity: 2400 },
    { spec: grammarSpec, gradeId: 4, capacity: 2400 },
    { spec: grammarSpec, gradeId: 5, capacity: 2400 },
    { spec: grammarSpec, gradeId: 6, capacity: 2400 },
    { spec: tenseSpec, gradeId: 2, capacity: 2400 },
    { spec: tenseSpec, gradeId: 3, capacity: 2400 },
    { spec: tenseSpec, gradeId: 4, capacity: 2400 },
    { spec: tenseSpec, gradeId: 5, capacity: 2400 },
    { spec: tenseSpec, gradeId: 6, capacity: 2400 },
    // ── Y3–6 senior set ────────────────────────────────────────────────────
    { spec: conjunctionSpec, gradeId: 3, capacity: 1600 },
    { spec: conjunctionSpec, gradeId: 4, capacity: 1600 },
    { spec: conjunctionSpec, gradeId: 5, capacity: 1600 },
    { spec: conjunctionSpec, gradeId: 6, capacity: 1600 },
    { spec: apostropheSpec, gradeId: 3, capacity: 247 },
    { spec: apostropheSpec, gradeId: 4, capacity: 247 },
    { spec: apostropheSpec, gradeId: 5, capacity: 247 },
    { spec: apostropheSpec, gradeId: 6, capacity: 247 },
    { spec: commaSpec, gradeId: 3, capacity: 450 },
    { spec: commaSpec, gradeId: 4, capacity: 450 },
    { spec: commaSpec, gradeId: 5, capacity: 450 },
    { spec: commaSpec, gradeId: 6, capacity: 450 },
    { spec: affixSpec, gradeId: 3, capacity: 1800 },
    { spec: affixSpec, gradeId: 4, capacity: 1800 },
    { spec: affixSpec, gradeId: 5, capacity: 1800 },
    { spec: affixSpec, gradeId: 6, capacity: 1800 },
    { spec: compoundSpec, gradeId: 3, capacity: 1800 },
    { spec: compoundSpec, gradeId: 4, capacity: 1800 },
    { spec: compoundSpec, gradeId: 5, capacity: 1800 },
    { spec: compoundSpec, gradeId: 6, capacity: 1800 },
    { spec: speechSpec, gradeId: 3, capacity: 652 },
    { spec: speechSpec, gradeId: 4, capacity: 652 },
    { spec: speechSpec, gradeId: 5, capacity: 652 },
    { spec: speechSpec, gradeId: 6, capacity: 652 },
    { spec: homographSpec, gradeId: 3, capacity: 1800 },
    { spec: homographSpec, gradeId: 4, capacity: 1800 },
    { spec: homographSpec, gradeId: 5, capacity: 1800 },
    { spec: homographSpec, gradeId: 6, capacity: 1800 },
    { spec: pronounSpec, gradeId: 3, capacity: 1332 },
    { spec: pronounSpec, gradeId: 4, capacity: 1332 },
    { spec: pronounSpec, gradeId: 5, capacity: 1332 },
    { spec: pronounSpec, gradeId: 6, capacity: 1332 },
    { spec: figurativeSpec, gradeId: 3, capacity: 1800 },
    { spec: figurativeSpec, gradeId: 4, capacity: 1800 },
    { spec: figurativeSpec, gradeId: 5, capacity: 1800 },
    { spec: figurativeSpec, gradeId: 6, capacity: 1800 },
    { spec: idiomSpec, gradeId: 3, capacity: 230 },
    { spec: idiomSpec, gradeId: 4, capacity: 230 },
    { spec: idiomSpec, gradeId: 5, capacity: 230 },
    { spec: idiomSpec, gradeId: 6, capacity: 230 },
    { spec: advpunctSpec, gradeId: 3, capacity: 720 },
    { spec: advpunctSpec, gradeId: 4, capacity: 720 },
    { spec: advpunctSpec, gradeId: 5, capacity: 720 },
    { spec: advpunctSpec, gradeId: 6, capacity: 720 },
    { spec: agreementSpec, gradeId: 3, capacity: 1296 },
    { spec: agreementSpec, gradeId: 4, capacity: 1296 },
    { spec: agreementSpec, gradeId: 5, capacity: 1296 },
    { spec: agreementSpec, gradeId: 6, capacity: 1296 }
];

describe('unique sampling — per-worksheet question capacity', () => {
    for (const { spec, gradeId, capacity } of CAPACITIES) {
        const grade = getGradeConfig(gradeId);
        const ask = spec.perPage * 100; // 100 pages of questions
        it(`${spec.id} grade ${gradeId}: ${ask}-question (100-page) ask yields exactly ${capacity} unique questions`, () => {
            const seed = seedFrom([grade.id, spec.id, 0]);
            const problems = spec.generate(createRng(seed), grade.caps, ask);
            expect(problems).toHaveLength(ask);
            const prompts = problems.map((p) => p.prompt);
            const unique = new Set(prompts);
            expect(unique.size).toBe(capacity);
            // Uniqueness is a PREFIX property: sampleUnique only releases a
            // question after checking its key, so the first `capacity`
            // questions are pairwise distinct — repeats can only sit in the
            // fallback tail after the space was fully dealt.
            expect(new Set(prompts.slice(0, capacity)).size).toBe(capacity);
        });
    }

    it('the 100-page bar: 20 worksheet types print 100 pages with zero repeats', () => {
        // A spec clears the bar when its capacity equals the 100-page ask at
        // EVERY grade that offers it. Dedupe to the distinct worksheet ids.
        const cleared = Array.from(new Set(CAPACITIES.filter((c) => c.capacity === c.spec.perPage * 100).map((c) => c.spec.id)));
        expect(cleared.sort()).toEqual(
            [
                'blend', 'capital', 'compound', 'conjunction', 'affix', 'figurative', 'homograph',
                'grammar', 'letters', 'opposite', 'plural', 'rhyme', 'sentence', 'similar',
                'sounds', 'spelling', 'syllable', 'sight', 'tense', 'vowel'
            ].sort()
        );
        // Sight, sounds, vowels and alphabet order are offered (and clear the
        // bar) at ALL SEVEN implemented grades (Prep..Year 6).
        for (const spec of [sightSpec, soundsSpec, vowelSpec, lettersSpec]) {
            for (const gradeId of [0, 1, 2, 3, 4, 5, 6]) {
                const entry = CAPACITIES.find((c) => c.spec === spec && c.gradeId === gradeId);
                expect(entry?.capacity).toBe(spec.perPage * 100);
            }
        }
    });
});
