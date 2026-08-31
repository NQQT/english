// NON-REPEATING SAMPLING — capacity contract for every sampling worksheet.
//
// Every generator now collects its questions through the framework's
// sampleUnique (keyed on the printed prompt) over deck-dealt pools, so a
// worksheet never repeats a question until its whole question space has been
// dealt. This suite pins that contract:
//
//   - for each plugin x grade: the exact UNIQUE-QUESTION CAPACITY measured by
//     generating 1000 questions (seed seedFrom([grade.id, spec.id, 0]));
//   - the FIRST `capacity` questions are all distinct (duplicates may only
//     appear in the fallback tail once the space is exhausted);
//   - combinatorial types (sight, opposite, rhyme, sentence, capital, plural,
//     similar, spelling, tense) clear the 1000-unique-question bar at every
//     grade that offers them — "a thousand questions that don't repeat".
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

// The ask: at least a thousand non-repeating questions.
const THOUSAND = 1000;

// Pinned capacities, measured by this suite's generator run (a spec whose
// space exceeds the ask pins THOUSAND).
const CAPACITIES: { spec: WorksheetSpec; gradeId: number; capacity: number }[] = [
    { spec: sightSpec, gradeId: 0, capacity: THOUSAND },
    { spec: sightSpec, gradeId: 1, capacity: THOUSAND },
    { spec: sightSpec, gradeId: 2, capacity: THOUSAND },
    { spec: blendSpec, gradeId: 1, capacity: 211 },
    { spec: blendSpec, gradeId: 2, capacity: 253 },
    { spec: soundsSpec, gradeId: 0, capacity: 25 },
    { spec: soundsSpec, gradeId: 1, capacity: 45 },
    { spec: soundsSpec, gradeId: 2, capacity: 61 },
    { spec: vowelSpec, gradeId: 0, capacity: 49 },
    { spec: vowelSpec, gradeId: 1, capacity: 75 },
    { spec: vowelSpec, gradeId: 2, capacity: 91 },
    { spec: oppositeSpec, gradeId: 1, capacity: THOUSAND },
    { spec: oppositeSpec, gradeId: 2, capacity: THOUSAND },
    { spec: rhymeSpec, gradeId: 1, capacity: THOUSAND },
    { spec: rhymeSpec, gradeId: 2, capacity: THOUSAND },
    { spec: sentenceSpec, gradeId: 1, capacity: THOUSAND },
    { spec: sentenceSpec, gradeId: 2, capacity: THOUSAND },
    { spec: lettersSpec, gradeId: 0, capacity: 122 },
    { spec: lettersSpec, gradeId: 1, capacity: 122 },
    { spec: lettersSpec, gradeId: 2, capacity: 122 },
    { spec: capitalSpec, gradeId: 1, capacity: THOUSAND },
    { spec: capitalSpec, gradeId: 2, capacity: THOUSAND },
    { spec: punctSpec, gradeId: 1, capacity: 108 },
    { spec: punctSpec, gradeId: 2, capacity: 108 },
    { spec: homophoneSpec, gradeId: 1, capacity: 14 },
    { spec: homophoneSpec, gradeId: 2, capacity: 22 },
    { spec: pluralSpec, gradeId: 1, capacity: THOUSAND },
    { spec: pluralSpec, gradeId: 2, capacity: THOUSAND },
    { spec: similarSpec, gradeId: 1, capacity: THOUSAND },
    { spec: similarSpec, gradeId: 2, capacity: THOUSAND },
    { spec: wordgapSpec, gradeId: 1, capacity: 100 },
    { spec: wordgapSpec, gradeId: 2, capacity: 120 },
    { spec: spellingSpec, gradeId: 1, capacity: THOUSAND },
    { spec: spellingSpec, gradeId: 2, capacity: THOUSAND },
    { spec: syllableSpec, gradeId: 2, capacity: 40 },
    { spec: grammarSpec, gradeId: 2, capacity: 40 },
    { spec: tenseSpec, gradeId: 2, capacity: THOUSAND }
];

describe('unique sampling — per-worksheet question capacity', () => {
    for (const { spec, gradeId, capacity } of CAPACITIES) {
        const grade = getGradeConfig(gradeId);
        it(`${spec.id} grade ${gradeId}: capacity is exactly ${capacity} unique questions`, () => {
            const seed = seedFrom([grade.id, spec.id, 0]);
            const problems = spec.generate(createRng(seed), grade.caps, THOUSAND);
            expect(problems).toHaveLength(THOUSAND);
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

    it('the thousand-question bar: every combinatorial worksheet clears 1000 unique questions', () => {
        // One entry per spec x grade; dedupe to the distinct worksheet ids.
        const cleared = Array.from(new Set(CAPACITIES.filter((c) => c.capacity === THOUSAND).map((c) => c.spec.id)));
        expect(cleared.sort()).toEqual(
            [
                'capital', 'opposite', 'plural', 'rhyme', 'sentence', 'similar', 'sight',
                'spelling', 'tense'
            ].sort()
        );
        // Sight is offered (and clears the bar) at ALL THREE implemented grades.
        for (const gradeId of [0, 1, 2]) {
            const entry = CAPACITIES.find((c) => c.spec === sightSpec && c.gradeId === gradeId);
            expect(entry?.capacity).toBe(THOUSAND);
        }
    });
});
