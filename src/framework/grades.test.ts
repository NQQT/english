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

describe('grade catalogue', () => {
    it('lists grades 0..12 with Prep / Year N labels', () => {
        expect(getGradeConfig(0).label + '|' + getGradeConfig(12).label).toBe('Prep|Year 12');
        expect(g0.implemented).toBe(true);
        expect(g1.implemented).toBe(true);
        expect(g2.implemented).toBe(true);
        // Grade 3 and above are not implemented yet.
        expect(getGradeConfig(3).implemented).toBe(false);
        expect(getGradeConfig(12).implemented).toBe(false);
    });

    it('Prep offers the letter-awareness scope + handwriting tracing (tier-1 word set)', () => {
        // Tracing (letter/word/number) is Prep-only — Y1/Y2 get reading/writing
        // tasks instead.
        expect(g0.available).toEqual([
            'letters', 'sounds', 'vowel', 'sight', 'letterTrace', 'wordTrace', 'numberTrace'
        ]);
        expect(g0.caps).toEqual({ wordTier: 1, sentenceLen: 2, tricky: false });
    });

    it('Year 1 offers the full early-reading catalogue (15 types)', () => {
        expect(g1.available).toEqual([
            'sight', 'blend', 'sounds', 'vowel', 'opposite', 'rhyme', 'sentence',
            'letters', 'capital', 'punct', 'homophone', 'plural', 'similar', 'wordgap', 'spelling'
        ]);
        expect(g1.caps).toEqual({ wordTier: 2, sentenceLen: 4, tricky: false });
    });

    it('Year 2 adds syllables, nouns/verbs and past tense (18 types, tricky set)', () => {
        expect(g2.available).toEqual([
            'sight', 'blend', 'sounds', 'vowel', 'opposite', 'rhyme', 'sentence',
            'letters', 'capital', 'punct', 'homophone', 'plural', 'similar', 'wordgap', 'spelling',
            'syllable', 'grammar', 'tense'
        ]);
        expect(g2.caps).toEqual({ wordTier: 3, sentenceLen: 5, tricky: true });
        // The Y2-only types are gated out of Y1 and Prep.
        expect(g1.available).not.toContain('syllable');
        expect(g1.available).not.toContain('grammar');
        expect(g1.available).not.toContain('tense');
        expect(g0.available).not.toContain('sentence');
    });

    it('falls back to grade 1 for unknown ids (a bad selection can never crash)', () => {
        expect(getGradeConfig(99).label).toBe('Year 1');
    });
});
