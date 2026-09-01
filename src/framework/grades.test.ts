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

// The early-reading ids (shared by Y1..Y6 lists), then the Y2+ additions and
// the Y3–6 senior catalogue — asserted exactly, order included, below.
const EARLY_READING = [
    'sight', 'blend', 'sounds', 'vowel', 'opposite', 'rhyme', 'sentence',
    'letters', 'capital', 'punct', 'homophone', 'plural', 'similar', 'wordgap', 'spelling'
];
const Y2_EXTRA = ['syllable', 'grammar', 'tense'];
const UPPER_PRIMARY_EXTRA = [
    'conjunction', 'apostrophe', 'comma', 'affix', 'compound', 'speech',
    'homograph', 'pronoun', 'figurative', 'idiom', 'advpunct', 'agreement'
];

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
        expect(g0.caps).toEqual({ wordTier: 1, sentenceLen: 2, tricky: false });
    });

    it('Year 1 offers the full early-reading catalogue (15 types)', () => {
        expect(g1.available).toEqual([...EARLY_READING]);
        expect(g1.caps).toEqual({ wordTier: 2, sentenceLen: 4, tricky: false });
    });

    it('Year 2 adds syllables, nouns/verbs and past tense (18 types, tricky set)', () => {
        expect(g2.available).toEqual([...EARLY_READING, ...Y2_EXTRA]);
        expect(g2.caps).toEqual({ wordTier: 3, sentenceLen: 5, tricky: true });
        // The Y2-only types are gated out of Y1 and Prep.
        expect(g1.available).not.toContain('syllable');
        expect(g1.available).not.toContain('grammar');
        expect(g1.available).not.toContain('tense');
        expect(g0.available).not.toContain('sentence');
    });

    it('Years 3..6 open the upper-primary catalogue (30 types, word tiers 4..6)', () => {
        const expected = [...EARLY_READING, ...Y2_EXTRA, ...UPPER_PRIMARY_EXTRA];
        expect(getGradeConfig(3).available).toEqual(expected);
        expect(getGradeConfig(4).available).toEqual(expected);
        expect(getGradeConfig(5).available).toEqual(expected);
        expect(getGradeConfig(6).available).toEqual(expected);
        // The tier ladder: one deeper word set each year, sentences up to 10.
        expect(getGradeConfig(3).caps).toEqual({ wordTier: 4, sentenceLen: 7, tricky: true });
        expect(getGradeConfig(4).caps).toEqual({ wordTier: 5, sentenceLen: 8, tricky: true });
        expect(getGradeConfig(5).caps).toEqual({ wordTier: 6, sentenceLen: 9, tricky: true });
        expect(getGradeConfig(6).caps).toEqual({ wordTier: 6, sentenceLen: 10, tricky: true });
        // The senior types never leak below Year 3.
        expect(g2.available).not.toContain('conjunction');
        expect(g2.available).not.toContain('idiom');
        expect(g2.available).not.toContain('agreement');
    });

    it('falls back to grade 1 for unknown ids (a bad selection can never crash)', () => {
        expect(getGradeConfig(99).label).toBe('Year 1');
    });
});
