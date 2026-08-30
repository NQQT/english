// Unit tests for the SENTENCE BUILDING worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm, template bank, or caps
// change, these exact assertions fail — which is what we want, so a silent
// change to the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { sentenceSpec } from './SentenceBuildingWorksheet';

const g0 = getGradeConfig(0);
const g1 = getGradeConfig(1);
const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(sentenceSpec, grade, seedFrom([grade.id, sentenceSpec.id, 0]));
}

describe('sentence plugin — declarative spec', () => {
    it('declares its sidebar label, glyph, page size and single-column layout', () => {
        expect(sentenceSpec.id).toBe('sentence');
        expect(sentenceSpec.label).toBe('Sentence Building');
        expect(sentenceSpec.icon).toBe('¶');
        expect(sentenceSpec.perPage).toBe(12);
        // Prose sheets print one scrambled line per row, full page width.
        expect(sentenceSpec.singleColumn).toBe(true);
    });

    it('describes its length scope from the grade caps', () => {
        expect(sentenceSpec.scope(g1)).toBe('up to 4 words');
        expect(sentenceSpec.scope(g2)).toBe('up to 5 words');
    });

    it('is gated by the grade catalogue (Year 1 and Year 2 only)', () => {
        expect(sentenceSpec.offered(g0)).toBe(false);
        expect(sentenceSpec.offered(g1)).toBe(true);
        expect(sentenceSpec.offered(g2)).toBe(true);
        expect(sentenceSpec.offered(getGradeConfig(3))).toBe(false);
        // Unoffered type => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(sentenceSpec, g0, seedFrom([0, 'sentence', 0]))).toEqual([]);
    });
});

// Semantic invariant: the printed scramble is a PERMUTATION of the answer
// words (the child can always rebuild the pinned answer from the line).
function checkPermutation(grade: GradeConfig) {
    for (const p of sheet(grade)) {
        const m = p.prompt.match(/\(([^)]+)\)\s*$/);
        expect(m).not.toBeNull();
        const shown = m![1].split(', ').map((s) => s.trim());
        expect([...shown].sort()).toEqual(p.answer.split(' ').sort());
    }
}

describe('sentence — Year 1 (2..4-word lines)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"id":1,"type":"sentence","prompt":"Put the words in the correct order: __, __.  (reads, Ben)","answer":"Ben reads"},
        {"id":2,"type":"sentence","prompt":"Put the words in the correct order: __, __.  (skips, Mia)","answer":"Mia skips"},
        {"id":3,"type":"sentence","prompt":"Put the words in the correct order: __, __, __, __.  (sees, Ben, bird, a)","answer":"Ben sees a bird"},
        {"id":4,"type":"sentence","prompt":"Put the words in the correct order: __, __, __.  (sun, The, shines)","answer":"The sun shines"},
        {"id":5,"type":"sentence","prompt":"Put the words in the correct order: __, __, __, __.  (the, kicks, Sam, ball)","answer":"Sam kicks the ball"},
        {"id":6,"type":"sentence","prompt":"Put the words in the correct order: __, __.  (reads, Ben)","answer":"Ben reads"},
        {"id":7,"type":"sentence","prompt":"Put the words in the correct order: __, __.  (skips, Mia)","answer":"Mia skips"},
        {"id":8,"type":"sentence","prompt":"Put the words in the correct order: __, __, __, __.  (reads, book, Sue, a)","answer":"Sue reads a book"},
        {"id":9,"type":"sentence","prompt":"Put the words in the correct order: __, __, __, __.  (ball, kicks, the, Sam)","answer":"Sam kicks the ball"},
        {"id":10,"type":"sentence","prompt":"Put the words in the correct order: __, __, __, __.  (cats, two, has, Sam)","answer":"Sam has two cats"},
        {"id":11,"type":"sentence","prompt":"Put the words in the correct order: __, __.  (draws, Zoe)","answer":"Zoe draws"},
        {"id":12,"type":"sentence","prompt":"Put the words in the correct order: __, __, __, __.  (has, cats, Sam, two)","answer":"Sam has two cats"}
]);
        checkPermutation(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(sentenceSpec, g1, seedFrom([1, 'sentence', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":13,"type":"sentence","prompt":"Put the words in the correct order: __, __.  (runs, Sam)","answer":"Sam runs"},
        {"id":14,"type":"sentence","prompt":"Put the words in the correct order: __, __, __, __.  (apple, Mia, an, eats)","answer":"Mia eats an apple"},
        {"id":15,"type":"sentence","prompt":"Put the words in the correct order: __, __.  (skips, Mia)","answer":"Mia skips"}
]);
    });
});

describe('sentence — Year 2 (adds the 5-word templates)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"sentence","prompt":"Put the words in the correct order: __, __, __, __, __.  (ball, My, the, kicks, brother)","answer":"My brother kicks the ball"},
        {"id":2,"type":"sentence","prompt":"Put the words in the correct order: __, __.  (reads, Ben)","answer":"Ben reads"},
        {"id":3,"type":"sentence","prompt":"Put the words in the correct order: __, __, __, __.  (sees, Ben, a, bird)","answer":"Ben sees a bird"},
        {"id":4,"type":"sentence","prompt":"Put the words in the correct order: __, __.  (sings, Sue)","answer":"Sue sings"},
        {"id":5,"type":"sentence","prompt":"Put the words in the correct order: __, __.  (reads, Ben)","answer":"Ben reads"},
        {"id":6,"type":"sentence","prompt":"Put the words in the correct order: __, __.  (draws, Zoe)","answer":"Zoe draws"},
        {"id":7,"type":"sentence","prompt":"Put the words in the correct order: __, __, __, __, __.  (kicks, brother, ball, My, the)","answer":"My brother kicks the ball"},
        {"id":8,"type":"sentence","prompt":"Put the words in the correct order: __, __.  (sings, Sue)","answer":"Sue sings"},
        {"id":9,"type":"sentence","prompt":"Put the words in the correct order: __, __.  (skips, Mia)","answer":"Mia skips"},
        {"id":10,"type":"sentence","prompt":"Put the words in the correct order: __, __, __.  (The, barks, dog)","answer":"The dog barks"},
        {"id":11,"type":"sentence","prompt":"Put the words in the correct order: __, __, __.  (dog, barks, The)","answer":"The dog barks"},
        {"id":12,"type":"sentence","prompt":"Put the words in the correct order: __, __, __, __.  (a, Ben, bird, sees)","answer":"Ben sees a bird"}
]);
        checkPermutation(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(sentenceSpec, g2, seedFrom([2, 'sentence', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":13,"type":"sentence","prompt":"Put the words in the correct order: __, __.  (draws, Zoe)","answer":"Zoe draws"},
        {"id":14,"type":"sentence","prompt":"Put the words in the correct order: __, __.  (sings, Sue)","answer":"Sue sings"},
        {"id":15,"type":"sentence","prompt":"Put the words in the correct order: __, __.  (paints, Leo)","answer":"Leo paints"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(sentenceSpec, getGradeConfig(3), seedFrom([3, 'sentence', 0]))).toEqual([]);
    });
});
