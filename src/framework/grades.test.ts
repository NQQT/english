// Unit tests for the framework's grade catalogue.
//
// The catalogue is the dashboard's configuration: labels, implemented flags,
// per-grade word-set caps and which worksheet ids each grade offers. Every
// worksheet plugin's grade gating reads these lists, so they are pinned
// EXACTLY here — including the available-list ORDER (the rail keeps catalogue
// order, so a re-sorted list would silently re-order the sidebar).

import { describe, it, expect } from 'vitest';
import { getGradeConfig } from './grades';

const g0 = getGradeConfig(0);
const g1 = getGradeConfig(1);
const g2 = getGradeConfig(2);

// The staged catalogue (see framework/grades.ts assertions below):
// early-reading ids (shared by Y1..Y6 lists), the Y2+ additions, then the
// STAGED upper-primary ladder — the introductory Y3 grammar set, the Y4
// advanced-vocabulary pair, the remaining Y5 advanced trio. Every list is
// CUMULATIVE: each year keeps every earlier year's ids. Asserted exactly,
// order included, below.
const EARLY_READING = [
    'sight', 'blend', 'sounds', 'vowel', 'opposite', 'rhyme', 'sentence',
    'letters', 'capital', 'punct', 'homophone', 'plural', 'similar', 'wordgap', 'spelling'
];
const Y2_EXTRA = ['syllable', 'grammar', 'tense'];
// Year 3 — the introductory grammar set (clause joiners, apostrophes, comma
// lists, word building, quoted speech, pronouns).
const Y3_INTRO = ['conjunction', 'apostrophe', 'comma', 'affix', 'compound', 'speech', 'pronoun'];
// Year 3 — T5's four new literacy families (reading comprehension, sentence
// crafting, writing planning/composing, editing/proofreading).
const Y3_LITERACY = ['comprehension', 'craft', 'writing', 'editing'];
// Year 4 — the first advanced vocabulary types.
const Y4_ADVANCED = ['figurative', 'homograph'];
// Year 5 — the remaining advanced set (Y6 adds no new ids).
const Y5_ADVANCED = ['idiom', 'advpunct', 'agreement'];

describe('grade catalogue', () => {
    it('lists grades 0..12 with Prep / Year N labels', () => {
        expect(getGradeConfig(0).label + '|' + getGradeConfig(12).label).toBe('Prep|Year 12');
        expect(g0.implemented).toBe(true);
        expect(g1.implemented).toBe(true);
        expect(g2.implemented).toBe(true);
        // The upper-primary ladder (Years 3–6) is implemented too.
        expect(getGradeConfig(3).implemented).toBe(true);
        expect(getGradeConfig(6).implemented).toBe(true);
        // Only Years 7..12 render the coming-soon placeholder.
        expect(getGradeConfig(7).implemented).toBe(false);
        expect(getGradeConfig(12).implemented).toBe(false);
    });

    it('Prep offers the letter-awareness scope + handwriting tracing (tier-1 word set)', () => {
        // Tracing (letter/word/number) is Prep-only — Y1+ get reading/writing
        // tasks instead.
        expect(g0.available).toEqual([
            'letters', 'sounds', 'vowel', 'sight', 'letterTrace', 'wordTrace', 'numberTrace'
        ]);
        expect(g0.caps).toEqual({ wordTier: 1, sentenceLen: 2, tricky: false, level: 0 });
    });

    it('Year 1 offers the full early-reading catalogue (15 types)', () => {
        expect(g1.available).toEqual([...EARLY_READING]);
        expect(g1.caps).toEqual({ wordTier: 2, sentenceLen: 4, tricky: false, level: 1 });
    });

    it('Year 2 adds syllables, nouns/verbs and past tense (18 types, tricky set)', () => {
        expect(g2.available).toEqual([...EARLY_READING, ...Y2_EXTRA]);
        expect(g2.caps).toEqual({ wordTier: 3, sentenceLen: 5, tricky: true, level: 2 });
        // The Y2-only types are gated out of Y1 and Prep.
        expect(g1.available).not.toContain('syllable');
        expect(g1.available).not.toContain('grammar');
        expect(g1.available).not.toContain('tense');
        expect(g0.available).not.toContain('sentence');
    });

    it('Year 3 opens the introductory upper-primary set (29 types: intro Y3 grammar + T5 literacy)', () => {
        // Early-reading + Y2 extensions + the introductory Y3 grammar set +
        // the T5 literacy families.
        const expected = [...EARLY_READING, ...Y2_EXTRA, ...Y3_INTRO, ...Y3_LITERACY];
        expect(getGradeConfig(3).available).toEqual(expected);
        // The tier ladder continues: one deeper word set each year.
        expect(getGradeConfig(3).caps).toEqual({ wordTier: 4, sentenceLen: 7, tricky: true, level: 3 });
        // Year 3 keeps the intro set but NOT the advanced Y4/Y5 types.
        expect(getGradeConfig(3).available).not.toContain('figurative');
        expect(getGradeConfig(3).available).not.toContain('homograph');
        expect(getGradeConfig(3).available).not.toContain('idiom');
        expect(getGradeConfig(3).available).not.toContain('advpunct');
        expect(getGradeConfig(3).available).not.toContain('agreement');
    });

    it('Year 4 adds the first advanced vocabulary types (31 types: +figurative +homograph)', () => {
        const expected = [...EARLY_READING, ...Y2_EXTRA, ...Y3_INTRO, ...Y3_LITERACY, ...Y4_ADVANCED];
        expect(getGradeConfig(4).available).toEqual(expected);
        expect(getGradeConfig(4).caps).toEqual({ wordTier: 5, sentenceLen: 8, tricky: true, level: 4 });
        // The Y5-advanced trio is still held back.
        expect(getGradeConfig(4).available).not.toContain('idiom');
        expect(getGradeConfig(4).available).not.toContain('advpunct');
        expect(getGradeConfig(4).available).not.toContain('agreement');
    });

    it('Year 5 completes the catalogue (34 types: +idiom +advpunct +agreement)', () => {
        const expected = [
            ...EARLY_READING, ...Y2_EXTRA, ...Y3_INTRO, ...Y3_LITERACY, ...Y4_ADVANCED, ...Y5_ADVANCED
        ];
        expect(getGradeConfig(5).available).toEqual(expected);
        expect(getGradeConfig(5).caps).toEqual({ wordTier: 6, sentenceLen: 9, tricky: true, level: 5 });
    });

    it('Year 6 keeps the full cumulative catalogue at its deepest caps', () => {
        // The complete 34-type catalogue (same list as Year 5); only the caps
        // deepen (tier 6, 10-word sentences).
        const expected = [
            ...EARLY_READING, ...Y2_EXTRA, ...Y3_INTRO, ...Y3_LITERACY, ...Y4_ADVANCED, ...Y5_ADVANCED
        ];
        expect(getGradeConfig(6).available).toEqual(expected);
        expect(getGradeConfig(6).caps).toEqual({ wordTier: 6, sentenceLen: 10, tricky: true, level: 6 });
        // The advanced types never leak below their introduction year.
        expect(g2.available).not.toContain('conjunction');
        expect(g2.available).not.toContain('idiom');
        expect(g2.available).not.toContain('agreement');
    });

    it('falls back to grade 1 for unknown ids (a bad selection can never crash)', () => {
        expect(getGradeConfig(99).label).toBe('Year 1');
    });
});
