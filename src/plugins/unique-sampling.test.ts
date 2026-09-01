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
//   - all but three worksheet types clear the 100-PAGE BAR — their whole
//     document (100 pages) prints without a single repeated question:
//     sight, blend, sounds, vowel, opposite, rhyme, sentence, letters,
//     capital, plural, similar, spelling, syllable, grammar and tense.
//     The three exceptions are finite-fact-space types: punct (line slots x
//     2 prompt forms), wordgap (sentences x drawn option pairs) and
//     homophone (a hand-curated twin-word bank — each pair is asked with
//     both option orders before anything repeats).
//
// If a pool or variant changes, these exact capacities move — which is what
// we want: a silent shrink of a worksheet's question space can't slip through.

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

// Pinned capacities, measured by this suite's generator run at the 100-page
// ask (spec.perPage x 100 questions). A capacity EQUAL to the ask means the
// whole 100-page document is repeat-free.
const CAPACITIES: { spec: WorksheetSpec; gradeId: number; capacity: number }[] = [
    { spec: sightSpec, gradeId: 0, capacity: 1800 },
    { spec: sightSpec, gradeId: 1, capacity: 1800 },
    { spec: sightSpec, gradeId: 2, capacity: 1800 },
    { spec: blendSpec, gradeId: 1, capacity: 2400 },
    { spec: blendSpec, gradeId: 2, capacity: 2400 },
    { spec: soundsSpec, gradeId: 0, capacity: 2400 },
    { spec: soundsSpec, gradeId: 1, capacity: 2400 },
    { spec: soundsSpec, gradeId: 2, capacity: 2400 },
    { spec: vowelSpec, gradeId: 0, capacity: 2400 },
    { spec: vowelSpec, gradeId: 1, capacity: 2400 },
    { spec: vowelSpec, gradeId: 2, capacity: 2400 },
    { spec: oppositeSpec, gradeId: 1, capacity: 2400 },
    { spec: oppositeSpec, gradeId: 2, capacity: 2400 },
    { spec: rhymeSpec, gradeId: 1, capacity: 1800 },
    { spec: rhymeSpec, gradeId: 2, capacity: 1800 },
    { spec: sentenceSpec, gradeId: 1, capacity: 1200 },
    { spec: sentenceSpec, gradeId: 2, capacity: 1200 },
    { spec: lettersSpec, gradeId: 0, capacity: 2400 },
    { spec: lettersSpec, gradeId: 1, capacity: 2400 },
    { spec: lettersSpec, gradeId: 2, capacity: 2400 },
    { spec: capitalSpec, gradeId: 1, capacity: 2400 },
    { spec: capitalSpec, gradeId: 2, capacity: 2400 },
    { spec: punctSpec, gradeId: 1, capacity: 1076 },
    { spec: punctSpec, gradeId: 2, capacity: 1076 },
    { spec: homophoneSpec, gradeId: 1, capacity: 40 },
    { spec: homophoneSpec, gradeId: 2, capacity: 52 },
    { spec: pluralSpec, gradeId: 1, capacity: 2400 },
    { spec: pluralSpec, gradeId: 2, capacity: 2400 },
    { spec: similarSpec, gradeId: 1, capacity: 1800 },
    { spec: similarSpec, gradeId: 2, capacity: 1800 },
    { spec: wordgapSpec, gradeId: 1, capacity: 1080 },
    { spec: wordgapSpec, gradeId: 2, capacity: 1440 },
    { spec: spellingSpec, gradeId: 1, capacity: 1800 },
    { spec: spellingSpec, gradeId: 2, capacity: 1800 },
    { spec: syllableSpec, gradeId: 2, capacity: 1800 },
    { spec: grammarSpec, gradeId: 2, capacity: 2400 },
    { spec: tenseSpec, gradeId: 2, capacity: 2400 }
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

    it('the 100-page bar: 15 worksheet types print 100 pages with zero repeats', () => {
        // A spec clears the bar when its capacity equals the 100-page ask at
        // EVERY grade that offers it. Dedupe to the distinct worksheet ids.
        const cleared = Array.from(new Set(CAPACITIES.filter((c) => c.capacity === c.spec.perPage * 100).map((c) => c.spec.id)));
        expect(cleared.sort()).toEqual(
            [
                'blend', 'capital', 'grammar', 'letters', 'opposite', 'plural', 'rhyme',
                'sentence', 'similar', 'sounds', 'spelling', 'syllable', 'sight', 'tense', 'vowel'
            ].sort()
        );
        // Sight, sounds, vowels and alphabet order are offered (and clear the
        // bar) at ALL THREE implemented grades.
        for (const spec of [sightSpec, soundsSpec, vowelSpec, lettersSpec]) {
            for (const gradeId of [0, 1, 2]) {
                const entry = CAPACITIES.find((c) => c.spec === spec && c.gradeId === gradeId);
                expect(entry?.capacity).toBe(spec.perPage * 100);
            }
        }
    });
});
